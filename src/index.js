import 'glamor/reset';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'unstated';
import UNSTATED from 'unstated-debug';
import UseDesktop from './UseDesktop';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';

UNSTATED.logStateChanges = process.env.NODE_ENV === 'development';

// UNSTATED.logStateChanges = false;

ReactDOM.render(
  <Provider>
    <UseDesktop />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
