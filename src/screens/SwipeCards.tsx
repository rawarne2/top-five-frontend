import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import Swiper from 'react-native-deck-swiper';
import { useAuth } from '../contexts/AuthContext';
import usersCardData from '../data/usersCardData.json';
import { useTheme } from 'react-native-paper';

const NoMoreCards = () => {
  console.log('No more cards');
  return (
    <View style={styles.noMoreCards}>
      <Text>No more cards</Text>
    </View>
  );
};

const Card = ({ cardData }: any) => (
  <View style={styles.card}>
    <Image style={styles.thumbnail} source={{ uri: cardData?.image }} />
    <Text style={styles.text}>{cardData?.name}</Text>
  </View>
);

export function SwipeCards() {
  const { user } = useAuth();
  const theme = useTheme();

  const [cards, setCards] = useState(usersCardData.users);

  const onSwiped = () => {
    setCards((prevCards) => prevCards.slice(1));
  };
  const handleYup = () => {
    console.log('yup');
  };
  const handleNope = () => {
    console.log('nope');
  };

  console.log('SwipeCards - user: ', user);

  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={(cardData) => <Card cardData={cardData} />}
        stackSize={2}
        onSwiped={onSwiped}
        onSwipedAll={() => <NoMoreCards />}
        onSwipedRight={handleYup}
        onSwipedLeft={handleNope}
        verticalSwipe={false}
        cardIndex={0}
        horizontalThreshold={10}
        key={cards.length}
        backgroundColor={theme.colors.background}
      />
      <Text style={styles.text}>Hello {user?.first_name}!!!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 20,
    zIndex: 1,
  },
  thumbnail: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
