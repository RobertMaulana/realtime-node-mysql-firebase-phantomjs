import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import App from './src/components/App';
import { Provider } from 'react-redux';
import store from './src/store';

class dashboard2 extends Component {
  constructor(props) {
    super(props);

    this.state={}
  }
  render() {
    return(
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('dashboard2', () => dashboard2);
