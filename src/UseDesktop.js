import React, { PureComponent } from 'react';
import Media from 'react-media';
import PoetryEditor from './PoetryEditor';
import NotDesktop from './components/NotDesktop';
import EditorStateProvider from './state-containers/state-providers/EditorStateProvider';

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
            <EditorStateProvider>
              {EditorStateService => {
                return <PoetryEditor {...EditorStateService} />;
              }}
            </EditorStateProvider>
          ) : (
            <NotDesktop minScreenWidth={mediaObj.minWidth} />
          )
        }
      </Media>
    );
  }
}

export default UseDesktop;
