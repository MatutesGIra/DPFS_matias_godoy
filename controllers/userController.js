const userController = {
    getLogin: (req,res) => {
        res.render("login.ejs");
    },
    getRegister: (req,res) => {
        res.render("register.ejs");
    },
};

module.exports = userController;