import express from 'express'
import { getCategories, addCategory, editCategory, deleteCategory } from '../controllers/categoryController.js'

const router = express.Router();

router.get('/getCategories', getCategories)
router.post('/addCategory', addCategory)
router.put('/update/:name', editCategory)
router.delete('/delete/:name', deleteCategory)

export default router;