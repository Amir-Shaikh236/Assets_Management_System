import Asset from "../models/Asset.js";
import AppError from "../utils/AppError.js";

export const getAssets = async (req, res, next) => {
    try {

        const assets = await Asset.findAll({ limit: 10, offset: 0 });
        res.status(200).json(assets)

    } catch (error) {
        next(error)

    }
}

export const addAssets = async (req, res, next) => {
    try {

        const { serialNumber, make, model, value, branch, purchasedDate, status } = req.body;
        if (!serialNumber || !make || !model || !value || !branch || !purchasedDate || !status) {
            return next(new AppError(400, "Please Provide required details of Assest"));
        }

        const assets = await Asset.create({ serialNumber, make, model, value, branch, purchasedDate, status });
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