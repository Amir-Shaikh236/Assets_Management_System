import express from "express"
import { register, login, logout, deleteUser, refreshToken, Users } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken)
router.delete("/deleteUser", deleteUser);
router.get('/users', Users);

export default router;
