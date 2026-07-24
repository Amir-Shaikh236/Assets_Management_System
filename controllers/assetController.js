import { where } from "sequelize";
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

        let filter = {};

        if (req.query?.status) {
            filter.status = req.query.status;
        }

        const assets = await Asset.findAll({ where: filter, include: joinTables });
        res.status(200).json(assets)

    } catch (error) {
        next(error)

    }
}

export const addAssets = async (req, res, next) => {
    try {

        const { serialNumber, make, model, value, branch, purchasedDate, status, categoryId, currentEmpId } = req.body;
        if (!serialNumber || !make || !model || !value || !branch || !purchasedDate || !status) {
            return next(new AppError(400, "Please Provide required details of Assest"));
        }

        const assets = await Asset.create({ serialNumber, make, model, value, branch, purchasedDate, status, categoryId, currentEmpId });
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
        const { empId } = req.body;

        const asset = await Asset.findByPk(id);
        if (!asset) {
            await t.rollback();
            return next(new AppError(404, "Asset Not Found, Please provide valid Id"));

        }

        if (asset.status !== 'in_stock') {
            await t.rollback();
            return next(new AppError(400, `The Asset is not available for issue. Current Status: ${asset.status}`));

        }

        await asset.update({
            status: 'issued',
            currentEmpId: empId
        }, { transaction: t });

        await AssestsHistory.create({
            action: 'issued',
            assetId: asset.id,
            empId: empId,
            reason: null,
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
        const { reason } = req.body;

        const asset = await Asset.findByPk(id);
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

        res.status(200).json({ message: `Asset move to ${asset.status}` });

    } catch (error) {
        await t.rollback();
        next(error)

    }
}