// Rev 7
// File: src/screens/FeedScreen.js

import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, TextInput, Button, Animated, PanResponder } from "react-native";
import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance
import * as WebBrowser from "expo-web-browser";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/styles"; // Import styles from a separate file
import { appConfig } from "../config"; // Added import

const FeedScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    viewCount: { min: null, max: null },
    likeCount: { min: null, max: null },
    publishedAt: { min: null, max: null },
  });
  const [sortOptions, setSortOptions] = useState({
    field: "publishedAt",
    order: "desc",
  });
  const [drawerHeight] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [sortOptions, filters]);

  const applySorting = (field, order) => {
    setSortOptions({ field, order });
    setShowSortOptions(false);
  };

  const fetchVideos = async (loadMore = false) => {
    setLoading(true);
    let videosQuery = collection(
      db,
      appConfig.infosourcePrefix + encodeURIComponent(appConfig.defaultKeyword)
    );

  const constraints = [];
    if (filters.viewCount.min !== null) {
      constraints.push(where("viewCount", ">=", filters.viewCount.min));
    }
    if (filters.viewCount.max !== null) {
      constraints.push(where("viewCount", "<=", filters.viewCount.max));
    }
    if (filters.likeCount.min !== null) {
      constraints.push(where("likeCount", ">=", filters.likeCount.min));
    }
    if (filters.likeCount.max !== null) {
      constraints.push(where("likeCount", "<=", filters.likeCount.max));
    }
    if (filters.publishedAt.min !== null) {
      constraints.push(where("publishedAt", ">=", new Date(filters.publishedAt.min)));
    }
    if (filters.publishedAt.max !== null) {
      constraints.push(where("publishedAt", "<=", new Date(filters.publishedAt.max)));
    }

    constraints.push(orderBy(sortOptions.field, sortOptions.order));

    if (loadMore && lastVisible) {
      constraints.push(startAfter(lastVisible));
    }
    constraints.push(limit(10));

    videosQuery = query(videosQuery, ...constraints);

    try {
      const querySnapshot = await getDocs(videosQuery);
      const videosList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          channelName: data.channelName || "Unknown Channel",
          description: (data.keywordTimestampDescription || "No Description").split("\n")[0].substring(0, 87),
          youtubeLink: data.youtubeLink || "",
          thumbnail: data.thumbnail ? { uri: data.thumbnail } : require("../../assets/images/aik.jpg"),
          publishedAt: data.publishedAt ? data.publishedAt.split("T")[0] : "Unknown",
          viewCount: data.viewCount || 0,
          likeCount: data.likeCount || 0,
          videoCategoryId: data.videoCategoryId !== "unknown" ? data.videoCategoryId : "Unknown Category",
        };
      });

      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

      setVideos((prev) =>
        loadMore
          ? [...prev, ...videosList.filter(newVideo => !prev.some(video => video.id === newVideo.id))]
          : videosList
      );
    } catch (error) {
      console.error("Error fetching videos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (url) => {
    WebBrowser.openBrowserAsync(url);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVideos(false); // Hämta de senaste videorna utan att ladda mer
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator />;
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.dy > 20;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        drawerHeight.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        Animated.timing(drawerHeight, {
          toValue: 300,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(drawerHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{appConfig.defaultKeyword}</Text> 
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setShowSortOptions(!showSortOptions)}>
            <MaterialIcons name="sort" size={70} color="#FADB17" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilterOptions(!showFilterOptions)}>
            <MaterialIcons name="filter-list" size={70} color="#FADB17" />
          </TouchableOpacity>
        </View>
      </View>

      {showSortOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={() => applySorting('publishedAt', 'desc')}>
            <Text style={styles.optionText}>Publiceringsdatum (Nyast först)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => applySorting('viewCount', 'desc')}>
            <Text style={styles.optionText}>Visningar (Flest först)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => applySorting('likeCount', 'desc')}>
            <Text style={styles.optionText}>Gilla-markeringar (Flest först)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Options
      {showFilterOptions && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Publiceringsdatum Min:</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="YYYY-MM-DD"
            onChangeText={(value) => handleFilterChange("publishedAt", "min", value)}
          />
          <Text style={styles.filterLabel}>Publiceringsdatum Max:</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="YYYY-MM-DD"
            onChangeText={(value) => handleFilterChange("publishedAt", "max", value)}
          />
          <Text style={styles.filterLabel}>Visningar Min:</Text>
          <TextInput
            style={styles.filterInput}
            keyboardType="numeric"
            onChangeText={(value) => handleFilterChange("viewCount", "min", value)}
          />
          <Text style={styles.filterLabel}>Visningar Max:</Text>
          <TextInput
            style={styles.filterInput}
            keyboardType="numeric"
            onChangeText={(value) => handleFilterChange("viewCount", "max", value)}
          />
          <Text style={styles.filterLabel}>Gilla-markeringar Min:</Text>
          <TextInput
            style={styles.filterInput}
            keyboardType="numeric"
            onChangeText={(value) => handleFilterChange("likeCount", "min", value)}
          />
          <Text style={styles.filterLabel}>Gilla-markeringar Max:</Text>
          <TextInput
            style={styles.filterInput}
            keyboardType="numeric"
            onChangeText={(value) => handleFilterChange("likeCount", "max", value)}
          />
          <Button title="Tillämpa Filter" onPress={() => { fetchVideos(); setShowFilterOptions(false); }} color="#FADB17" />
        </View>
      )*/} 
       
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.youtubeLink)}>
            <View style={styles.videoCard}>
              <Image source={item.thumbnail} style={styles.thumbnail} />
              <View style={styles.info}>
                <Text style={styles.channelTitle}>{item.channelName}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.stats}>
                  <Text style={styles.statText}>Views: {item.viewCount}</Text>
                  <Text style={styles.statText}>Likes: {item.likeCount}</Text>
                  <Text style={styles.statText}>Published: {item.publishedAt}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={renderFooter}
        onEndReached={() => fetchVideos(true)}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh} // Lägg till denna rad
      />
    </View>
  );
};

export default FeedScreen;
