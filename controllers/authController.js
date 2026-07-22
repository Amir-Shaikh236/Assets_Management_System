import User from "../models/User.js"
import { SignToken, setRefreshCookie } from "../services/authService.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { Op, where } from "sequelize";

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });
    if (userExist)
      return next(new AppError(403, "User with this email already exist"));

    const user = await User.create({ firstName, lastName, email, password });

    const { accessToken, refreshToken } = SignToken(user.id, user.role);
    user.refreshTokens = [...user.refreshTokens, refreshToken];

    await user.save();

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      status: "success",
      user: { id: user.id, email: user.email },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError(400, "Please enter email and password"));

    const user = await User.scope("withAllSecretData").findOne({ where: { email } })

    if (!user || !(await user.matchPassword(password)))
      return next(new AppError(401, "incorrect email or password"));

    const { accessToken, refreshToken } = SignToken(user.id, user.role);

    let activeTokens = user.refreshTokens || [];

    // Filter out the old cookie token if present to execute clean token rotation
    if (req.cookies?.refreshToken) {
      activeTokens = activeTokens.filter((token) => token !== req.cookies.refreshToken);
    }

    activeTokens.push(refreshToken);

    user.refreshTokens = [...activeTokens];
    user.changed('refreshTokens', true);
    await user.save();

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      status: "success",
      user: { id: user.id, email: user.email },
      accessToken,
    });

  } catch (error) {
    next(error);

  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return next(new AppError(401, "Authentication token missing"));

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth/refresh",
    });

    let decoded;

    try {
      decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    } catch (error) {

      const userExpiredToken = await User.scope('withRefreshTokens').findOne({
        where: {
          refreshTokens: {
            [Op.contains]: [refreshToken]
          }
        }
      });

      if (userExpiredToken) {
        userExpiredToken.refreshTokens = userExpiredToken.refreshTokens.filter((t) => t !== refreshToken)
        userExpiredToken.changed('refreshTokens', true)
        await userExpiredToken.save()
      }

      return next(new AppError(403, "Session Expired or invalid token"));
    }

    const user = await User.scope('withRefreshTokens').findByPk(decoded.id);
    if (!user)
      return next(new AppError(403, "User Profile associated with the token is not exist"));

    if (!user.refreshTokens.includes(refreshToken)) {
      user.refreshTokens = [];
      await user.save();
      return next(new AppError(403, "Compromised token usage detected. Wiping all sessions"));
    }

    const activeTokens = user.refreshTokens.filter((token) => token !== refreshToken);

    const tokens = SignToken(user.id, user.role);

    user.refreshTokens = [...activeTokens, tokens.refreshToken]
    user.changed('refreshTokens', true);
    await user.save();

    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {

    const { refreshToken } = req.cookies;

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: 'strict',
      path: "/api/auth/refresh",
    });

    if (refreshToken) {
      const userWithToken = await User.scope('withRefreshTokens').findOne({
        where: {
          refreshTokens: {
            [Op.contains]: [refreshToken]
          }
        }
      });

      if (userWithToken) {
        userWithToken.refreshTokens = userWithToken.refreshTokens.filter((t) => t !== refreshToken)
        await userWithToken.save()
      }
    }

    res.status(200).json({ status: "success", message: "logout successfully" });

  } catch (error) {
    next(error);

  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(new AppError(404, "User Not Found"));

    await user.destroy()

    res.status(200).json({ status: "success", message: "User Deleted" });
  } catch (error) {
    next(error);
  }
};

const Users = async (req, res, next) => {
  try {
    // Example of how Sequelize handles pagination conceptually:
    const users = await User.findAll({ limit: 10, offset: 0 });
    if (!users) return next(new AppError(404, "Users Not Found"));

    res.status(200).json(users);

  } catch (error) {
    next(error);

  }
};

export { register, login, refreshToken, logout, deleteUser, Users }
