'use client'
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0); // state: count starts at 0

  const handleClick = () => {
    const newValue = count * 10;
    setCount(newValue); // update state
  };

  return (
    <div>
      <h1>{ count }</h1>
      <h2>Counter: {count}</h2>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}