"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Wc as GenderIcon,
  Cake as BirthdayIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

// Function to get initials from name
const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Function to get random color based on name
const getAvatarColor = (name) => {
  if (!name) return "#757575";
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
    "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
    "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const InfoRow = ({ label, value }) => (
  <Grid item xs={12}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        py: 1.5,
        px: 1,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 140, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, color: "#333", ml: 2 }}
      >
        {value}
      </Typography>
    </Box>
  </Grid>
);

const EmployeeDetails = ({ open, employee, onClose }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateString) => new Date(dateString).toLocaleString();
  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(employee.name),
              width: 56,
              height: 56,
              fontSize: "1.2rem",
              fontWeight: "bold",
              mr: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {getInitials(employee.name)}
          </Avatar>
          <Typography variant="h5" component="div" color="#333">
            {employee.name}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={0}>
          <InfoRow label="Email" value={employee.email} />
          <InfoRow label="Gender" value={employee.gender} />
          <InfoRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
          <InfoRow label="Phone" value={employee.phone} />
          <InfoRow label="Position" value={employee.position} />
          <InfoRow label="Department" value={employee.department} />
          <InfoRow label="Salary" value={`$${employee.salary?.toLocaleString?.() || employee.salary}`} />
          <InfoRow label="Created At" value={formatDateTime(employee.createdAt)} />
          <InfoRow label="Last Updated" value={formatDateTime(employee.updatedAt)} />
          <InfoRow label="ID" value={employee._id} />
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          sx={{ borderRadius: 20, px: 3 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetails;