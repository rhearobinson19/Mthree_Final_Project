import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import registerImage from "../assets/register.jpg";

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/register", formData);
      setSuccessMessage(response.data.message);
      setFormData({ username: "", email: "", password: "" });

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login"); // Navigate to the login page
      }, 1000); // Delay for 2 seconds to show success message
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response ? err.response.data.error : "Failed to register. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${registerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: "30px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "2rem",
          color: "white",
          width: "350px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6)",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px", fontFamily: "serif" }}>
          Sign Up
        </Typography>

        {error && <Typography sx={{ color: "red", marginBottom: "10px" }}>{error}</Typography>}
        {successMessage && <Typography sx={{ color: "green", marginBottom: "10px" }}>{successMessage}</Typography>}

        <Typography sx={styles.label}>Username</Typography>
        <TextField
          name="username"
          variant="outlined"
          fullWidth
          placeholder="Enter username"
          sx={styles.input}
          value={formData.username}
          onChange={handleChange}
        />

        <Typography sx={styles.label}>Email</Typography>
        <TextField
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          placeholder="Enter email"
          sx={styles.input}
          value={formData.email}
          onChange={handleChange}
        />

        <Typography sx={styles.label}>Password</Typography>
        <TextField
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          placeholder="Enter password"
          sx={styles.input}
          value={formData.password}
          onChange={handleChange}
        />

        <Button variant="contained" sx={styles.submitButton} onClick={handleSubmit}>
          Submit
        </Button>

        <Typography sx={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.loginLink}>
            Login
          </Link>
        </Typography>

        <Button component={Link} to="/" variant="contained" sx={styles.submitButton}>
          Move to Home Page
        </Button>
      </Box>
    </Box>
  );
};

const styles = {
  label: {
    alignSelf: "flex-start",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  input: {
    marginTop: "5px",
    background: "white",
    borderRadius: "5px",
    "& .MuiOutlinedInput-root": {
      height: "40px",
      fontSize: "14px",
      "& input": {
        padding: "8px",
      },
    },
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    background: "#3B3FCB",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
      background: "#3038a5",
    },
  },
  loginText: {
    marginTop: "15px",
    fontSize: "16px",
  },
  loginLink: {
    color: "#3B3FCB",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Registration;
