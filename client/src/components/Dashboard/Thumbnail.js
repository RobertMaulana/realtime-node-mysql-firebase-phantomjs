import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right, Col, Row, Grid } from 'native-base';
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
    margin: 20,
    color: '#61A7ED',
    textAlign: 'center'
  },
  count: {
    fontSize: 40,
    margin: 10,
    color: '#61A7ED',
    fontWeight: 'bold',
    textAlign: 'center'
  }
}

class ThumbnailApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      online: 0,
      offline: 0
    }
    if (!firebase.apps.length) {
      this.auth = firebase.initializeApp(config);
    }
    console.ignoredYellowBox = [
        2000
    ]
  }

  componentWillMount() {

    let query = firebase.database(this.auth).ref().child('Data-Registration');
    let self = this;
    query.on('value', function(snap) {
      self.setState({online: snap.val()["online-registration-today"]})
    })
    query.on('value', function(snap) {
      self.setState({offline: snap.val()["offline-registration-today"]})
    })

  }

  render() {
    return(
      <Card style={{height: 200}}>
        <Grid>
          <Col style={{ backgroundColor: '#FFF', alignItems: 'center'}}>
            <View>
              <Text style={styles.title}>Online/this day</Text>
              <Text style={styles.count}>{this.state.online}</Text>
            </View>
          </Col>
          <Col style={{ backgroundColor: '#eee', alignItems: 'center'}}>
            <View>
              <Text style={styles.title}>Offline/this day</Text>
              <Text style={styles.count}>{this.state.offline}</Text>
            </View>
          </Col>
        </Grid>
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
