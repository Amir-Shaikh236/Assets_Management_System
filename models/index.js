import { sequelize } from "../config/db.js";
import Asset from "./Asset.js";
import AssestsHistory from "./assetsHistory.js";
import Category from "./Category.js";
import Employee from "./Employee.js";


// Linking Category with Assets
Category.hasMany(Asset, {
    foreignKey: 'categoryId',
    as: 'assets',
    onDelete: 'RESTRICT', // If someone tries to delete a Category from the database, block the deletion if there are assets linked to it.
    onUpdate: 'CASCADE'  // If the Category's ID number changes, automatically update the sticky notes on all the laptops to match the new number.
});

// Linking Assets with Category
Asset.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

// Asset with Employee
Employee.hasMany(Asset, {
    foreignKey: 'currentEmpId',
    as: 'assignedAssets',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Asset.belongsTo(Employee, {
    foreignKey: 'currentEmpId',
    as: 'currentHolder'
});

// Asset History with Employee
Asset.hasMany(AssestsHistory, {
    foreignKey: 'assetId',
    as: 'history',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

AssestsHistory.belongsTo(Asset, {
    foreignKey: 'assetId',
    as: 'asset'
})



Employee.hasMany(AssestsHistory, {
    foreignKey: 'empId',
    as: 'assetLogs',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

AssestsHistory.belongsTo(Employee, {
    foreignKey: 'empId',
    as: 'employee'
});


export { sequelize, Category, Asset, Employee, AssestsHistory };