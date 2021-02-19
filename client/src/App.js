import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Column from './components/columns';
import Card from './components/cards';
import './App.scss';

const App = () => {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  let api = axios.create({
    baseURL: 'http://localhost:8000/api/',
  });

  useEffect(() => {
    const loadColumns = async () => {
      try {
        const response = await api.get('/columns');

        const columns = response.data.data;
        const cardsResponse = await api.get('/cards');
        setCards(cardsResponse.data.data);
        setColumns(columns);
      } catch (err) {
        console.error('Columns loading failed:', err);
      }
    };

    loadColumns();
  }, []);

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData('id', event.target.id);
  };

  const onDrop = (event) => {
    let data = event.dataTransfer.getData('id');
    event.target.appendChild(document.getElementById(data));
  };

  const renderCards = (theCards) => {
    return theCards.map((card) => (
      <Card
        id={card.id}
        description={card.description}
        onDragStart={onDragStart}
      />
    ));
  };

  const getCards = (columnId) =>
    cards.filter((card) => card.columnid === columnId);

  return (
    <div className="sections">
      {columns &&
        cards &&
        columns.map((column) => (
          <div key={column.id} className="section">
            <Column
              cards={getCards(column.id)}
              renderCards={renderCards}
              label={column.label}
              onDrop={onDrop}
              onDragOver={onDragOver}
            />
          </div>
        ))}
    </div>
  );
};

export default App;
