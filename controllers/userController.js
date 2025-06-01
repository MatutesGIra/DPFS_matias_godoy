const userController = {
    getLogin: (req,res) => {
        res.render("users/login", {title: "Formulario de ingreso"});
    },
    getRegister: (req,res) => {
        res.render("users/register", {title: "Formulario de registro"});
    },
};

module.exports = userController;