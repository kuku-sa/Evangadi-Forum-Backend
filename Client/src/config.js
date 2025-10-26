export const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "https://evangadi-forum-backend-4sc5.onrender.com/api";
// // src/config.js
// export const API_URL =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:5000/api"
//     : "https://evangadi-forum-backend-production.up.railway.app/api";

// // src/config.js
// export const API_URL =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:5000/api"
//     : "https://evangadi-forum-backend-production.up.railway.app/api";
// import { useEffect, useState } from "react";
// import { API_URL } from "../config";

// export default function Questions() {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     fetch(`${API_URL}/question`)
//       .then(res => res.json())
//       .then(data => setQuestions(data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       <h1>Questions</h1>
//       <ul>
//         {questions.map(q => (
//           <li key={q.id}>{q.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
