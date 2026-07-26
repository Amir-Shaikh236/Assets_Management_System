
import { Employee } from '../models/index.js'
import AppError from '../utils/AppError.js'
import { Op } from 'sequelize'

export const addEmployee = async (req, res, next) => {
    try {
        const { email, name, department, designation, status, JoiningDate } = req.body;

        if (!email || !name || !department || !designation || !JoiningDate) {
            return next(new AppError(400, "Please Provide required details!"));
        }

        const employee = await Employee.create({ email, name, department, designation, status, JoiningDate });

        if (employee) {
            // res.status(201).json({ employee: employee.name, department: employee.department, designation: employee.designation })
            res.status(201).json(employee);
        }

    } catch (error) {
        next(error)

    }
}

export const editEmp = async (req, res, next) => {
    try {
        const { email } = req.params;

        const { name, department, designation, status, JoiningDate } = req.body;

        const emp = await Employee.findOne({ where: { email } });
        if (!emp) {
            return next(new AppError(404, "Employee with this email doesn't exist"));
        }

        if (name) emp.name = name;
        if (department) emp.department = department;
        if (designation) emp.designation = designation;
        if (status) emp.status = status;
        if (JoiningDate) emp.JoiningDate = JoiningDate;

        await emp.save();

        res.status(200).json({
            message: "Employee Updated Successfully",
            employee: {
                name: emp.name,
                email: emp.email,
                department: emp.department,
                designation: emp.designation,
                status: emp.status,
                JoiningDate: emp.JoiningDate
            }
        });

    } catch (error) {
        next(error);

    }
}

export const deleteEmp = async (req, res, next) => {
    try {
        const { email } = req.params;

        const emp = await Employee.findOne({ where: { email } })
        if (!emp) return next(new AppError(404, "Employee with this email doesn't exist"));

        await emp.destroy();
        res.status(200).json({ message: `Employee with email ${email} has been deleted` });

    } catch (error) {
        next(error);

    }
}

export const getEmp = async (req, res, next) => {
    try {
        const searchQuery = {};

        const { status, search, name, email } = req.query;

        if (status !== undefined) {
            searchQuery.status = status;
        }

        if (search) {
            searchQuery[Op.or] = [
                { name: { [Op.iLike]: `%${search.trim()}%` } },
                { email: { [Op.iLike]: `%${search.trim()}%` } }
            ];
        }

        if (name && !search) {
            searchQuery.name = { [Op.iLike]: `%${name.trim()}%` };
        }

        if (email && !search) {
            searchQuery.email = { [Op.iLike]: `%${email.trim()}%` };
        }

        const employees = await Employee.findAll({
            where: searchQuery,
            order: [['id', 'ASC']],
        });

        res.status(200).json(employees);

    } catch (error) {
        next(error);

    }
};
