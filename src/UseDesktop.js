import merge from 'lodash/merge';
import React, { PureComponent } from 'react';
import Media from 'react-media';
import { Subscribe } from 'unstated';
import PoetryEditor from './PoetryEditor';
import NotDesktop from './components/NotDesktop';
import ColorSelectContainer from './state-containers/ColorSelectContainer';
import EditorStateContainer from './state-containers/EditorStateContainer';

const mediaObj = {
  minWidth: 1200,
};

class UseDesktop extends PureComponent {
  componentDidMount() {
    // remove the first page load loader
    let doc = document;
    const pageLoaderEl = doc.getElementById('page-loader');

    if (pageLoaderEl) {
      pageLoaderEl.parentNode.removeChild(pageLoaderEl);
    }
  }

  render() {
    return (
      <Media query={mediaObj}>
        {matches =>
          matches ? (
            <Subscribe to={[EditorStateContainer, ColorSelectContainer]}>
              {(EditorStateService, ColorSelectService) => {
                const poetryEditorProps = merge(
                  EditorStateService,
                  ColorSelectService,
                );
                return <PoetryEditor {...poetryEditorProps} />;
              }}
            </Subscribe>
          ) : (
            <NotDesktop minScreenWidth={mediaObj.minWidth} />
          )
        }
      </Media>
    );
  }
}

export default UseDesktop;
