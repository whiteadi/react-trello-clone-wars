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

const Column = ({
  label,
  onDragOver,
  onDrop,
  renderCards,
  cards,
  title,
  onNewCard,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      api
        .post(
          '/cards',
          `description=${event.target.innerText}&columnId=${title}`,
          configPost
        )
        .then(
          (response) => {
            onNewCard();
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  return (
    <>
      <div className="section-title">
        <h2>{label}</h2>
      </div>
      <div
        onDrop={(event) => onDrop(event)}
        onDragOver={(e) => onDragOver(e)}
        className="body-section"
        title={title}
      >
        <span>
          <h3
            className="newcard"
            contentEditable="true"
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning={true}
          >
            Add a new card?
          </h3>
        </span>
        {renderCards ? renderCards(cards) : null}
      </div>
    </>
  );
};

export default Column;
