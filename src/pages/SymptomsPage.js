import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function SymptomsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [symptomText, setSymptomText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [step, setStep] = useState(1);

  const recognitionRef = useRef(null);

  const selectedLang = localStorage.getItem("appLanguage") || "en";
  const langMap = { en: "en-US", hi: "hi-IN", ta: "ta-IN", pa: "pa-IN" };
const API = process.env.REACT_APP_ML_API_URL;
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langMap[selectedLang];

    recognition.onstart = () => {
      setIsRecording(true);
      setSymptomText("");
      setSuggestion(null);
      setStep(1);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }

      setSymptomText((prev) => (prev + " " + finalTranscript).trim() || interimTranscript);
    };

    recognition.onerror = (e) => {
      console.error("Recognition error", e);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const fetchSuggestion = async () => {
    if (!symptomText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: symptomText }),
      });
      const data = await res.json();
      setSuggestion({ disease: data.disease, doctor: data.doctor });
    } catch (err) {
      console.error(err);
      setSuggestion({ error: "Failed to get suggestion from AI model." });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      await fetchSuggestion();
      setStep(2);
    } else if (step === 2) {
      navigate("/vitals", { state: { symptomText, suggestion } });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "80px 20px",
        backgroundImage: `url(${process.env.PUBLIC_URL}/image.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Left aligned content
          gap: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          color: "#fff",
        }}
      >
        <h2 style={{ textAlign: "left", width: "100%" }}>{t("describeSymptoms")}</h2>

        {step === 1 && (
          <>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: isRecording ? "#e74c3c" : "#2ecc71",
                color: "#fff",
                border: "2px solid black",
                transition: "0.3s",
                alignSelf: "flex-start",
              }}
            >
              {isRecording ? t("stopRecording") : t("startRecording")}
            </button>

            <textarea
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder={t("describeSymptoms")}
              rows={6}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "none",
                background: "rgba(255,255,255,0.3)",
                color: "#000",
              }}
            />
          </>
        )}

        {loading && <p>{t("loading")}...</p>}

        {step === 2 && suggestion && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "8px",
              width: "100%",
              textAlign: "left",
              color: "#000",
            }}
          >
            {suggestion.error ? (
              <span style={{ color: "red" }}>{suggestion.error}</span>
            ) : (
              <>
                <h4>Department: {suggestion.disease}</h4>
                <p>Suggested Doctor: {suggestion.doctor}</p>
              </>
            )}
          </div>
        )}

        {((step === 1 && symptomText && !isRecording) || step === 2) && (
         <button
  onClick={handleNext}
  disabled={loading || (step === 1 && !symptomText.trim())}
  style={{
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "2px solid #040404ff", // black border
    transition: "0.3s",
    marginTop: "20px",
    alignSelf: "flex-start", // left aligned
  }}
>
  {step === 1 ? t("next") : t("proceedToVitals")}
</button>

        )}
      </div>
    </div>
  );
}

export default SymptomsPage;
