import React, { useEffect, useState } from "react";
import "./comp/styles/App.css";
import Nav, { SideNav } from "./comp/Nav";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import FormBuilder from "./comp/pages/FormBuilder";
import Forms from "./comp/pages/Forms";
import Responses from "./comp/pages/Responses";
import Dashboard from "./comp/pages/Dashboard";
import AuthPage from "./comp/AuthPage";
import { auth } from "./firebase";
import { supabase } from './supabaseClient'

import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser && currentUser.emailVerified ? currentUser : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

const addUser = async () => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name: "Rahul", age: 21 }])

  console.log(data, error)
}
  return (
    <Router>
      {!user ? (
       
        <Routes>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      ) : (
   
        <>
          <Nav onLogout={handleLogout} />
          <div className="App_container">
            <div>
              <SideNav />
            </div>
            <div className="Right_side">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/Responses" element={<Responses />} />
                <Route path="/Forms/:formId" element={<Forms />} />
                <Route path="/FormBuilder" element={<FormBuilder />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </Router>
   
  );
}

export default App;
