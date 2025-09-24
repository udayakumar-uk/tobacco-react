import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from '../config';
import { useGetById } from '../hooks/useGetById';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [myUser, setMyUser] = useState(null);
  const { userData, fetchUserById } = useGetById('user/getUserById');

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
      // Fetch user details and update myUser
      const userDetails = await fetchUserById(data.userId, data.token);
      if (userDetails.status) {
        setMyUser(userDetails.data);
        localStorage.setItem('myUser', JSON.stringify(userDetails.data));
      } else {
        setMyUser(null);
        localStorage.removeItem('myUser');
      }
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
      setMyUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("myUser");
    }
    
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, myUser, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
