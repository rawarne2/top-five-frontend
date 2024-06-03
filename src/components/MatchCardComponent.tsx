import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text, Title } from 'react-native-paper';

const MatchCardComponent = ({ data, isTop5, index }) => {
  return (
    <Card mode='elevated' style={styles.card} key={index}>
      <Card.Content style={styles.content}>
        <View>
          <Avatar.Image
            source={{ uri: data.image }}
            style={styles.image}
            size={80}
          />
        </View>
        <View style={styles.rightContent}>
          <Title numberOfLines={2} ellipsizeMode='tail'>
            {data.first_name} {data.last_name}
          </Title>
          <Text numberOfLines={2} ellipsizeMode='tail'>
            {data.last_message}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 2,
    height: 100,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    height: 100,
  },
  image: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rightContent: {
    flex: 1,
    marginLeft: 16,
  },
});

export default MatchCardComponent;
