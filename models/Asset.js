import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Asset = sequelize.define('Asset', {
    serialNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('serialNumber', value ? value.trim() : value);
        }
    },

    make: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    branch: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    purchasedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please provide Purchase Date of Asset" },
            isDate: { msg: "Please proivde a valid Date" }
        }
    },

    status: {
        type: DataTypes.ENUM("in_stock", "issued", "scrapped"),
        defaultValue: 'in_stock',
        allowNull: false,
        validate: {
            isIn: {
                args: [["in_stock", "issued", "scrapped"]],
                msg: "Status must be in_stock, issued or scrapped"
            }
        }
    },

}, {
    tableName: 'assets',
    timestamps: true
});

export default Asset;