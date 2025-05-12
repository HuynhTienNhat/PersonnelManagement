import express from 'express';
const router = express.Router();
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployeesByName,
  searchEmployeesByDOB,
  filterEmployeesByPosition,
  filterEmployeesByDepartment,
} from '../controllers/Controller.js';

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

// Search routes
router.get('/search/name', searchEmployeesByName);
router.get('/search/dob', searchEmployeesByDOB);

// Filter routes
router.get('/filter/position', filterEmployeesByPosition);
router.get('/filter/department', filterEmployeesByDepartment);

export default router;