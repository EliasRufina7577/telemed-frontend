// src/components/VideoCall.js
import React, { useRef, useState, useEffect } from "react";
import Video from "twilio-video";

export default function VideoCall({ identity, roomName }) {
  const localRef = useRef();
  const remoteRef = useRef();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    return () => {
      if (room) room.disconnect();
    };
  }, [room]);

  const startCall = async () => {
    try {
      const res = await fetch("http://localhost:5000/video-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, room: roomName }),
      });
      const data = await res.json();
      const twilioRoom = await Video.connect(data.token, { name: roomName, audio: true, video: { width: 640 } });
      setRoom(twilioRoom);

      // Local video
      const localTrack = Array.from(twilioRoom.localParticipant.videoTracks.values())[0].track;
      localRef.current.appendChild(localTrack.attach());

      // Remote participants
      twilioRoom.on("participantConnected", participant => {
        participant.tracks.forEach(pub => {
          if (pub.isSubscribed) remoteRef.current.appendChild(pub.track.attach());
        });
        participant.on("trackSubscribed", track => remoteRef.current.appendChild(track.attach()));
      });

      twilioRoom.participants.forEach(participant => {
        participant.tracks.forEach(pub => {
          if (pub.isSubscribed) remoteRef.current.appendChild(pub.track.attach());
        });
        participant.on("trackSubscribed", track => remoteRef.current.appendChild(track.attach()));
      });
    } catch (err) {
      console.error("Twilio Video error:", err);
    }
  };

  return (
    <div>
      <button onClick={startCall} style={{ marginBottom: 20, padding: "10px 20px" }}>
        Start Video Call
      </button>
      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <h4>Local Video</h4>
          <div ref={localRef} style={{ width: 300, height: 200, background: "#000" }} />
        </div>
        <div>
          <h4>Remote Video</h4>
          <div ref={remoteRef} style={{ width: 300, height: 200, background: "#000" }} />
        </div>
      </div>
    </div>
  );
}
