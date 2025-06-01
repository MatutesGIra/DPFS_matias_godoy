const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const methodOverride = require('method-override')
const session = require('express-session');
const cookieParser = require('cookie-parser');

//rutas
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');

// override
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(methodOverride('_method'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Recursos estaticos o publicos
app.use(express.static(path.join(__dirname, 'public')));

// CookieParser
app.use(cookieParser());

// Express-Session
app.use(session({
    secret: 'tu_secreto_muy_secreto_y_largo',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: false }
}));

const userController = require('./src/controllers/userController');
const { getUsers } = userController; // Destructuring

// Middleware
const rememberMeMiddleware = (req, res, next) => {
    console.log('--- rememberMeMiddleware INICIO ---');
    console.log('req.cookies.rememberEmail:', req.cookies.rememberEmail);
    console.log('req.session.userId:', req.session.userId);

    if (req.cookies.rememberEmail && !req.session.userId) {
        console.log('Cookie rememberEmail encontrada y no hay sesión activa.');
        const users = getUsers(); // getUsers ahora es accesible
        const user = users.find(user => user.email === req.cookies.rememberEmail);

        if (user) {
            req.session.userId = user.id;
            console.log('Usuario logueado automáticamente por cookie:', user.usuario);
        } else {
            console.log('Usuario de cookie no encontrado.');
            res.clearCookie('rememberEmail'); // Limpiar cookie si el usuario no existe
        }
    }
    console.log('--- rememberMeMiddleware FIN ---');
    next();
};

// Adjuntar el usuario a res.locals
const userMiddleware = (req, res, next) => {
    console.log('--- userMiddleware INICIO ---');
    console.log('req.session.userId en userMiddleware:', req.session.userId);
    if (req.session.userId) {
        const users = getUsers(); // getUsers ahora es accesible
        const loggedUser = users.find(user => user.id === req.session.userId);
        if (loggedUser) {
            res.locals.user = loggedUser;
            console.log('Usuario en locals.user:', res.locals.user.usuario);
        } else {
            res.locals.user = null;
            req.session.destroy(err => { // Destruir sesión si el ID de usuario no es válido
                if (err) console.error("Error al destruir sesión de usuario inválido:", err);
            });
            console.log('ID de usuario en sesión no válido, sesión destruida.');
        }
    } else {
        res.locals.user = null;
        console.log('No hay usuario en sesión.');
    }
    console.log('--- userMiddleware FIN ---');
    next();
};

app.use(rememberMeMiddleware);
app.use(userMiddleware);

// Rutas de Usuario
app.use('/users', userRoutes);

// Rutas de Productos
app.use('/products', productRoutes);


app.listen(port, () =>
  console.log("Servidor corriendo en http://localhost:" + port)
);