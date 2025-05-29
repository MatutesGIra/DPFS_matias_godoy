const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Recursos estaticos o publicos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/products', cartRoutes);
app.use('/products', productRoutes);

app.listen(port, () =>
  console.log("Servidor corriendo en http://localhost:" + port)
);