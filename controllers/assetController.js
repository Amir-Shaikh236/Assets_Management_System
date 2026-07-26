import { Op, where } from "sequelize";
import { AssestsHistory, Asset, Category, Employee, sequelize } from "../models/index.js";
import AppError from "../utils/AppError.js";

export const getAssets = async (req, res, next) => {
    try {
        const joinTables = [
            {
                model: Category,
                as: 'category'
            },
            {
                model: Employee,
                as: 'currentHolder'
            }
        ]

        let searchQuery = {};

        const { search, serialNumber, id, make, model, status } = req.query;

        if (search) {
            searchQuery[Op.or] = [
                { make: { [Op.iLike]: `%${search.trim()}%` } },
                { model: { [Op.iLike]: `%${search.trim()}%` } }
            ]
        }

        if (make && !search) {
            searchQuery.make = { [Op.iLike]: `%${make.trim()}%` }
        }

        if (model && !search) {
            searchQuery.model = { [Op.iLike]: `%${model.trim()}%` }
        }

        if (id && !search) {
            searchQuery.id = id;
        }

        if (serialNumber && !search) {
            searchQuery.serialNumber = { [Op.iLike]: `%${serialNumber.trim()}%` }
        }

        if (status && !search) {
            if (status !== 'all') {
                searchQuery.status = status;
            }
        } else {
            searchQuery.status = { [Op.ne]: 'scrapped' };
        }

        const assets = await Asset.findAll({
            where: searchQuery,
            include: joinTables
        });

        res.status(200).json(assets)

    } catch (error) {
        next(error)

    }
}

export const addAssets = async (req, res, next) => {
    try {

        const { serialNumber, make, model, value, branch, purchasedDate, status, categoryId, categoryName, currentEmpId } = req.body;
        if (!serialNumber || !make || !model || !value || !branch || !purchasedDate || !status) {
            return next(new AppError(400, "Please Provide required details of Assest"));
        }

        let resolvedCategoryId = categoryId || null;

        if (!resolvedCategoryId && categoryName) {
            const category = await Category.findOne({
                where: { name: categoryName.trim() }
            });

            if (!category) {
                return next(new AppError(404, "Category not found for the provided name"));
            }

            resolvedCategoryId = category.id;
        }

        const assets = await Asset.create({
            serialNumber,
            make,
            model,
            value,
            branch,
            purchasedDate,
            status,
            categoryId: resolvedCategoryId,
            currentEmpId
        });

        await AssestsHistory.create({
            action: 'in_stock',
            assetId: assets.id,
            empId: null,
            reason: 'Asset added to inventory',
        });

        res.status(201).json(assets);

    } catch (error) {
        next(error)

    }
}

export const editAssets = async (req, res, next) => {
    try {

        const { serialNumber } = req.params;

        const { make, model, value, branch, purchasedDate, status } = req.body;

        const foundAsset = await Asset.findOne({ where: { serialNumber } });
        if (!foundAsset) return next(new AppError(404, "Assets with this Sr.No. is not found"));

        // const UpdateData = serialNumber || make || model || value || branch || purchasedDate || status;

        if (make) foundAsset.make = make;
        if (model) foundAsset.model = model;
        if (value) foundAsset.value = value;
        if (branch) foundAsset.branch = branch;
        if (purchasedDate) foundAsset.purchasedDate = purchasedDate;
        if (status) foundAsset.status = status;

        await foundAsset.save();

        res.status(200).json({
            message: "Assets Updated Successfully",
            Asset: {
                make: foundAsset.make,
                model: foundAsset.model,
                value: foundAsset.value,
                branch: foundAsset.branch,
                purchasedDate: foundAsset.purchasedDate,
                status: foundAsset.status,
            }
        });

    } catch (error) {
        next(error)

    }
}

export const deleteAsset = async (req, res, next) => {
    try {
        const { serialNumber } = req.params;

        const asset = await Asset.findOne({ where: { serialNumber } });
        if (!asset) return next(new AppError(404, "Asset Not Found"));

        await asset.destroy();
        res.status(200).json({ message: `Asset with ${serialNumber} Sr.No has been deleted` })

    } catch (error) {
        next(error)

    }
}

// Issued Asset
export const issueAsset = async (req, res, next) => {

    const t = await sequelize.transaction();

    try {

        const { id } = req.params;
        const { employeeEmail, empId, reason } = req.body;

        const asset = await Asset.findByPk(id);
        if (!asset) {
            await t.rollback();
            return next(new AppError(404, "Asset Not Found, Please provide valid Id"));

        }

        if (asset.status !== 'in_stock') {
            await t.rollback();
            return next(new AppError(400, `The Asset is not available for issue. Current Status: ${asset.status}`));

        }

        let resolvedEmpId = empId || null;

        if (employeeEmail && !resolvedEmpId) {
            const employee = await Employee.findOne({
                where: { email: employeeEmail.trim().toLowerCase() }
            });

            if (!employee) {
                await t.rollback();
                return next(new AppError(404, "Employee not found for the provided email"));
            }

            resolvedEmpId = employee.id;
        }

        if (!resolvedEmpId) {
            await t.rollback();
            return next(new AppError(400, "Please provide a valid employee email or employee id"));
        }

        await asset.update({
            status: 'issued',
            currentEmpId: resolvedEmpId
        }, { transaction: t });

        await AssestsHistory.create({
            action: 'issued',
            assetId: asset.id,
            empId: resolvedEmpId,
            reason: reason || null,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "Asset Issue Successfully", asset });

    } catch (error) {
        await t.rollback();
        next(error)

    }
};

export const returnAsset = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { reason, employeeId } = req.body;

        let asset = null;

        if (id && id !== '0') {
            asset = await Asset.findByPk(id);
        }

        if (!asset) {
            const resolvedEmployeeId = employeeId || id;
            if (resolvedEmployeeId) {
                asset = await Asset.findOne({
                    where: {
                        currentEmpId: resolvedEmployeeId,
                        status: 'issued'
                    }
                });
            }
        }

        if (!asset) {
            await t.rollback();
            return next(new AppError(404, "Asset Not Found"))
        }

        if (asset.status !== 'issued') {
            await t.rollback();
            return next(new AppError(409, "Asset cannot be returned because it is currently in_stock"));
        }

        if (!reason) {
            await t.rollback();
            return next(new AppError(400, "Please Provide your Reason of Returning Asset"));
        }

        await AssestsHistory.create({
            action: 'returned',
            assetId: asset.id,
            empId: asset.currentEmpId,
            reason: reason,
        }, { transaction: t });

        await asset.update({
            status: 'in_stock',
            currentEmpId: null,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: 'Asset returned successfully', asset });

    } catch (error) {
        await t.rollback();
        next(error)

    }
}

export const scrap = async (req, res, next) => {

    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const asset = await Asset.findByPk(id)
        if (!asset) {
            await t.rollback();
            return next(new AppError(404, "Asset Not Found"))
        }

        if (asset.status === 'scrapped') {
            await t.rollback();
            return next(new AppError(409, "The Asset is already been scrapped"));
        }

        if (!reason) {
            await t.rollback();
            return next(new AppError(400, "Please Provide your Reason for Scrapping an Asset"));
        }


        await AssestsHistory.create({
            action: 'scrapped',
            assetId: asset.id,
            empId: asset.currentEmpId || null,
            reason: reason

        }, { transaction: t });

        await asset.update({
            status: 'scrapped',
            currentEmpId: null,
        }, { transaction: t })

        await t.commit();

        res.status(200).json({ message: `Asset has been scrapped`, asset });

    } catch (error) {
        await t.rollback();
        next(error);

    }
}

export const getAssetHistory = async (req, res, next) => {
    try {
        const includeData = [
            {
                model: AssestsHistory,
                as: 'history',
                order: [['createdAt', 'ASC']],

                include: {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'name', 'email', 'department'],
                }
            },
        ]

        const { id } = req.params;

        const asset = await Asset.findByPk(id, { include: includeData });

        if (!asset) {
            return next(new AppError(404, `Asset with id: ${id} Not Found`));
        }

        res.status(200).json({
            Id: asset.id,
            value: asset.value,
            purchasedDate: asset.purchasedDate,
            make: asset.make,
            model: asset.model,
            serialNumber: asset.serialNumber,
            branch: asset.branch,
            status: asset.status,
            history: asset.history
        });

    } catch (error) {
        next(error);

    }
}

export const getStockView = async (req, res, next) => {
    try {
        const stockByBranch = await Asset.findAll({
            attributes: [
                'branch',
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalAssets'],
                [sequelize.fn('SUM', sequelize.col('value')), 'branchValuation'],
            ],
            where: {
                status: {
                    [Op.ne]: 'scrapped'
                }
            },
            group: ['branch'],
            order: [['branch', 'ASC']],
            raw: true
        });

        const totalValuation = stockByBranch.reduce((acc, currentBranch) => {
            const branchvalue = Number(currentBranch.branchValuation) || 0;
            return acc + branchvalue;
        }, 0);


        const grandTotalAssets = stockByBranch.reduce((acc, currentBranch) => {
            const branchAsset = Number(currentBranch.totalAssets) || 0;
            return acc + branchAsset;
        }, 0);

        res.status(200).json({
            status: 'success',
            summary: {
                totalBranches: stockByBranch.length,
                grandTotalAssets,
                totalValuation: totalValuation.toFixed(2)
            },
            data: stockByBranch
        });


    } catch (error) {
        next(error);

    }
}