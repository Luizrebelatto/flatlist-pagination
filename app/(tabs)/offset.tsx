import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useApi, type Item } from '@/hooks/useApi';

const LIMIT = 10;

interface OffsetApiResponse {
  data: Item[];
  offset: number;
  limit: number;
  totalItems: number;
  hasMore: boolean;
}

export default function OffsetPaginationScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { fetchItems, loading, error } = useApi();

  // Fetch items for current offset
  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/items-offset?offset=${offset}&limit=${LIMIT}`,
        );
        if (!response.ok) throw new Error('Failed to fetch items');

        const data: OffsetApiResponse = await response.json();
        setItems(data.data);
        setTotalItems(data.totalItems);
        setHasMore(data.hasMore);
        setCurrentPage(Math.floor(offset / LIMIT) + 1);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [offset]);

  const handlePageChange = useCallback((newOffset: number) => {
    if (newOffset >= 0 && newOffset < totalItems) {
      setOffset(newOffset);
    }
  }, [totalItems]);

  const handlePreviousPage = () => {
    const newOffset = Math.max(0, offset - LIMIT);
    handlePageChange(newOffset);
  };

  const handleNextPage = () => {
    const newOffset = offset + LIMIT;
    if (newOffset < totalItems) {
      handlePageChange(newOffset);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text style={styles.id}>#{item.id}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const getPageNumbers = () => {
    const totalPages = Math.ceil(totalItems / LIMIT);
    const currentPageNum = Math.floor(offset / LIMIT) + 1;
    const pages: number[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPageNum - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add first page if not visible
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1); // -1 represents ellipsis
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page if not visible
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1); // -1 represents ellipsis
      pages.push(totalPages);
    }

    return pages;
  };

  const renderPageButton = (pageNum: number) => {
    if (pageNum === -1) {
      return <Text key={`ellipsis-${Math.random()}`} style={styles.ellipsis}>...</Text>;
    }

    const pageOffset = (pageNum - 1) * LIMIT;
    const isActive = Math.floor(offset / LIMIT) + 1 === pageNum;

    return (
      <TouchableOpacity
        key={pageNum}
        style={[styles.pageButton, isActive && styles.pageButtonActive]}
        onPress={() => handlePageChange(pageOffset)}
        disabled={isActive}
      >
        <Text style={[styles.pageButtonText, isActive && styles.pageButtonTextActive]}>
          {pageNum}
        </Text>
      </TouchableOpacity>
    );
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>Make sure the API is running on http://localhost:3000</Text>
      </View>
    );
  }

  const totalPages = Math.ceil(totalItems / LIMIT);

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
              <Text style={styles.loadingText}>Loading items...</Text>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          )
        }
      />

      {/* Offset Info */}
      <View style={styles.offsetInfo}>
        <Text style={styles.offsetText}>
          Offset: {offset} | Items: {items.length}
        </Text>
      </View>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.navButton, offset === 0 && styles.navButtonDisabled]}
          onPress={handlePreviousPage}
          disabled={offset === 0}
        >
          <Text style={[styles.navButtonText, offset === 0 && styles.navButtonTextDisabled]}>
            ← Prev
          </Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pageButtonsContainer}
        >
          {getPageNumbers().map(renderPageButton)}
        </ScrollView>

        <TouchableOpacity
          style={[styles.navButton, !hasMore && styles.navButtonDisabled]}
          onPress={handleNextPage}
          disabled={!hasMore}
        >
          <Text style={[styles.navButtonText, !hasMore && styles.navButtonTextDisabled]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Page Info */}
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
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  id: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 12,
    minWidth: 40,
  },
  name: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  offsetInfo: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  offsetText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Menlo',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButtonActive: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  pageButtonTextActive: {
    color: '#fff',
  },
  ellipsis: {
    fontSize: 14,
    marginHorizontal: 4,
    color: '#999',
    paddingVertical: 6,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0066ff',
  },
  navButtonDisabled: {
    borderColor: '#ddd',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066ff',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  pageInfo: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pageInfoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
