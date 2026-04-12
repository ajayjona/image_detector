import React from 'react'; // Force refresh
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DetectorPage from './pages/DetectorPage';
import PeoplePage from './pages/PeoplePage';
import ProjectBriefPage from './pages/ProjectBriefPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<DetectorPage />} />
                <Route path="/people" element={<PeoplePage />} />
                <Route path="/brief" element={<ProjectBriefPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
