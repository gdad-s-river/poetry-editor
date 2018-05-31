import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import EditorStateContainer from '../EditorStateContainer';

class EditorStateProvider extends Component {
  render() {
    return (
      <Subscribe to={[EditorStateContainer]}>
        {EditorStateService => {
          return this.props.children(EditorStateService);
        }}
      </Subscribe>
    );
  }
}

export default EditorStateProvider;
