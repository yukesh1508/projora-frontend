import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import API_BASE_URL from "../services/api";

function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const token = localStorage.getItem("userToken");

  const showNotification = (msg, type = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setMessage("Session expired. Please login again.");
    setSeverity("error");
    setOpen(true);

    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  }, []);

  const fetchOrders = useCallback(
    async (email) => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/orders/customer/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        showNotification("Failed to load your orders", "error");
      } finally {
        setLoading(false);
      }
    },
    [token, handleUnauthorized]
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (!token || !storedUser) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchOrders(parsedUser.email);
  }, [token, fetchOrders]);

  const getStatusColor = (status) => {
    if (status === "Pending") return "warning";
    if (status === "In Progress") return "info";
    if (status === "Completed") return "success";
    return "default";
  };

  const totalProjects = orders.length;
  const pendingProjects = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const inProgressProjects = orders.filter(
    (order) => order.status === "In Progress"
  ).length;
  const completedProjects = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#F5F7FB,#E8ECF5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#F5F7FB,#E8ECF5)",
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 2, color: "#0B1C39" }}
        >
          User Dashboard
        </Typography>

        {user && (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Profile
            </Typography>
            <Typography><strong>Name:</strong> {user.name}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Phone:</strong> {user.phone}</Typography>
          </Paper>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Total Projects</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalProjects}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Pending</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {pendingProjects}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">In Progress</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {inProgressProjects}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Completed</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {completedProjects}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3, color: "#0B1C39" }}
        >
          My Orders
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            overflowX: "auto"
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Estimated Cost</strong></TableCell>
                <TableCell><strong>Timeline</strong></TableCell>
                <TableCell><strong>Payment</strong></TableCell>
                <TableCell><strong>Paid</strong></TableCell>
                <TableCell><strong>Pending</strong></TableCell>
                <TableCell><strong>Track</strong></TableCell>
                <TableCell><strong>Download</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => {
                const estimated = Number(String(order.estimatedCost || "").replace(/[^0-9.]/g, "")) || 0;
                const paid = Number(String(order.paidAmount || "").replace(/[^0-9.]/g, "")) || 0;
                const pending = Math.max(estimated - paid, 0);

                return (
                  <TableRow key={order._id}>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                      />
                    </TableCell>
                    <TableCell>{order.estimatedCost || "Not shared yet"}</TableCell>
                    <TableCell>{order.estimatedTimeline || "Not shared yet"}</TableCell>
                    <TableCell>{order.paymentStatus || "Pending"}</TableCell>
                    <TableCell>₹{paid}</TableCell>
                    <TableCell>₹{pending}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ background: "#0B1C39" }}
                        onClick={() =>
                          window.location.href = `/project-status?email=${order.email}`
                        }
                      >
                        Track
                      </Button>
                    </TableCell>
                    <TableCell>
                      {order.projectFile ? (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ background: "#198754" }}
                          href={`${API_BASE_URL}/uploads/${order.projectFile}`}
                        >
                          Download
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not Ready
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No projects found for this account.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {user && (
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() =>
                window.location.href = `/project-status?email=${user.email}`
              }
            >
              View All Status
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userData");
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          </Stack>
        )}
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpen(false)}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserDashboard;