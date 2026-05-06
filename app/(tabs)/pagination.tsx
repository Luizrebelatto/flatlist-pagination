import { useApi, type Item } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LIMIT = 10;

export default function PaginationScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { fetchItems, loading, error } = useApi();

  useEffect(() => {
    const load = async () => {
      const result = await fetchItems(currentPage, LIMIT);
      if (result) {
        setItems(result.data);
        setTotalPages(result.totalPages);
      }
    };
    load();
  }, [currentPage]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages],
  );

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text style={styles.id}>#{item.id}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const renderPageButton = (pageNum: number) => {
    const isActive = pageNum === currentPage;
    return (
      <TouchableOpacity
        key={pageNum}
        style={[styles.pageButton, isActive && styles.pageButtonActive]}
        onPress={() => handlePageChange(pageNum)}
        disabled={isActive}
      >
        <Text
          style={[
            styles.pageButtonText,
            isActive && styles.pageButtonTextActive,
          ]}
        >
          {pageNum}
        </Text>
      </TouchableOpacity>
    );
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  };

  const renderPageButtonOrEllipsis = (pageNum: number) => {
    if (pageNum === -1) {
      return (
        <Text key={`ellipsis-${Math.random()}`} style={styles.ellipsis}>
          ...
        </Text>
      );
    }
    return renderPageButton(pageNum);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>
                Loading page {currentPage}...
              </Text>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          )
        }
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === 1 && styles.navButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPage === 1 && styles.navButtonTextDisabled,
            ]}
          >
            ← Prev
          </Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pageButtonsContainer}
        >
          {getVisiblePages().map(renderPageButtonOrEllipsis)}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === totalPages && styles.navButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPage === totalPages && styles.navButtonTextDisabled,
            ]}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pageInfo}>
        <Text style={styles.pageInfoText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>
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
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  pageButtonsContainer: {
    maxHeight: 44,
    marginHorizontal: 8,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    minWidth: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  pageButtonActive: {
    backgroundColor: "#0066ff",
    borderColor: "#0066ff",
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  pageButtonTextActive: {
    color: "#fff",
  },
  ellipsis: {
    fontSize: 14,
    marginHorizontal: 4,
    color: "#999",
    paddingVertical: 6,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0066ff",
  },
  navButtonDisabled: {
    borderColor: "#ddd",
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066ff",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
  pageInfo: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  pageInfoText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
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
