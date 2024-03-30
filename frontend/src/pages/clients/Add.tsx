import * as React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import { Container } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { LoadingButton } from "@mui/lab";
import TextField from "@mui/material/TextField";
import axios from "axios";

interface ClientFormState {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

export default function AddNewClient() {
  const [client, setClient] = React.useState<ClientFormState>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [msgError, setMsgError] = React.useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClient({ ...client, [e.target.name]: e.target.value });
    console.log(client);
  };

  const validateFields = () => {
    if (client.first_name === "" || client.first_name.length === 0) {
      setMsgError("First name is required");
      setOpen(true);
      return false;
    } else if (client.last_name === "" || client.last_name.length === 0) {
      setMsgError("Last name is required");
      setOpen(true);
      return false;
    } else if (client.phone_number === "" || client.phone_number.length === 0) {
      setMsgError("Phone number is required");
      setOpen(true);
      return false;
    } else if (client.email === "" || client.email.length === 0) {
      setMsgError("Email is required");
      setOpen(true);
      return false;
    } else {
      setMsgError("");
      setOpen(false);
      return true;
    }
  };

  const handleClick = () => {
    if (validateFields()) {
      const url = "http://127.0.0.1:8000/api/v1/accounts/client/";
      axios
        .post(url, {
          first_name: client.first_name,
          last_name: client.last_name,
          email: client.email,
          phone_number: client.phone_number,
        })
        .then((res) => {
          setOpen(false);
          window.location.href = "/";
        })
        .catch((err) => {
          setOpen(true);

          if (err.response.data["email"]) {
            setMsgError(err.response.data["email"]);
          } else if (err.response.data["first_name"]) {
            setMsgError(err.response.data["first_name"]);
          } else if (err.response.data["last_name"]) {
            setMsgError(err.response.data["last_name"]);
          } else if (err.response.data["phone_number"]) {
            setMsgError(err.response.data["phone_number"]);
          } else {
            setMsgError(err.response.data);
          }
        });
    }
  };

  return (
    <Container>
      <Box sx={{ m: 2 }} />
      <Collapse in={open}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {msgError}
        </Alert>
      </Collapse>
      <Box textAlign="center">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 4, width: "60ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              onChange={handleChange}
              required
              id="firstName"
              name="first_name"
              label="First Name"
              defaultValue=""
            />
            <TextField
              onChange={handleChange}
              required
              id="lastName"
              name="last_name"
              label="Last Name"
              defaultValue=""
            />
          </div>
          <div>
            <TextField
              onChange={handleChange}
              required
              id="phone"
              name="phone_number"
              label="Phone number"
              type="phone"
            />
            <TextField
              onChange={handleChange}
              required
              id="email"
              name="email"
              label="Email"
              type="email"
            />
          </div>
        </Box>
        <LoadingButton
          onClick={handleClick}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          <span>Add</span>
        </LoadingButton>
      </Box>
    </Container>
  );
}
