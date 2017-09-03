import React, {Component} from 'react';
import {
  View
} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import HeaderApp from '../Common/Header';
import Dashboard from '../Dashboard';
import Api from '../Api';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: <Dashboard />
    }
  }
  changeContent(val) {

    if (val === 'Dashboard') {
      this.setState({content: <Dashboard />})
    }else {
      this.setState({content: <Api />})
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return(
      <Container>
        <HeaderApp/>
        <Container>
            {this.state.content}
          <Footer style={{position: 'absolute', bottom: 0}}>
            <FooterTab>
              <Button
                vertical
                active
                onPress={() => this.changeContent('Dashboard')}
              >
                <Icon name="apps" />
                <Text>Dashboard</Text>
              </Button>
              <Button
                vertical
                active
                onPress={() => this.changeContent('Api')}
              >
                <Icon name="camera" />
                <Text>Api</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </Container>
    )
  }
}

export default Home;
