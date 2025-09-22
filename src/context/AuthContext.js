import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [myUser, setMyUser] = useState(null);

  // load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    const storedMyUser = localStorage.getItem("myUser");
    if (storedMyUser) setMyUser(JSON.parse(storedMyUser));
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
      currUser(data.userId, data.token);
    }
    return data;
  };
 

  const currUser = async (userId, token) => {
    // Get User Details with API
    const response = await fetch(`${API_BASE_URL}/user/getUserById`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();

    if (data.status) {
      localStorage.setItem("myUser", JSON.stringify(data.data));
      setMyUser(data.data);
    }else{
      setMyUser(null);
      localStorage.removeItem("myUser");
    }
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
      setMyUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("myUser");
    }
    
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, myUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
