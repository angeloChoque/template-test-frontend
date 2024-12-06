import React from "react";
import { Route, Routes } from "react-router";
import Login from "./pages/Login.jsx";
import Map from "./pages/Map.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Map />} />
      </Routes>
    </>
  );
}