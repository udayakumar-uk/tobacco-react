import { useState } from 'react';
import { API_BASE_URL } from '../config';

export function useGetById(path) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserById = async (userId, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId }),
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      if (data.status) {
        setUserData(data.data);
      } else {
        setUserData(null);
      }
      return data;
    } catch (err) {
      setError(err);
      setUserData(null);
      return { status: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { userData, loading, error, fetchUserById };
}
