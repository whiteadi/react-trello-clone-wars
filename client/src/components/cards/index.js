import React from 'react';

const Card = ({ id, description, onDragStart }) => (
  <div
    className="draggable"
    key={id}
    id={id}
    draggable
    onDragStart={(event) => onDragStart(event)}
    role="link"
  >
    <h3>{description}</h3>
  </div>
);

export default Card;
