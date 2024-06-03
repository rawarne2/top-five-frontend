import { Card } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import MatchCardComponent from '../components/MatchCardComponent';
import data from '../data/usersCardData.json';
import { useState, useEffect } from 'react';

const MatchesScreen = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    setUserData(data.users);
  }, []);

  console.log(userData);

  return (
    <View>
      <Card mode='elevated' style={styles.mainCard}>
        {userData.map((item, i) => (
          <MatchCardComponent data={item} isTop5={false} key={i} index={i} />
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    justifyContent: 'space-between',
    margin: 2,
  },
});

export default MatchesScreen;
