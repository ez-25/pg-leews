'use client'

import React, { useEffect, useState } from 'react';

const StudentsTable = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4002/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>학생 목록</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>이름</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>나이</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{student.id}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{student.name}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{student.age}</td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;