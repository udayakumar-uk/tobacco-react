import { useState } from 'react';
import { API_BASE_URL } from '../config';

export function useGetById(path) {
  const [getByData, setGetByData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserById = async (userId, token) => {
    const user = JSON.parse(localStorage.getItem("user"));
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
        console.log(data);
        
        setGetByData(data.data);
      } else {
        setGetByData(null);
      }
      return data;
    } catch (err) {
      setError(err);
      setGetByData(null);
      return { status: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { getByData, loading, error, fetchUserById };
}
