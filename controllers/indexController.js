const indexController = {
    getHome: (req,res) => {
        res.render("index.ejs");
    },
};
module.exports = indexController;