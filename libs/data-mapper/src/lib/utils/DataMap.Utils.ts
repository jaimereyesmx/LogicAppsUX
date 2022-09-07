/* eslint-disable no-param-reassign */
import { MapDefinitionProperties, MapNodeParams, YamlFormats } from '../constants/MapDefinitionConstants';
import { InvalidFormatException, InvalidFormatExceptionCode } from '../exceptions/MapDefinitionExceptions';
import type { ConnectionDictionary, LoopConnection } from '../models/Connection';
import type { DataMap, MapNode } from '../models/DataMap';
import type { SchemaExtended, SchemaNodeExtended } from '../models/Schema';
import { inputPrefix, outputPrefix } from '../utils/ReactFlow.Util';
import yaml from 'js-yaml';

export const convertToMapDefinition = (
  connections: ConnectionDictionary,
  inputSchema: SchemaExtended,
  outputSchema: SchemaExtended
): string => {
  const dataMap = generateDataMap(connections, inputSchema.name, outputSchema);

  const codeDetails = `${MapDefinitionProperties.SourceSchema}: ${dataMap?.srcSchemaName ?? ''}${YamlFormats.newLine}${
    MapDefinitionProperties.TargetSchema
  }: ${dataMap?.dstSchemaName ?? ''}${YamlFormats.newLine}`;

  const mapDefinition = keepNode(dataMap.mappings) ? `${codeDetails}${nodeToMapDefinition(dataMap.mappings, '').trim()}` : codeDetails;
  return mapDefinition;
};

const nodeToMapDefinition = (node: MapNode, initIndent: string): string => {
  let mapDefinition = '';
  let indent = initIndent;

  if (node.loopSource) {
    mapDefinition = `${mapDefinition}${indent}${MapNodeParams.For}(${node.loopSource.loopSource}${
      node.loopSource.loopIndex ? `, ${node.loopSource.loopIndex}` : ''
    }):${YamlFormats.newLine}`;
    indent += YamlFormats.indentGap;
  }

  if (node.condition) {
    mapDefinition = `${mapDefinition}${indent}${MapNodeParams.If}(${node.condition.condition}):${YamlFormats.newLine}`;
    indent += YamlFormats.indentGap;
  }

  mapDefinition = `${mapDefinition}${indent}${node.targetNodeKey}:`;

  if (node.children && node.children.length > 0 && node.children.some((childNode) => keepNode(childNode))) {
    indent += YamlFormats.indentGap;

    mapDefinition = `${mapDefinition}${YamlFormats.newLine}`;

    if (node.targetValue) {
      mapDefinition = `${mapDefinition}${indent}${MapNodeParams.Value}: ${node.targetValue.value}${YamlFormats.newLine}`;
    }

    for (const childNode of node.children) {
      if (keepNode(childNode)) {
        mapDefinition = `${mapDefinition}${nodeToMapDefinition(childNode, indent)}`;
      }
    }
  } else {
    if (node.targetValue) {
      mapDefinition = `${mapDefinition} ${node.targetValue.value}`;
    }

    mapDefinition = `${mapDefinition}${YamlFormats.newLine}`;
  }

  return mapDefinition;
};

const generateDataMap = (connections: ConnectionDictionary, inputSchemaName: string, outputSchema: SchemaExtended): DataMap => {
  const fullDataMap = {
    srcSchemaName: inputSchemaName,
    dstSchemaName: outputSchema.name,
    mappings: generateFullDataMapMapping(connections, outputSchema),
  };

  return fullDataMap;
};

const generateFullDataMapMapping = (connections: ConnectionDictionary, outputSchema: SchemaExtended): MapNode => {
  return generateFullChildDataMapMapping(connections, outputSchema.schemaTreeRoot);
};

const generateFullChildDataMapMapping = (connections: ConnectionDictionary, node: SchemaNodeExtended): MapNode => {
  const connectionKeys = Object.keys(connections);
  const currentConnectionKey = connectionKeys.find((key) => key === node.key);
  const currentConnection = currentConnectionKey ? connections[currentConnectionKey] : undefined;
  const splitNodeKey = node.key.split('/');

  return {
    targetNodeKey: splitNodeKey[splitNodeKey.length - 1],
    children: node.children.map((childNode) => generateFullChildDataMapMapping(connections, childNode)),
    targetValue: currentConnection ? { value: currentConnection.value } : undefined,
    loopSource: currentConnection?.loop ? { ...currentConnection.loop } : undefined,
    condition: currentConnection?.condition ? { condition: currentConnection.condition } : undefined,
  };
};

const keepNode = (node: MapNode): boolean => {
  return (
    (node.children && node.children.length > 0 && node.children.some((child) => keepNode(child))) ||
    !!node.condition ||
    !!node.loopSource ||
    !!node.targetValue
  );
};

export const convertFromMapDefinition = (mapDefinition: string): ConnectionDictionary => {
  const connections: ConnectionDictionary = {};
  const formattedMapDefinition = mapDefinition.replaceAll('\t', YamlFormats.indentGap);
  const parsedYaml: any = yaml.load(formattedMapDefinition);
  const parsedYamlKeys: string[] = Object.keys(parsedYaml);

  if (parsedYamlKeys[0] !== MapDefinitionProperties.SourceSchema || parsedYamlKeys[1] !== MapDefinitionProperties.TargetSchema) {
    throw new InvalidFormatException(InvalidFormatExceptionCode.MISSING_SCHEMA_NAME, InvalidFormatExceptionCode.MISSING_SCHEMA_NAME);
  }

  const targetNodeKey: string = parsedYamlKeys[2];

  if (targetNodeKey) {
    parseMappingsJsonToNode(targetNodeKey, parsedYaml[targetNodeKey], targetNodeKey, connections);
  }

  return connections;
};

const parseMappingsJsonToNode = (
  targetNodeKey: string,
  targetNodeObject: string | object | any,
  connectionKey: string,
  connections: ConnectionDictionary
) => {
  // Basic leaf node
  if (typeof targetNodeObject === 'string') {
    connections[connectionKey] = {
      value: targetNodeObject,
      loop: undefined,
      condition: undefined,
      // Needs to be addressed again once we have expressions properly coded out in the designer
      reactFlowSource: `${inputPrefix}${targetNodeObject}`,
      reactFlowDestination: `${outputPrefix}${connectionKey}`,
    };

    return;
  }

  const startsWithFor = targetNodeKey.startsWith(MapNodeParams.For);
  const startsWithIf = targetNodeKey.startsWith(MapNodeParams.If);

  if (startsWithFor || startsWithIf) {
    const childrenKeys = Object.keys(targetNodeObject);
    if (childrenKeys.length !== 1) {
      throw new InvalidFormatException(
        InvalidFormatExceptionCode.MISSING_MAPPINGS_PARAM,
        InvalidFormatExceptionCode.MISSING_MAPPINGS_PARAM
      );
    }

    const newConnectionKey = `${connectionKey}/${childrenKeys[0]}`;
    parseMappingsJsonToNode(`${childrenKeys[0]}`, targetNodeObject[childrenKeys[0]], newConnectionKey, connections);

    // TODO (#15388621) revisit this once we've got loops and conditionals enabled in the designer to double check all the logic
    if (connections[newConnectionKey]) {
      connections[newConnectionKey].loop = startsWithFor ? parseLoopMapping(targetNodeKey) : undefined;
      connections[newConnectionKey].condition = startsWithIf ? parseConditionalMapping(targetNodeKey) : undefined;
    }

    return;
  }

  const targetValue = targetNodeObject?.[MapNodeParams.Value];

  for (const childKey in targetNodeObject) {
    if (childKey !== MapNodeParams.Value) {
      parseMappingsJsonToNode(childKey, targetNodeObject[childKey], `${connectionKey}/${childKey}`, connections);
    }
  }

  // TODO (#15388621) revisit this once we've got loops and conditionals enabled in the designer to double check all the logic
  if (targetValue) {
    connections[connectionKey] = {
      value: targetValue,
      loop: undefined,
      condition: undefined,
      reactFlowSource: `${inputPrefix}${targetValue}`,
      reactFlowDestination: `${outputPrefix}${connectionKey}`,
    };
  }
};

// Exported for testing purposes only
export const parseLoopMapping = (line: string): LoopConnection => {
  const formattedLine = line.substring(line.indexOf('(') + 1, line.lastIndexOf(')')).trim();
  const expressionSplitOnComma = formattedLine.split(',');

  return {
    loopSource: expressionSplitOnComma[0].trim(),
    loopIndex: expressionSplitOnComma[1]?.trim(),
  };
};

// Exported for testing purposes only
export const parseConditionalMapping = (line: string): string => {
  return line.substring(line.indexOf('(') + 1, line.lastIndexOf(')')).trim();
};