import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Please Provide an Asset Category Name!" }
        },
        set(value) {
            this.setDataValue('name', value ? value.trim() : value);
        },
    },

    description: {
        type: DataTypes.STRING,
    }
},
    {
        timestamps: true,
        tableName: "asset_categories"
    }
);

export default Category;