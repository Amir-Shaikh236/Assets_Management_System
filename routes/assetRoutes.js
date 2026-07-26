import express from 'express'
import { getAssets, addAssets, editAssets, deleteAsset, issueAsset, returnAsset, scrap, getAssetHistory, getStockView } from "../controllers/assetController.js"
const router = express.Router();

router.get('/getAssets', getAssets);
router.get('/stockView', getStockView);
router.post('/addAssets', addAssets);
router.put('/update/:serialNumber', editAssets);
router.delete('/delete/:serialNumber', deleteAsset);
router.post('/:id/issue', issueAsset);
router.post('/:id/return', returnAsset);
router.post('/:id/scrap', scrap);
router.get('/getAssetHistory/:id', getAssetHistory);

export default router;