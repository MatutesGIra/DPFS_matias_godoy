module.exports = function(sequelize,DataTypes){
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
    tableName: 'products', // Especifica el nombre de la tabla en la base de datos
    timestamps: false, // Sequelize añadirá automáticamente los campos createdAt y updatedAt
    //underscored: true // _ en createdAt y updateAt
    };

const Product = sequelize.define(alias, cols, config)
return Product;
}