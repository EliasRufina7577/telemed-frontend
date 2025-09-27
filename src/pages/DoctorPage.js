// src/pages/DoctorPage.js
import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Video from "twilio-video";

function DoctorPage() {
  const location = useLocation();
  const { symptomText, suggestion, vitals } = location.state || {};

  const [videoStarted, setVideoStarted] = useState(false);
  const [roomName] = useState("consultation-room"); // same room for doctor & patient
  const [identity] = useState("Doctor");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [roomObj, setRoomObj] = useState(null);

  const startVideoCall = async () => {
    setVideoStarted(true);

    try {
      const res = await fetch("http://localhost:5000/video-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, room: roomName }),
      });
      const data = await res.json();
      const token = data.token;

      const room = await Video.connect(token, { name: roomName });
      setRoomObj(room);

      // Attach local video
      room.localParticipant.videoTracks.forEach(pub => {
        localVideoRef.current.appendChild(pub.track.attach());
      });

      // Handle remote participants
      room.on("participantConnected", participant => {
        participant.tracks.forEach(pub => {
          if (pub.isSubscribed) remoteVideoRef.current.appendChild(pub.track.attach());
        });

        participant.on("trackSubscribed", track => {
          remoteVideoRef.current.appendChild(track.attach());
        });
      });

      // Handle participants already in room
      room.participants.forEach(participant => {
        participant.tracks.forEach(pub => {
          if (pub.isSubscribed) remoteVideoRef.current.appendChild(pub.track.attach());
        });
        participant.on("trackSubscribed", track => {
          remoteVideoRef.current.appendChild(track.attach());
        });
      });

    } catch (err) {
      console.error("Twilio Video error:", err);
    }
  };

  const leaveVideoCall = () => {
    roomObj && roomObj.disconnect();
    setVideoStarted(false);
    // Clear video elements
    localVideoRef.current.innerHTML = "";
    remoteVideoRef.current.innerHTML = "";
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <h2>Doctor Dashboard</h2>

      <div style={{ marginBottom: 20, padding: 15, background: "#eef", borderRadius: 8 }}>
        <h4>Patient Symptoms:</h4>
        <p>{symptomText || "No symptoms available"}</p>
      </div>

      {suggestion && (
        <div style={{ marginBottom: 20, padding: 15, background: "#dde", borderRadius: 8 }}>
          <h4>AI Suggestion:</h4>
          <p>Department: {suggestion.disease}</p>
          <p>Suggested Doctor: {suggestion.doctor}</p>
        </div>
      )}

      {vitals && (
        <div style={{ marginBottom: 20, padding: 15, background: "#eee", borderRadius: 8 }}>
          <h4>Vitals:</h4>
          <p>Heart Rate: {vitals.heartRate} BPM</p>
          <p>SpO₂: {vitals.spo2} %</p>
          <p>Alerts:</p>
          <ul>{vitals.alerts?.map((alert, idx) => <li key={idx}>{alert}</li>)}</ul>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        {!videoStarted ? (
          <button
            onClick={startVideoCall}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Start Video Call
          </button>
        ) : (
          <div>
            <h4>Video Call In Progress</h4>
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <h5>Your Video</h5>
                <div ref={localVideoRef} style={{ width: 300, height: 200, background: "#000" }} />
              </div>
              <div>
                <h5>Patient Video</h5>
                <div ref={remoteVideoRef} style={{ width: 300, height: 200, background: "#000" }} />
              </div>
            </div>
            <button
              onClick={leaveVideoCall}
              style={{
                marginTop: 10,
                padding: "10px 20px",
                borderRadius: 8,
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              End Call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorPage;
