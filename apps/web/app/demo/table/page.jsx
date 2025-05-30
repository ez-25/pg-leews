'use client';

function TableComponent({ data }) {
  return (
    <div>
      <h2>Simple Table</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {data.map((person, index) => (
            <tr key={index}>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default function Sample() {
  const userList = [
    { name: 'Alice', age: 25, city: 'Seoul' },
    { name: 'Bob', age: 30, city: 'Busan' },
    { name: 'Charlie', age: 28, city: 'Incheon' },
    { name: 'Charlie', age: 28, city: 'Incheon' },
  ];

  return (
    <div>
      <TableComponent data={userList} /> 
    </div>
  );
}


