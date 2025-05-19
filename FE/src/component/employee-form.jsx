import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from "@mui/material";
import { updateEmployee } from "../services/employeeService";

const defaultForm = {
  name: "",
  email: "",
  position: "Staff",
  department: "",
  salary: "",
  gender: "Male",
  dateOfBirth: "",
  phone: "",
};

const EmployeeForm = ({ open, employee, onClose, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        ...employee,
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split("T")[0] : "",
      });
    } else {
      setForm(defaultForm);
    }
    setError("");
  }, [employee, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Validate basic fields
      if (!form.name || !form.email || !form.department || !form.salary || !form.dateOfBirth || !form.phone) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
      if (employee) {
        // Update
        const updated = await updateEmployee(employee._id, form);
        onSave && onSave(updated);
      } else {
        // Add new (bạn cần tự viết hàm addEmployee nếu muốn hỗ trợ thêm mới)
        setError("Add new employee not implemented in this form.");
      }
    } catch (err) {
      setError(err.message || "Failed to update employee. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{employee ? "Edit Employee" : "Add Employee"}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  name="position"
                  value={form.position}
                  label="Position"
                  onChange={handleChange}
                >
                  <MenuItem value="Staff">Staff</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={form.gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                fullWidth
                required
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                required
                helperText="Format: 0XXXXXXXXX (10 digits starting with 0)"
              />
            </Grid>
          </Grid>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {employee ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
