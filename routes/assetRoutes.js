import express from 'express'
import { getAssets, addAssets, editAssets, deleteAsset } from "../controllers/assetController.js"
const router = express.Router();

router.get('/getAssets', getAssets);
router.post('/addAssets', addAssets);
router.put('/update/:serialNumber', editAssets);
router.delete('/delete/:serialNumber', deleteAsset);

export default router;