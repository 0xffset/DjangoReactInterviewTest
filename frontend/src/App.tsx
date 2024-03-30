import "./App.css";

import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AddNewClient from "./pages/clients/Add";
import Main from "./pages/dashboard/Main";
import UpdateClient from "./pages/clients/Update";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/client/add" element={<AddNewClient/>} />
          <Route path="/client/:id" element={<UpdateClient/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
