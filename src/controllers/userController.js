const db = require('../../database/models');
const path = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const userController = {
    getLogin: (req, res) => {
        res.render("users/login", { title: "Formulario de ingreso", reqPath: req.path });
    },
    getRegister: (req, res) => {
        res.render("users/register", { title: "Formulario de registro", reqPath: req.path });
    },
    getProfile: (req, res) => {
        res.render("users/profile", { title: "Perfil de usuario", reqPath: req.path });
    },
    register: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Errores de validación:", errors.array());
            return res.render('users/register', {
                errors: errors.array(),
                oldData: req.body,
                title: "Formulario de registro",
                reqPath: req.path
            });
        }

        try {
            console.log("--- Inicio de Registro ---");
            console.log("req.body:", req.body);

            const newUser = {
                email: req.body.email,
                username: req.body.usuario,
                password: bcrypt.hashSync(req.body.password, 10),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                role: req.body.rol,
                avatar: req.file ? req.file.filename : 'default-avatar.jpg'
            };

            console.log("Objeto newUser antes de crear:", newUser);

            await db.sequelize.transaction(async (t) => {
                const createdUser = await db.User.create(newUser, { transaction: t });
                console.log("Usuario creado en la base de datos:", createdUser);
            });

            console.log("--- Fin de Registro Exitoso ---");
            res.redirect('/users/login');

        } catch (error) {
            console.error("--- Error en Registro ---");
            console.error("Error al registrar usuario:", error);
            console.error("Detalles del error:", error.errors);
            console.error("req.body en el error:", req.body);
            res.status(500).send("Error al registrar usuario");
        }
    },
    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('users/login', {
                errors: errors.array(),
                oldData: req.body,
                title: "Formulario de ingreso",
                reqPath: req.path
            });
        }

        try {
            const user = await db.User.findOne({
                where: { email: req.body.email }
            });

            if (user && bcrypt.compareSync(req.body.password, user.password)) {
                req.session.userId = user.id;

                if (req.body.rememberme) {
                    res.cookie('rememberEmail', req.body.email, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                }

                res.redirect('/products');
            } else {
                res.redirect('/users/login');
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(500).send("Error al iniciar sesión");
        }
    },
    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error("Error al destruir la sesión:", err);
                return res.redirect('/error');
            }
            res.clearCookie('connect.sid');
            res.clearCookie('rememberEmail');
            res.redirect('/products');
        });
    },
    apiUsers: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows: users } = await db.User.findAndCountAll({
                attributes: ['id', 'firstName', 'lastName', 'email'],
                limit: limit,
                offset: offset
            });

            const usersWithDetail = users.map(user => {
                return {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
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
            console.error("Error al obtener la lista de usuarios:", error);
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
            console.error("Error al obtener el detalle del usuario:", error);
            res.status(500).json({ error: "Error al obtener el detalle del usuario" });
        }
    }
};

module.exports = userController;