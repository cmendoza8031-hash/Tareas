import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// REGISTRAR USUARIO
// =====================
app.post("/usuarios", async (req, res) => {
  try {
    const { cedula, nombre, clave } = req.body;

    if (!cedula || !nombre || !clave) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const query = `
      INSERT INTO usuarios (cedula, nombre, clave)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, [cedula, nombre, clave]);
    res.json({ msg: "Usuario registrado", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// CONSULTAR POR ID
// =====================
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// nuevas rutas //

// ==================================
// CONSULTAR TODOS LOS USUARIOS 
// ==================================
app.get("/usuarios", async (req, res) => {
  try {
        // Selecciona ID, cédula y nombre
        const query = "SELECT id, cedula, nombre FROM usuarios ORDER BY id";
        const result = await pool.query(query);

        res.json(result.rows); // Devuelve la lista

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al consultar todos los usuarios: " + error.message });
    }
});


// ====================
// EDITAR USUARIO
// ====================
app.put("/usuarios/:id", async (req, res) => {
  try {
        const { id } = req.params;
        const { nombre, clave } = req.body; 
        
        if (!nombre || !clave) {
            return res.status(400).json({ msg: "Nombre y clave son obligatorios para la actualización" });
        }

        const query = `
            UPDATE usuarios 
            SET nombre = $1, clave = $2 
            WHERE id = $3
            RETURNING id, nombre, cedula;
        `;

        const result = await pool.query(query, [nombre, clave, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado para editar" });
        }
        
        res.json({ msg: "Usuario editado correctamente", data: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al editar el usuario: " + error.message });
    }
});


// ========================
// ELIMINAR USUARIO
// ========================
app.delete("/usuarios/:id", async (req, res) => {
  try {
        const { id } = req.params;

        const query = "DELETE FROM usuarios WHERE id = $1 RETURNING id";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado para eliminar" });
        }
        
        res.json({ msg: `Usuario con ID ${id} eliminado correctamente` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el usuario: " + error.message });
    }
});

// ===================================
//  RUTAS PARA LA TABLA ASIGNATURA 
// ===================================


// ========================
// REGISTRAR ASIGNATURA 
// ========================
app.post("/asignaturas", async (req, res) => {
  try {
        const { codigo, nombre, creditos } = req.body;

        if (!codigo || !nombre) {
            return res.status(400).json({ msg: "Código y nombre son obligatorios para la asignatura" });
        }
        
        const query = `
            INSERT INTO asignatura (codigo, nombre, creditos)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const result = await pool.query(query, [codigo, nombre, creditos]);
        res.json({ msg: "Asignatura registrada", data: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar la asignatura: " + error.message });
    }
});


// ===================================
// CONSULTAR TODAS LAS ASIGNATURAS
// ===================================
app.get("/asignaturas", async (req, res) => {
  try {
        const result = await pool.query("SELECT * FROM asignatura ORDER BY nombre");
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las asignaturas: " + error.message });
    }
});

// SERVIDOR
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));