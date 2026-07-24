import { addEmployee, editEmp, Emp, deleteEmp } from "../controllers/empController.js";
import express from "express";

const router = express.Router();

router.get('/getEmp', Emp);
router.post('/addEmp', addEmployee);
router.put('/update/:email', editEmp);
router.delete('/delete/:email', deleteEmp);

export default router;