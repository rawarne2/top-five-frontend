import React from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import { Card, Divider, Text, useTheme } from 'react-native-paper';
import MatchCardComponent from '../components/MatchCardComponent';
import { useFetchMatches } from '../hooks/queries';

const MatchesScreen = () => {
  const theme = useTheme();
  const matches = useFetchMatches();

  const getItem = (data, index) => ({
    id: data[index].id,
    ...data[index],
  });

  const getItemCount = (data) => data?.length ?? 0;

  const renderItem = ({ item, index }) => (
    <MatchCardComponent
      data={item}
      isTop5={index < 5}
      index={index}
      key={index}
    />
  );
  // TODO: remove `slice` when top 5 matches are specified when coming back from the backend

  const ListHeaderComponent = () => (
    <>
      <Card.Title title='Top 5 Matches' titleStyle={styles.titleText} />
      {!matches.isLoading &&
        matches.data
          ?.slice(0, 5)
          .map((item, i) => renderItem({ item, index: i }))}
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
            Time Left
          </Text>
        )}
      />
      {!matches.isLoading &&
        matches.data?.slice(5).map((item, i) => renderItem({ item, index: i }))}
    </>
  );

  if (matches.isLoading) return <Text>Loading...</Text>;
  if (matches.isError) return <Text>Error loading matches</Text>;

  return (
    <View style={styles.container}>
      <Card
        mode='elevated'
        style={{ backgroundColor: theme.colors.background }}
      >
        <VirtualizedList
          data={matches}
          initialNumToRender={10}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          getItemCount={getItemCount}
          getItem={getItem}
          ListHeaderComponent={ListHeaderComponent}
          collapsable // android only
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default MatchesScreen;
