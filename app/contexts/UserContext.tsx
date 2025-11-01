"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { TUser } from "../types";

interface TUserContext {
  user: TUser | null;
  setUser: (user: TUser) => void;
  logout: () => void;
}
export const userContext = createContext<TUserContext>({
  user: null,
  setUser: () => {},
  logout() {},
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<TUser | null>(null);

  const setUser = async (user: TUser) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  useEffect(() => {
    const userStorage = localStorage.getItem("user");

    if (userStorage) {
      setUserState(JSON.parse(userStorage));
    }
  }, []);

  const logout = () => {
    setUserState(null);
    localStorage.clear();
  };
  return (
    <userContext.Provider value={{ user, setUser, logout }}>
      {children}
    </userContext.Provider>
  );
}

export function UseUser() {
  const context = useContext<TUserContext>(userContext);

  if (!context) throw new Error("Context not loading");

  return context;
}
