import React, {Component} from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';

class HeaderApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
    }
  }
  render() {
    const { title } = this.state;
    return(
        <Header>
          <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right>
          </Right>
        </Header>
    )
  }
}

export default HeaderApp
