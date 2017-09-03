import React, {Component} from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';

class FooterApp extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { nav } = this.props
    return(
      <Container>
        <Content />
        <Footer>
          <FooterTab>
            <Button
              vertical
              active
              onPress={() => nav('Dashboard')}
            >
              <Icon name="apps" />
              <Text>Dashboard</Text>
            </Button>
            <Button
              vertical
              active
              onPress={() => nav('Api')}
            >
              <Icon name="camera" />
              <Text>Api</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

export default FooterApp;
