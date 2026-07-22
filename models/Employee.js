import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Employee = sequelize.define('Employee', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: "employee_email_unique_idx",
            msg: "Employee with this email is already exists."
        },
        set(value) {
            this.setDataValue("email", value ? value.trim().toLowerCase() : value);
        },
        validate: {
            notEmpty: { msg: "Please Provide Employee email address" },
            isEmail: { msg: "Please provide a valid email address" },
        }
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please Provide Employee Full Name" },
            len: {
                args: [3, 50],
                msg: "Name cannot exceed 50 characters"
            }
        },

        set(value) {
            this.setDataValue('name', value ? value.trim() : value)
        }
    },

    department: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please Provide Employee's Department Name" },
            len: {
                args: [3, 30],
                msg: "Department Name cannot exceed 30 characters"
            }
        },

        set(value) {
            this.setDataValue('department', value ? value.trim() : value)
        },
    },

    designation: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please Provide Designation of Employee" },
            len: {
                args: [3, 30],
                msg: "Designation cannot exceeds 30 characters"
            },
        },

        set(value) {
            this.setDataValue("designation", value ? value.trim() : value);
        },
    },

    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false,
        validate: {
            isIn: {
                args: [["active", "inactive"]],
                msg: "Status must be either: active or inactive"
            }
        }
    },

    JoiningDate: {
        type: DataTypes.DATE(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Please provide Joing Date of Employee" },
            isDate: { msg: "Please proivde a valid Date" }
        }
    }

},
    {
        tableName: 'employees',
        timestamps: true,
    }
);

export default Employee;