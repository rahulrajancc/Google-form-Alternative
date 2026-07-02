import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./styles/login.css";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  // Google Sign-in
  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      let firstname = "";
      let lastname = "";
      if (user.displayName) {
        const parts = user.displayName.split(" ");
        firstname = parts[0] || "";
        lastname = parts[1] || "";
      }

      await setDoc(
        doc(db, "users", user.uid),
        { firstname, lastname, email: user.email },
        { merge: true }
      );

      navigate("/resume-editor"); // redirect to profile page
    } catch (err) {
      console.log(err);
      setErrorMsg("Google Sign-in failed. Try again.");
    }
  };

  // Email Sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const r = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = r.user;

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email
      });

      // Send verification email
      await sendEmailVerification(user);

      setInfoMsg(
        "Sign-up successful! Please check your email to verify before logging in."
      );

      // Clear password fields
      setFormData({ ...formData, password: "", confirmPassword: "" });
    } catch (err) {
      console.log(err);
      setErrorMsg("Sign-up failed. Try again.");
    }
  };

  // Email Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Reload to get latest emailVerified status
      await res.user.reload();

      if (!res.user.emailVerified) {
        setErrorMsg(
          "Please verify your email before logging in. Check your inbox."
        );
        return;
      }

      setInfoMsg("Login successful!");
      navigate("/resume-editor");
    } catch (err) {
      console.log(err);
      setErrorMsg("Login failed. Try again.");
    }
  };

  // Refresh email verification manually
  const handleRefreshVerification = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setInfoMsg("Email verified! You can now log in.");
        setErrorMsg("");
      } else {
        setErrorMsg("Email not verified yet. Check your inbox!");
      }
    }
  };

  return (
    <div className={`auth-container ${isSignUp ? "signup-mode" : ""}`}>
      <div className="form-box">
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}
        {infoMsg && <div className="info-box">{infoMsg}</div>}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="show-pass-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          <button type="submit" className="btn-primary">
            {isSignUp ? "Register" : "Login"}
          </button>
        </form>

      

        <button className="google-btn" onClick={handleGoogle}>
          Sign in with Google
        </button>

        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
