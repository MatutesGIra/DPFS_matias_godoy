const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const methodOverride = require('method-override')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./database/models');
const { Op } = require("sequelize");

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

// Middleware
const rememberMeMiddleware = async (req, res, next) => {
    console.log('--- rememberMeMiddleware INICIO ---');
    console.log('req.cookies.rememberEmail:', req.cookies.rememberEmail);
    console.log('req.session.userId:', req.session.userId);

    if (req.cookies.rememberEmail && !req.session.userId) {
        console.log('Cookie rememberEmail encontrada y no hay sesión activa.');

        try {
            const user = await db.User.findOne({
                where: { email: req.cookies.rememberEmail }
            });

            if (user) {
                req.session.userId = user.id;
                console.log('Usuario logueado automáticamente por cookie:', user.username); // Usar username en lugar de usuario
            } else {
                console.log('Usuario de cookie no encontrado.');
                res.clearCookie('rememberEmail'); // Limpiar cookie si el usuario no existe
            }
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            // Manejar el error apropiadamente (ej. redirigir a una página de error, mostrar un mensaje)
            return res.redirect('/users/login'); // O alguna otra ruta de manejo de error
        }
    }

    console.log('--- rememberMeMiddleware FIN ---');
    next();
};

// Adjuntar el usuario a res.locals
const userMiddleware = async (req, res, next) => { 
    console.log('--- userMiddleware INICIO ---');
    console.log('req.session.userId en userMiddleware:', req.session.userId);
    if (req.session.userId) {
        try {
            const loggedUser = await db.User.findByPk(req.session.userId);
            if (loggedUser) {
                res.locals.user = loggedUser;
                console.log('Usuario en locals.user:', res.locals.user.username);
            } else {
                res.locals.user = null;
                req.session.destroy(err => {
                    if (err) console.error("Error al destruir sesión de usuario inválido:", err);
                });
                console.log('ID de usuario en sesión no válido, sesión destruida.');
            }
        } catch (error) {
            console.error("Error al buscar usuario en userMiddleware:", error);
            res.locals.user = null;
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