import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await axios.get('http://localhost:5000/employees');
    setEmployees(response.data);
  };

  const addEmployee = async (employee) => {
    await axios.post('http://localhost:5000/employees', employee);
    fetchEmployees();
  };

  const updateEmployee = async (employee) => {
    await axios.put(`http://localhost:5000/employees/${employee.id}`, employee);
    fetchEmployees();
    setEditingEmployee(null);
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`http://localhost:5000/employees/${id}`);
    fetchEmployees();
  };

  const handleSubmit = (employee) => {
    if (editingEmployee) {
      updateEmployee({ ...editingEmployee, ...employee });
    } else {
      addEmployee(employee);
    }
  };

  return (
    <div>
      <h1>Employee CRUD</h1>
      <EmployeeForm
        onSubmit={handleSubmit}
        defaultValues={editingEmployee || {
          name: '',
          email: '',
          position: '',
          skills: [],
          employmentType: ''
        }}
      />
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.email} - {employee.position} - {(employee.skills || []).join(', ')} - {employee.employmentType}
            <button onClick={() => setEditingEmployee(employee)}>Edit</button>
            <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
