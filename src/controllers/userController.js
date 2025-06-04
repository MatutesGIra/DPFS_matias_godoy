const db = require('../../database/models');
const path = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const productController = require('./productController');

const userController = {
    getLogin: (req, res) => {
        res.render("users/login", { 
            title: "Formulario de ingreso", 
            reqPath: req.path, 
            style: "login",
            cartItemCount: productController.getCartItemCount(req) 
        });
    },
    getRegister: (req, res) => {
        res.render("users/register", { 
            title: "Formulario de registro", 
            reqPath: req.path, 
            style: "register",
            cartItemCount: productController.getCartItemCount(req)
        });
    },
    getProfile: (req, res) => {
        res.render("users/profile", { 
            title: "Perfil de usuario", 
            reqPath: req.path, 
            style: "profile",
            cartItemCount: productController.getCartItemCount(req)
        });
    },
    register: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('/users/register', {
                errors: errors.array(),
                oldData: req.body,
                title: "Formulario de registro",
                reqPath: req.path,
                style: "register",
                cartItemCount: productController.getCartItemCount(req)
            });
        }
        
        try {
            console.log("--- Inicio de Registro ---");
            console.log("req.body:", req.body);

            const newUser = {
                email: req.body.email,
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 10),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                role: req.body.email.endsWith('@admin.com') ? 'admin' : 'user',
                avatar: req.file ? req.file.filename : 'default-avatar.png'
            };

            console.log("Nuevo usuario a crear:", newUser);

            await db.User.create(newUser);
            
            console.log("Usuario registrado exitosamente.");
            res.redirect('/users/login');
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            
            const cartItemCount = productController.getCartItemCount(req);
            res.render('/users/register', {
                errors: [{ msg: 'Hubo un error al intentar registrar el usuario. Por favor, inténtalo de nuevo.' }],
                oldData: req.body,
                title: "Formulario de registro",
                reqPath: req.path,
                style: "register",
                cartItemCount 
            });
        }
    },
    login: async (req, res) => {
        console.log("LOGIN DEBUG: Request entered login controller function.");
        console.log("LOGIN DEBUG: req.body:", req.body); // Añadido para ver los datos del formulario

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("LOGIN DEBUG: Errores de validación de express-validator:", errors.array());
            const cartItemCount = productController.getCartItemCount(req); 
            return res.render('users/login', {
                errors: errors.array(),
                oldData: req.body,
                title: "Formulario de ingreso",
                style: "login",
                reqPath: req.path,
                cartItemCount 
            });
        }

        try {
            console.log("LOGIN DEBUG: Buscando usuario con email:", req.body.email);
            const userToLogin = await db.User.findOne({ where: { email: req.body.email } });
            console.log("LOGIN DEBUG: Resultado de userToLogin:", userToLogin ? userToLogin.get({ plain: true }) : null); // Muestra el usuario encontrado o null

            if (!userToLogin) {
                console.log("LOGIN DEBUG: Usuario NO encontrado en la base de datos.");
                const cartItemCount = productController.getCartItemCount(req);
                return res.render('users/login', {
                    errors: [{ msg: 'Credenciales inválidas.' }],
                    oldData: req.body,
                    title: "Formulario de ingreso",
                    style: "login",
                    reqPath: req.path,
                    cartItemCount 
                });
            }

            console.log("LOGIN DEBUG: Comparando contraseña para usuario:", userToLogin.username);
            const passwordMatch = bcrypt.compareSync(req.body.password, userToLogin.password);
            console.log("LOGIN DEBUG: Resultado de passwordMatch:", passwordMatch);

            if (!passwordMatch) {
                console.log("LOGIN DEBUG: Contraseña NO coincide.");
                const cartItemCount = productController.getCartItemCount(req);
                return res.render('users/login', {
                    errors: [{ msg: 'Credenciales inválidas.' }],
                    oldData: req.body,
                    title: "Formulario de ingreso",
                    style: "login",
                    reqPath: req.path,
                    cartItemCount 
                });
            }

            req.session.userId = userToLogin.id;
            console.log("LOGIN DEBUG: Usuario logueado exitosamente. ID de sesión:", req.session.userId);

            if (req.body.rememberme) { 
                res.cookie('rememberEmail', userToLogin.email, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                console.log("LOGIN DEBUG: Cookie 'rememberEmail' establecida.");
            }

            console.log("LOGIN DEBUG: Redirigiendo a /users/profile");
            res.redirect('/users/profile'); 
        } catch (error) {
            console.error("LOGIN DEBUG: Error al intentar iniciar sesión:", error);
            const cartItemCount = productController.getCartItemCount(req); 
            res.render('users/login', {
                errors: [{ msg: 'Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.' }],
                oldData: req.body,
                title: "Formulario de ingreso",
                style: "login",
                reqPath: req.path,
                cartItemCount 
            });
        }
    },
    logout: (req, res) => {
        res.clearCookie('rememberEmail'); 
        req.session.destroy(err => {
            if (err) {
                console.error("Error al destruir la sesión durante el logout:", err);
                return res.send('Error al cerrar sesión.');
            }
            res.redirect('/products'); 
        });
    },

    
    apiUsers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows: users } = await db.User.findAndCountAll({
                attributes: ['id', 'username', 'email', 'avatar'],
                limit: limit,
                offset: offset
            });

            const usersWithDetail = users.map(user => {
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    detail: `/api/users/${user.id}` 
                };
            });

            let next = null;
            if (offset + limit < count) {
                next = `/api/users?page=${page + 1}`;
            }

            let previous = null;
            if (page > 1) {
                previous = `/api/users?page=${page - 1}`;
            }

            const response = {
                count: count,
                users: usersWithDetail,
                next: next,
                previous: previous
            };

            res.json(response);
        } catch (error) {
            console.error("Error al obtener la lista de usuarios (API):", error);
            res.status(500).json({ error: "Error al obtener la lista de usuarios" });
        }
    },
    apiUserDetail: async (req, res) => {
        try {
            const user = await db.User.findByPk(req.params.id, {
                attributes: { exclude: ['password', 'role'] } 
            });

            if (user) {
                const response = {
                    ...user.get({ plain: true }),
                    profileImageUrl: `/images/users/${user.avatar}` 
                };
                res.json(response);
            } else {
                res.status(404).json({ error: "Usuario no encontrado" });
            }
        } catch (error) {
            console.error("Error al obtener el detalle del usuario (API):", error);
            res.status(500).json({ error: "Error al obtener el detalle del usuario" });
        }
    }
};

module.exports = userController;