"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material"
import axios from "axios"

// API URL
const API_URL = "http://localhost:5000/api/employees"

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchType, setSearchType] = useState("name")
  const [searchValue, setSearchValue] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [openDetails, setOpenDetails] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get random color based on name
  const getAvatarColor = (name) => {
    if (!name) return "#757575"
    const colors = [
      "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
      "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
      "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B",
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(API_URL)
      setEmployees(response.data)
    } catch (err) {
      console.error("Failed to fetch employees:", err)
      setError("Failed to fetch employees. Please check your API connection.")
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      fetchEmployees()
      return
    }

    setLoading(true)
    try {
      let response
      switch (searchType) {
        case "name":
          response = await axios.get(`${API_URL}?name=${encodeURIComponent(searchValue)}`)
          break
        case "department":
          response = await axios.get(`${API_URL}?department=${encodeURIComponent(searchValue)}`)
          break
        case "position":
          response = await axios.get(`${API_URL}?position=${encodeURIComponent(searchValue)}`)
          break
        default:
          response = await axios.get(API_URL)
      }
      setEmployees(response.data)
      setError(null)
    } catch (err) {
      console.error(`Failed to search employees by ${searchType}:`, err)
      setError(`Failed to search employees by ${searchType}. Please try again.`)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchValue("")
    fetchEmployees()
  }

  // Handle delete employee
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedEmployee._id}`)
      setEmployees(employees.filter((emp) => emp._id !== selectedEmployee._id))
      setOpenDelete(false)
      setSnackbar({
        open: true,
        message: "Employee deleted successfully",
        severity: "success",
      })
    } catch (err) {
      console.error(`Error deleting employee:`, err)
      setSnackbar({
        open: true,
        message: "Failed to delete employee. Please try again.",
        severity: "error",
      })
    }
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Employee Management
      </Typography>

      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Search By
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                displayEmpty
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="position">Position</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            placeholder={`Search by ${searchType}`}
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            sx={{ flexGrow: 1 }}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{
              bgcolor: "#7c4dff",
              "&:hover": { bgcolor: "#6200ea" },
              borderRadius: 1,
            }}
          >
            SEARCH
          </Button>

          <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearSearch} sx={{ borderRadius: 1 }}>
            CLEAR
          </Button>
        </Box>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Employee List */}
      {!loading && !error && employees.length === 0 && <Alert severity="info">No employees found</Alert>}

      {!loading &&
        employees.map((employee) => (
          <Paper
            key={employee._id}
            sx={{
              mb: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: getAvatarColor(employee.name),
                width: 56,
                height: 56,
                mr: 2,
              }}
            >
              {getInitials(employee.name)}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{employee.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                {employee.position}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedEmployee(employee)
                  setOpenDetails(true)
                }}
                sx={{
                  bgcolor: "#7c4dff",
                  "&:hover": { bgcolor: "#6200ea" },
                  borderRadius: 1,
                }}
              >
                View Details
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  setSelectedEmployee(employee)
                  setOpenEdit(true)
                }}
                sx={{
                  bgcolor: "#2196f3",
                  "&:hover": { bgcolor: "#1976d2" },
                  borderRadius: 1,
                }}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setSelectedEmployee(employee)
                  setOpenDelete(true)
                }}
                sx={{ borderRadius: 1 }}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}

      {/* Employee Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        {selectedEmployee && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(selectedEmployee.name),
                    mr: 2,
                  }}
                >
                  {getInitials(selectedEmployee.name)}
                </Avatar>
                <Typography variant="h6">{selectedEmployee.name}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedEmployee.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{selectedEmployee.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1">{selectedEmployee.department}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Position
                  </Typography>
                  <Typography variant="body1">{selectedEmployee.position}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">{selectedEmployee.gender}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Age
                  </Typography>
                  <Typography variant="body1">{selectedEmployee.age}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">{new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Salary
                  </Typography>
                  <Typography variant="body1">${selectedEmployee.salary.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetails(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Employee Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        {selectedEmployee && (
          <>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Name" fullWidth margin="normal" defaultValue={selectedEmployee.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" fullWidth margin="normal" defaultValue={selectedEmployee.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Phone" fullWidth margin="normal" defaultValue={selectedEmployee.phone} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Department" fullWidth margin="normal" defaultValue={selectedEmployee.department} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Position</InputLabel>
                    <Select defaultValue={selectedEmployee.position} label="Position">
                      <MenuItem value="Staff">Staff</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Director">Director</MenuItem>
                      <MenuItem value="VP">VP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select defaultValue={selectedEmployee.gender} label="Gender">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    margin="normal"
                    defaultValue={new Date(selectedEmployee.dateOfBirth).toISOString().split("T")[0]}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Salary"
                    type="number"
                    fullWidth
                    margin="normal"
                    defaultValue={selectedEmployee.salary}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => {
                  // In a real app, you would update the employee here
                  setOpenEdit(false)
                  setSnackbar({
                    open: true,
                    message: "Employee updated successfully",
                    severity: "success",
                  })
                }}
              >
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EmployeeManagement