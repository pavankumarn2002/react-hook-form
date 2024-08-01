import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './App.css'
const App = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      position: '',
      skills: [],
      employmentType: ''
    },
    mode: 'onTouched'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (editingEmployee) {
      reset(editingEmployee);
    } else {
      reset({
        name: '',
        email: '',
        position: '',
        skills: [],
        employmentType: ''
      });
    }
  }, [editingEmployee, reset]);

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

  const handleFormSubmit = (employee) => {
    if (editingEmployee) {
      updateEmployee({ ...editingEmployee, ...employee });
    } else {
      addEmployee(employee);
    }
  };

  return (
    <div className='container'>
      <h1>Employee CRUD</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label>Name</label>
          <input
            {...register('name', {
              required: 'Name is required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Name can only contain letters and spaces'
              },
              minLength: {
                value: 2,
                message: "Username must be at least 2 characters long"
              },
              maxLength: {
                value: 10,
                message: "Username must be at most 10 characters long"
              }
            })}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Email is not valid'
              }
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div>
          <label>Position</label>
          <select {...register('position', { required: 'Position is required' })}>
            <option value="">Select...</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.position && <p className="error-message">{errors.position.message}</p>}
        </div>
        <div>
          <label>Skills</label>
          <div>
            <input
              type="checkbox"
              value="JavaScript"
              {...register('skills')}
            />
            JavaScript
          </div>
          <div>
            <input
              type="checkbox"
              value="React"
              {...register('skills')}
            />
            React
          </div>
          <div>
            <input
              type="checkbox"
              value="CSS"
              {...register('skills')}
            />
            CSS
          </div>
        </div>
        <div>
          <label>Employment Type</label>
          <div>
            <input
              type="radio"
              value="Full-time"
              {...register('employmentType', { required: 'Employment type is required' })}
            />
            Full-time
          </div>
          <div>
            <input
              type="radio"
              value="Part-time"
              {...register('employmentType', { required: 'Employment type is required' })}
            />
            Part-time
          </div>
          {errors.employmentType && <p className="error-message">{errors.employmentType.message}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
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
