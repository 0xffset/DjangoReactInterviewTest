import * as React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Modal } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ListView() {
  const [clientData, setClientData] = React.useState<Client[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [deleteClient, setDeleteClient] = React.useState("");

  const [openAlert, setOpenAlert] = React.useState(false);
  const [msgError, setMsg] = React.useState("");
  const [alertType, setAlertType] = React.useState("success");

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  React.useEffect(() => {
    const url = "http://127.0.0.1:8000/api/v1/accounts/client/all/";

    axios.get(url).then((res) => {
      setClientData(res.data["results"]);
      console.log(res.data["results"]);
    });
  }, []);

  const handleClickDeleteClient = (id: string) => {
    setOpenModal(true);
    setDeleteClient(id);
  };

  const handleClickCancel = () => {
    setOpenModal(false);
    setDeleteClient("");
  };

  const handleClientDeletion = () => {
    const url = `http://127.0.0.1:8000/api/v1/accounts/client/${deleteClient}/`;
    axios
      .delete(url)
      .then((res) => {
        setOpenAlert(true);
        setOpenModal(false);
        setAlertType("success");
        setClientData(clientData.filter((item) => item.id !== deleteClient));
        setDeleteClient("");
        setMsg("The client was deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        setOpenAlert(true);
        setOpenModal(false);

        setAlertType("error");
        setMsg(err);
      });
  };

  return (
    <>
      <Collapse in={openAlert}>
        <Alert
          severity={alertType === "success" ? "success" : "error"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Phone number</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.first_name}
                </TableCell>
                <TableCell align="right">{row.last_name}</TableCell>
                <TableCell align="right">{row.phone_number}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleClickDeleteClient(row.id)}
                    aria-label="delete"
                    size="small"
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton href={`/client/${row.id}`} aria-label="delete" size="small">
                    <ModeIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you do you want to delete the client?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              The client <strong>{deleteClient}</strong> will be deleted
            </Typography>
            <Button onClick={handleClientDeletion}>Delete</Button>
            <Button onClick={handleClickCancel}>Cancel</Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}
