import type { ApiResponse, Item } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const LIMIT = 10;

export default function InfiniteScrollScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (pageNum: number) => {
    const response = await fetch(
      `http://localhost:3000/items?page=${pageNum}&limit=${LIMIT}`,
    );
    if (!response.ok) throw new Error("Failed to fetch items");
    return (await response.json()) as ApiResponse;
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPage(1);
        setItems(data.data);
        setTotalPages(data.totalPages);
        setPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchPage]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchPage(nextPage);
      setItems((prev) => [...prev, ...data.data]);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, totalPages, loadingMore, fetchPage]);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text style={styles.id}>#{item.id}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  id: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginRight: 12,
    minWidth: 40,
  },
  name: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  loader: {
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
