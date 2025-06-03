const db = require('../../database/models');
const path = require('path');
const { validationResult } = require('express-validator')

const productController = {
    viewCart: (req, res) => {
        const cart = req.session.cart || [];

        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        res.render("products/cart", {
            title: "Carrito",
            reqPath: req.path,
            style: "cart",
            cartItems: cart,
            total: total.toFixed(2),
            cartItemCount: productController.getCartItemCount(req)
        });
    },
    viewProducts: async (req, res) => {
        try {
            const products = await db.Product.findAll();
            const cartItemCount = req.session.cart ? req.session.cart.length : 0;
            res.render('products/index',
                {
                    title: "Productos",
                    products,
                    reqPath: req.path,
                    style: "index",
                    cartItemCount 
                });
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
                const cartItemCount = productController.getCartItemCount(req); 
                res.render('products/productDetail', {
                    title: "Detalle del Producto",
                    product,
                    style: "detail",
                    cartItemCount 
                });
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (error) {
            console.error("Error al obtener detalle del producto:", error);
            res.status(500).send("Error al obtener detalle del producto");
        }
    },
    createForm: async (req, res) => {
        try {
            const categories = await db.Category.findAll(); 
            res.render('products/productCreate', {
                title: "Crear Producto",
                reqPath: req.path,
                style: "create", 
                categories 
            });
        } catch (error) {
            console.error("Error al cargar el formulario de creación:", error);
            res.status(500).send("Error al cargar el formulario de creación.");
        }
    },
    editForm: async (req, res) => {
        try {
            const productId = req.params.id;
            const productToEdit = await db.Product.findByPk(productId, {
                include: ['categories'] 
            });
            const allCategories = await db.Category.findAll();

            if (!productToEdit) {
                return res.status(404).send('Producto no encontrado para editar.');
            }

            res.render('products/productEdit', {
                title: "Editar Producto",
                product: productToEdit,
                categories: allCategories,
                reqPath: req.path,
                style: "create" 
            });
        } catch (error) {
            console.error("Error al cargar el formulario de edición:", error);
            res.status(500).send("Error al cargar el formulario de edición.");
        }
    },
    create: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Errores de validación al crear producto:", errors.array());
            const categories = await db.Category.findAll();
            return res.render('products/create', {
                errors: errors.array(),
                oldData: req.body,
                title: "Crear Producto",
                reqPath: req.path,
                style: "create",
                categories 
            });
        }

        try {
            const { name, description, price, categoryIds, active } = req.body;
            const image = req.file ? req.file.filename : 'default-product-image.png'; 
            const newProduct = await db.Product.create({
                name,
                description,
                image,
                price: parseFloat(price),
                active: !!active 
            });
            if (categoryIds && categoryIds.length > 0) {
                const finalCategoryIds = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
                await newProduct.setCategories(finalCategoryIds);
            }

            res.redirect('/products');
        } catch (error) {
            console.error("Error al crear el producto:", error);
            res.status(500).send("Error al crear el producto.");
        }
    },
    edit: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Errores de validación al editar producto:", errors.array());
            const productId = req.params.id;
            const productToEdit = await db.Product.findByPk(productId, {
                include: ['categories']
            });
            const allCategories = await db.Category.findAll();

            return res.render('products/edit', {
                title: "Editar Producto",
                product: productToEdit,
                categories: allCategories,
                errors: errors.array(),
                oldData: req.body,
                reqPath: req.path,
                style: "create"
            });
        }
        try {
            const productId = req.params.id;
            const { name, description, price, categoryIds, active } = req.body;
            const product = await db.Product.findByPk(productId);

            if (!product) {
                return res.status(404).send('Producto no encontrado.');
            }

            const updatedData = {
                name,
                description,
                price: parseFloat(price),
                active: !!active
            };

            if (req.file) {
                updatedData.image = req.file.filename;
            }

            await product.update(updatedData);

            const finalCategoryIds = Array.isArray(categoryIds) ? categoryIds : (categoryIds ? [categoryIds] : []);
            await product.setCategories(finalCategoryIds);

            res.redirect('/products');
        } catch (error) {
            console.error("Error al editar el producto:", error);
            res.status(500).send("Error al editar el producto.");
        }
    },
    destroy: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await db.Product.findByPk(productId);

            if (product) {
                
                await product.setCategories([]); 

                await db.Product.destroy({
                    where: { id: productId }
                });
                res.redirect('/products');
            } else {
                res.status(404).send('Producto no encontrado para eliminar.');
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            res.status(500).send("Error al eliminar el producto.");
        }
    },
    getCartItemCount: (req) => {
        return req.session.cart ? req.session.cart.length : 0;
    },
    addToCart: async (req, res) => {
        try {
        
            const productId = parseInt(req.params.id, 10);
            
            const quantity = parseInt(req.body.quantity, 10);

            
            if (isNaN(productId) || productId <= 0 || isNaN(quantity) || quantity <= 0) {
                return res.status(400).send('Cantidad o ID de producto inválido.');
            }

            
            const productToAdd = await db.Product.findByPk(productId);

            if (!productToAdd) {
                return res.status(404).send('Producto no encontrado.');
            }

            
            if (!req.session.cart) {
                req.session.cart = [];
            }

            
            const existingItemIndex = req.session.cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                
                req.session.cart[existingItemIndex].quantity += quantity;
            } else {
                
                req.session.cart.push({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: parseFloat(productToAdd.price), 
                    image: productToAdd.image,
                    quantity: quantity
                });
            }

            req.session.message = 'Producto agregado al carrito con éxito.';
            res.redirect('/products/cart');
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            res.status(500).send("Error interno del servidor al agregar el producto al carrito.");
        }
    },
    updateCart: (req, res) => {
        const { id, quantity } = req.body;

        if (req.session.cart) {
            const itemIndex = req.session.cart.findIndex(item => item.id == id);
            if (itemIndex > -1) {
                const newQuantity = parseInt(quantity);
                if (newQuantity > 0) {
                    req.session.cart[itemIndex].quantity = newQuantity;
                } else {
                    req.session.cart.splice(itemIndex, 1);
                }
            }
        }
        console.log("Carrito después de actualizar:", req.session.cart);
        res.redirect('/products/cart');
    },
    removeFromCart: (req, res) => {
        const productIdToRemove = req.params.id; 

        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.id != productIdToRemove);
        }
        console.log("Carrito después de remover:", req.session.cart);
        res.redirect('/products/cart');
    },
    apiProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows: products } = await db.Product.findAndCountAll({
                limit: limit,
                offset: offset
            });

            const productsWithDetail = products.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: `/images/products/${product.image}`, 
                    price: product.price,
                    active: product.active,
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
            console.error("Error al obtener la lista de productos (API):", error);
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
            console.error("Error al obtener el detalle del producto (API):", error);
            res.status(500).json({ error: "Error al obtener el detalle del producto" });
        }
    }
};

module.exports = productController;