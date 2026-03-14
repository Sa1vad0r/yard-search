"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { useRouter } from "next/navigation";

const SignInPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Home");
    } catch (err) {
      if (err instanceof Error) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-white font-bold">YS</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">Yard Search</span>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">
          Buy and sell in your neighbourhood
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition text-sm"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/SignUp")}
              className="text-green-600 font-semibold hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
