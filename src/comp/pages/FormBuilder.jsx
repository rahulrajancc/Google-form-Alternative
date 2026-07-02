import React, { useState } from "react";
import "../styles/FormBuilder.css";
import "../styles/Forms.css";
import { Card, CardContent } from "../ui/card";
import { useNavigate } from "react-router-dom";
import Auth_pic from "../images/two-factor-authentication.png"
import Timer_pic from "../images/stopwatch.png"
import tick_pic from "../images/check.png"
// import {ref,set,push } from "firebase/database";
import { doc, setDoc,collection, addDoc } from "firebase/firestore";
import { auth,db } from "../../firebase";
import {v4 as uuidv4} from "uuid"
import axios from "axios";
/* ---------- AI helper ---------- */
const ap = async (prompt) => {
  try {
    const res = await fetch("", {
      method: "POST",
      headers: {
        Authorization: ``,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4-fast:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    if (!data.choices?.[0]) return data.error?.message || "AI error";
    return data.choices[0].message.content;
  } catch {
    return " Error connecting to AI";
  }
};

/* ---------- Component ---------- */
export default function FormBuilder() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBuilder, setIsBuilder] = useState(true);
  const [showPro, setShowPro] = useState(false);
  /* near top with other useState */
  const [ShowAuth,SetShowAuth]=useState(false);
  const [ShowTimer,SetShowtimer]=useState(false);
  const [AuthImg,SetAuthImg]=useState(Auth_pic);
  const [TimerImg,Settimerimg]=useState(Timer_pic);
  const [formTitle, setFormTitle] = useState("Form Preview");
const [formDescription, setFormDescription] = useState("");


 const [passwordType, setPasswordType] = useState("text");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");


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
      backgroundMedia: null,
      cardMedia: null,
    },
  ]);
 const [timerInput, setTimerInput] = useState("");
  const [timerHandle, setTimerHandle] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

const ToFiredb = async () => {
  const userId = auth.currentUser.uid;
  const formId = uuidv4();

  await setDoc(doc(db, `users/qform/forms/${formId}`), {
    owner: userId,
    questions,
    Password: confirmPassword,
    Timers: timerInput,
    Passwordtp: passwordType,
  });
  

  console.log("Form saved with ID:", formId);
};

  const [uploaded, setUploaded] = useState(null);
  const upload = async (file) => {
    const form = new FormData();
    form.append('file', file);

    try {
      // setLoading(true);
      const res = await axios.post('http://localhost:4000/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // store server response for later use
      setUploaded(res.data);
      console.log('Upload response:', res.data);
      // return server response so callers can use returned URL/info
      return res.data.url;
    } catch (err) {
      console.error('Upload error:', err);
      // rethrow so caller can handle UI state
      throw err;
    } finally {
      // setLoading(false);
    }
  };

  const handleTimerSubmit = (e) => {
    e.preventDefault();

    if (!timerInput || isNaN(timerInput) || timerInput <= 0) {
      setStatusMessage(" Please enter a valid timer value (in seconds).");
      return;
    }

    setTimerHandle(timerInput);
    setStatusMessage(`Timer handle set to ${timerInput} seconds.`);
    Settimerimg(tick_pic)
    setTimerInput("");
  };

const [amountInput, setAmountInput] = useState("");
  const [setAmount, setSetAmount] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleSetAmount = (e) => {
    e.preventDefault();

    if (!amountInput || isNaN(amountInput) || amountInput <= 0) {
      setPaymentStatus(" Please enter a valid amount.");
      return;
    }

    setSetAmount(amountInput);
    setPaymentStatus(` Amount set to ₹${amountInput}`);
    setAmountInput("");
  };

  const handlePay = () => {
    if (!setAmount) {
      setPaymentStatus(" No amount set by owner yet!");
      return;
    }

    setPaymentStatus(` Payment of ₹${setAmount} successful!`);
  };


  //  const [uploadedImages, setUploadedImages] = useState([]);

  // handle multiple image uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    // const imageUrls = files.map((file) => URL.createObjectURL(file));
    const ur=await upload(files[0]);
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === selectedIndex ? { ...q, url: ur } : q
      )
    );
    console.log(ur);
    // setUploadedImages(imageUrls);
  };


    const [uploadedFile, setUploadedFile] = useState(null);
  const [fileURL, setFileURL] = useState("");
  const [fileStatus, setFileStatus] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFileStatus(" No file selected!");
      return;
    }

    setFileStatus('Uploading file...');

    try {
      // wait for server upload and prefer server-provided URL if available
      const resData = await upload(file);
      
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === selectedIndex ? { ...q, url: resData } : q
      )
    );
    console.log(resData);

      // determine file URL: server response may include `url` or `fileUrl` or be a string
      const serverUrl = resData && (resData.url || resData.fileUrl || (typeof resData === 'string' ? resData : null));

      const fileLink = serverUrl || URL.createObjectURL(file);

      setUploadedFile(file);
      setFileURL(fileLink);

      setFileStatus(`File "${file.name}" uploaded successfully!`);
    } catch (err) {
      setFileStatus('Upload failed.');
    }
  };

  /* ---------- Question types ---------- */
  const questionTypes = [
    { type: "Properties", title: "Form Settings", desc: "Select the theme of form" , img: require("../images/note.png")},
    { type: "Auth", title: "Authentication", desc: "Set password" , img: AuthImg},
    { type: "timer", title: "Set Timer", desc: "Set Timer" , img:TimerImg},
    { type: "short_text", title: "Short Answer", desc: "Single-line text", img: require("../images/text.png"), default: { label: "Untitled", placeholder: "Type…", required: false } },
    { type: "paragraph", title: "Paragraph", desc: "Multi-line text", img: require("../images/paragraph.png"), default: { label: "Untitled", placeholder: "Long text…", required: false } },
    { type: "multiple_choice", title: "Multiple Choice", desc: "Pick one", img: require("../images/multiple_choice.png"), default: { label: "Untitled", options: ["Option 1", "Option 2"], required: false } },
    { type: "checkbox", title: "Checkboxes", desc: "Pick many", img: require("../images/checkbox.png"), default: { label: "Untitled", options: ["Option 1", "Option 2"], required: false } },
    { type: "multiple_grid", title: "Multiple Choice Grid", desc: "Grid of radio options", img: require("../images/grid.png"), default: { label: "Untitled Grid", rows: ["Row 1"], cols: ["Col 1", "Col 2"], required: false }, },
     { type: "checkbox_grid", title: "Checkbox Grid", desc: "Grid with multiple selections", img: require("../images/grid.png"), default: { label: "Untitled Grid", rows: ["Row 1"], cols: ["Col 1", "Col 2"], required: false }, },
    { type: "dropdown", title: "Dropdown", desc: "Pick one", img: require("../images/dropdown.png"), default: { label: "Untitled", options: ["Option 1", "Option 2"], required: false } },
    { type: "linear_scale", title: "Linear Scale", desc: "1-5 scale", img: require("../images/scale.png"), default: { label: "Rate", min: 1, max: 5, required: false } },
    { type: "date", title: "Date", desc: "Pick date", img: require("../images/date.png"), default: { label: "Pick date", required: false } },
    { type: "time", title: "Time", desc: "Pick time", img: require("../images/time.png"), default: { label: "Pick time", required: false } },
    { type: "file_upload", title: "File Upload", desc: "Upload file", img: require("../images/file.png"), default: { label: "Upload", required: false ,url:"" } },
    { type: "Add_images", title: "Add images", desc: "Image block", img: require("../images/file.png"), default: { label: "Add image", required: false  ,url:""} },
    { type: "Download", title: "Download File", desc: "Provide file", img: require("../images/downlaod.png"), default: { label: "Download", required: false ,url:"" } },
    { type: "Pay", title: "Add Payment", desc: "Add payment section", img: require("../images/wallet.png"), default: { label: "Pay", required: false } },
  ];

const handlePasswordTypeChange = (e) => {
    setPasswordType(e.target.value);
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage(" Please fill out both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage(" Passwords do not match.");
    } else {

      setMessage("Password set successfully!");
      SetAuthImg(tick_pic)
    }
  };



  /* ---------- Handlers ---------- */
  const handleAddQuestion = (q) => {
    if (q.type === "Properties") {
      //  setShowPro(false);
    SetShowtimer(false);
    SetShowAuth(false);
      return setShowPro(true);}
    if (q.type === "Auth") {
       setShowPro(false);
    SetShowtimer(false);
    // SetShowAuth(false);
      return SetShowAuth(true);}
    if (q.type === "timer") {
       setShowPro(false);
    // SetShowtimer(false);
    SetShowAuth(false);
      return SetShowtimer(true);}
    
    setShowPro(false);
    SetShowtimer(false);
    SetShowAuth(false);
    setQuestions((prev) => [
      ...prev,
      {
        ...q.default,
        type: q.type,
        BgColor: "#ffffff",
        backgroundMedia: null,
      },
    ]);
  };

  const updateQuestion = (field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === selectedIndex ? { ...q, [field]: value } : q))
    );
  };

  const handleRemoveQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndex((prev) => (prev === index ? null : prev > index ? prev - 1 : prev));
  };

  const handleMediaChange = (index, key, file) =>
    setQuestionPro((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: file } : p))
    );

  const handleColorChange = (index, key, value) =>
    setQuestionPro((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p))
    );

  /* ---------- AI generation ---------- */
  const handleGenerateAIForm = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    const structuredPrompt = `You are a form generator. Output ONLY valid JSON, no extra text.
Schema:
{"questions":[{"type":"short_text"|"paragraph"|"multiple_choice"|"checkbox"|"dropdown"|"linear_scale"|"date"|"time"|"file_upload","label":"string","required":bool,"placeholder":"string?","options":["string"]?,"min":number?,"max":number?}]}
Request: "${aiPrompt}"`;
    const raw = await ap(structuredPrompt);
    try {
      const parsed = JSON.parse(raw);
      if (parsed.questions) setQuestions(parsed.questions.map((q) => ({ ...q, BgColor: "#ffffff", backgroundMedia: null })));
    } catch {
      alert("AI returned invalid JSON");
    }
    setLoading(false);
  };

  const togglePreview = () => setIsBuilder((b) => !b);


if (!isBuilder)
  return (
    <div className="forms_container">

      <div className="builder_container">
        
        <div className="builder_buttons">
         
          <button onClick={togglePreview}>Back to Edit</button>
          
        </div>
      </div>


      <div
        className="forms_body"
        style={{
          backgroundColor: questionPro[0].BgColor,
          color: questionPro[0].TextColor,
          position: "relative",
          padding: "15px",
          minHeight: "60vh",
              display: "flex",
              flexDirection:"column",
              alignItems:"center"
        }}
      >

        {questionPro[0].backgroundMedia?.type.startsWith("image") && (
          <img
            src={URL.createObjectURL(questionPro[0].backgroundMedia)}
            alt=""
            className="bg_media"
          />
        )}
        {questionPro[0].backgroundMedia?.type.startsWith("video") && (
          <video
            src={URL.createObjectURL(questionPro[0].backgroundMedia)}
            autoPlay
            loop
            muted
            className="bg_media"
          />
        )}
        <h2 style={{ color: questionPro[0].HeaderColor,zIndex:'3' }}>{formTitle}</h2>

        {formDescription && (
          <p style={{ color: questionPro[0].TextColor, margin: "0 0 20px 0" }}>
            {formDescription}
          </p>
        )}

        {/*  QUESTIONS  */}
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          questions.map((q, i) => (
            <div
              key={i}
              className="forms_question"
              style={{
                backgroundColor: q.BgColor || questionPro[0].cardColor,
                color: questionPro[0].TextColor,
                border: `1px solid ${questionPro[0].cardBordercolor}`,
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                position: "relative",
                overflow: "hidden",
                width:"34rem"
              }}
            >
              {/*  individual bg  */}
              {q.backgroundMedia?.type.startsWith("image") && (
                <img
                  src={URL.createObjectURL(q.backgroundMedia)}
                  alt=""
                  className="q_bg_media"
                />
              )}
              {q.backgroundMedia?.type.startsWith("video") && (
                <video
                  src={URL.createObjectURL(q.backgroundMedia)}
                  autoPlay
                  loop
                  muted
                  className="q_bg_media"
                />
              )}

              <div style={{ position: "relative", zIndex: 1 }}>
                <p>
                  {q.label}
                  {q.required && <span className="required">*</span>}
                </p>

                {/*  -------  controls identical to your last file  -------  */}
                {q.type === "short_text" && <input placeholder={q.placeholder} />}
                {q.type === "paragraph" && <textarea placeholder={q.placeholder}></textarea>}
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
                {q.type === "multiple_choice" &&
                  q.options.map((opt, idx) => (
                    <label key={idx}>
                      <input type="radio" name={`q${i}`} /> {opt}
                    </label>
                  ))}
                {q.type === "checkbox" &&
                  q.options.map((opt, idx) => (
                    <label key={idx}>
                      <input type="checkbox" /> {opt}
                    </label>
                  ))}
                {q.type === "dropdown" && (
                  <select>
                    {q.options.map((opt, idx) => (
                      <option key={idx}>{opt}</option>
                    ))}
                  </select>
                )}
                {q.type === "linear_scale" && (
                  <div>
                    {[...Array(q.max - q.min + 1)].map((_, idx) => (
                      <label key={idx}>
                        <input type="radio" name={`scale${i}`} /> {q.min + idx}
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "date" && <input type="date" />}
                {q.type === "time" && <input type="time" />}
                {q.type === "file_upload" && (
                  <div className="file_class">
                    <label htmlFor={`file${i}`}>Upload Files</label>
                    <input id={`file${i}`} type="file" style={{ display: "none" }} />
                  </div>
                )}
                {q.type === "Add_images" && (
                  <div className="file_class">
                    <label htmlFor={`img${i}`}>Upload Image</label>
                    <input id={`img${i}`} type="file" accept="image/*" style={{ display: "none" }} />
                  </div>
                )}
                {q.type === "download" && <button>Download</button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="builder_container">
        <h2>Form Builder</h2>
        <div className="builder_buttons">
          <button>Save</button>
          <button onClick={togglePreview}>Preview</button>
          <button onClick={ToFiredb}>Save & Publish</button>
        </div>
      </div>

      <div className="builder_main">
        {/* Card 1 – Types */}
        <Card className="card_1">
          <CardContent>
            <h3>Question Type</h3>
            {questionTypes.map((q, i) => (
              <div key={i} className="Question_container" onClick={() => handleAddQuestion(q)}>
                {q.img && <img src={q.img} alt={q.title} />}
                <div className="Question_tl">
                  <h3>{q.title}</h3>
                  <p>{q.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card 2 – Live Preview */}
        <Card className="card_2">
          <div
            className="form_preview_container"
            style={{
              backgroundColor: questionPro[0].BgColor,
              borderRadius: 8,
              position: "relative",
              padding: 15,
              overflow: "hidden",
            }}
          >
            {/* Global background media */}
            {questionPro[0].backgroundMedia?.type.startsWith("image") && (
              <img src={URL.createObjectURL(questionPro[0].backgroundMedia)}
                    alt="background"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                    }} />
            )}
            {questionPro[0].backgroundMedia?.type.startsWith("video") && (
              <video src={URL.createObjectURL(questionPro[0].backgroundMedia)}
                    autoPlay
                    loop
                    muted
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                    }} />
            )}

            <div style={{ position: "relative", zIndex: 1, marginBottom: 15 }}>
  <h2 style={{ color: questionPro[0].HeaderColor, margin: 0 }}>{formTitle}</h2>
  {formDescription && (
    <p style={{ color: questionPro[0].TextColor, margin: "4px 0 0 0" }}>{formDescription}</p>
  )}
</div>

            {questions.map((q, i) => (
              <div
                key={i}
                className={`form_question ${selectedIndex === i ? "selected" : ""}`}
                onClick={() => {
                   setShowPro(false);
    SetShowtimer(false);
    SetShowAuth(false);
                  setSelectedIndex(i)}}
                style={{
                  backgroundColor: q.BgColor || questionPro[0].cardColor,
                  color: questionPro[0].TextColor,
                  border: `1px solid ${questionPro[0].cardBordercolor}`,
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  zIndex: 1,
                }}
              >
                {/* Individual background media */}
                {q.backgroundMedia?.type.startsWith("image") && (
                  <img src={URL.createObjectURL(q.backgroundMedia)}
                    alt="background"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                    }} />
                )}
                {q.backgroundMedia?.type.startsWith("video") && (
                  <video  src={URL.createObjectURL(q.backgroundMedia)}
                    autoPlay
                    loop
                    muted
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                    }} />
                )}

                <div style={{ position: "relative", zIndex: 2 }}>
                  <div className="form_question_header">
                    <p>
                      <b>{q.label}</b> {q.required && <span style={{ color: "red" }}>*</span>}
                    </p>
                    <img
                      src={require("../images/delete.png")}
                      alt="del"
                      className="remove_btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveQuestion(i);
                      }}
                    />
                  </div>

                  {q.type === "short_text" && <input type="text" placeholder={q.placeholder} disabled />}
           {q.type === "Pay" && (
                  <div className="color-card">

             <div className="user-section">
        {/* <h3>User Panel</h3> */}
        <p className="display-amount">
          {setAmount ? `Amount to Pay: ₹${setAmount}` : "Waiting for owner to set amount..."}
        </p>
        <button onClick={handlePay} className="pay-btn">
          Pay Now
        </button>
      </div>
      {paymentStatus && <p className="message">{paymentStatus}</p>}
                  </div>
        )}
                  {q.type === "paragraph" && <textarea placeholder={q.placeholder} disabled />}
                  {q.type === "multiple_choice" &&
                    q.options.map((opt, idx) => (
                      <div key={idx}>
                        <input type="radio" disabled /> {opt}
                      </div>
                    ))}


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
        {q.type === "Add_images" && (
            <div className="user-section">
        <h3>User Panel</h3>
       
          <div className="image-grid">
           {q.url ? (
            <img src={q.url} alt="Uploaded" className="uploaded-image" />
          ) : (
            <p>No image uploaded yet.</p>
          )}
          </div>
        
      </div>
        )}
                    

                  {q.type === "checkbox" &&
                    q.options.map((opt, idx) => (
                      <div key={idx}>
                        <input type="checkbox" disabled /> {opt}
                      </div>
                    ))}
                  {q.type === "dropdown" && (
                    <select disabled>
                      {q.options.map((opt, idx) => (
                        <option key={idx}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {q.type === "linear_scale" && (
                    <div>
                      {[...Array(q.max - q.min + 1)].map((_, idx) => (
                        <label key={idx}>
                          <input type="radio" disabled /> {q.min + idx}
                        </label>
                      ))}
                    </div>
                  )}  
                  {q.type === "Download" && (
                    <div>
                      <button> <a href={q.url} download>Download</a></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card 3 – Properties / Editor */}
        <Card className="card_3">
          <CardContent>
            <h3>Properties</h3>

            {/* AI Generator */}
            <div className="ai_generator">
              <textarea
                rows={2}
                placeholder="Example: Create a job application form with name, email, resume upload"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button onClick={handleGenerateAIForm} disabled={loading}>
                {loading ? "Generating..." : "Generate with AI"}
              </button>
            </div>

            {/* its the propertise */}
            {showPro && (
              <div className="Properties">
                {/* =====  FORM HEADER EDITOR  ===== */}
<div className="question-editor" style={{ border: "1px solid #ddd", padding: 10, borderRadius: 6, marginBottom: 15 }}>
  <label>Form Title</label>
  <input
    type="text"
    value={formTitle}
    onChange={(e) => setFormTitle(e.target.value)}
    placeholder="Enter form title"
  />

  <label style={{ marginTop: 10 }}>Form Description</label>
  <textarea
    rows={2}
    value={formDescription}
    onChange={(e) => setFormDescription(e.target.value)}
    placeholder="Short description (optional)"
  />
</div>
{/* =====  / FORM HEADER EDITOR  ===== */}
                {questionPro.map((p, i) => (
                  <div key={i} className="color-card">
                    <h3 style={{ color: p.HeaderColor }}>{p.title}</h3>
                    <p style={{ color: p.TextColor }}>{p.desc}</p>

                    <div className="color-inputs">
                      <div className="input-group">
                        <label>Header Color</label>
                        <input type="color" value={p.HeaderColor} onChange={(e) => handleColorChange(i, "HeaderColor", e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Text Color</label>
                        <input type="color" value={p.TextColor} onChange={(e) => handleColorChange(i, "TextColor", e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Card Color</label>
                        <input type="color" value={p.cardColor} onChange={(e) => handleColorChange(i, "cardColor", e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Background Color</label>
                        <input type="color" value={p.BgColor} onChange={(e) => handleColorChange(i, "BgColor", e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Global Background Image/Video</label>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handleMediaChange(i, "backgroundMedia", e.target.files[0])}
                        />
                        {p.backgroundMedia && (
                          <button type="button" onClick={() => handleMediaChange(i, "backgroundMedia", null)}>
                            Remove Global BG Media
                          </button>
                        )}
                      </div>
                      <div className="input-group">
                        <label>Card Media</label>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handleMediaChange(i, "cardMedia", e.target.files[0])}
                        />
                        {p.cardMedia && (
                          <button type="button" onClick={() => handleMediaChange(i, "cardMedia", null)}>
                            Remove Card Media
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
{/* this for auth */}
{ShowAuth &&(
  <div className="color-card">
<div className="password-container">
      <h2>Set Your Password</h2>

      <div className="type-selector">
        <label>
          <input
            type="radio"
            value="text"
            checked={passwordType === "text"}
            onChange={handlePasswordTypeChange}
          />
          Text
        </label>
        <label>
          <input
            type="radio"
            value="number"
            checked={passwordType === "number"}
            onChange={handlePasswordTypeChange}
          />
          Number
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>New Password:</label>
          <input
            type={passwordType === "text" ? "text" : "number"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={`Enter ${passwordType} password`}
          />
        </div>

        <div className="input-group">
          <label>Confirm Password:</label>
          <input
            type={passwordType === "text" ? "text" : "number"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={`Confirm ${passwordType} password`}
          />
        </div>

        <button type="submit">Set Password</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  </div>
)}

{/* this for timer
 */}
 {ShowTimer &&(
   <div className="timer-container">
      <h2>Set Timer Handle</h2>

      <form onSubmit={handleTimerSubmit}>
        <div className="input-group">
          <label>Timer (in seconds):</label>
          <input
            type="number"
            placeholder="Enter seconds"
            value={timerInput}
            onChange={(e) => setTimerInput(e.target.value)}
          />
        </div>

        <button type="submit">Save Timer</button>
      </form>

      {statusMessage && <p className="message">{statusMessage}</p>}

      {timerHandle && (
        <div className="result">
          <h4>Saved Timer Handle:</h4>
          <p>{timerHandle} seconds</p>
        </div>
      )}
    </div>
 )}


            {/* Selected question editor */}
            {selectedIndex !== null && (
              <div className="question-editor">
                
                <label>Question Label</label>
                <input type="text" value={questions[selectedIndex].label} onChange={(e) => updateQuestion("label", e.target.value)} />

                <div style={{ marginTop: 10 }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={questions[selectedIndex].required}
                      onChange={(e) => updateQuestion("required", e.target.checked)}
                    />{" "}
                    Required
                  </label>
                </div>

                {/* Per-card background controls */}
                <div className="input-group">
                  <label>Card Background Color</label>
                  <input
                    type="color"
                    value={questions[selectedIndex].BgColor || "#ffffff"}
                    onChange={(e) => updateQuestion("BgColor", e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Card Background Image/Video</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => updateQuestion("backgroundMedia", e.target.files[0])}
                  />
                  {questions[selectedIndex].backgroundMedia && (
                    <button type="button" onClick={() => updateQuestion("backgroundMedia", null)}>
                      Remove Card BG Media
                    </button>
                  )}
                </div>

                {/* Options */}
                {questions[selectedIndex].options && (
                  <div>
                    <label>Options</label>
                    {questions[selectedIndex].options.map((opt, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 5 }}>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const upd = [...questions];
                            upd[selectedIndex].options[idx] = e.target.value;
                            setQuestions(upd);
                          }}
                        />
                        <img
                          src={require("../images/delete.png")}
                          alt="del"
                          style={{ cursor: "pointer", width: 20 }}
                          onClick={() => {
                            const upd = [...questions];
                            upd[selectedIndex].options.splice(idx, 1);
                            setQuestions(upd);
                          }}
                        />
                      </div>
                    ))}
                    <img
                      src={require("../images/add.png")}
                      alt="add"
                      style={{ cursor: "pointer", width: 20 }}
                      onClick={() => {
                        const upd = [...questions];
                        upd[selectedIndex].options.push("New Option");
                        setQuestions(upd);
                      }}
                    />
                  </div>
                )}
{/* Grid questions */}
            {(questions[selectedIndex].type === "multiple_grid" ||
              questions[selectedIndex].type === "checkbox_grid") && (
              <div>
                <label>Rows:</label>
                {questions[selectedIndex].rows.map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      value={row}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[selectedIndex].rows[i] = e.target.value;
                        setQuestions(updated);
                      }}
                    />
                    <img
                      src={require("../images/delete.png")}
                      alt=""
                      style={{ cursor: "pointer", width: "20px" }}
                      onClick={() => {
                        const updated = [...questions];
                        updated[selectedIndex].rows.splice(i, 1);
                        setQuestions(updated);
                      }}
                    />
                  </div>
                ))}
                <img
                  src={require("../images/add.png")}
                  alt=""
                  style={{ cursor: "pointer", width: "20px" }}
                  onClick={() => {
                    const updated = [...questions];
                    updated[selectedIndex].rows.push("New Row");
                    setQuestions(updated);
                  }}
                />

                <label>Columns:</label>
                {questions[selectedIndex].cols.map((col, i) => (
                  <div key={i} style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      value={col}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[selectedIndex].cols[i] = e.target.value;
                        setQuestions(updated);
                      }}
                    />
                    <img
                      src={require("../images/delete.png")}
                      alt=""
                      style={{ cursor: "pointer", width: "20px" }}
                      onClick={() => {
                        const updated = [...questions];
                        updated[selectedIndex].cols.splice(i, 1);
                        setQuestions(updated);
                      }}
                    />
                  </div>
                ))}
                <img
                  src={require("../images/add.png")}
                  alt=""
                  style={{ cursor: "pointer", width: "20px" }}
                  onClick={() => {
                    const updated = [...questions];
                    updated[selectedIndex].cols.push("New Col");
                    setQuestions(updated);
                  }}
                />
              </div>
            )}
                {/* Linear scale */}
                {questions[selectedIndex].type === "linear_scale" && (
                  <div>
                    <label>Min</label>
                    <input
                      type="number"
                      min={0}
                      value={questions[selectedIndex].min}
                      onChange={(e) => updateQuestion("min", parseInt(e.target.value))}
                    />
                    <label>Max</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={questions[selectedIndex].max}
                      onChange={(e) => updateQuestion("max", parseInt(e.target.value))}
                    />
                  </div>
                )}  
                {questions[selectedIndex].type === "Download" && (
                  <div>
                    <div className="upload-section">
        <h3>Owner Upload</h3>
        <input type="file" onChange={handleFileUpload} />
        {fileStatus && <p className="file-status">{fileStatus}</p>}
      </div>
      </div>
                )} 
                 {questions[selectedIndex].type === "Add_images" && (
                  <div>
                <div className="owner-section">
        <h3>Owner Panel</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="file-input"
        />
      </div>
      </div>
                )}


                 {questions[selectedIndex].type === "Pay" && (
                  <div>
                     <div className="owner-section">
        {/* <h3>Owner Panel</h3> */}
        <form onSubmit={handleSetAmount}>
          <div className="input-group">
            <label>Set Payment Amount (₹):</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />
          </div>
          <button type="submit" className="set-btn">
            Set Amount
          </button>
        </form>
      </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}