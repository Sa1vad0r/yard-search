"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const SignUpPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignUp = async () => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async () => {
          await handleUserData(name, username, email);
        })
        .catch((error) => {
          console.error(error);
        });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleUserData = async (
    name: string,
    username: string,
    email: string
  ) => {
    console.log("Running handleUserData");

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No authenticated user.");
      return;
    }
    const uid = user.uid;
    try {
      await setDoc(doc(db, "users", uid), {
        UID: uid,
        name,
        username,
        email,
        createdAt: serverTimestamp(),
      });
      console.log("User document created.");
    } catch (err) {
      console.error("Error creating user document:", err);
    }
  };

  return (
    <div className=" w-1/3 mx-auto flex flex-col gap-4 p-4">
      <h2>Sign Up</h2>
      {submitted ? (
        <div>Thank you for signing up!</div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <label>
              Name
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
          )}
          <button
            type="button"
            style={{ width: "100%", padding: 10 }}
            onClick={() => {
              handleSignUp();
            }}
          >
            Sign Up
          </button>
        </>
      )}
      <button
        onClick={() => {
          router.push("/SignIn");
        }}
        className="text-blue-300"
      >
        Have an account? sign IN
      </button>
    </div>
  );
};

export default SignUpPage;
