import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './assets/components/LoginPage';
import AdminDashboard from './assets/components/dashboards/AdminDashboard';
import SalesManagerDashboard from './assets/components/dashboards/SalesManagerDashboard';
import HRDashboard from './assets/components/dashboards/HRDashboard';
import LabourDashboard from './assets/components/dashboards/LabourDashboard';

function App() {
    return (
        <Routes>  {/* Define your routes here */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/salemanger" element={<SalesManagerDashboard />} />
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/emp" element={<LabourDashboard />} />
        </Routes>
    );
}

export default App;
