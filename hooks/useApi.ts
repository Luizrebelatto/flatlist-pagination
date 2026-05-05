import { useState, useCallback } from 'react';

export interface Item {
  id: number;
  name: string;
  createdAt: number;
}

export interface ApiResponse {
  data: Item[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

const API_URL = 'http://localhost:3000/items';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(
    async (page: number = 1, limit: number = 10): Promise<ApiResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data: ApiResponse = await response.json();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetchItems, loading, error };
};
