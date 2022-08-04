import { SchemaTypes } from '../configPanel/EditorConfigPanel';
import type { SchemaCardWrapperProps } from './SchemaCard';
import { SchemaCardWrapper } from './SchemaCard';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

export default {
  component: SchemaCardWrapper,
  title: 'Data Mapper/SchemaCard',
} as ComponentMeta<typeof SchemaCardWrapper>;

export const Standard: ComponentStory<typeof SchemaCardWrapper> = (args: SchemaCardWrapperProps) => <SchemaCardWrapper {...args} />;
Standard.args = {
  label: 'label',
  schemaType: SchemaTypes.Input,
  displayHandle: true,
  isLeaf: false,
  onClick: () => console.log('Schema card clicked'),
  disabled: false,
};