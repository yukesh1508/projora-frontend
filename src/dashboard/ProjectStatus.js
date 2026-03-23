import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import API_BASE_URL from "../services/api";

function ProjectStatus() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailParam = params.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
    async (searchEmail) => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/orders/customer/${searchEmail}`,
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
          throw new Error("Failed to fetch project status");
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        showNotification("Failed to load project status", "error");
      } finally {
        setLoading(false);
      }
    },
    [token, handleUnauthorized]
  );

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (emailParam) {
      fetchOrders(emailParam);
    }
  }, [emailParam, token, fetchOrders]);

  const searchOrders = () => {
    if (!email.trim()) return;
    fetchOrders(email);
  };

  const getStatusColor = (status) => {
    if (status === "Pending") return "warning";
    if (status === "In Progress") return "info";
    if (status === "Completed") return "success";
    return "default";
  };

  const getPaymentColor = (status) => {
    if (status === "Paid") return "success";
    if (status === "Partial") return "info";
    if (status === "Pending") return "warning";
    return "default";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#F5F7FB,#E8ECF5)",
        py: 8
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Track Your Project
        </Typography>

        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <TextField
            fullWidth
            label="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ background: "#0B1C39" }}
            onClick={searchOrders}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: "#fff" }} />
                Checking...
              </Box>
            ) : (
              "Check Status"
            )}
          </Button>
        </Paper>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading &&
          orders.map((order) => {
            const estimated =
              Number(String(order.estimatedCost || "").replace(/[^0-9.]/g, "")) || 0;
            const paid =
              Number(String(order.paidAmount || "").replace(/[^0-9.]/g, "")) || 0;
            const pending = Math.max(estimated - paid, 0);

            return (
              <Paper
                key={order._id}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
              >
                <Typography fontWeight="bold">
                  Project: {order.category}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Description: {order.description}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Estimated Cost: {order.estimatedCost || "Not shared yet"}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Timeline: {order.estimatedTimeline || "Not shared yet"}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Payment Status: {order.paymentStatus || "Pending"}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Paid Amount: ₹{paid}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Pending Amount: ₹{pending}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                  />
                  <Chip
                    label={order.paymentStatus || "Pending"}
                    color={getPaymentColor(order.paymentStatus || "Pending")}
                  />
                </Box>

                {order.projectFile && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2, background: "#0B1C39" }}
                    href={`${API_BASE_URL}/uploads/${order.projectFile}`}
                  >
                    Download Project
                  </Button>
                )}
              </Paper>
            );
          })}

        {!loading && orders.length === 0 && email && (
          <Paper
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 4,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
            }}
          >
            <Typography color="text.secondary">
              No projects found for this email.
            </Typography>
          </Paper>
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

export default ProjectStatus;