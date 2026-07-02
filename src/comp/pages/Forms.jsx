import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
// import "../styles/Forms.css";
import '../styles/FormBuilder.css'
export default function Forms() {
  const { formId } = useParams();
  const [questions, setQuestions] = useState(null); // null for loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const ref = doc(db, `users/qform/forms/${formId}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setQuestions(data.questions || []); // safe default
        } else {
          setError("Form not found");
        }
      } catch (err) {
        console.error("Error loading form:", err);
        setError("Error loading form");
      }
    };

    loadForm();
  }, [formId]);

  // ⏳ Loading State
  if (questions === null && !error) return <h2>Loading...</h2>;

  // ❌ Error State
  if (error) return <h2>{error}</h2>;

  // ✅ Render Form
  return (
    <div className="forms_container">
      <div className="forms_header">
        <h2>Form Preview</h2>
      </div>

      {questions.length === 0 ? (
        <p>No form data. Please create a form first.</p>
      ) : (
        questions.map((q, i) => (
          <div key={i} className="forms_question">
            <p>
              {q.label}
              {q.required && <span className="required">*</span>}
            </p>

            {q.type === "short_text" && (
              <input type="text" placeholder={q.placeholder || ""} />
            )}

            {q.type === "paragraph" && (
              <textarea placeholder={q.placeholder || ""}></textarea>
            )}

            {q.type === "multiple_choice" &&
              q.options?.map((opt, idx) => (
                <label key={idx}>
                  <input type="radio" name={`q${i}`} /> {opt}
                </label>
              ))}

            {q.type === "checkbox" &&
              q.options?.map((opt, idx) => (
                <label key={idx}>
                  <input type="checkbox" /> {opt}
                </label>
              ))}

            {q.type === "dropdown" && (
              <select>
                {q.options?.map((opt, idx) => (
                  <option key={idx}>{opt}</option>
                ))}
              </select>
            )}

            {q.type === "linear_scale" && (
              <div>
                {[...Array((q.max ?? 5) - (q.min ?? 1) + 1)].map((_, idx) => (
                  <label key={idx}>
                    <input type="radio" name={`scale${i}`} />
                    {(q.min ?? 1) + idx}
                  </label>
                ))}
              </div>
            )}

            {(q.type === "multiple_grid" || q.type === "checkbox_grid") && (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {q.cols?.map((c, idx) => (
                      <th key={idx}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {q.rows?.map((r, rIdx) => (
                    <tr key={rIdx}>
                      <td>{r}</td>
                      {q.cols?.map((_, cIdx) => (
                        <td key={cIdx}>
                          {q.type === "multiple_grid" ? (
                            <input type="radio" name={`grid${i}-${rIdx}`} />
                          ) : (
                            <input type="checkbox" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {q.type === "date" && <input type="date" />}
            {q.type === "time" && <input type="time" />}
            {q.type === "file_upload" && <input type="file" />}
            {q.type === "download" && <button>Download</button>}
          </div>
        ))
      )}
    </div>
  );
}
