import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Paper
} from "@mui/material";
import ProjectCard from "../components/ProjectCard";

function Projects() {
  const projects = [
    {
      title: "College Project Development",
      description:
        "Custom mini projects, final year projects, and academic development support for college students.",
      category: "Academic"
    },
    {
      title: "School Project Support",
      description:
        "Innovative school-level project ideas and development support for science fairs and exhibitions.",
      category: "Academic"
    },
    {
      title: "Project Documentation",
      description:
        "Professional project documentation including abstract, modules, UML, report formatting, and final submission files.",
      category: "Documentation"
    },
    {
      title: "Research Paper Assistance",
      description:
        "Support for research paper drafting, formatting, structuring, and presentation-ready academic content.",
      category: "Documentation"
    },
    {
      title: "IoT Project Development",
      description:
        "IoT-based smart systems using sensors, controllers, automation, and real-world implementation ideas.",
      category: "Academic"
    },
    {
      title: "Business Website Development",
      description:
        "Professional websites for startups, local businesses, and service brands with responsive modern design.",
      category: "Business"
    },
    {
      title: "E-commerce Website Development",
      description:
        "Online store websites for food, clothing, products, and digital businesses with custom admin features.",
      category: "Business"
    },
    {
      title: "Portfolio Website Creation",
      description:
        "Personal portfolio websites for students, developers, freelancers, and job seekers with clean branding.",
      category: "Business"
    },
    {
      title: "Custom Freelance Solutions",
      description:
        "Custom websites, dashboards, web apps, and digital solutions tailored to client requirements.",
      category: "Freelance"
    }
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredProjects = projects.filter((project) => {
    return (
      project.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || project.category === category)
    );
  });

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
          Explore Our Services
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "text.secondary",
            maxWidth: "750px",
            mx: "auto",
            mb: 5
          }}
        >
          PROJORA provides academic project support, professional documentation,
          research assistance, and freelance digital solutions for students,
          startups, and businesses.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            mb: 5
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <TextField
              label="Search Services"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 260 } }}
            />

            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Documentation">Documentation</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
            </TextField>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {filteredProjects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProjectCard
                title={project.title}
                description={project.description}
              />
            </Grid>
          ))}
        </Grid>

        {filteredProjects.length === 0 && (
          <Typography
            align="center"
            sx={{ mt: 5, color: "text.secondary", fontWeight: 500 }}
          >
            No services found for your search.
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default Projects;