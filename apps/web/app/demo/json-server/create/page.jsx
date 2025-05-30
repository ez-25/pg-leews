'use client'

import React, { useEffect, useState } from 'react';

// 학생 추가 Form 컴포넌트
function AddStudentForm({ onAdd }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 간단한 validation
    if (name.trim().length < 2) {
      setError('이름은 2글자 이상 입력해주세요.');
      return;
    }
    const ageNum = Number(age);
    if (!ageNum || ageNum < 10 || ageNum > 99) {
      setError('나이는 10~99 사이 숫자만 입력하세요.');
      return;
    }
    setError('');
    // POST 요청
    const res = await fetch('http://localhost:4002/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), age: ageNum })
    });
    if (res.ok) {
      setName('');
      setAge('');
      onAdd();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="이름 (2글자 이상)"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: 8, marginRight: 8, width: 120 }}
        />
        <input
          placeholder="나이 (10~99)"
          value={age}
          onChange={e => setAge(e.target.value)}
          style={{ padding: 8, marginRight: 8, width: 80 }}
          type="number"
          min={10}
          max={99}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>추가</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
    </form>
  );
}

// 학생 테이블 컴포넌트
const StudentsTable = () => {
  const [students, setStudents] = useState([]);

  // 목록 불러오기
  const fetchStudents = () => {
    fetch('http://localhost:4002/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>학생 목록</h2>
      <AddStudentForm onAdd={fetchStudents} />
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