const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

var indexRoutes = require('./routes/indexRoutes');
var userRoutes = require('./routes/userRoutes');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Recursos estaticos o publicos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/users', userRoutes);

app.listen(port, () =>
  console.log("Servidor corriendo en http://localhost:" + port)
);