const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos

const usersFilePath = path.join(__dirname, '../data/users.json');

const userController = {
    getUsers: () => {
        const usersJSON = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(usersJSON);
    },
    saveUsers: (users) => {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    },
    getLogin: (req, res) => {
        res.render("users/login", { title: "Formulario de ingreso", reqPath: req.path });
    },
    getRegister: (req, res) => {
        res.render("users/register", { title: "Formulario de registro", reqPath: req.path });
    },
    getProfile: (req, res) => {
        res.render("users/profile", { title: "Perfil de usuario", reqPath: req.path });
    },
    register: (req, res) => {
        const users = userController.getUsers();

        const newUser = {
            id: uuidv4(),
            email: req.body.email,
            usuario: req.body.usuario,
            password: bcrypt.hashSync(req.body.password, 10),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            rol: req.body.rol,
            avatar: req.file ? req.file.filename : 'default-avatar.jpg'
        };

        users.push(newUser);
        saveUsers(users);

        res.redirect('users/login');
    },
    login: (req, res) => {
        const users = userController.getUsers();
        const user = users.find(user => user.email === req.body.email);

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.userId = user.id;

            if (req.body.rememberme) {
                res.cookie('rememberEmail', req.body.email, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); // 30 days
            }

            res.redirect('/products');
        } else {
            res.redirect('users/login');
        }
    },
    logout: (req, res) => {
        console.log('Función logout llamada.');
        req.session.destroy(err => {
            if (err) {
                console.error("Error al destruir la sesión:", err);
                return res.redirect('/error');
            }
            res.clearCookie('connect.sid');
            res.clearCookie('rememberEmail');
            console.log('Sesión destruida y cookies limpiadas. Redirigiendo a /products');
            res.redirect('/products');
        });
    }
};

module.exports = userController;