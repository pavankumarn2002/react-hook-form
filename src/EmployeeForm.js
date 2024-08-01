import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EmployeeForm = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { ...defaultValues, skills: defaultValues.skills || [] },
    mode: 'onTouched'
  });

  useEffect(() => {
    reset({ ...defaultValues, skills: defaultValues.skills || [] });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        {errors.name && <p>{errors.name.message}</p>}
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
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>Position</label>
        <select {...register('position', { required: 'Position is required' })}>
          <option value="">Select...</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
        {errors.position && <p>{errors.position.message}</p>}
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
        {errors.employmentType && <p>{errors.employmentType.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmployeeForm;
