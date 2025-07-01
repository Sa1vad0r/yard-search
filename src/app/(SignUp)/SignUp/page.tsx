"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { useRouter } from "next/navigation";

const SignUpPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignUp = async () => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
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
            onClick={handleSignUp}
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
