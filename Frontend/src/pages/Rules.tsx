import React from "react";
import { Box, Typography } from "@mui/material";
import rulesBg from "../assets/rulesbg.jpg"; // Background image
import scrollBg from "../assets/scroll.jpg"; // Scroll image

const Rules: React.FC = () => {
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
      }}
    >
      {/* Scroll Image with Text Overlay */}
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
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "white",
            position: "absolute",
            top: "13%",
          }}
        >
          RULES
        </Typography>

        {/* Rule List */}
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            marginTop: "80px",
            paddingLeft: "30px", // Moves text slightly away from left
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
            <Typography
              key={index}
              variant="body1"
              sx={{
                fontSize: "16px",
                color: "white",
                fontWeight: "bold",
                textAlign: "left",
                pl: 2, // Moves individual lines slightly away from left
              }}
            >
              {index + 1}. {rule}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Rules;
