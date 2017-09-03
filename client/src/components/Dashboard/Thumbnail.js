import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';

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

const styles = {
  title: {
    fontSize: 20,
    margin: 20
  },
  count: {
    fontSize: 40,
    margin: 10
  }
}

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
              <Card style={{height: 200}}>
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.title}>Online Goride Registration Count</Text>
                  <Text style={styles.count}>{this.state.value}</Text>
                </View>
              </Card>

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
