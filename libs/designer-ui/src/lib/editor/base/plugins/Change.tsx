import { serializeEditorState } from '../../base/utils/editorToSegement';
import type { ValueSegment } from '../../models/parameter';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import type { EditorState } from 'lexical';

interface ChangeProps {
  setValue: (newVal: ValueSegment[]) => void;
}

export const Change = ({ setValue }: ChangeProps) => {
  const onChange = (editorState: EditorState) => {
    const newValue = serializeEditorState(editorState);
    setValue(newValue);
  };
  return <OnChangePlugin ignoreSelectionChange onChange={onChange} />;
};
