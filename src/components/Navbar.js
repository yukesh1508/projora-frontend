import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import logo from "../assets/logo/projora-logo.png";

const taglines = [
  "the smart project marketplace",
  "build your business online",
  "launch your startup faster",
  "hire developers instantly"
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const adminToken = localStorage.getItem("token");
  const userToken = localStorage.getItem("userToken");

  let user = null;
  try {
    const storedUser = localStorage.getItem("userData");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    user = null;
  }

  const isAdminLoggedIn = !!adminToken;
  const isUserLoggedIn = !!userToken && !!user;

  const publicMenuItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Demo", path: "/demo" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" }
  ];

  const userMenuItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Demo", path: "/demo" },
    { name: "Dashboard", path: "/dashboard" }
  ];

  const adminMenuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Orders", path: "/admin/manage-orders" },
    { name: "Export", path:"/admin/export-orders"}
    
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const currentMenuItems = isAdminLoggedIn
    ? adminMenuItems
    : isUserLoggedIn
    ? userMenuItems
    : publicMenuItems;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "#0B1C39",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
        }}
      >
        <Toolbar>
          <Box
            component="img"
            src={logo}
            alt="PROJORA"
            sx={{ height: 45, mr: 2 }}
          />

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1
              }}
            >
              PROJORA
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#4FD1C5",
                display: "block",
                minHeight: "18px"
              }}
            >
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {taglines[index]}
              </motion.span>
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {currentMenuItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                to={item.path}
                sx={{
                  color: "#fff",
                  ml: 2,
                  fontWeight: 500,
                  "&:hover": { color: "#4FD1C5" }
                }}
              >
                {item.name}
              </Button>
            ))}

            {(isAdminLoggedIn || isUserLoggedIn) && (
              <Button
                onClick={logout}
                sx={{
                  color: "#ff6b6b",
                  ml: 2,
                  fontWeight: 600,
                  "&:hover": { color: "#ff4d4d" }
                }}
              >
                Logout
              </Button>
            )}
          </Box>

          <IconButton
            sx={{ display: { md: "none" }, color: "#fff" }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <List sx={{ width: 220 }}>
          {currentMenuItems.map((item) => (
            <ListItem
              key={item.name}
              component={Link}
              to={item.path}
              onClick={() => setOpen(false)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}

          {(isAdminLoggedIn || isUserLoggedIn) && (
            <ListItem
              onClick={() => {
                setOpen(false);
                logout();
              }}
              sx={{ cursor: "pointer" }}
            >
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: { color: "#ff6b6b", fontWeight: 600 }
                }}
              />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;