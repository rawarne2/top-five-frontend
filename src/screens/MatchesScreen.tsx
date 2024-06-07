import { Card, Divider, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import MatchCardComponent from '../components/MatchCardComponent';
import data from '../data/usersCardData.json';
import { useState, useEffect } from 'react';

const MatchesScreen = () => {
  const [userData, setUserData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    setUserData(data.users);
  }, []);

  console.log(userData);

  return (
    <View>
      <Card
        mode='elevated'
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        <ScrollView>
          <Card.Title title='Top 5 Matches' titleStyle={styles.titleText} />
          {userData.slice(0, 5).map((item, i) => (
            <MatchCardComponent data={item} isTop5={true} key={i} index={i} />
          ))}
          <Divider />
          <Card.Title
            title='Recent Matches'
            titleStyle={styles.titleText}
            right={() => (
              <Text
                style={{
                  ...styles.titleText,
                  color: theme.colors.error,
                  fontSize: 18,
                  paddingRight: 8,
                }}
              >
                {'Time Left'}
              </Text>
            )}
          />
          {userData.slice(5).map((item, i) => (
            <MatchCardComponent data={item} isTop5={false} key={i} index={i} />
          ))}
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default MatchesScreen;
