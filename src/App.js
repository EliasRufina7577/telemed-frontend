import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomeLanguagePage from "./pages/WelcomeLanguagePage";
import SeriousIllnessPage from "./pages/SeriousIllnessPage";
import PhonePage from "./pages/PhonePage";
import SymptomsPage from "./pages/SymptomsPage";
import VitalsPage from "./pages/VitalsPage";
import PatientVideoPage from "./PatientVideoPage"; 
import i18n from "./i18n";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("appLanguage") || "en";
    i18n.changeLanguage(lang).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
      <Router>
        <Routes>
     <Route path="/" element={<WelcomeLanguagePage />} />
     <Route path="/serious-illness" element={<SeriousIllnessPage />} />

          {/* Phone page */}
          <Route
            path="/phone"
            element={
              localStorage.getItem("appLanguage") ? (
                <PhonePage />
              ) : (
                <Navigate to="/language" replace />
              )
            }
          />

          {/* Symptoms page */}
          <Route
            path="/symptoms"
            element={
              localStorage.getItem("appLanguage") ? (
                <SymptomsPage />
              ) : (
                <Navigate to="/language" replace />
              )
            }
          />

          {/* Vitals page */}
          <Route
            path="/vitals"
            element={
              localStorage.getItem("appLanguage") ? (
                <VitalsPage />
              ) : (
                <Navigate to="/language" replace />
              )
            }
          />

          {/* Video page */}
          <Route path="/patient-video" element={<PatientVideoPage />} />
        </Routes>
      </Router>
 
  );
}

export default App;
