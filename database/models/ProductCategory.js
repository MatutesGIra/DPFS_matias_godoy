module.exports = function(sequelize, DataTypes) {
    let alias = 'ProductCategory';

    let cols = {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {      
              model: 'products',
              key: 'id'
            }
        },
        category_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            references: {
              model: 'categories',
              key: 'id'
            }
        }
    };

    let config = {
        tableName: 'productcategories',
        timestamps: false, 
    };

    const ProductCategory = sequelize.define(alias, cols, config);

    return ProductCategory;
};