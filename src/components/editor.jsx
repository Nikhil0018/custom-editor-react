import React, { useState, useRef } from 'react';
import { Editor, EditorState, Modifier, RichUtils, getDefaultKeyBinding } from 'draft-js';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef(null);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const handleBeforeInput = (char) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const startOffset = selectionState.getStartOffset();
    const block = contentState.getBlockForKey(startKey);
    const text = block.getText();

    if (char === '#' && startOffset === 0 && text[0] === '#') {
      // Handle '#' for Heading 1
      const newContentState = Modifier.replaceText(contentState, selectionState, '');
      const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
      setEditorState(RichUtils.toggleBlockType(newEditorState, 'header-one'));
      return 'handled';
    }

    if (char === '*' && startOffset === 0 && text.slice(0, 2) === '**') {
      // Handle '**' for red line
      const newContentState = Modifier.replaceText(contentState, selectionState, '');
      const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'RED_LINE'));
      return 'handled';
    }

    if (char === '*' && startOffset === 0 && text[0] === '*') {
      // Handle '*' for bold
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
      return 'handled';
    }

    return 'not-handled';
  };

  const keyBindingFn = (e) => {
    if (e.keyCode === 13) {
      // Handle Enter key to reset inline styles
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const block = contentState.getBlockForKey(selectionState.getStartKey());
      const text = block.getText();

      if (text[0] === '#' && text.slice(1).trim() === '') {
        const newContentState = Modifier.replaceText(contentState, selectionState, '');
        const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
        setEditorState(newEditorState);
        return null;
      }

      if (text.slice(0, 2) === '**' && text.slice(2).trim() === '') {
        const newContentState = Modifier.replaceText(contentState, selectionState, '');
        const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
        setEditorState(newEditorState);
        return null;
      }
    }

    return getDefaultKeyBinding(e);
  };

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      handleKeyCommand={handleKeyCommand}
      handleBeforeInput={handleBeforeInput}
      keyBindingFn={keyBindingFn}
      ref={editorRef}
    />
  );
};

export default MyEditor;
