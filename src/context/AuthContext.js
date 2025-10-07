import { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userNumber, setUserNumber] = useState(null);
  const [bornDetail, setBornDetail] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const navigate = useNavigate();
  // load user from localStorage on refresh
  useLayoutEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parseUser = JSON.parse(storedUser)
    if (storedUser) setUser(parseUser);
    setAdmin(parseUser?.userDetails?.role === 'ADMIN');
  }, []);

  // Store user in localStorage and update state
  const setUserLocally = (userObj) => {
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
    }
  }

    // Get user in localStorage
  const getUserLocally = () => {
    const getUser = JSON.parse(localStorage.getItem('user'));
    return getUser
  }


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
      if(data?.userDetails?.role === 'ADMIN'){
        navigate("/user");
        setAdmin(true);
      }else{
        navigate("/barn");
        setAdmin(false);
      }
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

    if (!response.ok){
      setUser(null);
      localStorage.removeItem("user");
      navigate('/login');
      throw new Error("Logout failed");
    } 

    const data = await response.json();
    
    if (data.status === 1) {
      console.log("Logout successful:", data);
      // clear user from context and localStorage
      setUser(null);
      localStorage.removeItem("user");
      navigate('/login');
        // window.location.reload();
    }
    
    return data;
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        setUserLocally, 
        getUserLocally,
        setUserName,
        setUserEmail,
        setUserNumber,
        userName,
        userEmail,
        userNumber,
        bornDetail, 
        setBornDetail,
        isAdmin,
        setAdmin
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
