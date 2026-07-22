
import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
const DatabaseUrl = isTest ? process.env.TEST_DATABASE_URI : process.env.DATABASE_URI;

if (!DatabaseUrl) {
  console.error(`Critical Core failure - Data Layer Error: DATABASE_URL environment missing.`);
  process.exit(1);
}

export const sequelize = new Sequelize(DatabaseUrl, {
  dialect: 'postgres',
  // logging: process.env.NODE_ENV === "development" ? console.log : false,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: DatabaseUrl.includes('neon.tech') ? { require: true, rejectUnauthorized: false } : false,
  }
});


export const connectDB = async () => {
  try {

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("PostgreSQL Connected Safely via Sequelize");

  } catch (error) {

    console.error(`Critical Core Failure - Database Connection Error: ${error.message}`);
    process.exit(1);

  }
};
