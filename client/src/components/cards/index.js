import React from 'react';
import axios from 'axios';

// if got time make a proper api module/script
let api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});
const configPost = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const Card = ({ id, description, onDragStart }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // because of time limits I will not try not to see why the PUT or PATCH does not work...
      api
        .post(
          `/cards/${id}`,
          `description=${event.target.innerText}`,
          configPost
        )
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  return (
    <div
      className="draggable"
      key={id}
      id={id}
      draggable
      onDragStart={(event) => onDragStart(event)}
      role="link"
    >
      <h3
        contentEditable="true"
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      >
        {description}
      </h3>
    </div>
  );
};

export default Card;
