import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export function usePostFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const postData = async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ data: body }),
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err);
      return { status: false, response: err.message };
    } finally {
      setLoading(false);
    }
  };

  return [postData, { loading, error }];
}
