import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import API_BASE_URL from "../services/api";

function ExportOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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

  const categories = useMemo(() => {
    return [...new Set(orders.map((order) => order.category).filter(Boolean))];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase();

      const matchesSearch =
        order.name?.toLowerCase().includes(q) ||
        order.email?.toLowerCase().includes(q) ||
        order.category?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "" || order.status === statusFilter;

      const matchesCategory =
        categoryFilter === "" || order.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [orders, search, statusFilter, categoryFilter]);

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      showNotification("No orders available to export", "error");
      return;
    }

    const rows = filteredOrders.map((order) => {
      const estimated =
        Number(String(order.estimatedCost || "").replace(/[^0-9.]/g, "")) || 0;
      const paid =
        Number(String(order.paidAmount || "").replace(/[^0-9.]/g, "")) || 0;
      const pending = Math.max(estimated - paid, 0);

      return {
        OrderID: order._id || "",
        Name: order.name || "",
        Email: order.email || "",
        Phone: order.phone || "",
        Business: order.business || "",
        Category: order.category || "",
        Description: order.description || "",
        Status: order.status || "",
        EstimatedCost: order.estimatedCost || "",
        EstimatedTimeline: order.estimatedTimeline || "",
        PaymentStatus: order.paymentStatus || "Pending",
        PaidAmount: order.paidAmount || "",
        PendingAmount: pending,
        ProjectFile: order.projectFile || "",
        CreatedAt: order.createdAt
          ? new Date(order.createdAt).toLocaleString()
          : ""
      };
    });

    const headers = Object.keys(rows[0]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) =>
            `"${String(row[header] ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `projora-orders-${date}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("CSV exported successfully");
  };

  const totalOrders = filteredOrders.length;

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
            Export Orders
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
            Filter orders and export them as CSV without changing your Manage Orders page.
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography color="text.secondary">Filtered Orders</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalOrders}
                </Typography>
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
              label="Search by name, email, category"
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

            <Button
              variant="contained"
              startIcon={<DownloadOutlinedIcon />}
              onClick={exportToCSV}
              sx={{
                background: "#0B1C39",
                "&:hover": { background: "#132F5B" }
              }}
            >
              Export CSV
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
                  <TableCell><strong>Payment</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.estimatedCost || "Not set"}</TableCell>
                    <TableCell>{order.paymentStatus || "Pending"}</TableCell>
                  </TableRow>
                ))}

                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No orders found for export.
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
    </Box>
  );
}

export default ExportOrders;