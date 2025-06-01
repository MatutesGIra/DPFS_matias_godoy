const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const methodOverride = require('method-override')

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Recursos estaticos o publicos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.listen(port, () =>
  console.log("Servidor corriendo en http://localhost:" + port)
);