import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';

import { connect } from 'react-redux';
import { onlineRegistration } from '../../actions';
import * as firebase from "firebase";

var config = {
  apiKey           : "AIzaSyAwJipkhOuKpMeDLYNZlGEsxtCbnxImDS0",
  authDomain       : "pasarpolis-api-monitoring.firebaseapp.com",
  databaseURL      : "https://pasarpolis-api-monitoring.firebaseio.com",
  projectId        : "pasarpolis-api-monitoring",
  storageBucket    : "pasarpolis-api-monitoring.appspot.com",
  messagingSenderId: "987718083796"
};

class ThumbnailApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
    if (!firebase.apps.length) {
      this.auth = firebase.initializeApp(config);
    }
    console.ignoredYellowBox = [
        2000
    ]
  }

  componentWillMount() {
    // this.props.getOnlineReg();
    let query = firebase.database(this.auth).ref().child('online-registration-today');
    let self = this;
    query.on('value', function(snap) {
      self.setState({value: snap.val()["online-registration-today"]})
    })
  }

  render() {
    return(
          <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Text>{this.state.value}</Text>
          </View>
    )
  }
}

const mapsDispatchToProps = dispatch => {
  return {
    getOnlineReg  : () => dispatch(onlineRegistration())
  }
}

const mapsStateToProps = state => {
  return {
    onlineReg: state,
  }
}

export default connect(mapsStateToProps, mapsDispatchToProps)(ThumbnailApp);
