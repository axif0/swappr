// components/CreateSemester.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateSemester = ({ onSemesterCreated }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [type, setType] = useState(''); // New state for semester type

  const handleCreateSemester = async () => {
    try {
      const response = await axios.post('/api/semester/create', {  name, type, startDate, endDate });
      onSemesterCreated(response.data);
    } catch (error) {
      console.error('Error creating semester:', error.message);
      // Handle error and provide user feedback
    }
  };

  return (
    <div>
      <h2>Create New Semester</h2>
      <input
        type="text"
        placeholder="Semester Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={handleCreateSemester}>Create Semester</button>
    </div>
  );
};

export default CreateSemester;
