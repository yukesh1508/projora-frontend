import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Select,
  MenuItem,
  FormControl,
  Button,
  Stack,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputLabel
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import API_BASE_URL from "../services/api";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const token = localStorage.getItem("token");

  const showNotification = (msg, type = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    showNotification("Session expired. Please login again.", "error");
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

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load orders", "error");
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

  const updateOrderField = (id, field, value) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, [field]: value } : order
      )
    );
  };

  const updateStatus = async (order) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/update-status/${order._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: order.status,
            estimatedCost: order.estimatedCost || "",
            estimatedTimeline: order.estimatedTimeline || "",
            paymentStatus: order.paymentStatus || "Pending",
            paidAmount: order.paidAmount || ""
          })
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      fetchOrders();
      showNotification("Order updated successfully");
    } catch (error) {
      console.error(error);
      showNotification("Failed to update order", "error");
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedOrderId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!selectedOrderId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/delete/${selectedOrderId}`,
        {
          method: "DELETE",
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
        throw new Error("Failed to delete order");
      }

      fetchOrders();
      showNotification("Order deleted successfully");
    } catch (error) {
      console.error(error);
      showNotification("Failed to delete order", "error");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const openWhatsApp = (order) => {
    let phone = (order.phone || "").replace(/[^\d]/g, "");

    if (phone.length === 10) {
      phone = "91" + phone;
    }

    const estimated = Number(String(order.estimatedCost || "").replace(/[^0-9.]/g, "")) || 0;
    const paid = Number(String(order.paidAmount || "").replace(/[^0-9.]/g, "")) || 0;
    const pending = Math.max(estimated - paid, 0);

    const whatsappMessage = `Hello ${order.name},

This is PROJORA Team 🚀

Regarding your project request:

Order ID: ${order._id}
Service: ${order.category}
Status: ${order.status}
Estimated Cost: ${order.estimatedCost || "Will be shared soon"}
Timeline: ${order.estimatedTimeline || "Will be shared soon"}

Payment Status: ${order.paymentStatus || "Pending"}
Paid Amount: ₹${paid}
Pending Amount: ₹${pending}

- PROJORA Team`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(url, "_blank");
  };

  const uploadProject = async (id, file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("project", file);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/upload/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload project");
      }

      fetchOrders();
      showNotification("Project file uploaded successfully");
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to upload project", "error");
    }
  };

  const getStatusColor = (status) => {
    if (status === "Pending") return "warning";
    if (status === "In Progress") return "info";
    if (status === "Completed") return "success";
    return "default";
  };

  const getPaymentColor = (status) => {
    if (status === "Pending") return "warning";
    if (status === "Partial") return "info";
    if (status === "Paid") return "success";
    return "default";
  };

  const categories = useMemo(() => {
    return [...new Set(orders.map((order) => order.category).filter(Boolean))];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.email?.toLowerCase().includes(search.toLowerCase()) ||
        order.category?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "" || order.status === statusFilter;

      const matchesCategory =
        categoryFilter === "" || order.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [orders, search, statusFilter, categoryFilter]);

  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "Pending"
  ).length;
  const inProgressOrders = filteredOrders.filter(
    (order) => order.status === "In Progress"
  ).length;
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "Completed"
  ).length;

  const totalReceived = filteredOrders.reduce((sum, order) => {
    const paid = Number(String(order.paidAmount || "").replace(/[^0-9.]/g, ""));
    return sum + (paid || 0);
  }, 0);

  const totalPending = filteredOrders.reduce((sum, order) => {
    const estimated = Number(String(order.estimatedCost || "").replace(/[^0-9.]/g, "")) || 0;
    const paid = Number(String(order.paidAmount || "").replace(/[^0-9.]/g, "")) || 0;
    return sum + Math.max(estimated - paid, 0);
  }, 0);

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
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Manage Orders
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
            Handle orders, cost, timeline, payment tracking, file delivery, and customer follow-up.
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Orders</Typography>
                <Typography variant="h4" fontWeight="bold">{totalOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Pending</Typography>
                <Typography variant="h4" fontWeight="bold">{pendingOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">In Progress</Typography>
                <Typography variant="h4" fontWeight="bold">{inProgressOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Completed</Typography>
                <Typography variant="h4" fontWeight="bold">{completedOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Received</Typography>
                <Typography variant="h5" fontWeight="bold">₹{totalReceived.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Pending ₹</Typography>
                <Typography variant="h5" fontWeight="bold">₹{totalPending.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              fullWidth
              label="Search by name, email, or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <FilterAltOutlinedIcon sx={{ mr: 1, color: "text.secondary" }} />
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setCategoryFilter("");
              }}
            >
              Reset
            </Button>
          </Stack>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
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
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Estimated Cost</strong></TableCell>
                  <TableCell><strong>Timeline</strong></TableCell>
                  <TableCell><strong>Payment</strong></TableCell>
                  <TableCell><strong>Paid</strong></TableCell>
                  <TableCell><strong>Pending</strong></TableCell>
                  <TableCell><strong>Save</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                  <TableCell><strong>File</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order) => {
                  const estimated = Number(String(order.estimatedCost || "").replace(/[^0-9.]/g, "")) || 0;
                  const paid = Number(String(order.paidAmount || "").replace(/[^0-9.]/g, "")) || 0;
                  const pending = Math.max(estimated - paid, 0);

                  return (
                    <TableRow key={order._id}>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>{order.category}</TableCell>

                      <TableCell sx={{ minWidth: 170 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderField(order._id, "status", e.target.value)
                            }
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                          </Select>
                        </FormControl>

                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          sx={{ mt: 1 }}
                          size="small"
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 150 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="5000"
                          value={order.estimatedCost || ""}
                          onChange={(e) =>
                            updateOrderField(order._id, "estimatedCost", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 150 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="5 days"
                          value={order.estimatedTimeline || ""}
                          onChange={(e) =>
                            updateOrderField(order._id, "estimatedTimeline", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 150 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={order.paymentStatus || "Pending"}
                            onChange={(e) =>
                              updateOrderField(order._id, "paymentStatus", e.target.value)
                            }
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Partial">Partial</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                          </Select>
                        </FormControl>

                        <Chip
                          label={order.paymentStatus || "Pending"}
                          color={getPaymentColor(order.paymentStatus || "Pending")}
                          sx={{ mt: 1 }}
                          size="small"
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 130 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="2000"
                          value={order.paidAmount || ""}
                          onChange={(e) =>
                            updateOrderField(order._id, "paidAmount", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`₹${pending}`}
                          color={pending === 0 ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ background: "#0B1C39" }}
                          onClick={() => updateStatus(order)}
                        >
                          Save
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              background: "#25D366",
                              "&:hover": { background: "#1ebe5b" }
                            }}
                            onClick={() => openWhatsApp(order)}
                          >
                            WhatsApp
                          </Button>

                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(order._id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={1}>
                          {order.projectFile ? (
                            <Chip label="Uploaded" color="success" size="small" />
                          ) : (
                            <Chip label="Not Uploaded" color="default" size="small" />
                          )}

                          <Button variant="outlined" component="label" size="small">
                            Upload
                            <input
                              type="file"
                              hidden
                              onChange={(e) =>
                                uploadProject(order._id, e.target.files[0])
                              }
                            />
                          </Button>

                          {order.projectFile && (
                            <Button
                              variant="text"
                              size="small"
                              href={`${API_BASE_URL}/uploads/${order.projectFile}`}
                              target="_blank"
                            >
                              View
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No orders found for this filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteOrder}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageOrders;