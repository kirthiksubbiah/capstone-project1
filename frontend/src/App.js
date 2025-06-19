// awesome-form-app/frontend/src/App.js

import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '', email: '', message: '', notes: '', date: ''
  });
  const [userEntries, setUserEntries] = useState([]);
  const [searchName, setSearchName] = useState('');

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/submit', formData);
      alert('✅ Data submitted successfully!');
    } catch (err) {
      alert('❌ Error submitting data.');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/entries/${searchName}`);
      setUserEntries(res.data);
    } catch (err) {
      alert('❌ Error fetching data.');
    }
  };

  return (
    <div className="container">
      <h1>🌈 Awesome Form</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <textarea name="message" placeholder="Message" onChange={handleChange} required />
        <textarea name="notes" placeholder="Notes" onChange={handleChange} />
        <input name="date" type="date" onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>

      <div className="search-box">
        <input
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          placeholder="Search by name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results">
        {userEntries.map((entry, idx) => (
          <div key={idx} className="entry-card">
            <p><strong>Name:</strong> {entry.name}</p>
            <p><strong>Email:</strong> {entry.email}
