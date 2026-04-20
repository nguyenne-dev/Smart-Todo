import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        if(res.status === "success") {
          setUser(res.data);
          setIsLogin(true);
        } else {
          setUser(null);
          setIsLogin(false);
        }
      } catch (err) {
        setUser(null);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, user, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);