import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Button, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, MenuItem, Select,
  FormControl, InputLabel, Grid, Chip, CircularProgress, Alert,
  Snackbar, Container
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import EmployeeDetails from "./employee-details";
import EmployeeForm from "./employee-form";
import EmployeeCard from "./employee-card";

const API_URL = "/api/employees";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees with optional query
  const fetchEmployees = async (endpoint = API_URL, queryParams = {}) => {
    setLoading(true);
    try {
      let url = endpoint;
      const params = new URLSearchParams(queryParams).toString();
      if (params) url += `?${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search/filter
  const handleSearch = () => {
    if (!searchValue.trim()) {
      fetchEmployees();
      setActiveFilter(null);
      return;
    }

    let endpoint = API_URL;
    let queryParams = {};

    switch (searchType) {
      case "name":
        endpoint = `${API_URL}/search/name`;
        queryParams = { name: searchValue.trim() };
        break;
      case "department":
        endpoint = `${API_URL}/filter/department`;
        queryParams = { department: searchValue.trim() };
        break;
      case "position":
        endpoint = `${API_URL}/filter/position`;
        queryParams = { position: searchValue.trim() };
        break;
      default:
        fetchEmployees();
        return;
    }

    fetchEmployees(endpoint, queryParams)
      .then(() => setActiveFilter({ type: searchType, value: searchValue.trim() }))
      .catch((err) => {
        setError("Failed to fetch employees with the search criteria.");
        setEmployees([]);
        setActiveFilter(null);
      });
  };

  // Clear search/filter
  const clearSearch = () => {
    setSearchValue("");
    fetchEmployees();
    setActiveFilter(null);
  };

  // Handle view details
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setOpenDetails(true);
  };

  // Handle edit
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenEdit(true);
  };

  // Handle delete confirmation dialog
  const handleDeleteConfirm = (employee) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

  // Handle delete employee
  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/${selectedEmployee._id}`, { method: "DELETE" });
      setEmployees(employees.filter((emp) => emp._id !== selectedEmployee._id));
      setOpenDelete(false);
      setSnackbar({
        open: true,
        message: "Employee deleted successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete employee",
        severity: "error",
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container
      maxWidth={false} // Remove width limit to span full page
      sx={{
        py: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        sx={{ mb: 4, color: "#333", pl: 2 }}
      >
        User Management
      </Typography>

      {/* Search/Filter Section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="search-type-label">Search By</InputLabel>
              <Select
                labelId="search-type-label"
                value={searchType}
                label="Search By"
                onChange={(e) => setSearchType(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="position">Position</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label={`Search by ${searchType}`}
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </Grid>
          <Grid item xs={6} sm={1.5}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{ borderRadius: 20 }}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={6} sm={1.5}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearSearch}
              sx={{ borderRadius: 20 }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {activeFilter && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Filter: ${activeFilter.type} = ${activeFilter.value}`}
              onDelete={clearSearch}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Paper>

      {/* User Cards */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          p: 3,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : employees.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No users found
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ width: "100%" }}>
            {employees.map((employee, index) => (
              <Grid item xs={12} sm={6} key={employee._id}>
                <EmployeeCard
                  employee={employee}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Employee Details Dialog */}
      {selectedEmployee && (
        <EmployeeDetails
          open={openDetails}
          employee={selectedEmployee}
          onClose={() => setOpenDetails(false)}
        />
      )}

      {/* Employee Edit Dialog */}
      {selectedEmployee && (
        <EmployeeForm
          open={openEdit}
          employee={selectedEmployee}
          onClose={() => setOpenEdit(false)}
          onSave={(updatedEmployee) => {
            setEmployees(
              employees.map((emp) =>
                emp._id === updatedEmployee._id ? updatedEmployee : emp
              )
            );
            setOpenEdit(false);
            setSnackbar({
              open: true,
              message: "Employee updated successfully",
              severity: "success",
            });
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedEmployee?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeList;