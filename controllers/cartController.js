const cartController = {
    viewCart: (req,res) => {
        res.render("products/cart");
    },
};
module.exports = cartController;