import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const AdminDashboard = () => {
  // State for Sales Managers
  const [managers, setManagers] = useState([]);
  const [isAddManagerVisible, setIsAddManagerVisible] = useState(false);
  const [managerUsername, setManagerUsername] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerLoginId, setManagerLoginId] = useState('');  // New state for loginId
  const [editingManagerIndex, setEditingManagerIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  // State for Labors
  const [labors, setLabors] = useState([]);
  const [isAddLaborVisible, setIsAddLaborVisible] = useState(false);
  const [laborUsername, setLaborUsername] = useState('');
  const [laborEmail, setLaborEmail] = useState('');
  const [laborLoginId, setLaborLoginId] = useState('');  // New state for loginId
  const [editingLaborIndex, setEditingLaborIndex] = useState(null);

  // State for Location Viewer
  const [viewLocation, setViewLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchManagers();
    fetchLabors();
  }, []);

  // Fetch all Sales Managers
  const fetchManagers = async () => {
    try {
      const response = await axios.get('https://backend-9rkk.onrender.com/admin/managers', { withCredentials: true });
      setManagers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
    }
  };

  // Fetch all Labors
  const fetchLabors = async () => {
    try {
      const response = await axios.get('https://backend-9rkk.onrender.com/admin/employees', { withCredentials: true });
      setLabors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching labors:', error);
    }
  };

  // Toggle Add Manager Form
  const handleAddManager = () => {
    setIsAddManagerVisible(!isAddManagerVisible);
    resetManagerFields();
  };

  // Toggle Add Labor Form
  const handleAddLabor = () => {
    setIsAddLaborVisible(!isAddLaborVisible);
    resetLaborFields();
  };

  // Reset Manager Fields
  const resetManagerFields = () => {
    setManagerUsername('');
    setManagerEmail('');
    setManagerLoginId('');  // Reset loginId
    setEditingManagerIndex(null);
    setErrorMessage('');
  };

  // Reset Labor Fields
  const resetLaborFields = () => {
    setLaborUsername('');
    setLaborEmail('');
    setLaborLoginId('');  // Reset loginId
    setEditingLaborIndex(null);
    setErrorMessage('');
  };

  // Save or Update Manager
  const handleSaveManager = async () => {
    const newManager = { 
      username: managerUsername, 
      email: managerEmail, 
      loginId: managerLoginId,
      role: 'salemanger'  
    };
  
    try {
      if (editingManagerIndex !== null) {
        const managerId = managers[editingManagerIndex]._id;
        await axios.put(`https://backend-9rkk.onrender.com/admin/managers/${managerId}`, newManager);
      } else {
        await axios.post('https://backend-9rkk.onrender.com/user/createuser', newManager);
      }
      fetchManagers(); 
      setIsAddManagerVisible(false);
      resetManagerFields();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Show error on frontend
      } else {
        console.error('Error saving manager:', error);
      }
    }
  };

  // Save or Update Labor
  const handleSaveLabor = async () => {
    const newLabor = { 
        username: laborUsername, 
        email: laborEmail, 
        loginId: laborLoginId,
        role: "emp"  
    };
    try {
        if (editingLaborIndex !== null) {
            const laborId = labors[editingLaborIndex]._id;
            await axios.put(`https://backend-9rkk.onrender.comadmin/employees/${laborId}`, newLabor);
        } else {
            await axios.post('https://backend-9rkk.onrender.com/user/createuser', newLabor);  
        }
        fetchLabors(); 
        setIsAddLaborVisible(false);
        resetLaborFields();
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
        } else {
            console.error('Error saving labor:', error);
        }
    }
  };

  // Delete Manager
  const handleDeleteManager = async (index) => {
    const managerId = managers[index]._id;
    try {
      await axios.delete(`https://backend-9rkk.onrender.com/admin/managers/${managerId}`);
      fetchManagers(); 
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  // Delete Labor
  const handleDeleteLabor = async (index) => {
    const laborId = labors[index]._id;
    try {
      await axios.delete(`https://backend-9rkk.onrender.com/admin/employees/${laborId}`);
      fetchLabors(); 
    } catch (error) {
      console.error('Error deleting labor:', error);
    }
  };

  // Update Manager
  const handleUpdateManager = (index) => {
    const manager = managers[index];
    setManagerUsername(manager.username);
    setManagerEmail(manager.email);
    setManagerLoginId(manager.loginId);  // Populate loginId for update
    setEditingManagerIndex(index);
    setIsAddManagerVisible(true);
    setErrorMessage('');
  };

  // Update Labor
  const handleUpdateLabor = (index) => {
    const labor = labors[index];
    setLaborUsername(labor.username);
    setLaborEmail(labor.email);
    setLaborLoginId(labor.loginId);  // Populate loginId for update
    setEditingLaborIndex(index);
    setIsAddLaborVisible(true);
    setErrorMessage('');
  };

  // View Location
  const handleViewLocation = async (id, role) => {
    try {
      const response = await axios.get(`https://backend-9rkk.onrender.com/admin/location/${role}/${id}`);
      setViewLocation(response.data); // Set location data
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h5>Admin Dashboard</h5>
        <ul>
          <li><a href="#sales-managers">Sales Managers</a></li>
          <li><a href="#labors">Labors</a></li>
          <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside>

      <main className="admin-main-content">
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message if exists */}

        {/* Sales Managers Section */}
        <section id="sales-managers">
          <h3>Sales Managers</h3>
          <button className="action-button" onClick={handleAddManager}>
            {isAddManagerVisible ? 'Cancel' : 'Add New Manager'}
          </button>
          {isAddManagerVisible && (
            <div className="add-manager-form">
              <input
                type="text"
                placeholder="Manager Username"
                value={managerUsername}
                onChange={(e) => setManagerUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Manager Email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Manager Login ID"
                value={managerLoginId}
                onChange={(e) => setManagerLoginId(e.target.value)}
              />
              <button onClick={handleSaveManager}>
                {editingManagerIndex !== null ? 'Update' : 'Save'}
              </button>
            </div>
          )}
          <div>
            <h4>Manager List</h4>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager, index) => (
                  <tr key={manager._id}>
                    <td>{manager.username}</td>
                    <td>{manager.email}</td>
                   
                    <td>
                      <button className="action-button" onClick={() => handleUpdateManager(index)}>Edit</button>
                      <button className="action-button" onClick={() => handleDeleteManager(index)}>Delete</button>
                      <button className="action-button" onClick={() => handleViewLocation(manager._id, 'salemanger')}>View Location</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Labors Section */}
        <section id="labors">
          <h3>Labors</h3>
          <button className="action-button" onClick={handleAddLabor}>
            {isAddLaborVisible ? 'Cancel' : 'Add New Labor'}
          </button>
          {isAddLaborVisible && (
            <div className="add-labor-form">
              <input
                type="text"
                placeholder="Labor Username"
                value={laborUsername}
                onChange={(e) => setLaborUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Labor Email"
                value={laborEmail}
                onChange={(e) => setLaborEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Labor Login ID"
                value={laborLoginId}
                onChange={(e) => setLaborLoginId(e.target.value)}
              />
              <button onClick={handleSaveLabor}>
                {editingLaborIndex !== null ? 'Update' : 'Save'}
              </button>
            </div>
          )}
          <div>
            <h4>Labor List</h4>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {labors.map((labor, index) => (
                  <tr key={labor._id}>
                    <td>{labor.username}</td>
                    <td>{labor.email}</td>
                    <td>
                      <button className="action-button" onClick={() => handleUpdateLabor(index)}>Edit</button>
                      <button className="action-button" onClick={() => handleDeleteLabor(index)}>Delete</button>
                      <button className="action-button" onClick={() => handleViewLocation(labor._id, 'emp')}>View Location</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {viewLocation && (
  <div className="location-viewer">
    <h4>Location</h4>
    <p>Latitude: {viewLocation.latitude}</p>
    <p>Longitude: {viewLocation.longitude}</p>
    <iframe
      width="600"
      height="400"
      src={`https://www.google.com/maps?q=${viewLocation.latitude},${viewLocation.longitude}&z=15&output=embed`}
      frameBorder="0"
      allowFullScreen
    ></iframe>
  </div>
)}
      </main>
    </div>
  );
};

export default AdminDashboard;
