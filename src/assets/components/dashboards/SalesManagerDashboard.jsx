import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/sales.css';

const SalesManagerDashboard = () => {
    const [tasks, setTasks] = useState({ Noida: [], Delhi: [], GreaterNoida: [] });
    const [labours, setLabours] = useState([]);
    const [labourTimes, setLabourTimes] = useState([]); // New state for labour times
    const [newTask, setNewTask] = useState({
        taskName: '',
        assignedTo: '',
        assignedBy: '',
        work: '',
        area: 'Noida',
        status: 'not started',
        startDate: '',
        dueDate: '',
    });
    const [newLabour, setNewLabour] = useState({
        username: '',
        email: '',
        role: 'emp',
        loginId: '',
    });
    const [editing, setEditing] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [currentLabour, setCurrentLabour] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
        fetchLabours();
        fetchLabourTimes(); // Fetch labour login/logout times
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get('https://backend-9rkk.onrender.com/salemanager/alltasks');
            setTasks(groupTasksByArea(data));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    

    const fetchLabours = async () => {
        try {
            const { data } = await axios.get('https://backend-9rkk.onrender.com/salemanager/alllabour');
            if (Array.isArray(data)) {
                setLabours(data);
            } else {
                console.error('Labours data is not an array:', data);
            }
        } catch (error) {
            console.error('Error fetching labours:', error);
        }
    };
    useEffect(() => {
        fetchLabours(); 
    }, []);

    const fetchLabourTimes = async () => {
        try {
            const { data } = await axios.get('https://backend-9rkk.onrender.com/salemanager/labourtimes');
            if (data && data.labours) {
                setLabourTimes(data.labours);
                console.log(data);
                
            } else {
                console.error('Labour times data is not in expected format:', data);
            }
        } catch (error) {
            console.error('Error fetching labour times:', error);
        }
    };

    const groupTasksByArea = (tasksData) => {
        return tasksData.reduce((acc, task) => {
            const area = task.area || 'Noida';
            if (!acc[area]) acc[area] = [];
            acc[area].push(task);
            return acc;
        }, {});
    };

    const handleTaskInputChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });
    const handleLabourInputChange = (e) => setNewLabour({ ...newLabour, [e.target.name]: e.target.value });

    const addTask = async () => {
        if (!newTask.taskName || !newTask.assignedTo || !newTask.assignedBy || !newTask.startDate || !newTask.dueDate || !newTask.work) {
            return alert('Please fill in all fields.');
        }

        const taskToSave = editing ? { ...newTask, _id: currentTask?._id } : newTask;

        if (editing && !taskToSave._id) {
            console.error("Current task ID is missing.");
            return alert("Cannot update task without an ID.");
        }

        try {
            const response = editing
                ? await axios.put(`https://backend-9rkk.onrender.com/salemanager/alltasks/${taskToSave._id}`, taskToSave)
                : await axios.post('https://backend-9rkk.onrender.com/salemanager/alltasks', taskToSave);

            setTasks((prev) => {
                const areaTasks = prev[taskToSave.area] || [];
                return {
                    ...prev,
                    [taskToSave.area]: editing
                        ? areaTasks.map((task) => task._id === taskToSave._id ? taskToSave : task)
                        : [...areaTasks, taskToSave],
                };
            });

            resetForm();
            fetchTasks(); 
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const addLabour = async () => {
        if (!newLabour.username || !newLabour.email || !newLabour.loginId) {
            return alert('Please fill in all fields.');
        }
    
        const labourToAdd = { ...newLabour, role: 'emp' };
    
        try {
            
            const response = await axios.post('https://backendrender-3jek.onrender.com/salemanager/addnewlabour', labourToAdd);
    
            
            console.log('Response:', response);
    
            
            if (response.status === 201) {
                
                if (response.data && response.data.newEmployee) {
                    setLabours((prev) => [...prev, response.data.newEmployee]);
                    resetLabourForm();  
                } else {
                    console.error('New employee data not found in response:', response);
                    alert('Failed to add new labour. Please try again.');
                }
            } else {
                console.error('Unexpected response status:', response.status);
                alert('Failed to add new labour. Please try again.');
            }
        } catch (error) {
            console.error('Error adding labour:', error);
            alert('An error occurred while adding the labour. Please try again later.');
        }
    };
    

    const updateLabour = async () => {
        if (!newLabour.username || !newLabour.email || !newLabour.loginId) {
            return alert('Please fill in all fields.');
        }

        try {
            await axios.put(`https://backendrender-3jek.onrender.com/salemanager/labour/${currentLabour._id}`, newLabour);
            setLabours((prevLabours) =>
                prevLabours.map((labour) => (labour._id === currentLabour._id ? { ...labour, ...newLabour } : labour))
            );
            resetLabourForm();
            setCurrentLabour(null);
        } catch (error) {
            console.error('Error updating labour:', error);
        }
    };

    const deleteLabour = async (id) => {
        try {
            await axios.delete(`https://backendrender-3jek.onrender.com/salemanager/labour/${id}`);
            setLabours((prevLabours) => prevLabours.filter((labour) => labour._id !== id));
        } catch (error) {
            console.error('Error deleting labour:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`https://backendrender-3jek.onrender.com/salemanager/alltasks/${id}`);
            setTasks((prev) => {
                const updatedTasks = Object.keys(prev).reduce((acc, area) => {
                    acc[area] = prev[area].filter(task => task._id !== id);
                    return acc;
                }, {});
                return updatedTasks;
            });
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = (task) => {
        setCurrentTask(task);
        setNewTask({ ...task });
        setEditing(true);
    };

    const editLabour = (labour) => {
        setCurrentLabour(labour);
        setNewLabour({ ...labour });
    };

    const resetForm = () => {
        setNewTask({
            taskName: '',
            assignedTo: '',
            assignedBy: '',
            work: '',
            area: 'Noida',
            status: 'not started',
            startDate: '',
            dueDate: '',
        });
        setEditing(false);
        setCurrentTask(null);
    };

    const resetLabourForm = () => {
        setNewLabour({
            username: '',
            email: '',
            role: 'emp',
            loginId: '',
        });
    };
    const handleLogout = () => {
        navigate('/');
      };
    return (
        <div className="dashboard-container">
            <div className="task-manager">
                <h2>SalesManager Dashboard</h2>
                <h3>Tasks</h3>
                <div className="task-form">
                    <input type="text" name="taskName" value={newTask.taskName} onChange={handleTaskInputChange} placeholder="Task Name" />
                    <input type="text" name="assignedTo" value={newTask.assignedTo} onChange={handleTaskInputChange} placeholder="Assigned To" />
                    <input type="text" name="assignedBy" value={newTask.assignedBy} onChange={handleTaskInputChange} placeholder="Assigned By" />
                    <input type="text" name="work" value={newTask.work} onChange={handleTaskInputChange} placeholder="Work" />
                    <select name="area" value={newTask.area} onChange={handleTaskInputChange}>
                        <option value="Noida">Noida</option>
                        <option value="Delhi">Delhi</option>
                        <option value="GreaterNoida">Greater Noida</option>
                    </select>
                    <input type="date" name="startDate" value={newTask.startDate} onChange={handleTaskInputChange} />
                    <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleTaskInputChange} />
                    <button onClick={addTask}>Save Task</button>
                </div>
                <div className="task-list">
                    {Object.keys(tasks).map((area) => (
                        <div key={area}>
                            <h4>{area}</h4>
                            <ul>
                                {tasks[area].map((task) => (
                                    <li key={task._id}>
                                        <span>{task.taskName}</span>
                                        <span>{task.assignedTo}</span>
                                        <span>{task.status}</span>
                                        <button onClick={() => editTask(task)}>Edit</button>
                                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="labour-manager">
                <h3>Labours</h3>
                <div className="labour-form">
                    <input type="text" name="username" value={newLabour.username} onChange={handleLabourInputChange} placeholder="Username" />
                    <input type="email" name="email" value={newLabour.email} onChange={handleLabourInputChange} placeholder="Email" />
                    <input type="text" name="loginId" value={newLabour.loginId} onChange={handleLabourInputChange} placeholder="Login ID" />
                    <button onClick={addLabour}>Add Labour</button>
                    <button onClick={updateLabour}>Update Labour</button>
                </div>
                <div className="labour-list">
                    {labours.map((labour) => (
                        <div key={labour._id}>
                            <span>{labour.username}</span>
                            <span>{labour.email}</span>
                            <button onClick={() => editLabour(labour)}>Edit</button>
                            <button onClick={() => deleteLabour(labour._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Labour Times Column */}
            <div className="labour-times-column">
                <h3>Labour Times</h3>
                <ul>
                    {labourTimes.map((labour) => (
                        <li key={labour.loginId}>
                             <span>{labour.username}</span>
    <span>{labour.inTime ? new Date(labour.inTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Not Available'}</span>
    <span>{labour.outTime ? new Date(labour.outTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Not Available'}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default SalesManagerDashboard;
