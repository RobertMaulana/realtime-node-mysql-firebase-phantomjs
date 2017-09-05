import React, {Component} from 'react';
import { Container, Header, Content, List, ListItem, Text, Separator, Icon, Left, Right, Switch } from 'native-base';
import ResponsiveImage from 'react-native-responsive-image';
import * as firebase from "firebase";

var config = {
  apiKey           : "AIzaSyAwJipkhOuKpMeDLYNZlGEsxtCbnxImDS0",
  authDomain       : "pasarpolis-api-monitoring.firebaseapp.com",
  databaseURL      : "https://pasarpolis-api-monitoring.firebaseio.com",
  projectId        : "pasarpolis-api-monitoring",
  storageBucket    : "pasarpolis-api-monitoring.appspot.com",
  messagingSenderId: "987718083796"
};

class Api extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: 0
    }
    if (!firebase.apps.length) {
      this.auth = firebase.initializeApp(config);
    }
    console.ignoredYellowBox = [
        2000
    ]
  }

  componentWillMount() {
    let query = firebase.database(this.auth).ref().child('API');
    let self = this;
    query.on('value', function(snap) {
      self.setState({statusCode: snap.val()["Mega"]["statusCode"]})
    })
  }

  render() {
    let color = '';
    if (this.state.statusCode === 200) {
      color = 'green'
    }else {
      color = 'red'
    }
    return(
      <Container>
        <Content>
          <Separator bordered>
            <Text>MEGA</Text>
          </Separator>
          <ListItem >
            <Left>
              <Text>http://121.52.49.174:9119</Text>
            </Left>
            <Right>
              <Icon name="wifi" style={{fontSize: 20, color: color}}/>
            </Right>
          </ListItem>
          <Separator bordered>
            <Text>MIDFIELD</Text>
          </Separator>
          <ListItem>
            <Left>
              <Text>Aaron Bennet</Text>
            </Left>
            <Right>
              <Icon name="wifi" />
            </Right>
          </ListItem>
        </Content>
      </Container>
    )
  }
}

export default Api;
