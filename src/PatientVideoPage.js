import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Video from "twilio-video";

function PatientVideoPage() {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const socketRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [roomObj, setRoomObj] = useState(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    // Register patient (replace patient1 with actual ID or phone)
    socketRef.current.emit("registerPatient", { patientId: "patient1" });

    socketRef.current.on("incomingCall", ({ room, doctorId }) => {
      setRoomDetails({ room, doctorId });
      setIncomingCall(true);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const acceptCall = async () => {
    setIncomingCall(false);
    if (!roomDetails) return;

    try {
      const res = await fetch("http://localhost:5000/video-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: "patient1", room: roomDetails.room }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed to get token");

      const twilioRoom = await Video.connect(data.token, { audio: true, video: { width: 640 }, name: roomDetails.room });
      setRoomObj(twilioRoom);

      // Local video (small corner)
      const localTrack = Array.from(twilioRoom.localParticipant.videoTracks.values())[0].track;
      const localContainer = document.createElement("div");
      localContainer.style.position = "absolute";
      localContainer.style.width = "200px";
      localContainer.style.height = "150px";
      localContainer.style.bottom = "10px";
      localContainer.style.right = "10px";
      localContainer.style.border = "2px solid #fff";
      localContainer.style.borderRadius = "8px";
      localContainer.style.overflow = "hidden";
      localContainer.appendChild(localTrack.attach());
      remoteVideoRef.current.appendChild(localContainer);

      // Remote video (doctor) large
      twilioRoom.on("participantConnected", (participant) => {
        participant.tracks.forEach((pub) => {
          if (pub.isSubscribed) remoteVideoRef.current.appendChild(pub.track.attach());
        });
        participant.on("trackSubscribed", (track) => {
          remoteVideoRef.current.appendChild(track.attach());
        });
      });

      // Attach existing participants if already in room
      twilioRoom.participants.forEach((participant) => {
        participant.tracks.forEach((pub) => {
          if (pub.isSubscribed) remoteVideoRef.current.appendChild(pub.track.attach());
        });
        participant.on("trackSubscribed", (track) => {
          remoteVideoRef.current.appendChild(track.attach());
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const endCall = () => {
    if (roomObj) roomObj.disconnect();
    navigate("/");
  };

  return (
    <div style={{ padding: 0, margin: 0, width: "100vw", height: "100vh", position: "relative", background: "#000" }}>
      {incomingCall && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 30, borderRadius: 10, textAlign: "center" }}>
            <h3>Doctor is calling you</h3>
            <button onClick={acceptCall} style={{ margin: 10, padding: "8px 16px", background: "green", color: "#fff" }}>Accept</button>
            <button onClick={() => setIncomingCall(false)} style={{ margin: 10, padding: "8px 16px", background: "red", color: "#fff" }}>Decline</button>
          </div>
        </div>
      )}

      <div ref={remoteVideoRef} style={{ width: "100%", height: "100%", position: "relative" }} />
      {roomObj && (
        <button onClick={endCall} style={{ position: "absolute", top: 20, right: 20, padding: "10px 20px", background: "red", color: "#fff", zIndex: 1001 }}>End Call</button>
      )}
    </div>
  );
}

export default PatientVideoPage;
