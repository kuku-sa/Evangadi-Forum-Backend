import React, { useContext, useState, useEffect } from "react";
import { Appstate } from "../Appstate";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(Appstate);

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUsername = localStorage.getItem("username");
        const savedUserid = localStorage.getItem("userid");

        if (!token || !savedUsername) {
          navigate("/login");
          return;
        }

        if (!user?.username) {
          setUser({ username: savedUsername, userid: savedUserid });
        }

        await axiosInstance.get("/user/checkUser", {
          headers: { Authorization: "Bearer " + token },
        });
        
        setIsAuthenticated(true); // ✅ Set authenticated after successful check
      } catch (err) {
        console.error("Token check failed:", err.response?.data || err.message);
        navigate("/login");
      }
    };

    verifyUser();
  }, [user, setUser, navigate]);

  useEffect(() => {
    // ✅ Only fetch questions if user is authenticated
    if (!isAuthenticated) return;

    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/question", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setQuestions(res.data.data.reverse());
      } catch (err) {
        console.error(
          "Error fetching questions:",
          err.response?.data || err.message
        );
      }
    };
    fetchQuestions();
  }, [isAuthenticated]); // ✅ Only run when isAuthenticated changes

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const deleteQuestion = async (e, questionid) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete("/question/" + questionid,{
        headers: { Authorization: "Bearer " + token },
      });
      setQuestions((prev) => prev.filter((q) => q.questionid !== questionid));
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error deleting question");
    }
  };

  // ✅ Show loading state while checking authentication
  if (!isAuthenticated) {
    return <div className="home-container">Loading...</div>;
  }

  return (
    <div className="home-container">
      <h2 className="wellcom_msg">
        Welcome: <span className="username">{user?.username}</span>
      </h2>

      <div className="ask-section">
        <button className="ask-btn" onClick={() => navigate("/QuestionPage")}>
          Ask Question
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search question"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="questions-list">
        {visibleQuestions.map((q) => (
          <div
            key={q.questionid}
            className="question-item"
            onClick={() => navigate("/answer/" + q.questionid)}
            style={{ cursor: "pointer" }}
          >
            <div className="question-left">
              <div className="avatar">👤</div>
              <div>
                <div className="question-text">{q.title}</div>
                <div className="author">
                  {q.username} &nbsp;•&nbsp;{" "}
                  <span className="date">
                    {new Date(q.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {q.userid === user?.userid && (
              <div className="question-actions">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/QuestionPage/" + q.questionid + "/edit");
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => deleteQuestion(e, q.questionid)}
                >
                  Delete
                </button>
              </div>
            )}

            <div className="arrow">➡</div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="page-numbers">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`page-number ${
                  page === currentPage ? "active" : ""
                } ${page === "..." ? "dots" : ""}`}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;