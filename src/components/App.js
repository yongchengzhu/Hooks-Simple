import React, { useState } from 'react';

const App = () => {
  // [resource, setResource] is a syntax called array destructuring.
  // Example:
  //   const myColors = ['red', 'green', 'blue'];
  //   const [firstColor, secondColor] = myColors;
  //
  //   console.log(firstColor) // returns 'red'
  //   console.log(secondColor) // returns 'green'
  // 
  // Thus, useState('posts') must be some array.
  const [resource, setResource] = useState('posts');

  return (
    <div>
      <div>
        <button onClick={() => setResource('posts')}>Posts</button>
        <button onClick={() => setResource('todos')}>Todos</button>
      </div>
      {resource}
    </div>
  );
}

export default App;