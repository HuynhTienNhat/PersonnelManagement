import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Button, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, MenuItem, Select,
  FormControl, InputLabel, Grid, Chip, CircularProgress, Alert,
  Snackbar, Container, IconButton, Avatar
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon, Info, Edit, Delete } from "@mui/icons-material";
import EmployeeDetails from "./employee-details";
import EmployeeForm from "./employee-form";

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

  const fetchEmployees = async (endpoint = API_URL, queryParams = {}) => {
    setLoading(true);
    try {
      let url = endpoint;
      const params = new URLSearchParams(queryParams).toString();
      if (params) url += `?${params}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch employees: ${res.status} ${res.statusText} - ${errorText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format: " + JSON.stringify(data));
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setEmployees([]);
      // Log lỗi ra console để dễ debug
      console.error("Fetch employees error:", err);
    } finally {
      setLoading(false);
    }
  };

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
      .catch(() => {
        setError("Failed to fetch employees with the search criteria.");
        setEmployees([]);
        setActiveFilter(null);
      });
  };

  const clearSearch = () => {
    setSearchValue("");
    fetchEmployees();
    setActiveFilter(null);
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setOpenDetails(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenEdit(true);
  };

  const handleDeleteConfirm = (employee) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = ["#4caf50", "#66bb6a", "#81c784", "#a5d6a7"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      m: 0,
      p: 0,
      bgcolor: '#f8f9fa'
    }}>
      {/* App Bar */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 2,
        boxShadow: 3
      }}>
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} sx={{
        flex: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 'none'
      }}>
        {/* Search Section */}
        <Paper elevation={3} sx={{
          p: 3,
          borderRadius: 2,
          width: '100%'
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="medium">
                <InputLabel>Search By</InputLabel>
                <Select
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Search by ${searchType}`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                size="large"
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={6} md={1}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<ClearIcon />}
                onClick={clearSearch}
                size="large"
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Employee List Section */}
        <Paper elevation={3} sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          width: '100%',
          minHeight: '60vh',
          overflow: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={80} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
          ) : employees.length === 0 ? (
            <Alert severity="info" sx={{ m: 2 }}>No employees found</Alert>
          ) : (
            <Box sx={{
              height: '100%',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '10px' },
              '&::-webkit-scrollbar-thumb': { 
                backgroundColor: 'primary.main', 
                borderRadius: '5px' 
              }
            }}>
              <Grid container spacing={3}>
                {employees.map((employee) => (
                  <Grid item xs={12} md={6} key={employee._id} sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                    <Paper sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      p: 3,
                      width: { xs: '100%', md: '99%' }, // tăng width lên 99% trên desktop
                      minWidth: 0,
                      maxWidth: 'none',
                      minHeight: 100,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-3px)', 
                        boxShadow: 4 
                      }
                    }}>
                      {/* Avatar và thông tin */}
                      <Avatar sx={{
                        bgcolor: getAvatarColor(employee.name),
                        width: 56,
                        height: 56,
                        mr: 2,
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}>
                        {getInitials(employee.name)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {employee.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" noWrap>
                          {employee.position}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleViewDetails(employee)}
                          sx={{ minWidth: 120, bgcolor: '#7c4dff' }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(employee)}
                          sx={{ minWidth: 100 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteConfirm(employee)}
                          sx={{ minWidth: 100 }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Modals và Snackbar (giữ nguyên) */}
      <EmployeeDetails 
        open={openDetails} 
        employee={selectedEmployee} 
        onClose={() => setOpenDetails(false)} 
      />

      <EmployeeForm
        open={openEdit}
        employee={selectedEmployee}
        onClose={() => setOpenEdit(false)}
        onSave={(updatedEmployee) => {
          setEmployees(employees.map((emp) => 
            emp._id === updatedEmployee._id ? updatedEmployee : emp
          ));
          setOpenEdit(false);
          setSnackbar({
            open: true,
            message: "Employee updated successfully",
            severity: "success",
          });
        }}
      />

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeList;