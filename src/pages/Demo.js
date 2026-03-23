import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack
} from "@mui/material";

function Demo() {
  const demoProjects = [
    {
      title: "Automatic Railway Gate Control System",
      category: "IoT Project",
      description:
        "A smart railway gate system using sensors that automatically closes when a train approaches and opens after it passes, improving safety and reducing manual work.",
      video: "/demo/railway-gate.mp4",
      image: "",
      tech: ["Arduino", "Sensors", "IoT"],
      type: "video"
    },
    {
      title: "SeeForMe – AI Vision Assistant",
      category: "AI Project",
      description:
        "An AI-powered system that uses live camera input to detect objects and describe surroundings with Tamil voice output, helping visually impaired users.",
      image: "/demo/seeforme.jpeg",
      video: "",
      tech: ["Computer Vision", "YOLO", "OCR", "TTS"],
      type: "image"
    }
  ];

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
          align="center"
          fontWeight="bold"
          sx={{ color: "#0B1C39", mb: 2 }}
        >
          Demo Works
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "text.secondary",
            maxWidth: "760px",
            mx: "auto",
            mb: 6
          }}
        >
          Explore some of our completed works and demo solutions. These
          projects represent the kind of academic, business, and freelance
          solutions PROJORA can build for clients.
        </Typography>

        <Grid container spacing={4}>
          {demoProjects.map((project, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.12)"
                  }
                }}
              >
                {project.type === "video" && project.video ? (
                  <Box
                    component="video"
                    controls
                    sx={{
                      width: "100%",
                      height: 280,
                      objectFit: "cover",
                      background: "#000"
                    }}
                  >
                    <source src={project.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      background: "#f5f5f5",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={project.image}
                      alt={project.title}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: 420,
                        objectFit: "contain",
                        borderRadius: 2
                      }}
                    />
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {project.title}
                    </Typography>

                    <Chip
                      label={project.category}
                      sx={{
                        background: "#E6F7F5",
                        color: "#0B1C39",
                        fontWeight: 600
                      }}
                    />
                  </Stack>

                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {project.description}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 3, flexWrap: "wrap", rowGap: 1 }}
                  >
                    {project.tech.map((item, i) => (
                      <Chip
                        key={i}
                        label={item}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    ))}
                  </Stack>

                  <Button
                    variant="contained"
                    href="/order"
                    sx={{
                      background: "#0B1C39",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        background: "#132F5B"
                      }
                    }}
                  >
                    Request Similar Project
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            textAlign: "center",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "linear-gradient(135deg,#0B1C39,#132F5B)",
            color: "#fff"
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Need a Similar Solution?
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.82)",
              maxWidth: "700px",
              mx: "auto",
              mb: 3
            }}
          >
            Whether you need an academic project, documentation support, or a
            custom website for your startup, PROJORA can help you build it.
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
              py: 1.2,
              "&:hover": {
                background: "#38B2AC"
              }
            }}
          >
            Start Your Request
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Demo;