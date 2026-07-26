import express from 'express'
import { getAssets, addAssets, editAssets, deleteAsset, issueAsset, returnAsset, scrap, getAssetHistory, getStockView } from "../controllers/assetController.js"
const router = express.Router();

router.get('/getAssets', getAssets);
router.get('/stockView', getStockView);
router.post('/addAssets', addAssets);
router.put('/update/:serialNumber', editAssets);
router.delete('/delete/:serialNumber', deleteAsset);
router.post('/issue/:id', issueAsset);
router.post('/return/:id', returnAsset);
router.post('/scrap/:id', scrap);
router.get('/getAssetHistory/:id', getAssetHistory);

export default router;