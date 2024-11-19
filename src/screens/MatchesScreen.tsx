import React from 'react';
import { StyleSheet, View, VirtualizedList } from 'react-native';
import {
  Card,
  Divider,
  Text,
  useTheme,
  Headline,
  Title,
} from 'react-native-paper';
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
      <Headline style={styles.titleText}>Top 5 Matches</Headline>
      {!matches.isLoading &&
        matches.data
          ?.slice(0, 5)
          .map((item, i) => renderItem({ item, index: i }))}
      <Divider />
      <Headline>Recent Matches</Headline>
      {!matches.isLoading &&
        matches.data?.slice(5).map((item, i) => renderItem({ item, index: i }))}
    </>
  );

  if (matches.isLoading) return <Text>Loading...</Text>;
  if (matches.isError) return <Text>Error loading matches</Text>;

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    paddingInline: 8,
    textAlign: 'left',
  },
});

export default MatchesScreen;
