import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import styles from "./EditAnswerPage.module.css";

const EditAnswerPage = () => {
  const { id: questionid, answerid } = useParams();
  const navigate = useNavigate();

  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [originalAnswer, setOriginalAnswer] = useState(""); // store original answer

  useEffect(() => {
    if (!questionid || !answerid) {
      setMessage({
        type: "error",
        text: "Missing question or answer ID in URL",
      });
      setLoading(false);
      return;
    }

    const fetchAnswer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/answer/${questionid}`, {
          headers: { Authorization: "Bearer " + token },
        });

        const answerObj = res.data.data.find(
          (a) => String(a.answerid) === String(answerid)
        );

        if (!answerObj) {
          setMessage({
            type: "error",
            text: "Answer not found for this question",
          });
        } else {
          setAnswerText(answerObj.answer || "");
          setOriginalAnswer(answerObj.answer || ""); // save original
        }
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to fetch answers" });
      } finally {
        setLoading(false);
      }
    };

    fetchAnswer();
  }, [questionid, answerid]);

  const handleUpdate = async () => {
    if (!answerText.trim()) {
      setMessage({ type: "error", text: "Answer cannot be empty" });
      return;
    }

    // Detect no changes
    if (answerText.trim() === originalAnswer.trim()) {
      setMessage({ type: "error", text: "No changes made to the answer" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        `/answer/${answerid}`,
        { answer: answerText },
        { headers: { Authorization: "Bearer " + token } }
      );

      setMessage({ type: "success", text: "Answer updated successfully!" });
      setTimeout(() => navigate(`/answer/${questionid}`), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update answer" });
    }
  };

  if (loading) return <p className={styles.message}>Loading...</p>;

  return (
    <div className={styles.editAnswerContainer}>
      {message.text && (
        <p className={message.type === "error" ? styles.error : styles.success}>
          {message.text}
        </p>
      )}

      <h2>Edit Answer</h2>
      <textarea
        className={styles.textarea}
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        rows={5}
        placeholder="Update your answer..."
      />
      <button className={styles.updateBtn} onClick={handleUpdate}>
        Update Answer
      </button>
    </div>
  );
};

export default EditAnswerPage;
