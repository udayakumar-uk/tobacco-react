import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (credentials) => {
    // Login with Postman API)
    const response = await fetch("http://54.167.203.153:4008/user/login", {
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
    // Logout with Postman API
    const response = await fetch("http://54.167.203.153:4008/user/logout", {
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
      localStorage.removeItem("user");
      setUser(null);
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
