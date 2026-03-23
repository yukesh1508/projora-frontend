import React from "react";
import { Box, Container, Typography, Grid, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        background: "#0B1C39",
        color: "#fff",
        mt: 10,
        pt: 6,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight="bold">
              PROJORA
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              The Smart Project Marketplace.  
              Build modern websites, apps and digital solutions for businesses.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6">Marketplace</Typography>
            <Link href="#" color="inherit" display="block">Website Projects</Link>
            <Link href="#" color="inherit" display="block">App Development</Link>
            <Link href="#" color="inherit" display="block">E-commerce</Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6">Company</Typography>
            <Link href="#" color="inherit" display="block">About</Link>
            <Link href="#" color="inherit" display="block">Contact</Link>
            <Link href="#" color="inherit" display="block">Privacy Policy</Link>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 5 }}
        >
          © {new Date().getFullYear()} PROJORA. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;