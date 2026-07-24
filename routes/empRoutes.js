import { addEmployee, editEmp, getEmp, deleteEmp } from "../controllers/empController.js";
import express from "express";

const router = express.Router();

router.get('/getEmp', getEmp);
router.post('/addEmp', addEmployee);
router.put('/update/:email', editEmp);
router.delete('/delete/:email', deleteEmp);

export default router;