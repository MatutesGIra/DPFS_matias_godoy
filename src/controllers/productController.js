const fileSystem = require("fs");
const path = require('path');
const productFile = path.join(__dirname, '../data/products.json');


const getProducts = () => {
    let products = fileSystem.readFileSync(productFile, "utf-8");
    return JSON.parse(products);
};
const saveProducts = (products) => {
    fileSystem.writeFileSync(productFile, JSON.stringify(products, null, " "));
};

const productController = {
    viewCart: (req, res) => {
        res.render("products/cart", {title: "Carrito", reqPath: req.path});
    },
    viewProducts: (req, res) => {
        const products = getProducts();
        res.render('products/index', {title: "Productos", products, reqPath: req.path });
    },
    detailProducts: (req, res) => {
        const products = getProducts();
        const productId = parseInt(req.params.id, 10);
        const product = products.find(p => p.id === productId);

        if (product) {
            res.render('products/productDetail', {title: "Detalles de producto", product, reqPath: req.path });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    },
    createForm: (req, res) => {
        res.render("products/productCreate", {title: "Formulario de edicion", reqPath: req.path});
    },
    create: (req, res) => {
        const products = getProducts();

        const newProduct = {
            id: (products.length) + 1,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image || ' ',
            category: req.body.category,
            status: req.body.status,
            price: parseFloat(req.body.price)
        };

        products.push(newProduct);
        saveProducts(products);
        res.redirect('/products');
    },
    editForm: (req, res) => {
        const products = getProducts();
        const productId = parseInt(req.params.id, 10);
        const product = products.find(p => p.id === productId);

        if (product) {
            res.render('products/productEdit', {title: "Formulario de edicion", product, reqPath: req.path });
        } else {
            res.status(404).send('Producto no encontrado para editar');
        }
    },
    edit: (req, res) => {
        let products = getProducts();
        const productId = parseInt(req.params.id, 10);

        products = products.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    name: req.body.name,
                    description: req.body.description,
                    image: req.body.image || p.image,
                    category: req.body.category,
                    status: req.body.status,
                    price: parseFloat(req.body.price)
                };
            }
            return p;
        });

        saveProducts(products);
        res.redirect(`/products/${productId}`);
    },
    destroy: (req, res) => {
        let products = getProducts();
        const productId = parseInt(req.params.id, 10);

        products = products.filter(p => p.id !== productId);

        saveProducts(products);
        res.redirect('/products');
    }
};
module.exports = productController;