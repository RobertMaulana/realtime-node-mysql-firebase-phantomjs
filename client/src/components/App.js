import React, {Component} from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import Home from './Home';
import Dashboard from './Dashboard';
import Api from './Api';

const App = StackNavigator({
  Main: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {
      header: null
    }
  },
  Api: {
    screen: Api,
    navigationOptions: {
      header: null
    }
  }
},
  { headerMode: 'screen' }
);
export default App;
