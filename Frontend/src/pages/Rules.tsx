import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import rulesBg from "../assets/rulesbg.jpg"; // Background image
import scrollBg from "../assets/scroll.png"; // Scroll image

const Rules: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
    sx={{
      backgroundImage: `url(${rulesBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "fixed", // Ensures it stays fixed and covers everything
      top: 0,
      left: 0,
    }}
    >
      {/* Back Icon */}
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Scroll Image with Text Overlay & Animations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Box
          sx={{
            backgroundImage: `url(${scrollBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "80%",
            maxWidth: "600px",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Title (Kept in Original Position) */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              color: "white",
              position: "absolute",
              top: "15%", // Kept intact
            }}
          >
            RULES
          </Typography>

          {/* Rule List with Staggered Animations */}
          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              marginTop: "70px",
              paddingLeft: "30px",
            }}
          >
            {[
              "Players join a queue and wait for their turn.",
              "The first two players in the queue play against each other.",
              "Each game consists of X questions (e.g., 5-10).",
              "Players take turns answering questions, with 30 seconds to answer each.",
              "1 point for each correct answer, 0 points for incorrect answers.",
              "The player with the most points wins.",
              "To participate, players must stay in the queue, canceling removes them.",
              "No cheating, and good sportsmanship is required.",
            ].map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "14px",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "left",
                    pl: 2,
                  }}
                >
                  {index + 1}. {rule}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Rules;
