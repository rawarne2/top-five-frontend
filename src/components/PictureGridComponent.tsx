import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { useUploadPhotosMutation } from '../hooks/mutations';
import { useFetchProfileQuery } from '../hooks/queries';
import * as ImagePicker from 'expo-image-picker';
import DraggableGrid from 'react-native-draggable-grid';

interface PhotoItem {
  key: number;
  image: string;
}

const MAX_PHOTOS = 6;

// Handles photo grid display and management for user profile pictures
export const PictureGridComponent: React.FC = () => {
  const theme = useTheme();
  const { data: profile, isLoading, isError, refetch } = useFetchProfileQuery();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loadingImageIndexes, setLoadingImageIndexes] = useState<Set<number>>(
    new Set()
  );
  const uploadPhotosMutation = useUploadPhotosMutation();

  // Syncs local photo state with profile data from the server
  useEffect(() => {
    if (profile?.picture_urls) {
      const mappedPhotos = profile.picture_urls.map((url, index) => ({
        key: index,
        image: url,
      }));
      setPhotos(mappedPhotos);
    }
  }, [profile?.picture_urls]);

  // Manages image selection from library and handles upload process
  const handleImagePicker = async (index?: number) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Permission to access media library was denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const photoIndex =
          index ??
          (photos.length < MAX_PHOTOS ? photos.length : MAX_PHOTOS - 1);

        // Set loading state for the uploading image
        setLoadingImageIndexes((prev) => new Set(prev).add(photoIndex));

        await uploadPhotosMutation.mutateAsync({
          photos: [{ image: result.assets[0], key: photoIndex }],
        });

        await refetch();

        // Clear loading state after successful upload
        setLoadingImageIndexes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(photoIndex);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      // TODO: Add user-facing error handling
    }
  };

  // Handles drag and drop reordering of photos
  const handleDragRelease = async (newArrangement: PhotoItem[]) => {
    try {
      setPhotos(newArrangement);
      // TODO: Implement backend API call to update photo order
      // await updatePhotoOrder(newArrangement.map(item => item.image));
    } catch (error) {
      console.error('Error updating photo order:', error);
    }
  };

  const renderGridItem = ({ key, image }: PhotoItem) => {
    if (isLoading) {
      return (
        <View style={[styles.item, styles.loadingContainer]}>
          <ActivityIndicator color={theme.colors.tertiary} size='large' />
        </View>
      );
    }

    const isImageLoading = loadingImageIndexes.has(key);

    return (
      <View style={styles.item} key={key}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          accessible={true}
          accessibilityLabel={`Profile photo ${key + 1}`}
          loadingIndicatorSource={{ uri: undefined }}
          onLoadStart={() => {
            setLoadingImageIndexes((prev) => new Set(prev).add(key));
          }}
          onLoadEnd={() => {
            setLoadingImageIndexes((prev) => {
              const newSet = new Set(prev);
              newSet.delete(key);
              return newSet;
            });
          }}
        />
        {isImageLoading && (
          <View style={styles.imageLoadingOverlay}>
            <ActivityIndicator color={theme.colors.tertiary} size='large' />
          </View>
        )}
      </View>
    );
  };

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load photos. Please try again later.</Text>
      </View>
    );
  }

  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.surface }}
    >
      <DraggableGrid
        numColumns={3}
        renderItem={renderGridItem}
        data={photos}
        onDragRelease={handleDragRelease}
        style={{
          ...styles.grid,
          backgroundColor: theme.colors.surface,
        }}
        onItemPress={(item) => handleImagePicker(item.key)}
        key='photo-grid'
        itemHeight={164}
      />
      {canAddMore && (
        <Button
          mode='contained'
          onPress={() => handleImagePicker()}
          style={styles.uploadButton}
          disabled={uploadPhotosMutation.isPending}
        >
          {uploadPhotosMutation.isPending ? 'Uploading...' : 'Upload Picture'}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 8,
  },
  grid: {
    borderRadius: 20,
    padding: 4,
    height: 600,
  },
  item: {
    width: 118,
    height: 157,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    // margin: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  uploadButton: {
    marginTop: 20,
  },
});
