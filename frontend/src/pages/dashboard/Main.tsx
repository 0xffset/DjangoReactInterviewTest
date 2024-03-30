import * as React from "react";

import { Box, Button, Container } from "@mui/material";

import ListView from "../clients/ListView";

export default function Main() {
  return (
    <Container>
      <Box sx={{ m: 2 }} />
      <Box textAlign="center">
        <Button href="/client/add" variant="contained">
          Add Client
        </Button>
      </Box>
      <Box sx={{ m: 2 }} />
      <ListView />
    </Container>
  );
}
