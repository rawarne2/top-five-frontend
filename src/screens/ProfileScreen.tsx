import { Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useLogout } from '../hooks/mutations';
import React, { useState } from 'react';

const ProfileScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const logout = useLogout();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      orderedSelection: true,
    });
    console.log({ result });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0]]);
    }
  };
  console.log('selectedImages: ', selectedImages);

  const handleLogout = async () => {
    logout.mutate();
  };
  return (
    <View style={styles.container}>
      <Text variant='titleLarge'>Profile!</Text>
      <Button
        onPress={handleLogout}
        mode='contained-tonal'
        style={{ marginVertical: 20 }}
      >
        Logout
      </Button>
      <Button mode='contained-tonal' onPress={pickImage}>
        Upload Photos
      </Button>
      <View style={styles.imageContainer}>
        {selectedImages.map((image) => (
          <Image
            key={image.uri}
            source={{ uri: image.uri }}
            style={styles.image}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});
export default ProfileScreen;
