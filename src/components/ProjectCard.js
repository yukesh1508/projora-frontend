import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

function ProjectCard({ title, description }) {
  return (
    <MotionCard
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      sx={{
        borderRadius: 4,
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            minHeight: 60
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{
              color: "#0B1C39"
            }}
          >
            Custom Pricing
          </Typography>

          <Button
            variant="contained"
            href={`/order?category=${encodeURIComponent(title)}`}
            sx={{
              background: "#0B1C39",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "#132F5B"
              }
            }}
          >
            Request Quote
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
}

export default ProjectCard;