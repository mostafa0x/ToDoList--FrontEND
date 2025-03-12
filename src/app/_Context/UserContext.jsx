"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";

export const UserContext = createContext({
  UserToken: null,
  setUserToken: () => {},
});
export default function UserContextProvider({ children }) {
  const Path = usePathname();
  const [UserToken, setUserToken] = useState(null);
  const [headers, setheaders] = useState({
    Authorization: UserToken,
  });

  useEffect(() => {
    if (localStorage.getItem("UserToken") != null) {
      setUserToken(localStorage.getItem("UserToken"));
      setheaders({ Authorization: localStorage.getItem("UserToken") });
    }
  }, [Path]);
  return (
    <UserContext.Provider
      value={{ UserToken, setUserToken, headers, setheaders }}
    >
      {children}
    </UserContext.Provider>
  );
}
