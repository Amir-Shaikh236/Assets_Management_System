// tests/setup/db.js
import { sequelize } from "../../config/db";

export const connectTestDB = async () => {
    await sequelize.authenticate();

    // .sync({ force: true }) creates all tables fresh based on your models
    await sequelize.sync({ force: true });
};

export const clearTestDB = async () => {

    if (process.env.NODE_ENV !== "test") {
        throw new Error("CRITICAL WARN: Attempt to wipe a non-test database");
    }

    const models = Object.values(sequelize.models);
    for (const model of models) {
        await model.destroy({ where: {}, truncate: true });
    }
};

export const disconnectTestDB = async () => {
    await sequelize.close();
};