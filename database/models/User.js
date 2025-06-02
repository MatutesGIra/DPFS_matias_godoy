module.exports = function(sequelize,DataTypes){
    let alias = 'User'; // Puedes usar 'User' o el nombre que prefieras para referirte al modelo

    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        dateOfBirth: {
            type: DataTypes.DATE
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING
        }
    };

    let config = {
        tableName: 'users', // Nombre de la tabla en la base de datos
        timestamps: false // Si tienes createdAt y updatedAt
    };

const User = sequelize.define(alias, cols, config)
return User;
}