import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios
import './styles/LoginPage.css';

const LoginPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [credentials, setCredentials] = useState({ username: '', loginId: '', gmail: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const selectRole = (role) => {
        setSelectedRole(role);
        setCredentials({ username: '', loginId: '', gmail: '' });
        setErrorMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            
            const endpoint = selectedRole === 'emp' 
                ? 'https://backend-9rkk.onrender.com/user/labourlogiin'  
                : 'https://backend-9rkk.onrender.com/user/adminlogin'; 
    
            const response = await axios.post(
                endpoint,
                {
                    username: credentials.username,
                    loginId: credentials.loginId,
                    email: credentials.email, 
                    role: selectedRole,
                },
                { withCredentials: true }
            );
    
            if (response.status === 200) {
                navigate(`/${selectedRole.toLowerCase().replace(' ', '-')}`); // Redirect based on selected role
            }
        } catch (error) {
            console.error('Login error:', error);
    
            if (error.response) {
                
                if (error.response.status === 404) {
                    setErrorMessage('Invalid username, login ID, or Gmail');
                } else if (error.response.status === 401) {
                    setErrorMessage('Role mismatch. Access denied');
                } else {
                    setErrorMessage('Error logging in');
                }
            } else {
                setErrorMessage('Network error. Please check your internet connection.');
            }
        }
    };
    

    return (
        <div className="login-container">
            <div className="title">System Login</div>
            <div className="role-selector">
                <button onClick={() => selectRole('admin')}>Admin</button>
                <button onClick={() => selectRole('salemanger')}>Sales Manager</button>
                <button onClick={() => selectRole('emp')}>Labour</button>
                <button onClick={() => selectRole('hr')}>HR Department</button>
            </div>

            {selectedRole && (
                <div className="login-box">
                    <h3>Login as {selectedRole}</h3>
                    <form onSubmit={handleLogin}>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                        />
                        <label>Login ID:</label>
                        <input
                            type="text"
                            name="loginId"
                            value={credentials.loginId}
                            onChange={handleInputChange}
                            required
                        />
                        <label>Gmail:</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            required
                            placeholder="example@gmail.com"
                        />
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <button type="submit">Login</button>
                    </form>
                </div>
            )}
        </div>
    );
};


export default LoginPage;
