// Create express app
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./database.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT));
});
// Root endpoint
app.get('/', (req, res, next) => {
  res.json({ message: 'Ok' });
});

// Routes
// app.use("/api/columns", require("./routes/columns"));
// app.use("/api/cards", require("./routes/cards"));

// columns routing, to be moved into columns separate routing file
app.get('/api/columns', (req, res, next) => {
  var sql = 'select * from columns';
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/columns/:id', (req, res, next) => {
  var sql = 'select * from columns where id = ?';
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

app.post('/api/columns', (req, res, next) => {
  var errors = [];  
  if (!req.body.label) {
    errors.push('No label specified');
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') });
    return;
  }
  var data = {
    label: req.body.label,
  };
  var sql = 'INSERT INTO columns (label) VALUES (?)';
  var params = [data.label];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID,
    });
  });
});

// cards routing , to be moved into cards separate routing file
app.get('/api/cards/column/:id', (req, res, next) => {
  var sql = 'select * from cards where columnid = ?';
  var params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/cards/:id', (req, res, next) => {
  var sql = 'select * from cards where id = ?';
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

app.post('/api/cards', (req, res, next) => {
  var errors = [];
  if (!req.body.description) {
    errors.push('No description specified');
  }
  if (!req.body.columnId) {
    errors.push('No column specified');
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') });
    return;
  }
  var data = {
    description: req.body.description,
    columnId: req.body.columnId,
  };
  var sql = 'INSERT INTO cards (description, columnid) VALUES (?,?)';
  var params = [data.description, data.columnId];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID,
    });
  });
});

// update description or parent column for drag and drop
// because of time limits I will not try not to see why the PUT or PATCH does not work...
app.post('/api/cards/:id', (req, res, next) => {
  
  var data = {
    description: req.body.description,
    columnId: req.body.columnId,
  };
  db.run(
    `UPDATE cards set 
           description = COALESCE(?,description),
           columnid = COALESCE(?,columnId) 
           WHERE id = ?`,
    [data.description, data.columnId, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: 'success',
        data: data,
        changes: this.changes,
      });
    }
  );
});

app.get('/api/cards', (req, res, next) => {
  var sql = 'select * from cards';
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Default response for any other request
app.use((req, res) => {
  res.status(404);
});
