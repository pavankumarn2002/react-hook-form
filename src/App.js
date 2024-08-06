
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './App.css'
const App = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

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

  // Form handling for login
  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: loginErrors } } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoggedIn]);

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

  // const updateEmployee = async (employee) => {
  //   await axios.put(`http://localhost:5000/employees/${employee.id}`, employee);
  //   fetchEmployees();
  //   setEditingEmployee(null);
  // };
  const updateEmployee = async (employee) => {
    const { id, ...employeeData } = employee;
    try {
      await axios.put(`http://localhost:5000/employees/${id}`, employeeData);
      fetchEmployees();
      setEditingEmployee(null);
    } catch (error) {
      console.error('Update error', error);
    }
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

  const handleLogin = async (data) => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      const user = response.data.find(user => user.username === data.username && user.password === data.password);

      if (user) {
        setIsLoggedIn(true);
        setShowLogin(false);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(true);
  };

  if (showLogin) {
    return (
      <div className="login-page">
        <h1>Login</h1>
        <form onSubmit={handleSubmitLogin(handleLogin)}>
          <div>
            <label>Username</label>
            <input className="input"
              {...registerLogin('username', { required: 'Username is required' })}
            />
            {loginErrors.username && <p>{loginErrors.username.message}</p>}
          </div>
          <div>
            <label>Password</label>
            <input className="input"
              type="password"
              {...registerLogin('password', { required: 'Password is required' })}
            />
            {loginErrors.password && <p>{loginErrors.password.message}</p>}
          </div>
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="main">
      <button className="logout-btn"onClick={handleLogout}>Logout</button>
    <div className='container'>
      <h1>Employee CRUD</h1>
      <form className="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="col">
          <label>Name</label>
          <input className="input"
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
        <div className="col">
          <label>Email</label>
          <input className="input"
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
        <div className="col">
          <label>Position</label>
          <select className="select" {...register('position', { required: 'Position is required' })}>
            <option value="">Select...</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.position && <p className="error-message">{errors.position.message}</p>}
        </div>
        <div className="col">
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
        <div className="col">
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
        <div className="col">
        <button type="submit">Submit</button>
        </div>
      </form>
      <table className="table">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Position</th>
          <th>Skills</th>
          <th>Employeement Type</th>
          <th>Actions</th>
        </tr>
        {employees.map((employee) => (
        <tr key={employee.id}>
          <td>{employee.name}</td>
          <td>{employee.email}</td>
          <td>{employee.position}</td>
          <td>{(employee.skills || []).join(', ')}</td>
          <td>{employee.employmentType}</td>
          <td>
          <button className="edit" onClick={() => setEditingEmployee(employee)}>Edit</button>
          <button className="delete" onClick={() => deleteEmployee(employee.id)}>Delete</button>
          </td>
        </tr>
        ))}
      </table>
    </div>
    </div>
  );
};

export default App;

