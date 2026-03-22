import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  let timer;

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    startIdleTimer();
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // =========================
  // Idle Timer Logic
  // =========================
  const startIdleTimer = () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      alert("Session expired due to inactivity");
      logout();
    }, 15 * 60 * 1000); // 15 minutes
  };

  useEffect(() => {
    if (!user) return;

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) =>
      window.addEventListener(event, startIdleTimer)
    );

    startIdleTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, startIdleTimer)
      );
      clearTimeout(timer);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
