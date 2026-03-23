import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";

function HeroSection() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg,#0B1C39,#122B5A)",
        color: "white",
        py: { xs: 8, md: 12 }
      }}
    >
      <Container maxWidth="lg">

        <Box
          sx={{
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto"
          }}
        >

          {/* Heading */}

          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "2rem", md: "3rem" }
            }}
          >
            Smart Projects for Students & Businesses
          </Typography>

          {/* Subheading */}

          <Typography
            variant="h6"
            sx={{
              mb: 5,
              color: "#C7D2FE",
              lineHeight: 1.6
            }}
          >
            Get college projects, documentation, research support, and custom
            websites built for you. PROJORA helps you turn ideas into real
            working solutions.
          </Typography>

          {/* Buttons */}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >

            <Button
              variant="contained"
              size="large"
              href="/projects"
              sx={{
                background: "#4FD1C5",
                color: "#0B1C39",
                fontWeight: "bold",
                px: 4,
                textTransform: "none",
                "&:hover": {
                  background: "#38B2AC"
                }
              }}
            >
              Explore Services
            </Button>

            <Button
              variant="outlined"
              size="large"
              href="/order"
              sx={{
                borderColor: "#4FD1C5",
                color: "#4FD1C5",
                fontWeight: "bold",
                px: 4,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#38B2AC",
                  color: "#38B2AC"
                }
              }}
            >
              Request a Quote
            </Button>

          </Box>

        </Box>

      </Container>
    </Box>
  );
}

export default HeroSection;