// src/pages/WelcomeLanguagePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { theme } from "../theme";
import { Stethoscope } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
];

const instructions = [
  "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ।",
  "ਆਪਣਾ ABHA ਨੰਬਰ ਦਰਜ ਕਰਕੇ ਪਹਿਚਾਣ ਸਾਬਤ ਕਰੋ।",
  "ਆਪਣੇ ਲੱਛਣ ਲਿਖ ਕੇ ਜਾਂ ਬੋਲ ਕੇ ਦੱਸੋ।",
  "ਸੈਂਸਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਜੀਵਨ-ਚਿੰਨ੍ਹ ਚੈੱਕ ਅਤੇ ਦਰਜ ਕਰੋ।",
  "ਡਾਕਟਰ ਨਾਲ ਵੀਡੀਓ ਕਨਸਲਟੇਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ।",
  "ਆਪਣੀ ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਵੇਖੋ; ਪ੍ਰਿੰਟ ਕਰੋ ਜਾਂ SMS ਰਾਹੀਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
  "ਦਵਾਈਆਂ ਦੀ ਉਪਲਬਧਤਾ ਸਕ੍ਰੀਨ ਤੇ ਜਾਂ SMS ਰਾਹੀਂ ਵੇਖੋ।"
];


export default function WelcomeLanguagePage() {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("appLanguage") || ""
  );
  const [showInstructions, setShowInstructions] = useState(false);

  const handleLanguageSelect = (langCode) => {
    localStorage.setItem("appLanguage", langCode);
    i18n.changeLanguage(langCode);
    setSelectedLang(langCode);
  };

  const handleNext = () => navigate("/phone");
  const handleSeriousIllness = () => navigate("/serious-illness");

  const buttonStyle = {
    padding: "15px 35px",
    borderRadius: "8px",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#ebe8e8ff",
    minWidth: "160px",
    fontWeight: 600,
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  };

  const textStyle = {
    color: "#faf7f7ff",
    textAlign: "left",
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundImage: `url(${process.env.PUBLIC_URL}/image.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        padding: "80px 20px 40px 20px",
        overflow: "hidden",
      }}
    >
      {/* Floating Instructions button */}
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 5,
          padding: "12px 20px",
          borderRadius: "8px",
          border: "2px  solid black",
          fontSize: "16px",
          cursor: "pointer",
          color: "#ddd8d8ff",
          background: theme.colors.info || "#1a98edff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          fontWeight: "600",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#2980b9")}
        onMouseOut={(e) =>
          (e.currentTarget.style.background = theme.colors.info || "#3498db")
        }
      >
        {showInstructions ? "Hide Instructions" : "Instructions"}
      </button>

      {/* Instruction Card */}
      {showInstructions && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            right: "20px",
            maxWidth: "380px",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "20px",
            borderRadius: "12px",
            backdropFilter: "blur(6px)",
            zIndex: 4,
          }}
        >
          {instructions.map((point, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  minWidth: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: theme.colors.primary,
                  color: "#e5e2e2ff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  marginRight: "12px",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                }}
              >
                {idx + 1}
              </div>
              <p style={{ color: "#0e0e0eff", fontSize: "18px", margin: 0 }}>
                {point}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          ...textStyle,
          zIndex: 2,
          maxWidth: "800px",
          width: "100%",
          padding: "20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              marginRight: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <Stethoscope size={42} color="black" strokeWidth={2.5} />
          </div>

          <h1
            style={{
              ...textStyle,
              fontSize: "48px",
              fontWeight: "800",
              margin: 0,
              lineHeight: "1.1",
            }}
          >
            Sehat Sathi
          </h1>
        </div>

        {/* Tagline */}
        <h2
          style={{
            ...textStyle,
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "20px",
            lineHeight: "1.2",
          }}
        >
          Your Complete Telemedicine Solution
        </h2>

        {/* Quote */}
        <p
          style={{
            ...textStyle,
            fontStyle: "italic",
            fontSize: "22px",
            fontWeight: "500",
            margin: "0 auto 40px auto",
            padding: "15px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            maxWidth: "600px",
            borderLeft: `5px solid ${theme.colors.success}`,
          }}
        >
          “Turning hope into health, one connection at a time.”
        </p>

        {/* Language Header */}
        <h3
          style={{
            ...textStyle,
            fontSize: "26px",
            marginBottom: "25px",
            fontWeight: 700,
          }}
        >
          {i18n.t("selectLanguage")}
        </h3>

        {/* Language Buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              style={{
                ...buttonStyle,
                background:
                  selectedLang === lang.code
                    ? theme.colors.primary
                    : "rgba(255,255,255,0.2)",
                color: "#fff",
                border:
                  selectedLang === lang.code
                    ? "none"
                    : "1px solid rgba(255,255,255,0.4)",
                boxShadow:
                  selectedLang === lang.code
                    ? "0 5px 15px rgba(0, 168, 154, 0.4)"
                    : "none",
                
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background =
                  selectedLang === lang.code
                    ? theme.colors.primaryHover
                    : "rgba(255,255,255,0.3)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  selectedLang === lang.code
                    ? theme.colors.primary
                    : "rgba(255,255,255,0.2)")
              }
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {selectedLang && (
          <div style={{ marginTop: "40px" }}>
            <div style={{ display: "flex", gap: "25px" }}>
              <button
                onClick={handleNext}
                style={{
                  ...buttonStyle,
                  background: theme.colors.primary,
                  fontWeight: "bold",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = theme.colors.primaryHover)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = theme.colors.primary)
                }
              >
                {i18n.t("next")}
              </button>

              <button
                onClick={handleSeriousIllness}
                style={{
                  ...buttonStyle,
                  background: theme.colors.danger,
                  fontWeight: "bold",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#c0392b")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = theme.colors.danger)
                }
              >
                {i18n.t("seriousIllness")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
