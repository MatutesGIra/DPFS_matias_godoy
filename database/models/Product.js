module.exports = function(sequelize, DataTypes) {
    let alias = 'Product';

    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    };

    let config = {
        tableName: 'products',
        timestamps: false,
    };

    const Product = sequelize.define(alias, cols, config);
    
    Product.associate = (models) => {
        Product.belongsToMany(models.Category, {
            through: models.ProductCategory,
            foreignKey: 'product_id',      
            otherKey: 'category_id',      
            as: 'categories'             
        });
    };

    return Product;
};