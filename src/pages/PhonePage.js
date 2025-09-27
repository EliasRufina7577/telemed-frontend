// PhonePage.js
/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PhonePage() {
  const { t } = useTranslation();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (number.length !== 10) return;
    setLoading(true);
    const formattedPhone = `+91${number}`;
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setOtpSent(true);
        alert(t("otpSent"));
      } else {
        alert(data.error || t("otpFailed"));
      }
    } catch (err) {
      setLoading(false);
      alert(t("serverError"));
      console.error(err);
    }
  };

  const handleVerifyOtp = async () => {
    const formattedPhone = `+91${number}`;
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert(t("phoneVerified"));
        navigate("/symptoms");
      } else {
        alert(data.error || t("invalidOtp"));
      }
    } catch (err) {
      alert(t("serverError"));
      console.error(err);
    }
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
      <div
        style={{
          background: "rgba(255,255,255,0.15)", // semi-transparent
          backdropFilter: "blur(10px)",        // frosted-glass effect
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Sehat Sathi</h1>
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>{t("phoneNumber")}</h2>

        //{/* Phone Input} */
       /* <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>+91</span>
          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 10-digit number"
            maxLength={10}
            style={{
              width: "180px",
              textAlign: "center",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleSendOtp}
            disabled={loading || number.length !== 10}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#3498db",
              color: "#fff",
              border: "none",
              cursor: loading || number.length !== 10 ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            {loading ? t("sendOtp") + "…" : t("sendOtp")}
          </button>
        </div>

        {/* OTP Section }*/
      /*  {otpSent && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>{t("enterOtp")}</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              maxLength={6}
              style={{
                textAlign: "center",
                width: "150px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={!otp}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: "#2ecc71",
                color: "#fff",
                border: "none",
                marginLeft: "10px",
                cursor: !otp ? "not-allowed" : "pointer",
                fontWeight: 500,
              }}
            >
              {t("verifyOtp")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhonePage;*/
// PhonePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PhonePage() {
  const { t } = useTranslation();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultOtp] = useState("1234"); // default OTP
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (number.length !== 10) return;
    setLoading(true);

    // simulate sending otp
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      alert(`${t("otpSent")} (Default OTP = 1234)`);
    }, 800);
  };

  const handleVerifyOtp = () => {
    // check against default otp
    if (otp === defaultOtp) {
      alert(t("phoneVerified"));
      navigate("/symptoms");
    } else {
      alert(t("invalidOtp"));
    }
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
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Sehat Sathi</h1>
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>{t("phoneNumber")}</h2>

        {/* Phone Input */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>+91</span>
          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 10-digit number"
            maxLength={10}
            autoComplete="off" 
            style={{
              width: "180px",
              textAlign: "center",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleSendOtp}
            disabled={loading || number.length !== 10}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#3498db",
              color: "#fff",
              border: "none",
              cursor: loading || number.length !== 10 ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            {loading ? t("sendOtp") + "…" : t("sendOtp")}
          </button>
        </div>

        {/* OTP Section */}
        {otpSent && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>{t("enterOtp")}</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              maxLength={6}
              style={{
                textAlign: "center",
                width: "150px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={!otp}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: "#2ecc71",
                color: "#fff",
                border: "none",
                marginLeft: "10px",
                cursor: !otp ? "not-allowed" : "pointer",
                fontWeight: 500,
              }}
            >
              {t("verifyOtp")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhonePage;

