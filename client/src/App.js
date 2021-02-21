import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Column from './components/columns';
import Card from './components/cards';
import './App.scss';

const App = () => {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [state, setState] = useState();

  let api = axios.create({
    baseURL: 'http://localhost:8000/api/',
  });
  const configPost = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  useEffect(() => {
    const loadColumns = async () => {
      try {
        // fetch both, not ideal but lets do it so first :)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData('id', event.target.id);
  };

  const onDrop = (event) => {
    let data = event.dataTransfer.getData('id');    
    // we use title to get the id of dropped on column
    // 1. cannot use id of column and cards
    // 2. must get the id(title :)) of column even if the card is dropped on another card
    const targetId = event.target.title
      ? event.target.title
      : document.getElementById(event.target.id).parentNode.title;
    api.post(`/cards/${data}`, `columnId=${targetId}`, configPost);
    setState({});
  };

  const onChange = (event) => {
    setNewColumnLabel(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      api.post('/columns', `label=${event.target.value}`, configPost).then(
        (response) => {
          // not the best way to refresh but good 4 now
          setState({});
        },
        (error) => {
          console.log(error);
        }
      );
      setNewColumnLabel('');
    }
  };

  const renderCards = (theCards) => {
    return theCards.map((card) => (
      <Card
        key={card.id}
        id={card.id}
        description={card.description}
        onDragStart={onDragStart}
      />
    ));
  };

  const getCards = (columnId) =>
    cards.filter((card) => card.columnid === columnId);

  const onNewCard = () => setState({});

  return (
    <div className="sections">
      <>
        <div className="section">
          <div className="section-title">
            <h2>{newColumnLabel}</h2>
            <input
              value={newColumnLabel}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="New Column"
            />
          </div>
        </div>
      </>
      {columns &&
        cards &&
        columns.map((column) => (
          <div key={column.id} className="section">
            <Column
              title={column.id}
              cards={getCards(column.id)}
              renderCards={renderCards}
              label={column.label}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNewCard={onNewCard}
            />
          </div>
        ))}
    </div>
  );
};

export default App;
