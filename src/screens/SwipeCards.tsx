import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useFetchPotentialMatches } from '../hooks/queries';

const { width, height } = Dimensions.get('window');

const Card = ({ cardData, onSelectSection, selectedSection }) => {
  const theme = useTheme();

  const sections = [
    { id: 'image', title: 'Photo' },
    { id: 'name', title: 'Name' },
    { id: 'career', title: 'Career' },
    { id: 'bio', title: 'Bio' },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.section,
          selectedSection === item.id && {
            borderColor: theme.colors.primary,
            borderWidth: 2,
            borderRadius: 20,
            backgroundColor: theme.colors.primaryContainer,
          },
        ]}
        key={item.id}
        onPress={() => onSelectSection(item.id)}
      >
        {item.id === 'image' ? (
          <Image
            style={styles.thumbnail}
            source={{ uri: cardData?.image }}
            key={cardData.userId}
            // when there are multiple images change the key to use the image id to avoid duplication bugs. using userId would not work
          />
        ) : (
          <Text style={styles.text}>
            {item.id === 'name'
              ? `${cardData?.first_name} ${cardData?.last_name}, ${cardData?.age}`
              : cardData?.[item.id]}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={sections}
      renderItem={renderItem}
      keyExtractor={(item) => item?.id}
      style={styles.card}
      contentContainerStyle={styles.cardContent}
    />
  );
};

export function SwipeCards() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const { data: cards, isLoading, isError } = useFetchPotentialMatches();

  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
  }, [currentIndex]);

  const handleSelectSection = (sectionId) => {
    setSelectedSection(sectionId);
    setShowWarning(false);
  };

  const handleSwipe = (direction) => {
    if (!selectedSection) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    console.log(
      `Swiped ${direction} on user: ${cards[currentIndex].first_name}, Selected section: ${selectedSection}`
    );

    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSelectedSection(null);
      setCurrentIndex((prev) => prev + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading potential matches</Text>;

  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.cardWrapper, position?.getLayout()]}>
          <Card
            cardData={cards[currentIndex]}
            onSelectSection={handleSelectSection}
            selectedSection={selectedSection}
            key={cards[currentIndex]?.userId}
          />
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: theme.colors.error }}
            onPress={() => handleSwipe('left')}
          >
            <Text style={styles.buttonText}>Nope</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/top5-logo-square.png')}
            style={styles.logo}
          />
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: theme.colors.primary }}
            onPress={() => handleSwipe('right')}
          >
            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
        </View>
        {showWarning && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>Select a section</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  cardWrapper: {
    width: width - 40,
    height: height - 250,
    marginTop: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'grey',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  cardContent: {
    alignItems: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  thumbnail: {
    width: width - 60,
    height: width - 60,
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: 80,
    marginVertical: 8,
    alignContent: 'center',
    alignItems: 'center',
  },
  button: {
    // flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    width: width / 2 - 70,
    height: 80,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  warning: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    alignItems: 'center',
  },
  warningText: {
    color: 'white',
    fontSize: 16,
  },
});
