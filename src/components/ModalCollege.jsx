import { Box, Modal, Typography } from "@mui/material";
import React from "react";

export default function ModalCollege({ open, setOpen, schoolData }) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 2,
          maxWidth: 400,
          width: "100%",
          backgroundColor: "white",
          boxShadow: 15,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxHeight: 400,
            overflowY: "scroll",
          }}
        >
          {schoolData && schoolData.length > 0 ? (
            schoolData.map((colegio, i) => (
              <div key={`${colegio.codigoModular}-${i}`}>
                <Typography
                  id="modal-modal-title"
                  variant="h5"
                  component="h2"
                  fontWeight={"bold"}
                  sx={{ my: 1 }}
                >
                  {schoolData[0].nombre}
                </Typography>
                <Typography variant="body1">
                  <strong>Código Modular:</strong>
                  {colegio.codigoModular}
                </Typography>
                <Typography variant="body1">
                  <strong>Nivel y Modalidad:</strong> {colegio.nivelModalidad}
                </Typography>
                <Typography variant="body1">
                  <strong>Dirección:</strong> {colegio.direccion}
                </Typography>
                <Typography variant="body1">
                  <strong>Departamento:</strong> {colegio.departamento}
                </Typography>
                <Typography variant="body1">
                  <strong>Provincia:</strong> {colegio.provincia}
                </Typography>
                <Typography variant="body1">
                  <strong>Distrito:</strong> {colegio.distrito}
                </Typography>
                <Typography variant="body1">
                  <strong>Centro Poblado:</strong> {colegio.centroPoblado}
                </Typography>
                <Typography variant="body1">
                  <strong>UGEL:</strong> {colegio.ugel}
                </Typography>
                <Typography variant="body1">
                  <strong>Código UGEL:</strong> {colegio.codigoUgel}
                </Typography>
                <Typography variant="body1">
                  <strong>Gestión y Dependencia:</strong>{" "}
                  {colegio.gestionDependencia}
                </Typography>
                <Typography variant="body1">
                  <strong>Ubigeo:</strong> {colegio.ubigeo}
                </Typography>
                <Typography variant="body1">
                  <strong>Altitud:</strong> {colegio.altitud} m
                </Typography>
                <Typography variant="body1">
                  <strong>Latitud:</strong> {colegio.latitud}
                </Typography>
                <Typography variant="body1">
                  <strong>Longitud:</strong> {colegio.longitud}
                </Typography>
                {i < schoolData.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <Typography variant="body1">
              No hay información disponible.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
