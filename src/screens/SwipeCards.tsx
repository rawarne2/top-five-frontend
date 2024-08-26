import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useTheme } from 'react-native-paper';
import { useFetchPotentialMatches } from '../hooks/queries';

const NoMoreCards = () => (
  <View style={styles.noMoreCards}>
    <Text>No more potential matches</Text>
  </View>
);

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
  const theme = useTheme();

  const {
    data: cards, // using static data for development for now
    isLoading,
    isError,
  } = useFetchPotentialMatches();

  const handleYup = (cardIndex: number) => {
    console.log('Liked user:', cards[cardIndex]);
    // Implement like logic here
  };

  const handleNope = (cardIndex: number) => {
    console.log('Disliked user:', cards[cardIndex]);
    // Implement dislike logic here
  };
  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading potential matches</Text>;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/top5-logo.png')}
        style={styles.logo}
      />
      <View style={styles.swiperContainer}>
        {cards?.length ? (
          <Swiper
            cards={cards}
            renderCard={(cardData) => <Card cardData={cardData} />}
            onSwipedRight={handleYup}
            onSwipedLeft={handleNope}
            cardIndex={0}
            stackSize={3}
            backgroundColor={theme.colors.background}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: theme.colors.error,
                    color: 'white',
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: theme.colors.tertiary,
                    color: 'white',
                    textAlight: 'left',
                  },
                },
              },
            }}
            overlayOpacityHorizontalThreshold={0.2}
          />
        ) : (
          <NoMoreCards />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    height: 560,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  thumbnail: {
    width: '100%',
    height: '80%',
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  noMoreCards: {},
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  logo: {
    width: '25%',
    height: 70,
  },
  swiperContainer: {
    width: '100%',
    height: '90%',
    marginTop: -30, // TODO: crop logo and remove this
    zIndex: -1,
  },
});
