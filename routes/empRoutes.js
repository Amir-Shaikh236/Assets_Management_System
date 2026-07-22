import { addEmployee, editEmp, Emp, deleteEmp } from "../controllers/empController.js";
import express from "express";

const router = express.Router();

router.post('/addEmp', addEmployee);
router.put('/:email', editEmp);
router.get('/emp', Emp);
router.delete('/deleteEmp', deleteEmp);

export default router;