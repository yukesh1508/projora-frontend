import React from "react";
import HeroSection from "../components/HeroSection";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from "@mui/material";

function Home() {
  const categories = [
    "College Projects",
    "School Projects",
    "Documentation Writing",
    "Research Paper Support",
    "Startup Website Development",
    "Custom Freelance Services"
  ];

  const featuredServices = [
    {
      name: "College Project Development",
      category: "Academic Services",
      description:
        "Complete development support for mini projects, final year projects, and academic solutions."
    },
    {
      name: "Documentation & Research Support",
      category: "Documentation Services",
      description:
        "Professional project documentation, report writing, formatting, and research paper assistance."
    },
    {
      name: "Business Website Development",
      category: "Freelance Services",
      description:
        "Modern websites for startups, e-commerce brands, portfolio needs, and small businesses."
    }
  ];

  const steps = [
    {
      title: "Submit Your Request",
      description:
        "Tell us what type of project or service you need through the order form."
    },
    {
      title: "Get a Custom Quote",
      description:
        "We review your requirements and share pricing based on your exact needs."
    },
    {
      title: "Project Development",
      description:
        "We build your solution and keep you updated through the dashboard."
    },
    {
      title: "Delivery & Support",
      description:
        "Receive your final project, documents, and files through your account."
    }
  ];

  return (
    <>
      {/* HERO */}
      <HeroSection />

      {/* SERVICE CATEGORIES */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ mb: 2, color: "#0B1C39" }}
          >
            What We Offer
          </Typography>

          <Typography
            align="center"
            sx={{
              color: "text.secondary",
              maxWidth: "750px",
              mx: "auto",
              mb: 6
            }}
          >
            PROJORA helps students, startups, and businesses with academic
            projects, professional documentation, research support, and custom
            digital solutions.
          </Typography>

          <Grid container spacing={3}>
            {categories.map((cat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 3,
                    height: "100%",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "0.3s",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 45px rgba(0,0,0,0.12)"
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {cat}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FEATURED SERVICES */}
      <Box sx={{ background: "#F7FAFC", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ mb: 2, color: "#0B1C39" }}
          >
            Featured Services
          </Typography>

          <Typography
            align="center"
            sx={{
              color: "text.secondary",
              maxWidth: "700px",
              mx: "auto",
              mb: 6
            }}
          >
            We provide quote-based solutions tailored to each requirement
            instead of fixed pricing, so every client gets the right service.
          </Typography>

          <Grid container spacing={4}>
            {featuredServices.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 4,
                    transition: "0.3s",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 45px rgba(0,0,0,0.12)"
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {service.name}
                    </Typography>

                    <Typography
                      sx={{ color: "#0B1C39", fontWeight: 600, mb: 2 }}
                    >
                      {service.category}
                    </Typography>

                    <Typography color="text.secondary">
                      {service.description}
                    </Typography>

                    <Button
                      variant="contained"
                      href="/projects"
                      sx={{
                        mt: 3,
                        background: "#0B1C39",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          background: "#132F5B"
                        }
                      }}
                    >
                      Explore Services
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ mb: 2, color: "#0B1C39" }}
          >
            How PROJORA Works
          </Typography>

          <Typography
            align="center"
            sx={{
              color: "text.secondary",
              maxWidth: "700px",
              mx: "auto",
              mb: 6
            }}
          >
            Our workflow is simple, transparent, and built to make project
            support easy for students, startups, and businesses.
          </Typography>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 4,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{ color: "#0B1C39", mb: 2 }}
                    >
                      0{index + 1}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      {step.title}
                    </Typography>

                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg,#0B1C39,#132F5B)",
          color: "#fff",
          textAlign: "center"
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Ready to Start Your Project?
          </Typography>

          <Typography sx={{ mb: 4, color: "rgba(255,255,255,0.8)" }}>
            Submit your request and get a custom quote based on your exact
            requirement.
          </Typography>

          <Button
            variant="contained"
            href="/order"
            sx={{
              background: "#4FD1C5",
              color: "#0B1C39",
              fontWeight: "bold",
              textTransform: "none",
              px: 4,
              py: 1.4,
              borderRadius: 2,
              "&:hover": {
                background: "#39bfb3"
              }
            }}
          >
            Request a Quote
          </Button>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          background: "#0B1C39",
          color: "white",
          py: 4,
          textAlign: "center"
        }}
      >
        <Typography>
          © 2026 PROJORA — Smart Project & Digital Service Platform
        </Typography>
      </Box>
    </>
  );
}

export default Home;