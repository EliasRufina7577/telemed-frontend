import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

function VitalsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    symptomText = "",
    suggestion = null,
    vitals = null,
    phone = "+911234567890",
  } = location.state || {};

  const [alerts, setAlerts] = useState(["Waiting for data…"]);
  const [heartRate, setHeartRate] = useState("--");
  const [spo2, setSpo2] = useState("--");
  const [sending, setSending] = useState(false); // new state to disable button while sending

  const heartRef = useRef(null);
  const spo2Ref = useRef(null);
  const heartChartRef = useRef(null);
  const spo2ChartRef = useRef(null);

  const [incomingCall, setIncomingCall] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const socketRef = useRef();
const SOCKET = process.env.REACT_APP_SOCKET_URL;
const API = "https://telemed-backend-3.onrender.com";

  // --- Socket.IO connection ---
  useEffect(() => {
    socketRef.current = io(SOCKET);
    socketRef.current.emit("registerPatient", { phone });

    socketRef.current.on("incomingCall", (data) => {
      setRoomInfo(data);
      setIncomingCall(true);
    });

    return () => socketRef.current.disconnect();
  }, [phone]);

  // --- Chart init ---
  useEffect(() => {
    if (heartChartRef.current) heartChartRef.current.destroy();
    if (spo2ChartRef.current) spo2ChartRef.current.destroy();

    heartChartRef.current = new Chart(heartRef.current, {
      type: "line",
      data: { labels: [], datasets: [{ label: "Heart Rate (BPM)", data: [], borderColor: "#3498db", fill: false, tension: 0.4, pointRadius: 3 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { suggestedMin: 50, suggestedMax: 120 } }, plugins: { legend: { display: true, position: "top" } } },
    });

    spo2ChartRef.current = new Chart(spo2Ref.current, {
      type: "line",
      data: { labels: [], datasets: [{ label: "SpO₂ (%)", data: [], borderColor: "#2ecc71", fill: false, tension: 0.4, pointRadius: 3 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { suggestedMin: 85, suggestedMax: 100 } }, plugins: { legend: { display: true, position: "top" } } },
    });

    const interval = setInterval(fetchVitals, 3000);
    fetchVitals();
    return () => {
      clearInterval(interval);
      heartChartRef.current.destroy();
      spo2ChartRef.current.destroy();
    };
  }, []);

  const fetchVitals = async () => {
    try {
      const res = await fetch("https://telemed-backend-3.onrender.com/vitals");
      const data = await res.json();
      const hr = data.heart_rate ?? data.heartRate;
      const sp = data.spo2 ?? data.SpO2;

      setHeartRate(hr || "--");
      setSpo2(sp || "--");
      setAlerts(data.alerts || []);

      const timeLabel = new Date().toLocaleTimeString();

      const heartChart = heartChartRef.current;
      heartChart.data.labels.push(timeLabel);
      heartChart.data.datasets[0].data.push(hr || null);
      if (heartChart.data.labels.length > 20) {
        heartChart.data.labels.shift();
        heartChart.data.datasets[0].data.shift();
      }
      heartChart.update();

      const spo2Chart = spo2ChartRef.current;
      spo2Chart.data.labels.push(timeLabel);
      spo2Chart.data.datasets[0].data.push(sp || null);
      if (spo2Chart.data.labels.length > 20) {
        spo2Chart.data.labels.shift();
        spo2Chart.data.datasets[0].data.shift();
      }
      spo2Chart.update();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Updated sendToDoctor ---
  const sendToDoctor = async () => {
    if (sending) return; // prevent multiple clicks
    setSending(true);
    try {
      // 1️⃣ Save patient data to backend
      const saveRes = await fetch(`${API}/api/patient-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          symptoms: symptomText,
          vitals: { heartRate, spo2, alerts },
        }),
      });

      if (!saveRes.ok) {
        const errRes = await saveRes.json().catch(() => ({}));
        alert("Failed to save patient data: " + (errRes.error || `HTTP ${saveRes.status}`));
        return;
      }

      const data = await saveRes.json();
      if (!data.success || !data.patientId) {
        alert("Failed to save patient data: " + (data.error || "Unknown"));
        return;
      }

      // 2️⃣ Send to doctor via socket only after successful save
      socketRef.current.emit("patientDataSent", {
        patientId: data.patientId,
        phone,
        symptoms: symptomText,
        vitals: { heartRate, spo2, alerts },
      });

      alert("Patient data sent to doctor successfully!");
    } catch (err) {
      console.error(err);
      alert("Error sending data to doctor.");
    } finally {
      setSending(false);
    }
  };

  const acceptCall = () => {
    setIncomingCall(false);
    if (roomInfo) {
      navigate("/patient-video", {
        state: { room: roomInfo.room, identity: phone, doctorIdentity: roomInfo.doctorIdentity },
      });
    }
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
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // left align
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: 900,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: 30,
      borderRadius: 15,
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      color: "#fff",
    }}
  >
    <h2 style={{ textAlign: "left" }}>Vitals Dashboard</h2>

    {incomingCall && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div style={{ background: "white", padding: 40, borderRadius: 15 }}>
          <h2>Incoming Video Call</h2>
          <p>Doctor is calling you...</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={acceptCall}
              style={{ background: "green", color: "white", padding: "6px 12px" }}
            >
              Accept
            </button>
            <button
              onClick={() => setIncomingCall(false)}
              style={{ background: "red", color: "white", padding: "6px 12px" }}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Side by side equal cards */}
    <div
      style={{
        display: "flex",
        gap: 20,
        marginTop: 20,
      }}
    >
      {/* Heart Rate Card */}
      <div
        style={{
          flex: 1,
          minHeight: 350,
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          color: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ textAlign: "left" }}>Heart Rate</h3>
          <p style={{ fontSize: 22, fontWeight: "bold", textAlign: "left" }}>
            {heartRate} BPM
          </p>
          <div style={{ height: 200 }}>
            <canvas ref={heartRef}></canvas>
          </div>
        </div>
        <button
          onClick={sendToDoctor}
          disabled={sending}
          style={{
            marginTop: 20,
            padding: "12px 24px",
            borderRadius: 8,
            background: "#3498db",
            color: "#fff",
            border: "2px solid black",
            opacity: sending ? 0.6 : 1,
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "Sending..." : "Send to Doctor"}
        </button>
      </div>

      {/* SpO₂ Card */}
      <div
        style={{
          flex: 1,
          minHeight: 350,
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          color: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h3 style={{ textAlign: "left" }}>SpO₂</h3>
        <p style={{ fontSize: 22, fontWeight: "bold", textAlign: "left" }}>{spo2} %</p>
        <div style={{ height: 200 }}>
          <canvas ref={spo2Ref}></canvas>
        </div>
      </div>
    </div>

    <div
      style={{
        marginTop: 20,
        padding: 10,
        background: "rgba(255,255,255,0.15)",
        borderRadius: 8,
      }}
    >
      <h4>Alerts & Notifications:</h4>
      <ul>{alerts.map((alert, idx) => <li key={idx}>{alert}</li>)}</ul>
    </div>
  </div>
</div>



    
  );
}

export default VitalsPage;
