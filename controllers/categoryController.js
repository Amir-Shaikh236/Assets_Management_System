
import Category from "../models/Category.js";
import AppError from "../utils/AppError.js";

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);

    } catch (error) {
        next(error)

    }
}

export const addCategory = async (req, res, next) => {
    try {

        const { name, description } = req.body;
        if (!name) return next(new AppError(400, "Please Provide name of Category"));

        const addCategory = await Category.create({ name, description });
        res.status(201).json({ message: `${addCategory.name} Category created.` });

    } catch (error) {
        next(error)

    }
}

export const editCategory = async (req, res, next) => {
    try {

        const { name } = req.params;
        if (!name) return next(new AppError(400, "Please Provide Category name as parameter"));

        const { name: newName, description } = req.body;

        const categoryUpdate = await Category.findOne({ where: { name } })
        if (!categoryUpdate) return next(new AppError(404, `${name} Cateogry Not Found`));

        if (newName) categoryUpdate.name = newName;
        if (description) categoryUpdate.description = description;

        await categoryUpdate.save();

        res.status(200).json({
            message: `${name} Category updated Successfully`,
            Category: {
                name: categoryUpdate.name,
                description: categoryUpdate.description
            }
        });

    } catch (error) {
        next(error)

    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const { name } = req.params;
        if (!name) return next(new AppError(400, "Please Provide Category name as parameter"));

        const category = await Category.findOne({ where: { name } });
        if (!category) return next(new AppError(404, `${name} Category Not Found`));

        await category.destroy();
        res.status(200).json({ message: `${name} Category Deleted Successfully` });

    } catch (error) {
        next(error)

    }
}