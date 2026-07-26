import { Category, sequelize } from "./models/index.js";


await sequelize.authenticate();

await Category.destroy({
    where: {},
    truncate: true,
    restartIdentity: true,
    cascade: true,
    force: true
});

console.log("Deleted:", await Category.count());