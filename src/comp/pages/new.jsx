import React, { useState,useReducer } from "react";
import "../styles/FormBuilder.css";
import "../styles/Forms.css"
import { Card, CardContent } from "../ui/card";
import { useNavigate } from "react-router-dom";


const ap = async (prompt) => {
  try {
    const res = await fetch("", {
      method: "POST",
      headers: {
        Authorization: ``, // replace with your key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4-fast:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!data.choices || !data.choices[0]) {
      return data.error?.message || "Something went wrong (no choices)";
    }
    return data.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return "⚠️ Error connecting to AI";
  }
};

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
const [Is,setIs]=useState(true);
const [Pro,setPro]=useState(false);
 const [questionPro, setQuestionPro] = useState([
    {
      type: "Properties",
      title: "Properties",
      desc: "Select the theme of form",
      BgColor: "#ffffff",
      HeaderColor: "#000000",
      TextColor: "#000000",
      cardColor: "#ffffff",
      cardBordercolor: "#cccccc",
      
    }
  ]);
const ch=()=>{
  if(Is){setIs(false)}
    else {setIs(true)}
    // console.log(Is)
}
const ch2=()=>{
  if(Pro){setPro(false)}
    else {setPro(true)}
    // console.log(Is)
}
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate("/Forms", { state: { questions } });
  };
  const handleColorChange = (index, key, value) => {
    setQuestionPro((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const questionTypes = [
    {type: "Properties",
      title: "Properties",
      desc: "Select the theme of form",},
   
    {
      type: "short_text",
      title: "Short Answer",
      desc: "Single-line text input",
      img: require("../images/text.png"),
      default: { label: "Untitled Question", placeholder: "Enter text...", required: false },
    },
    {
      type: "paragraph",
      title: "Paragraph",
      desc: "Multi-line text input",
      img: require("../images/paragraph.png"),
      default: { label: "Untitled Question", placeholder: "Enter long answer...", required: false },
    },
    {
      type: "multiple_choice",
      title: "Multiple Choice",
      desc: "Select one option",
      img: require("../images/multiple_choice.png"),
      default: { label: "Untitled Question", options: ["Option 1", "Option 2"], required: false },
    },
    {
      type: "checkbox",
      title: "Checkboxes",
      desc: "Select multiple options",
      img: require("../images/checkbox.png"),
      default: { label: "Untitled Question", options: ["Option 1", "Option 2"], required: false },
    },
    {
      type: "dropdown",
      title: "Dropdown",
      desc: "Choose one option from a list",
      img: require("../images/dropdown.png"),
      default: { label: "Untitled Question", options: ["Option 1", "Option 2"], required: false },
    },
    {
      type: "linear_scale",
      title: "Linear Scale",
      desc: "Rate between numbers",
      img: require("../images/scale.png"),
      default: { label: "Rate from 1 to 5", min: 1, max: 5, required: false },
    },
    {
      type: "multiple_grid",
      title: "Multiple Choice Grid",
      desc: "Grid of radio options",
      img: require("../images/grid.png"),
      default: { label: "Untitled Grid", rows: ["Row 1"], cols: ["Col 1", "Col 2"], required: false },
    },
    {
      type: "checkbox_grid",
      title: "Checkbox Grid",
      desc: "Grid with multiple selections",
      img: require("../images/grid.png"),
      default: { label: "Untitled Grid", rows: ["Row 1"], cols: ["Col 1", "Col 2"], required: false },
    },
    {
      type: "date",
      title: "Date",
      desc: "Pick a date",
      img: require("../images/date.png"),
      default: { label: "Select a date", required: false },
    },
    {
      type: "time",
      title: "Time",
      desc: "Pick a time",
      img: require("../images/time.png"),
      default: { label: "Select a time", required: false },
    },
    {
      type: "file_upload",
      title: "File Upload",
      desc: "Allow file upload",
      img: require("../images/file.png"),
      default: { label: "Upload a file", required: false },
    },
     {
      type: "Add_images",
      title: "Add images",
      desc: "Add Images",
      img: require("../images/file.png"),
      default: { label: "Add a Images", required: false },
    },
    
    {
      type: "download",
      title: "Download File",
      desc: "Provide a file to download",
      img: require("../images/downlaod.png"),
      default: { label: "Download the file", required: false },
    },
  ];
console.log(questionTypes)
  const handleAddQuestion = (q) => {
    if(q.type==="Properties"){
      setPro(true)
      return}
      setPro(false)
    setQuestions([...questions, { ...q.default, type: q.type }]);
  };

  const updateQuestion = (field, value) => {
    const updated = [...questions];
    updated[selectedIndex][field] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    if (selectedIndex === index) setSelectedIndex(null);
    else if (selectedIndex > index) setSelectedIndex(selectedIndex - 1);
  };

  // --- AI Form Generation ---
  const handleGenerateAIForm = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);

    const structuredPrompt = `
You are a form generator. 
Output JSON only (no text outside JSON). 
Schema:
{
  "questions": [
    {
      "type": "short_text" | "paragraph" | "multiple_choice" | "checkbox" | "dropdown" | "linear_scale" | "multiple_grid" | "checkbox_grid" | "date" | "time" | "file_upload",
      "label": "Question text",
      "required": true | false,
      "placeholder": "Optional placeholder",
      "options": ["Option 1", "Option 2"],
      "min": 1,
      "max": 5,
      "rows": ["Row 1"],
      "cols": ["Col 1", "Col 2"]
    }
  ]
}
Request: "${aiPrompt}"`;

    const response = await ap(structuredPrompt);
console.log(response)
    try {
      const parsed = JSON.parse(response);
      if (parsed.questions) {
        setQuestions(parsed.questions);
      } else {
        alert("AI did not return questions.");
      }
    } catch (err) {
      console.error("JSON parse failed:", err);
      alert("AI did not return valid JSON.");
    }

    setLoading(false);
  };

  return (
    <>
    {Is ? (
      <>

   
      <div className="builder_container">
        <h2>Form Builder</h2>
        <div className="builder_buttons">
          <button type="button">Save</button>
          <button type="button" onClick={ch}>Preview</button>
          <button type="button">Save & Publish</button>
        </div>
      </div>

      <div className="builder_main">
        {/* Card 1: Question Types */}
        <Card className="card_1">
          <CardContent>
            <h3>Question Type</h3>
            {questionTypes.map((q, i) => (
              <div key={i} className="Question_container" onClick={() => handleAddQuestion(q)}>
                <img src={q.img} alt={q.title} />
                <div className="Question_tl">
                  <h3>{q.title}</h3>
                  <p>{q.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card 2: Form Preview */}
       {/* Card 2: Form Preview */}
<Card className="card_2">
  <div
    className="form_preview_container"
    style={{
      backgroundColor: questionPro[0].backgroundColor,
      padding: "15px",
      borderRadius: "8px",
    }}
  >
    <h3
      style={{
        color: questionPro[0].HeaderColor,
        marginBottom: "15px",
      }}
    >
      Form Preview
    </h3>

    {questions.map((q, i) => (
      <div
        key={i}
        className={`form_question ${selectedIndex === i ? "selected" : ""}`}
        style={{
          backgroundColor: questionPro[0].cardColor,
          color: questionPro[0].TextColor,
          border: `1px solid ${questionPro[0].cardBordercolor}`,
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
        onClick={() => setSelectedIndex(i)}
      >
        <div className="form_question_header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: questionPro[0].HeaderColor, margin: 0 }}>
            <b>{q.label}</b> {q.required && <span style={{ color: "red" }}>*</span>}
          </p>
          <img
            src={require("../images/delete.png")}
            alt=""
            className="remove_btn"
            style={{ cursor: "pointer", width: "18px" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveQuestion(i);
            }}
          />
        </div>

        {/* Question Inputs */}
        {q.type === "short_text" && <input type="text" placeholder={q.placeholder} disabled />}
        {q.type === "paragraph" && <textarea placeholder={q.placeholder} disabled />}
        {q.type === "multiple_choice" &&
          q.options?.map((opt, idx) => (
            <div key={idx}>
              <input type="radio" disabled /> {opt}
            </div>
          ))}
        {q.type === "checkbox" &&
          q.options?.map((opt, idx) => (
            <div key={idx}>
              <input type="checkbox" disabled /> {opt}
            </div>
          ))}
        {q.type === "dropdown" && (
          <select disabled>
            {q.options?.map((opt, idx) => (
              <option key={idx}>{opt}</option>
            ))}
          </select>
        )}
        {q.type === "linear_scale" && (
          <div>
            {Array.from({ length: q.max - q.min + 1 }, (_, idx) => q.min + idx).map((num) => (
              <label key={num}>
                <input type="radio" disabled /> {num}
              </label>
            ))}
          </div>
        )}
        {q.type === "multiple_grid" && (
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
                      <input type="radio" disabled />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {q.type === "checkbox_grid" && (
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
                      <input type="checkbox" disabled />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {q.type === "date" && <input type="date" disabled />}
        {q.type === "time" && <input type="time" disabled />}
        {q.type === "file_upload" && (
          <div className="file_class">
            <label className="files_label" htmlFor="file">
              Upload Files
            </label>
            <input id="file" type="file" accept="image/*" style={{ display: "none" }} disabled />
          </div>
        )}
        {q.type === "Add_images" && (
          <div className="file_class">
            <label className="files_label" htmlFor="file">
              Upload Image
            </label>
            <input id="file" type="file" accept="image/*" style={{ display: "none" }} disabled />
          </div>
        )}
        {q.type === "download" && <button disabled>Download</button>}
      </div>
    ))}
  </div>
</Card>


        {/* Card 3: Properties */}
        <Card className="card_3">
          <CardContent>
            <h3>Properties</h3>
            <div className="ai_generator">
              <textarea rows={2} placeholder="Example: Create a job application form with name, email, resume upload"
                value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
              <button onClick={handleGenerateAIForm} disabled={loading}>
                {loading ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            {Pro && <div className="Properties">
             


                {questionPro.map((q, i) => (
  <div key={i} className="color-card">
    <h3 className="card-title" style={{ color: q.HeaderColor }}>{q.title}</h3>
    <p className="card-desc" style={{ color: q.TextColor }}>{q.desc}</p>

    <div className="color-inputs">
      

      <div className="input-group">
        <label>Header</label>
        <input
          type="color"
          value={q.HeaderColor}
          onChange={(e) => handleColorChange(i, "HeaderColor", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Text</label>
        <input
          type="color"
          value={q.TextColor}
          onChange={(e) => handleColorChange(i, "TextColor", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Card</label>
        <input
          type="color"
          value={q.cardColor}
          onChange={(e) => handleColorChange(i, "cardColor", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Card Border</label>
        <input
          type="color"
          value={q.cardBordercolor}
          onChange={(e) => handleColorChange(i, "cardBordercolor", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Background</label>
        <input
          type="color"
          value={q.BgColor}
          onChange={(e) => handleColorChange(i, "backgroundColor", e.target.value)}
        />
      </div>
    </div>

    <div
      className="preview-box"
      style={{
        backgroundColor: q.cardColor || q.BgColor,
        color: q.TextColor,
        border: `2px solid ${q.cardBordercolor}`,
      }}
    >
      <h4 style={{ color: q.HeaderColor }}>Preview Header</h4>
      <p>Preview text inside the card</p>
    </div>
  </div>
))}

</div>}
            {selectedIndex !== null ? (
              <div>
                <label>Question Label:</label>
                <input type="text" value={questions[selectedIndex].label}
                  onChange={(e) => updateQuestion("label", e.target.value)} />

                <div style={{ marginTop: "10px" }}>
                  <label><input type="checkbox" checked={questions[selectedIndex].required}
                    onChange={(e) => updateQuestion("required", e.target.checked)} /> Required</label>
                </div>

                {questions[selectedIndex].options && (
                  <div>
                    <label>Options:</label>
                    {questions[selectedIndex].options.map((opt, i) => (
                      <div key={i} style={{ display: "flex", gap: "5px" }}>
                        <input type="text" value={opt}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[selectedIndex].options[i] = e.target.value;
                            setQuestions(updated);
                          }} />
                        <img src={require("../images/delete.png")} alt="" style={{ cursor: "pointer", width: "20px" }}
                          onClick={() => {
                            const updated = [...questions];
                            updated[selectedIndex].options.splice(i, 1);
                            setQuestions(updated);
                          }} />
                      </div>
                    ))}
                    <img src={require("../images/add.png")} alt="" style={{ cursor: "pointer", width: "20px" }}
                      onClick={() => {
                        const updated = [...questions];
                        updated[selectedIndex].options.push("New Option");
                        setQuestions(updated);
                      }} />
                  </div>
                )}

                {questions[selectedIndex].type === "linear_scale" && (
                  <div>
                    <label>Min:</label>
                    <input type="number" min="0" value={questions[selectedIndex].min}
                      onChange={(e) => updateQuestion("min", parseInt(e.target.value))} />
                    <label>Max:</label>
                    <input type="number" min="1" max="10" value={questions[selectedIndex].max}
                      onChange={(e) => updateQuestion("max", parseInt(e.target.value))} />
                  </div>
                )}

                {(questions[selectedIndex].type === "multiple_grid" ||
                  questions[selectedIndex].type === "checkbox_grid") && (
                  <div>
                    <label>Rows:</label>
                    {questions[selectedIndex].rows.map((row, i) => (
                      <div key={i} style={{ display: "flex", gap: "5px" }}>
                        <input type="text" value={row}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[selectedIndex].rows[i] = e.target.value;
                            setQuestions(updated);
                          }} />
                        <img src={require("../images/delete.png")} alt="" style={{ cursor: "pointer", width: "20px" }}
                          onClick={() => {
                            const updated = [...questions];
                            updated[selectedIndex].rows.splice(i, 1);
                            setQuestions(updated);
                          }} />
                      </div>
                    ))}
                    <img src={require("../images/add.png")} alt="" style={{ cursor: "pointer", width: "20px" }}
                      onClick={() => {
                        const updated = [...questions];
                        updated[selectedIndex].rows.push("New Row");
                        setQuestions(updated);
                      }} />

                    <label>Columns:</label>
                    {questions[selectedIndex].cols.map((col, i) => (
                      <div key={i} style={{ display: "flex", gap: "5px" }}>
                        <input type="text" value={col}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[selectedIndex].cols[i] = e.target.value;
                            setQuestions(updated);
                          }} />
                        <img src={require("../images/delete.png")} alt="" style={{ cursor: "pointer", width: "20px" }}
                          onClick={() => {
                            const updated = [...questions];
                            updated[selectedIndex].cols.splice(i, 1);
                            setQuestions(updated);
                          }} />
                      </div>
                    ))}
                    <img src={require("../images/add.png")} alt="" style={{ cursor: "pointer", width: "20px" }}
                      onClick={() => {
                        const updated = [...questions];
                        updated[selectedIndex].cols.push("New Col");
                        setQuestions(updated);
                      }} />
                  </div>
                )}
              </div>
            ) : (
              <p>Select a question to edit its properties</p>
            )}
          </CardContent>
        </Card>
      </div>
   </> ) : (
 <div className="forms_container">
      <div className="builder_container">
               <h2>Form Preview</h2>

        <div className="builder_buttons">
          <button type="button">Save</button>
          <button type="button" onClick={ch}>Back to Edit</button>
          <button type="button">Save & Publish</button>
        </div>
      </div>
      <div className="forms_header">

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

            {q.type === "short_text" && <input type="text" placeholder={q.placeholder} />}
            {q.type === "paragraph" && <textarea placeholder={q.placeholder}></textarea>}

            {q.type === "multiple_choice" && q.options.map((opt, idx) => (
              <label key={idx}>
                <input type="radio" name={`q${i}`} /> {opt}
              </label>
            ))}

            {q.type === "checkbox" && q.options.map((opt, idx) => (
              <label key={idx}>
                <input type="checkbox" /> {opt}
              </label>
            ))}

            {q.type === "dropdown" && (
              <select>
                {q.options.map((opt, idx) => <option key={idx}>{opt}</option>)}
              </select>
            )}

            {q.type === "linear_scale" && (
              <div>
                {[...Array(q.max - q.min + 1)].map((_, idx) => (
                  <label key={idx}>
                    <input type="radio" name={`scale${i}`} />
                    {q.min + idx}
                  </label>
                ))}
              </div>
            )}

            {(q.type === "multiple_grid" || q.type === "checkbox_grid") && (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {q.cols.map((c, idx) => <th key={idx}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {q.rows.map((r, rIdx) => (
                    <tr key={rIdx}>
                      <td>{r}</td>
                      {q.cols.map((_, cIdx) => (
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
 {q.type==="Add_images" && <div className="file_class">
                    <label className="files_label" htmlFor="file"> Upload Image</label>
<input id="file" type="file" accept="image/*" style={{ display: "none" }} /></div>}
            {q.type === "date" && <input type="date" />}
            {q.type === "time" && <input type="time" />}
{q.type === "file_upload" && <div className="file_class">
                    <label className="files_label" htmlFor="file"> Upload Files</label>
<input id="file" type="file"  accept="image/*" style={{ display: "none" }} /></div>}            {q.type === "download" && <button>Download</button>}
          </div>
        ))
      )}
    </div>
  )}
    </>
  );
}


convert above code as
in card_3 i need to add porperties section as add img or video as backgound in background and card 