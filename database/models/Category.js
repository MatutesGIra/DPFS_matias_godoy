module.exports = function(sequelize, DataTypes) {
    let alias = 'Category';

    let cols = {
        id: {
            type: DataTypes.STRING, 
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };

    let config = {
        tableName: 'categories',
        timestamps: false,
    };

    const Category = sequelize.define(alias, cols, config);

    Category.associate = (models) => {
        Category.belongsToMany(models.Product, {
            through: models.ProductCategory,
            foreignKey: 'category_id',
            otherKey: 'product_id',
            as: 'products'
        });
    };

    return Category;
};