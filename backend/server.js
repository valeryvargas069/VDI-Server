const express = require("express");
const cors = require("cors");
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED ="0";
const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("vdi_server.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS resultados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    practica TEXT NOT NULL,
    completados INTEGER NOT NULL,
    total INTEGER NOT NULL,
    porcentaje INTEGER NOT NULL
  )
`);
try {
  db.exec(`ALTER TABLE resultados ADD COLUMN correo TEXT`);
} catch (error) {
  // La columna ya existe
}
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    rol TEXT NOT NULL
  )
`);
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de VDI SERVER funcionando correctamente",
    estado: "activo"
  });
});

let resultados = [];

app.post("/resultados", (req, res) => {
  const resultado = req.body;

  const insertar = db.prepare(`
    INSERT INTO resultados
(usuario, correo, practica, completados, total, porcentaje)
VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertar.run(
    resultado.usuario,
    resultado.correo,
    resultado.practica,
    resultado.completados,
    resultado.total,
    resultado.porcentaje
  );

  res.json({
    mensaje: "Resultado guardado correctamente en la base de datos",
    resultado
  });
});

app.get("/resultados", (req, res) => {
  const resultados = db.prepare(
    "SELECT * FROM resultados ORDER BY id DESC"
  ).all();

  res.json(resultados);
});
app.post("/usuarios", (req, res) => {
  const usuario = req.body;

  try {
    const insertar = db.prepare(`
      INSERT INTO usuarios (usuario, correo, rol)
      VALUES (?, ?, ?)
    `);

    insertar.run(
      usuario.usuario,
      usuario.correo,
      usuario.rol
    );

    res.json({
      mensaje: "Usuario guardado correctamente"
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "El correo ya está registrado"
    });
  }
});

app.get("/usuarios", (req, res) => {
  const usuarios = db.prepare(
    "SELECT * FROM usuarios ORDER BY id DESC"
  ).all();

  res.json(usuarios);
});

app.get("/proxmox/estado", async (req, res) => {
  try {
    const respuesta = await fetch(
      `${process.env.PROXMOX_URL}/api2/json/nodes`,
      {
        headers: {
          Authorization: `PVEAPIToken=${process.env.PROXMOX_TOKEN_ID}=${process.env.PROXMOX_TOKEN_SECRET}`
        }
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      return res.status(respuesta.status).json({
        estado: "error",
        datos
      });
    }

    res.json({
      estado: "conectado",
      mensaje: "Conexión con Proxmox VE correcta",
      datos: datos.data
    });
  } catch (error) {
    res.status(500).json({
      estado: "desconectado",
      mensaje: error.message
    });
  }
});
app.get("/proxmox/vms", async (req, res) => {
  try {
    const respuesta = await fetch(
      `${process.env.PROXMOX_URL}/api2/json/nodes/pve/qemu/100/status/current`,
      {
        headers: {
          Authorization: `PVEAPIToken=${process.env.PROXMOX_TOKEN_ID}=${process.env.PROXMOX_TOKEN_SECRET}`
        }
      }
    );

    const datos = await respuesta.json();

    res.status(respuesta.status).json(datos);
  } catch (error) {
    res.status(500).json({
      estado: "error",
      mensaje: error.message
    });
  }
});
app.post("/proxmox/iniciar/:vmid", async (req, res) => {
  try {
    const vmid = req.params.vmid;

    const respuesta = await fetch(
      `${process.env.PROXMOX_URL}/api2/json/nodes/pve/qemu/${vmid}/status/start`,
      {
        method: "POST",
        headers: {
          Authorization: `PVEAPIToken=${process.env.PROXMOX_TOKEN_ID}=${process.env.PROXMOX_TOKEN_SECRET}`
        }
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      return res.status(respuesta.status).json({
        estado: "error",
        datos
      });
    }

    res.json({
      estado: "iniciado",
      mensaje: "Computador virtual iniciado correctamente",
      datos: datos.data
    });
  } catch (error) {
    res.status(500).json({
      estado: "error",
      mensaje: error.message
    });
  }
});
app.post("/proxmox/consola/:vmid", async (req, res) => {
  try {
    const vmid = req.params.vmid;

    const respuesta = await fetch(
      `${process.env.PROXMOX_URL}/api2/json/nodes/pve/qemu/${vmid}/vncproxy`,
      {
        method: "POST",
        headers: {
          Authorization: `PVEAPIToken=${process.env.PROXMOX_TOKEN_ID}=${process.env.PROXMOX_TOKEN_SECRET}`
        }
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      return res.status(respuesta.status).json({
        estado: "error",
        datos
      });
    }

    res.json({
      estado: "consola_lista",
      datos: datos.data
    });
  } catch (error) {
    res.status(500).json({
      estado: "error",
      mensaje: error.message
    });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor VDI SERVER funcionando en el puerto ${PORT}`);
}); 