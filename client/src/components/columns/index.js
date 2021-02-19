import React, { Fragment } from 'react';

const Column = ({ label, onDragOver, onDrop, renderCards, cards }) => (
  <>
    <div className="section-title">
      <h2>{label}</h2>
    </div>
    <div
      onDrop={(event) => onDrop(event)}
      onDragOver={(e) => onDragOver(e)}
      className="body-section"
    >
      {renderCards ? renderCards(cards) : null}
    </div>
  </>
);

export default Column;
