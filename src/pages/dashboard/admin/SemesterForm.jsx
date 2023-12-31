import React, { useState } from 'react';
import axios from 'axios';

const SemesterForm = () => {
  const [semesterName, setSemesterName] = useState('');

  const handleCreateSemester = async () => {
    try {
      const response = await axios.post('/api/semesters/create', { name: semesterName });
      console.log('New semester created:', response.data);
      // You might want to update the UI or take other actions on success
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
        value={semesterName}
        onChange={(e) => setSemesterName(e.target.value)}
      />
      <button onClick={handleCreateSemester}>Create Semester</button>
    </div>
  );
};

export default SemesterForm;
