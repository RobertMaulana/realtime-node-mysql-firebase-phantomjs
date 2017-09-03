import React, {Component} from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import ResponsiveImage from 'react-native-responsive-image';

class CardApp extends Component {
  render() {
    return(
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'https://www.anychart.com/_design/img/upload/plugins/nodejs-logo.png'}} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>GeekyAnts</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody style={{flex: 1, justifyContent: 'center'}}>
              <ResponsiveImage source={{uri: 'https://www.anychart.com/_design/img/upload/plugins/nodejs-logo.png'}} initWidth="138" initHeight="138"/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active name="thumbs-up" />
                  <Text>12 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>11h ago</Text>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    )
  }
}

export default CardApp;
