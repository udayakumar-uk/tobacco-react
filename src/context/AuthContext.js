import { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";
import { API_BASE_URL } from '../config';
import { useGetById } from '../hooks/useGetById';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // load user from localStorage on refresh
  useLayoutEffect(() => {
    // const storedUser = localStorage.getItem("user");
    // if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (credentials) => {
    // Login with API
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: credentials }),
    });

    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();

    // save token/user in localStorage
    if (data.token) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    }
    return data;
  };
 


  const logout = async () => {
    // Logout with API
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ data: { id: user.userId } }),
    });

    if (!response.ok) throw new Error("Logout failed");
    const data = await response.json();
    console.log("Logout successful:", data);

    if (data.status === 1) {
      // clear user from context and localStorage
      setUser(null);
      localStorage.removeItem("user");
    }
    
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
