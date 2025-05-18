import { Box, Avatar, Typography, Button } from "@mui/material";

const EmployeeCard = ({ employee, onViewDetails, onEdit, onDelete }) => {
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
    const colors = ["#4caf50", "#66bb6a"]; // Green shades to match your image
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#fff",
        p: 2,
        borderRadius: 2,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: 80, // Fixed height for consistency
        width: "100%", // Ensure full width
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{
            bgcolor: getAvatarColor(employee.name),
            mr: 2,
            width: 48,
            height: 48,
          }}
        >
          {getInitials(employee.name)}
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {employee.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {employee.position || "USER"}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}> {/* Thêm ml: 2 để hở ra */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => onViewDetails(employee)}
          sx={{ mr: 1, borderRadius: 20 }}
        >
          View Details
        </Button>
        <Button
          variant="contained"
          color="info" // Changed to info for blue color
          onClick={() => onEdit(employee)}
          sx={{ mr: 1, borderRadius: 20 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(employee)}
          sx={{ borderRadius: 20 }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeCard;