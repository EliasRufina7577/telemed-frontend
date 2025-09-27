// src/pages/SeriousIllnessPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";

const hospitals = [
  { name: "City Hospital", address: "123 Main St, City Center", token: "A001" },
  { name: "Green Valley Clinic", address: "456 Park Ave, Green Town", token: "B023" },
  { name: "Sunrise Hospital", address: "789 Lake Rd, Riverside", token: "C045" },
];

export default function SeriousIllnessPage() {
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState(null);

  const handleTokenClick = (token) => {
    setSelectedToken(token);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundImage: `url(${process.env.PUBLIC_URL}/image.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Optional overlay to make cards readable */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h1
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "32px",
            marginBottom: "30px",
          }}
        >
          Hospital Details
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {hospitals.map((hospital, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)", // semi-transparent card
                backdropFilter: "blur(10px)",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                minWidth: "250px",
                textAlign: "center",
                position: "relative",
              }}
            >
              <h2 style={{ color: "#fff", marginBottom: "10px" }}>{hospital.name}</h2>
              <p style={{ color: "#eee", marginBottom: "10px" }}>{hospital.address}</p>

              <button
                onClick={() => handleTokenClick(hospital.token)}
                style={{
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: selectedToken === hospital.token ? "#27ae60" : theme.colors.danger,
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background 0.3s",
                }}
              >
                Token No: {hospital.token}
              </button>

              {selectedToken === hospital.token && (
                <p
                  style={{
                    color: "#121313ff",
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                >
                  Token booked successfully!
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#fff",
              backgroundColor: theme.colors.primary,
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
