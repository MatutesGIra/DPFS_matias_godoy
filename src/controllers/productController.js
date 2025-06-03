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
    },
    apiProducts: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows: products } = await db.Product.findAndCountAll({
                limit: limit,
                offset: offset
            });

            const productsWithDetail = products.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    detail: `/api/products/${product.id}`
                };
            });

            let next = null;
            if (offset + limit < count) {
                next = `/api/products?page=${page + 1}`;
            }

            let previous = null;
            if (page > 1) {
                previous = `/api/products?page=${page - 1}`;
            }

            const response = {
                count: count,
                products: productsWithDetail,
                next: next,
                previous: previous
            };

            res.json(response);
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
            res.status(500).json({ error: "Error al obtener la lista de productos" });
        }
    },
    apiProductDetail: async (req, res) => {
        try {
            const product = await db.Product.findByPk(req.params.id);

            if (product) {
                const response = {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: `/images/products/${product.image}`,
                    price: product.price,
                    active: product.active
                };
                res.json(response);
            } else {
                res.status(404).json({ error: "Producto no encontrado" });
            }
        } catch (error) {
            console.error("Error al obtener el detalle del producto:", error);
            res.status(500).json({ error: "Error al obtener el detalle del producto" });
        }
    }
};
module.exports = productController;