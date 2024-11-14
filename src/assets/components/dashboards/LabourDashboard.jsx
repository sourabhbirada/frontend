import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/labour.css';

const LabourDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('https://backend-9rkk.onrender.com/labour/labourTasks', { withCredentials: true });
            setTasks(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.put(
                `https://backend-9rkk.onrender.com/labour/labourTasks/${taskId}`,
                { status: newStatus },
                { withCredentials: true }
            );
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('https://backend-9rkk.onrender.com/user/labourlogout', {}, { withCredentials: true });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="ld-panel" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Labour Dashboard</h2>
            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div>
                    {tasks.length === 0 ? (
                        <p>No tasks assigned to you.</p>
                    ) : (
                        <div>
                            {tasks.map((task) => (
                                <div key={task._id} className="task-card">
                                    <h3>{task.taskName}</h3>
                                    <p><strong>Assigned By:</strong> {task.assignedBy}</p>
                                    <p><strong>Work:</strong> {task.work}</p>
                                    <p><strong>Area:</strong> {task.area}</p>
                                    <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
                                    <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                                    <p><strong>Status:</strong> {task.status}</p>
                                    {task.status !== 'completed' && (
                                        <button
                                            onClick={() =>
                                                handleStatusChange(task._id, task.status === 'not started' ? 'in-process' : 'completed')
                                            }
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: '#007bff',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Mark as {task.status === 'not started' ? 'In-Process' : 'Completed'}
                                        </button>
                                    )}
                                    <hr />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <button
                onClick={handleLogout}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default LabourDashboard;
