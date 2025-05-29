const productController = {
    detailProducts: (req,res) => {
        res.render("products/productDetail");
    },
    createProducts: (req,res) => {
        res.render("products/productCreate");
    },
    editProducts: (req,res) => {
        res.render("products/productEdit");
    },
};
module.exports = productController;