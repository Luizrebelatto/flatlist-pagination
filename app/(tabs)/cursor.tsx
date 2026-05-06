import type { Item } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const LIMIT = 10;

interface CursorApiResponse {
  data: Item[];
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

async function fetchCursor(
  cursor: string | null,
  limit: number,
): Promise<CursorApiResponse> {
  const url = new URL("http://localhost:3000/items-cursor");
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("cursor", cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export default function CursorPaginationScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchCursor(null, LIMIT);
        setItems(res.data);
        setCursor(res.nextCursor);
        setHasMore(res.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursor) return;
    try {
      setLoadingMore(true);
      const res = await fetchCursor(cursor, LIMIT);
      setItems((prev) => [...prev, ...res.data]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, hasMore, loadingMore]);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text style={styles.id}>#{item.id}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>
          Make sure the API is running on http://localhost:3000
        </Text>
      </View>
    );
  }

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
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />
      <View style={styles.cursorInfo}>
        <Text style={styles.cursorText} numberOfLines={1}>
          cursor: {cursor ?? "(start)"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
  name: { fontSize: 16, color: "#000", flex: 1 },
  loader: { marginVertical: 16 },
  loadingText: { marginTop: 12, fontSize: 16, color: "#666" },
  emptyText: { fontSize: 16, color: "#999" },
  errorText: { fontSize: 16, color: "#d32f2f", textAlign: "center" },
  errorSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  cursorInfo: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cursorText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    fontFamily: "Menlo",
  },
});
