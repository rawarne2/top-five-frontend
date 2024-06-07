import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text, Title, useTheme } from 'react-native-paper';

const MatchCardComponent = ({ data, isTop5, index }) => {
  const theme = useTheme();
  return (
    <Card
      mode='elevated'
      style={{
        ...styles.card,
        borderColor: theme.colors.outline,
      }}
      key={index}
    >
      <Card.Content style={styles.content}>
        <View>
          <Avatar.Image
            source={{ uri: data.image }}
            style={styles.image}
            size={72}
          />
        </View>
        <View style={styles.rightContent}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={styles.nameText}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {data.first_name} {data.last_name}
            </Text>
            {!isTop5 && (
              <Text
                style={{
                  ...styles.timeText,
                  color: theme.colors.error,
                  fontWeight: '600',
                }}
              >{`48hrs`}</Text>
            )}
          </View>
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
    height: 88,
    justifyContent: 'center',
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    height: 88,
    alignItems: 'center',
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
  timeText: {
    fontSize: 16,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'condensedBold',
  },
});

export default MatchCardComponent;
