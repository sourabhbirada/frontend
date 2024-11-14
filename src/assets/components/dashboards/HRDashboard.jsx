import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hr.css';
import axios from 'axios';

const HRDashboard = () => {
    const [labors, setLabors] = useState([]);
    const [salary, setSalary] = useState([]);
    const navigate = useNavigate();

    // Fetch attendance and salary data on component mount
    useEffect(() => {
        // Fetch labor attendance data
        axios.get("https://backend-9rkk.onrender.com/hr/allattendence")
            .then((response) => {
                console.log("Attendance API Response:", response.data);
                const attendanceRecords = response.data?.attendanceRecords;
                if (attendanceRecords && Array.isArray(attendanceRecords)) {
                    const laborRecords = attendanceRecords.filter(record => !record.empId);
                    setLabors(laborRecords);
                } else {
                    setLabors([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching labor attendance:", error);
                setLabors([]);
            });

            axios.get("https://backend-9rkk.onrender.com/hr/getsalary")
.then((response) => {
    console.log(response.data);  // Log the response to check the structure
    const salaryRecords = response.data?.salary;
    if (salaryRecords && Array.isArray(salaryRecords)) {
        setSalary(salaryRecords.map(record => ({ ...record, _id: record._id})));
    } else {
        setSalary([]);
    }
})
.catch((error) => {
    console.error("Error fetching salary data:", error);
    setSalary([]);
});
    }, []); // Empty dependency array ensures this only runs once on mount

    const handleLogout = () => {
        navigate('/');
    };

    const getPerformance = (totalTasks) => {
        if (totalTasks < 10) return 'Bad';
        if (totalTasks >= 10 && totalTasks < 20) return 'Good';
        if (totalTasks >= 20) return 'Excellent';
    };

    // Update salary status
    const updateSalaryStatus = async (salaryId, newStatus) => {
        console.log("Updating salary for ID:", salaryId);  
        if (!salaryId) {
            console.error("Invalid salary ID");
            return; 
        }
        
        try {
            const response = await axios.put(`https://backend-9rkk.onrender.com/hr/updatesalary/${salaryId}`, {
                status: newStatus
            });
            if (response.data.success) {
                setSalary(prevSalary =>
                    prevSalary.map(salaryRecord =>
                        salaryRecord._id === salaryId
                            ? { ...salaryRecord, paymentStatus: newStatus }
                            : salaryRecord
                    )
                );
            }
        } catch (error) {
            console.error("Error updating salary status:", error);
        }
    };
    

    return (
        <div className='hd-panel'>
            <h2>HR Dashboard</h2>

            <div className="dashboard-content">
                {/* Employee Details Box */}
                <div className="info-box">
                    <h3>Labor Details</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Gmail</th>
                                <th>Name</th>
                                <th>Attendance</th>
                                <th>In Time</th>
                                <th>Out Time</th>
                                <th>Date</th>
                                <th>Performance</th>
                                <th>Tasks Completed</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {labors.map((labor, index) => (
                                <tr key={index}>
                                    <td>{labor.email}</td>
                                    <td>{labor.username}</td>
                                    <td>{labor.Attendance} days</td>
                                    <td>{new Date(labor.inTime).toLocaleString()}</td>
                                    <td>{labor.outTime ? new Date(labor.outTime).toLocaleString() : 'Not yet out'}</td>
                                    <td>{new Date(labor.date).toLocaleDateString()}</td>
                                    <td>{getPerformance(labor.totaltask)}</td>
                                    <td>{labor.totaltask}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Labor Salary Box */}
                <div className="info-box">
                    <h3>Labor Salary</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gmail</th>
                                <th>Salary</th>
                                <th>Status</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salary.map((salaryRecord, index) => (
                                <tr key={index}>
                                    <td>{salaryRecord.username}</td>
                                    <td>{salaryRecord.email}</td>
                                    <td>{salaryRecord.salaryAmount}</td>
                                    <td>{salaryRecord.paymentStatus}</td>
                                    <td>
                                        <button
                                            onClick={() => updateSalaryStatus(salaryRecord._id, 'Paid')}
                                            disabled={salaryRecord.paymentStatus === 'Paid'}
                                        >
                                            Mark as Paid
                                        </button>
                                        <button
                                            onClick={() => updateSalaryStatus(salaryRecord._id, 'Pending')}
                                            disabled={salaryRecord.paymentStatus === 'Pending'}
                                        >
                                            Mark as Pending
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HRDashboard;
