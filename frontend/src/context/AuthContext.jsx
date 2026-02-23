import { createContext, useContext, useEffect, useState } from "react";
import { getProfileApi, refreshTokenApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }
      setToken(accessToken);
      try {
        // Try getting profile with existing access token
        const profileRes = await getProfileApi();
        setUser(profileRes.data.user);
      } catch (err) {
        try {
          // Access token expired → refresh it
          const refreshRes = await refreshTokenApi();
          const newAccessToken = refreshRes.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          setToken(newAccessToken);
          // Retry profile request
          const profileRes = await getProfileApi();
          setUser(profileRes.data.user);
        } catch (refreshErr) {
          // 4️⃣ Refresh token invalid → full logout
          localStorage.removeItem("accessToken");
          setUser(null);
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("accessToken", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
