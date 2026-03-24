import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../services/api";

function Order() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    category: "",
    description: ""
  });

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category") || "";

    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      category: categoryFromUrl || prev.category
    }));
  }, [navigate, location.search]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSeverity("success");
        setMessage(
          `🎉 Request submitted successfully! Your Order ID: ${data.orderId}. PROJORA team will contact you soon. Cost estimation and timeline will be shared after reviewing your requirements.`
        );
        setOpen(true);

        const params = new URLSearchParams(location.search);
        const categoryFromUrl = params.get("category") || "";

        setFormData({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: "",
          category: categoryFromUrl,
          description: ""
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setSeverity("error");
        setMessage(data.message || "Submission failed");
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSeverity("error");
      setMessage("Server error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#F5F7FB,#E8ECF5)",
        display: "flex",
        alignItems: "center",
        py: 8
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            sx={{ color: "#0B1C39", mb: 1 }}
          >
            {formData.category
              ? `Request for ${formData.category}`
              : "Start Your Project"}
          </Typography>

          <Typography
            align="center"
            sx={{ color: "text.secondary", mb: 4 }}
          >
            Tell us about your project and we will send a custom quote.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3
            }}
          >
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              label="Mobile Number"
              name="phone"
              type="tel"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
            />

            <TextField
              label="Business Name"
              name="business"
              fullWidth
              value={formData.business}
              onChange={handleChange}
            />

            <TextField
              select
              label="Project Category"
              name="category"
              fullWidth
              required
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItem value="College Project Development">
                College Project Development
              </MenuItem>
              <MenuItem value="School Project Support">
                School Project Support
              </MenuItem>
              <MenuItem value="Project Documentation">
                Project Documentation
              </MenuItem>
              <MenuItem value="Research Paper Assistance">
                Research Paper Assistance
              </MenuItem>
              <MenuItem value="IoT Project Development">
                IoT Project Development
              </MenuItem>
              <MenuItem value="Business Website Development">
                Business Website Development
              </MenuItem>
              <MenuItem value="E-commerce Website Development">
                E-commerce Website Development
              </MenuItem>
              <MenuItem value="Portfolio Website Creation">
                Portfolio Website Creation
              </MenuItem>
              <MenuItem value="Custom Freelance Solutions">
                Custom Freelance Solutions
              </MenuItem>
            </TextField>

            <TextField
              label="Project Description"
              name="description"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                background: "#0B1C39",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  background: "#132F5B"
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                  Submitting...
                </Box>
              ) : (
                "Submit Project Request"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={6000}
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

export default Order;