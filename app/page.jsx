// app/page.jsx
"use client"; // This is a client component, as it uses state and handles form submission.

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message);
        setEmail(""); // Clear the input on success
      } else {
        setIsSuccess(false);
        setMessage(data.message);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("An unexpected error occurred. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="w-full max-w-md mx-auto p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Stay Updated!</h1>
          <p className="text-gray-400 mt-2">
            Sign up to receive weekly highlights from GitHub’s public timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        {message && (
          <p
            className={`text-center text-sm mt-4 p-3 rounded-md ${
              isSuccess
                ? "bg-green-800 text-green-200"
                : "bg-red-800 text-red-200"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
