import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const [password, setPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("prueba@hotmail.com");
  const [passwordInput, setPasswordInput] = useState("ContraseñaPrueba");
  const [error, setError] = useState(false);
  const authUser = useAuthStore((state) => state);

  const VALUE_EMAIL = "prueba@hotmail.com";
  const VALUE_PASSWORD = "ContraseñaPrueba";
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser.isAuthenticate) {
      navigate("/visor");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput === VALUE_EMAIL && passwordInput === VALUE_PASSWORD) {
      navigate("/visor");
      authUser.logIn();
    } else {
      if (emailInput !== VALUE_EMAIL || passwordInput !== VALUE_PASSWORD) {
        setError(true);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "linear-gradient(to bottom right, #d4d4dc, #a8b6d4, #8499b1)",
        px: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 500,
          height: 450,
          textAlign: "center",
          borderRadius: "15px",
        }}
      >
        <Typography
          fontFamily={"inherit"}
          fontWeight={"bold"}
          variant="h4"
          sx={{ mb: 2 }}
        >
          Login
        </Typography>
        <Typography
          fontFamily={"inherit"}
          variant="body1"
          sx={{ my: 2 }}
          align="justify"
        >
          Please place your account.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            helperText={error ? "Email incorrect" : ""}
            error={error}
            label="Email"
            type="email"
            fullWidth
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            helperText={error ? "Password incorrect" : ""}
            error={error}
            type={password ? "Text" : "Password"}
            value={passwordInput}
            fullWidth
            onChange={(e) => setPasswordInput(e.target.value)}
            required
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setPassword(!password)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {password ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Alert severity="info">
            Credentials: prueba@hotmail.com - ContraseñaPrueba
          </Alert>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              background: "#a8b6d4",
              "&:hover": { bgcolor: "#849ac1" },
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
