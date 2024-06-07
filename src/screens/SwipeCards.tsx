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
    <Text style={styles.text}>
      {cardData?.first_name} {cardData?.last_name}, {cardData?.age}
    </Text>
    <Text style={styles.text}>{cardData?.career}</Text>
  </View>
);

export function SwipeCards() {
  const { user } = useAuth();
  const theme = useTheme();

  const [cards, setCards] = useState(usersCardData.users);
  const [hasCards, setHasCards] = useState(usersCardData.users.length > 0);
  const onSwiped = () => {
    setCards((prevCards) => prevCards.slice(1));
  };
  const handleYup = () => {
    console.log('yup');
  };
  const handleNope = () => {
    console.log('nope');
  };

  return !hasCards ? (
    <NoMoreCards />
  ) : (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={(cardData) => <Card cardData={cardData} />}
        stackSize={2}
        onSwiped={onSwiped}
        onSwipedAll={() => setHasCards(false)}
        onSwipedRight={handleYup}
        onSwipedLeft={handleNope}
        verticalSwipe={false}
        cardIndex={0}
        keyExtractor={(data) => data?.userId?.toString()}
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
    borderRadius: 20,
    height: 600,
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
