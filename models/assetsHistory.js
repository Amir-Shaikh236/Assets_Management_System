import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AssestsHistory = sequelize.define('AssetsHistory', {

    action: {
        type: DataTypes.ENUM('in_stock', 'issued', 'scrapped', 'returned'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['in_stock', 'issued', 'scrapped', 'returned']],
                msg: "action must be in_stock, issued, scrapped or returned"
            }
        }
    },

    reason: {
        type: DataTypes.STRING,
    },

},
    {
        tableName: 'asset_histories',
        timestamps: true,
    }
)

export default AssestsHistory;