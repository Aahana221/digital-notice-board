import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./components/AuthPage";
import NoticeBoard from "./components/NoticeBoard";
import Layout from "./components/Layout";

type UserData = {
  name: string;
  role: string;
  email: string;
};

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);

  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  });


  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);


  useEffect(() => {
    const loggedInUser =
      localStorage.getItem("currentUser");

    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
  }, []);


  const handleLoginSuccess = (
    userData: UserData
  ) => {
    setUser(userData);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(userData)
    );
  };


  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };


  return (
    // <Layout
    //   darkMode={darkMode}
    //   onToggleTheme={() =>
    //     setDarkMode((c) => !c)
    //   }
    //   user={user}
    //   onLogout={handleLogout}
    //   footerVariant={
    //     user ? "compact" : "default"
    //   }
    // >

      <Routes>

        {/* Login Route */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/notice-board" />
            ) : (
              <AuthPage
                onLoginSuccess={handleLoginSuccess}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )
          }
        />


        {/* Notice Board Route */}
        <Route
          path="/notice-board"
          element={
            user ? (
              <NoticeBoard
                user={user}
                onLogout={handleLogout}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />


        {/* Invalid Route */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    // </Layout>
  );
}