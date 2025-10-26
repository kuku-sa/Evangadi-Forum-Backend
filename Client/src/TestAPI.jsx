import { useEffect, useState } from "react";
import { API_URL } from "./config";

export default function TestAPI() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/question`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch questions");
        }

        // ✅ ensure data is an array
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          setError("Unexpected response from server");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message);
      }
    }

    fetchQuestions();
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Questions from Backend</h1>
      {questions.length === 0 && <p>Loading...</p>}
      <ul>
        {questions.map((q) => (
          <li key={q.id}>{q.title}</li>
        ))}
      </ul>
    </div>
  );
}
