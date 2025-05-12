import Employee from '../models/Employee.js';

// Get all employees
export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// Create a new employee
export const createEmployee = async (req, res, next) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    next(error);
  }
};

// Update an employee
export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// Delete an employee
export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted' });
  } catch (error) {
    next(error);
  }
};

// Search employees by name
export const searchEmployeesByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name query parameter is required' });
    }
    const employees = await Employee.find({
      name: { $regex: name, $options: 'i' }, // Case-insensitive search
    });
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// Search employees by date of birth (month, year, or both)
export const searchEmployeesByDOB = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month && !year) {
      return res.status(400).json({ message: 'At least one of month or year is required' });
    }

    const match = {};
    if (month) {
      if (isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Month must be between 1 and 12' });
      }
      match['$month'] = Number(month);
    }
    if (year) {
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        return res.status(400).json({ message: 'Year must be between 1900 and current year' });
      }
      match['$year'] = Number(year);
    }

    const employees = await Employee.aggregate([
      {
        $match: {
          dateOfBirth: {
            $exists: true,
            ...(month && { $expr: { $eq: [{ $month: '$dateOfBirth' }, match['$month']] } }),
            ...(year && { $expr: { $eq: [{ $year: '$dateOfBirth' }, match['$year']] } }),
          },
        },
      },
    ]);

    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// Filter employees by position (Staff or Manager)
export const filterEmployeesByPosition = async (req, res, next) => {
  try {
    const { position } = req.query;
    if (!position) {
      return res.status(400).json({ message: 'Position query parameter is required' });
    }
    if (!['Staff', 'Manager'].includes(position)) {
      return res.status(400).json({ message: 'Position must be Staff or Manager' });
    }
    const employees = await Employee.find({ position });
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// Filter employees by department
export const filterEmployeesByDepartment = async (req, res, next) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ message: 'Department query parameter is required' });
    }
    const employees = await Employee.find({ department });
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};