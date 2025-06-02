const db = require('../../database/models');
const path = require('path');
const { validationResult } = require('express-validator')

const productController = {
    viewCart: (req, res) => {
        res.render("products/cart", {title: "Carrito", reqPath: req.path});
    },
    viewProducts: async (req, res) => {
        try {
            const products = await db.Product.findAll(); // Usamos db.Product
            res.render('products/index', {title: "Productos", products, reqPath: req.path });
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            res.status(500).send("Error al cargar los productos");
        }
    },
    detailProducts: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await db.Product.findByPk(productId);
            if (product) {
                console.log("Producto obtenido de la base de datos:", product);
                res.render('products/productDetail', { title: "Detalle del Producto", product });
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (error) {
            console.error("Error al obtener detalle del producto:", error);
            res.status(500).send("Error al obtener detalle del producto");
        }
    },
    createForm: (req, res) => {
        res.render("products/productCreate", {title: "Formulario de edicion", reqPath: req.path});
    },
    create: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Errores de validación:", errors.array());
            try {
                const productId = req.params.id;
                const product = await db.Product.findByPk(productId);
                return res.render('products/productEdit', {
                    errors: errors.array(),
                    product: product,
                    title: "Formulario de edicion",
                    reqPath: req.path
                });
            } catch (error) {
                console.error("Error al obtener el producto para editar:", error);
                return res.status(500).send("Error al obtener el producto para editar");
            }
        }
        try {
            const productId = req.params.id;
            const updatedProduct = await db.Product.update({
                name: req.body.name,
                description: req.body.description,
                image: req.file ? '/images/products/' + req.file.filename : req.body.oldImage,
                category: req.body.category,
                status: req.body.status,
                price: parseFloat(req.body.price)
            }, {
                where: { id: productId }
            });
            console.log("Producto actualizado:", updatedProduct);
            res.redirect(`/products/${productId}`);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).send("Error al actualizar producto");
        }
    },
    editForm: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await db.Product.findByPk(productId);

            if (product) {
                res.render('products/productEdit', {title: "Formulario de edicion", product, reqPath: req.path });
            } else {
                res.status(404).send('Producto no encontrado para editar');
            }
        } catch (error) {
            console.error("Error al obtener el producto para editar:", error);
            res.status(500).send("Error al obtener el producto para editar");
        }
    },
    edit: async (req, res) => {
        try {
            const productId = req.params.id;
            const updatedProduct = await db.Product.update({
                image: req.file ? '/images/products/' + req.file.filename : req.body.oldImage,
            }, {
                where: { id: productId }
            });
            console.log("Producto actualizado:", updatedProduct);
            res.redirect(`/products/${productId}`);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).send("Error al actualizar producto");
        }
    },
    destroy: async (req, res) => {
        try {
            const productId = req.params.id;
            await db.Product.destroy({ 
                where: { id: productId }
            });

            res.redirect('/products');
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            res.status(500).send("Error al eliminar el producto");
        }
    }
};
module.exports = productController;