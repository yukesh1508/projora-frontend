import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Link } from "react-router-dom";
import API_BASE_URL from "../services/api";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const token = localStorage.getItem("token");

  const showNotification = (msg, type = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    setMessage("Session expired. Please login again.");
    setSeverity("error");
    setOpen(true);

    setTimeout(() => {
      window.location.href = "/admin-login";
    }, 1200);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to load orders");
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Invalid server response");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard error:", error);
      setOrders([]);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [token, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin-login";
      return;
    }

    fetchOrders();
  }, [token, fetchOrders]);

  const totalOrders = Array.isArray(orders) ? orders.length : 0;
  const pendingOrders = Array.isArray(orders)
    ? orders.filter((order) => order.status === "Pending").length
    : 0;
  const inProgressOrders = Array.isArray(orders)
    ? orders.filter((order) => order.status === "In Progress").length
    : 0;
  const completedOrders = Array.isArray(orders)
    ? orders.filter((order) => order.status === "Completed").length
    : 0;

  const totalCustomers = new Set(
    orders.map((order) => order.email?.toLowerCase()).filter(Boolean)
  ).size;

  const totalEstimatedRevenue = orders.reduce((sum, order) => {
    const value = String(order.estimatedCost || "").replace(/[^0-9.]/g, "");
    return sum + (Number(value) || 0);
  }, 0);

  const recentOrders = [...orders].slice(0, 5);
  
  const categoryCounts = orders.reduce((acc, order) => {
    const key = order.category || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const customersOverview = useMemo(() => {
    const grouped = {};

    orders.forEach((order) => {
      const email = order.email?.toLowerCase();
      if (!email) return;

      if (!grouped[email]) {
        grouped[email] = {
          name: order.name,
          email: order.email,
          phone: order.phone,
          ordersCount: 0,
          totalQuoted: 0,
          latestStatus: order.status
        };
      }

      grouped[email].ordersCount += 1;
      const value = String(order.estimatedCost || "").replace(/[^0-9.]/g, "");
      grouped[email].totalQuoted += Number(value) || 0;

      grouped[email].latestStatus = order.status;
    });

    return Object.values(grouped)
      .sort((a, b) => b.ordersCount - a.ordersCount)
      .slice(0, 5);
  }, [orders]);

  const getStatusColor = (status) => {
    if (status === "Pending") return "warning";
    if (status === "In Progress") return "info";
    if (status === "Completed") return "success";
    return "default";
  };

  const openWhatsApp = (customer) => {
    let phone = (customer.phone || "").replace(/[^\d]/g, "");

    if (phone.length === 10) {
      phone = "91" + phone;
    }

    const msg = `Hello ${customer.name},

This is PROJORA Team.

We are reaching out regarding your project requests with us.

Total Projects: ${customer.ordersCount}
Latest Status: ${customer.latestStatus}
Total Quoted Value: ₹${customer.totalQuoted.toLocaleString()}

Feel free to contact us for any update.

- PROJORA Team`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const StatCard = ({ title, value, icon, subtext }) => (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        height: "100%"
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {subtext && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtext}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(11,28,57,0.08)",
              color: "#0B1C39"
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

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
      <Container maxWidth="xl">
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg,#0B1C39,#132F5B)",
            color: "#fff",
            boxShadow: "0 12px 35px rgba(0,0,0,0.15)"
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Super Admin Dashboard
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
                Manage PROJORA orders, pricing, timelines, customers, and project delivery from one place.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent={{ md: "flex-end" }}
              >
                <Button
                  component={Link}
                  to="/admin/manage-orders"
                  variant="contained"
                  sx={{
                    background: "#4FD1C5",
                    color: "#0B1C39",
                    fontWeight: "bold",
                    "&:hover": {
                      background: "#38B2AC"
                    }
                  }}
                >
                  Manage Orders
                </Button>

                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "#fff",
                    "&:hover": {
                      borderColor: "#fff"
                    }
                  }}
                >
                  View Site
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={totalOrders}
              icon={<ReceiptLongOutlinedIcon />}
              subtext="All client requests"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={pendingOrders}
              icon={<PendingActionsOutlinedIcon />}
              subtext="Waiting for review"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              value={inProgressOrders}
              icon={<EngineeringOutlinedIcon />}
              subtext="Currently active"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={completedOrders}
              icon={<CheckCircleOutlineOutlinedIcon />}
              subtext="Delivered projects"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Estimated Revenue"
              value={`₹${totalEstimatedRevenue.toLocaleString()}`}
              icon={<CurrencyRupeeOutlinedIcon />}
              subtext="Based on quoted projects"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Customers"
              value={totalCustomers}
              icon={<GroupsOutlinedIcon />}
              subtext="Unique client accounts"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              title="Completion Rate"
              value={
                totalOrders > 0
                  ? `${Math.round((completedOrders / totalOrders) * 100)}%`
                  : "0%"
              }
              icon={<TrendingUpOutlinedIcon />}
              subtext="Completed vs total orders"
            />
            
          </Grid>

        </Grid>
        

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders
                </Typography>

                <Button
                  component={Link}
                  to="/admin/manage-orders"
                  variant="text"
                  sx={{ color: "#0B1C39", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Customer</strong></TableCell>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Cost</strong></TableCell>
                      <TableCell><strong>Timeline</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <Typography fontWeight={600}>{order.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.email}
                            </Typography>
                          </TableCell>
                          <TableCell>{order.category}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{order.estimatedCost || "Not set"}</TableCell>
                          <TableCell>{order.estimatedTimeline || "Not set"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No recent orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>

                <Stack spacing={2}>
                  <Button
                    component={Link}
                    to="/admin/manage-orders"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: "#0B1C39",
                      "&:hover": { background: "#132F5B" }
                    }}
                  >
                    Open Order Manager
                  </Button>

                  <Button
                    component={Link}
                    to="/admin/manage-orders"
                    variant="outlined"
                    fullWidth
                  >
                    Update Cost & Timeline
                  </Button>
                  <Button
                    component={Link}
                    to="/admin/manage-orders"
                    variant="outlined"
                    fullWidth
                  >
                    Upload Client Files
                  </Button>
                </Stack>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Top Categories
                </Typography>

                <Stack spacing={1.5}>
                  {topCategories.length > 0 ? (
                    topCategories.map(([category, count]) => (
                      <Box
                        key={category}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1.5,
                          borderRadius: 2,
                          background: "#F8FAFC"
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {category}
                        </Typography>
                        <Chip
                          label={`${count} orders`}
                          size="small"
                          sx={{
                            background: "rgba(11,28,57,0.08)",
                            color: "#0B1C39",
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      No category data available.
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Customers Overview
            </Typography>

            <Chip
              label={`${customersOverview.length} top customers`}
              sx={{
                background: "rgba(11,28,57,0.08)",
                color: "#0B1C39",
                fontWeight: 600
              }}
            />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Total Orders</strong></TableCell>
                  <TableCell><strong>Total Quoted</strong></TableCell>
                  <TableCell><strong>Latest Status</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customersOverview.length > 0 ? (
                  customersOverview.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.ordersCount}</TableCell>
                      <TableCell>₹{customer.totalQuoted.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={customer.latestStatus}
                          color={getStatusColor(customer.latestStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            background: "#25D366",
                            "&:hover": { background: "#1ebe5b" }
                          }}
                          onClick={() => openWhatsApp(customer)}
                        >
                          WhatsApp
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No customer overview available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={severity} variant="filled" onClose={() => setOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;