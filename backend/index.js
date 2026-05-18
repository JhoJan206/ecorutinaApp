/*
11/04/2026 - Actualizado 18/05/2026

Correr el servidor
Registro de usuarios de EcoRutina con password hasheado
Validación de usuarios existentes e insertación de usuarios nuevos.

- JuanMoreno
*/

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import bd from "./bd.js";

const app = express();

app.use(cors());
app.use(express.json());

//health check
app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.listen(3000, () => {
    console.log("Server corriendo en http://localhost:3000")
})

//REGISTRO - con password hasheado
app.post("/registro", async (req, res) => {
    const {correo, password, usuario} = req.body;

    if(!correo || !password || !usuario){
        return res.status(400).json({mensaje: "Datos incompletos"});
    }

    //Verificar si el usuario ya existe
    const checkQuery = "SELECT id FROM usuarios WHERE correo = ?";

    bd.query(checkQuery, [correo], async (err, result) => {
        if(err) return res.status(500).json({mensaje: "Error en el servidor"});
        if(result.length > 0) return res.status(400).json({mensaje: "Usuario ya existente"});

        //Hashear password antes de guardar
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //Insertar usuario con password hasheado
        const insertQuery = "INSERT INTO usuarios (correo, password, nombre, fechaRegistro) VALUES (?, ?, ?, NOW())";

        bd.query(insertQuery, [correo, passwordHash, usuario], (err, result) => {
            if(err){
                console.error("Error al insertar:", err);
                return res.status(500).json({mensaje: "Error al registrar"});
            }
            res.json({mensaje: "Usuario registrado correctamente"});
        });
    });
});

//LOGIN - comparar password con hash
app.post("/login", (req, res) => {
    const {correo, password} = req.body;

    if(!correo || !password) return res.status(400).json({mensaje: "Datos invalidos"});

    //Buscar usuario por correo (sin comparar password en SQL)
    const query = "SELECT id, nombre, correo, password, fechaRegistro FROM usuarios WHERE correo = ?";

    bd.query(query, [correo], async (err, result) => {
        if(err){
            console.error("Error al iniciar sesión:", err);
            return res.status(500).json({mensaje: "Error en el servidor"});
        }

        if(result.length === 0) {
            return res.status(401).json({mensaje: "Correo o contraseña incorrectos"});
        }

        //Comparar password ingresada con el hash almacenado
        const passwordValido = await bcrypt.compare(password, result[0].password);

        if(!passwordValido) {
            return res.status(401).json({mensaje: "Correo o contraseña incorrectos"});
        }

        console.log("Usuario encontrado:", result[0].nombre);
        res.json({
            mensaje: "Login exitoso",
            usuario: result[0].nombre,
            fechaRegistro: result[0].fechaRegistro,
            id: result[0].id
        });
    });
});

//ACTUALIZAR perfil
app.put("/actualizarUsuario", (req, res) => {
    const {correo, nuevoNombre, nuevoCorreo} = req.body;

    if(!correo || !nuevoNombre || !nuevoCorreo) {
        return res.status(400).json({mensaje: "Datos incompletos"});
    }

    const query = "UPDATE usuarios SET nombre = ?, correo = ? WHERE correo = ?";

    bd.query(query, [nuevoNombre, nuevoCorreo, correo], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json({mensaje: "Error al actualizar"});
        }
        if(result.affectedRows === 0) {
            return res.status(404).json({mensaje: "Usuario no encontrado"});
        }
        res.json({mensaje: "Perfil actualizado correctamente"});
    });
});

//OBTENER STATS del usuario
app.get("/stats/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT racha, ecoPuntos, nivel FROM usuarios WHERE id = ?";

    bd.query(query, [userId], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener stats"});
        }
        if(result.length === 0) {
            return res.status(404).json({mensaje: "Usuario no encontrado"});
        }
        res.json(result[0]);
    });
});

//OBTENER hábitos por categoría (para Home)
app.get("/habitos", (req, res) => {
    const query = `
        SELECT h.id, h.nombre, h.descripcion, h.puntos, c.nombre as categoria, c.icono
        FROM habitos h
        JOIN categorias c ON h.categoria_id = c.id
        ORDER BY c.id, h.id
    `;

    bd.query(query, (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener hábitos"});
        }
        res.json(result);
    });
});

//OBTENER progreso del usuario HOY
app.get("/progreso/:userId", (req, res) => {
    const userId = req.params.userId;
    const hoy = new Date().toISOString().split('T')[0];

    const query = `
        SELECT p.habit_id, p.completado, h.nombre, h.categoria_id, c.nombre as categoria
        FROM progreso p
        JOIN habitos h ON p.habit_id = h.id
        JOIN categorias c ON h.categoria_id = c.id
        WHERE p.usuario_id = ? AND p.fecha = ?
    `;

    bd.query(query, [userId, hoy], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener progreso"});
        }
        res.json(result);
    });
});

//COMPLETAR un hábito (marcar como hecho)
app.post("/completarHabito", (req, res) => {
    const { usuarioId, habitId } = req.body;
    const hoy = new Date().toISOString().split('T')[0];

    if(!usuarioId || !habitId) {
        return res.status(400).json({mensaje: "Datos incompletos"});
    }

    //Verificar si ya está completado hoy
    const checkQuery = "SELECT id FROM progreso WHERE usuario_id = ? AND habit_id = ? AND fecha = ?";

    bd.query(checkQuery, [usuarioId, habitId, hoy], async (err, result) => {
        if(err) return res.status(500).json({mensaje: "Error en el servidor"});

        if(result.length > 0) {
            return res.status(400).json({mensaje: "Habito ya completado hoy"});
        }

        //Insertar progreso
        const insertQuery = "INSERT INTO progreso (usuario_id, habit_id, fecha, completado) VALUES (?, ?, ?, TRUE)";

        bd.query(insertQuery, [usuarioId, habitId, hoy], async (err, result) => {
            if(err) {
                console.error(err);
                return res.status(500).json({mensaje: "Error al completar hábito"});
            }

            //Obtener puntos del hábito y sumarlos al usuario
            const getPuntos = "SELECT puntos FROM habitos WHERE id = ?";
            bd.query(getPuntos, [habitId], (err, habito) => {
                if(err || habito.length === 0) return;

                const puntos = habito[0].puntos;

                //Actualizar ecoPuntos del usuario
                const updatePuntos = "UPDATE usuarios SET ecoPuntos = ecoPuntos + ? WHERE id = ?";
                bd.query(updatePuntos, [puntos, usuarioId], (err, result) => {
                    if(err) {
                        console.error(err);
                        return res.status(500).json({mensaje: "Error al sumar puntos"});
                    }
                    res.json({mensaje: "Hábito completado", puntosGanados: puntos});
                });
            });
        });
    });
});
