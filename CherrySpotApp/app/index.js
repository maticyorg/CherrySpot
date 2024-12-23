/*  */import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFirestore, collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import * as WebBrowser from 'expo-web-browser';

const FeedScreen = () => {
  const [videos, setVideos] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (loadMore = false) => {
    setLoading(true);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    let videosQuery = query(
      collection(db, 'transformed_videos'),
      orderBy('publishedAt', 'desc'),
      limit(10)
    );

    if (loadMore && lastVisible) {
      videosQuery = query(
        collection(db, 'transformed_videos'),
        orderBy('publishedAt', 'desc'),
        startAfter(lastVisible),
        limit(10)
      );
    }

    try {
      const querySnapshot = await getDocs(videosQuery);
      const videosList = querySnapshot.docs.map(doc => doc.data());
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      if (loadMore) {
        setVideos([...videos, ...videosList]);
      } else {
        setVideos(videosList);
      }
      console.log('Fetched videos:', videosList);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }

    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading) {
      fetchVideos(true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVideos().then(() => setRefreshing(false));
  };

  const handlePress = (url) => {
    WebBrowser.openBrowserAsync(url);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ color: '#000' }} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.youtubeLink)}>
            <View style={styles.videoCard}>
              <Image source={{ uri: item.thumbnails.default }} style={styles.thumbnail} />
              <View style={styles.info}>
                <Text style={styles.channelTitle}>{item.channelName}:</Text>
                <Text style={styles.description}>{item.keywordTimestampDescription}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#0D2846' },
  videoCard: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  thumbnail: { width: 80, height: 80, marginRight: 10 },
  info: { flex: 1 },
  channelTitle: { fontSize: 16, fontWeight: 'bold', color: '#FADB17', fontFamily: 'Agency FB' },
  description: { fontSize: 14, color: '#FADB17', fontFamily: 'Agency FB' },
});

export default FeedScreen;