import { DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';
import { sequelize } from "../config/db.js";


const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please Provide your First Name" },
            len: {
                args: [3, 25],
                msg: "first Name exceeds 25 characters",
            },
        },
        set(value) {
            this.setDataValue('firstName', value ? value.trim() : value)
        }
    },

    lastName: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please provide your last Name" },
            len: {
                args: [3, 25],
                msg: "last name cannot exceeds 25 characters"
            }
        },
        set(value) {
            this.setDataValue('lastName', value ? value.trim() : value)
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: "user_email_unique_idx",
            msg: "User with this email is already exists."
        },
        set(value) {
            this.setDataValue("email", value ? value.trim().toLowerCase() : value);
        },
        validate: {
            notEmpty: { msg: "Please Provide your email address" },
            isEmail: { msg: "Please provide a valid email address" },
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please Provide Your Password" },
            len: {
                args: [8, 100],
                msg: "Password must be atleast 8 characters",
            },
        },
        set(value) {
            this.setDataValue('password', value ? value.trim() : value)
        }
    },

    role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: 'user',
        allowNull: false,
        validate: {
            isIn: {
                args: [["user", "admin"]],
                msg: "Role must be either: User, Admin",
            },
        },
    },

    refreshTokens: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false,
    },

},
    {
        timestamps: true,

        tableName: 'users',

        defaultScope: {
            attributes: { exclude: ['password', 'refreshTokens'] },
        },

        scopes: {
            withPassword: {
                attributes: { include: ['password'] },
            },
            withRefreshTokens: {
                attributes: { include: ['refreshTokens'] }
            },
            withAllSecretData: {
                attributes: { include: ['password', 'refreshTokens'] }
            },
        },

        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(12);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },

            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(12);
                    user.password = await bcrypt.hash(user.password, genSalt);
                }
            },

        },
    }
);

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// strips sensitive data when res.json(user) is called
User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.refreshTokens;
    return values;
};

export default User;