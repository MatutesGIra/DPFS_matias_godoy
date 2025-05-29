const userController = {
    getLogin: (req,res) => {
        res.render("users/login");
    },
    getRegister: (req,res) => {
        res.render("users/register");
    },
};

module.exports = userController;