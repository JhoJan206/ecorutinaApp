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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`);
})

//REGISTRO - con password hasheado
app.post("/registro", async (req, res) => {
    const {correo, password, usuario} = req.body;

    if(!correo || !password || !usuario){
        return res.status(400).json({mensaje: "Todos los campos son obligatorios"});
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(correo)) {
        return res.status(400).json({mensaje: "El formato del email es inválido"});
    }

    // Validación de contraseña mínima
    if(password.length < 6) {
        return res.status(400).json({mensaje: "La contraseña debe tener al menos 6 caracteres"});
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
            res.json({
                mensaje: "Usuario registrado correctamente",
                id: result.insertId,
                usuario: usuario
            });
        });
    });
});

//LOGIN - comparar password con hash
app.post("/login", (req, res) => {
    const {correo, password} = req.body;

    if(!correo || !password) return res.status(400).json({mensaje: "Datos inválidos"});

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
    const {correo, nuevoNombre, nuevoCorreo, nuevaMotivacion} = req.body;

    if(!correo || !nuevoNombre || !nuevoCorreo) {
        return res.status(400).json({mensaje: "Datos incompletos"});
    }

    const query = "UPDATE usuarios SET nombre = ?, correo = ?, motivacion = ? WHERE correo = ?";

    bd.query(query, [nuevoNombre, nuevoCorreo, nuevaMotivacion || 'Cuidar el planeta', correo], (err, result) => {
        if(err){
            if(err.errno === 1062) {
                return res.status(409).json({mensaje: "Ese correo ya está registrado"});
            }
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
    const hoy = getFechaColombia();
    const ayer = getFechaColombia(-1);

    const query = "SELECT racha, ecoPuntos, nivel, fecha_ultima_racha, motivacion FROM usuarios WHERE id = ?";

    bd.query(query, [userId], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener stats"});
        }
        if(result.length === 0) {
            return res.status(404).json({mensaje: "Usuario no encontrado"});
        }

        const usuario = result[0];

        //Recalcular nivel según puntos acumulados (red de seguridad)
        const nivelEsperado = nivelDesdePuntos(usuario.ecoPuntos);
        if (nivelEsperado > usuario.nivel) {
            const updateNivel = "UPDATE usuarios SET nivel = ? WHERE id = ?";
            bd.query(updateNivel, [nivelEsperado, userId], (err) => {
                if (!err) usuario.nivel = nivelEsperado;
                enviarStats(usuario, userId, hoy, ayer, res);
            });
        } else {
            enviarStats(usuario, userId, hoy, ayer, res);
        }
    });
});

const enviarStats = (usuario, userId, hoy, ayer, res) => {
    //Auto-reset: si la última actividad fue antes de ayer, la racha se perdió
    if (usuario.fecha_ultima_racha && usuario.fecha_ultima_racha < ayer) {
        const resetQuery = "UPDATE usuarios SET racha = 0, fecha_ultima_racha = ? WHERE id = ? AND fecha_ultima_racha < ?";
        bd.query(resetQuery, [hoy, userId, ayer], (err) => {
            if (!err) {
                usuario.racha = 0;
            }
            res.json({ racha: 0, ecoPuntos: usuario.ecoPuntos, nivel: usuario.nivel, motivacion: usuario.motivacion });
        });
    } else {
        res.json({ racha: usuario.racha, ecoPuntos: usuario.ecoPuntos, nivel: usuario.nivel, motivacion: usuario.motivacion });
    }
};

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

//OBTENER hábitos según nivel del usuario
app.get("/habitos/:nivel", (req, res) => {
    const nivel = parseInt(req.params.nivel);
    
    let nivelesIncluir = [1];
    if(nivel >= 5 && nivel <= 9) {
        nivelesIncluir = [1, 2];
    } else if(nivel >= 10) {
        nivelesIncluir = [1, 2, 3];
    }

    const query = `
        SELECT h.id, h.nombre, h.descripcion, h.puntos, c.nombre as categoria, c.icono, h.nivel
        FROM habitos h
        JOIN categorias c ON h.categoria_id = c.id
        WHERE h.nivel IN (?)
        ORDER BY c.id, h.nivel, h.id
    `;

    bd.query(query, [nivelesIncluir], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener hábitos"});
        }

        const categoriasAgrupadas = {};
        result.forEach(habito => {
            if(!categoriasAgrupadas[habito.categoria]) {
                categoriasAgrupadas[habito.categoria] = {
                    nombre: habito.categoria,
                    icono: habito.icono,
                    habitos: []
                };
            }
            categoriasAgrupadas[habito.categoria].habitos.push({
                id: habito.id,
                nombre: habito.nombre,
                descripcion: habito.descripcion,
                puntos: habito.puntos,
                categoria: habito.categoria,
                icono: habito.icono
            });
        });

        res.json(Object.values(categoriasAgrupadas));
    });
});

//OBTENER progreso del usuario HOY
app.get("/progreso/:userId", (req, res) => {
    const userId = req.params.userId;
    const hoy = getFechaColombia();

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
    const hoy = getFechaColombia();

    if(!usuarioId || !habitId) {
        return res.status(400).json({mensaje: "Datos incompletos"});
    }

    //Verificar si ya está completado hoy
    const checkQuery = "SELECT id FROM progreso WHERE usuario_id = ? AND habit_id = ? AND fecha = ?";

    bd.query(checkQuery, [usuarioId, habitId, hoy], async (err, result) => {
        if(err) return res.status(500).json({mensaje: "Error en el servidor"});

        if(result.length > 0) {
            return res.status(400).json({mensaje: "Hábito ya completado hoy"});
        }

        //Insertar progreso
        const insertQuery = "INSERT INTO progreso (usuario_id, habit_id, fecha, completado) VALUES (?, ?, ?, TRUE)";

        bd.query(insertQuery, [usuarioId, habitId, hoy], async (err, result) => {
            if(err) {
                console.error(err);
                return res.status(500).json({mensaje: "Error al completar hábito"});
            }

            //Obtener puntos y co2_kg del hábito
            const getHabito = "SELECT puntos, co2_kg FROM habitos WHERE id = ?";
            bd.query(getHabito, [habitId], (err, habito) => {
                if(err || habito.length === 0) {
                    return res.status(400).json({mensaje: "Hábito no encontrado"});
                }

                const puntos = habito[0].puntos;
                const co2Kg = parseFloat(habito[0].co2_kg) || 0.1;

                //Actualizar ecoPuntos del usuario
                const updatePuntos = "UPDATE usuarios SET ecoPuntos = ecoPuntos + ? WHERE id = ?";
                bd.query(updatePuntos, [puntos, usuarioId], (err, result) => {
                    if(err) {
                        console.error(err);
                        return res.status(500).json({mensaje: "Error al sumar puntos"});
                    }

                    //Actualizar o insertar en historial_co2
                    const checkCo2 = "SELECT id, co2_ahorrado, habitos_completados FROM historial_co2 WHERE usuario_id = ? AND fecha = ?";
                    bd.query(checkCo2, [usuarioId, hoy], (err, co2Result) => {
                        if(err) {
                            console.error(err);
                        } else if(co2Result.length > 0) {
                            //Ya existe registro hoy, actualizar
                            const updateCo2 = "UPDATE historial_co2 SET co2_ahorrado = co2_ahorrado + ?, habitos_completados = habitos_completados + 1 WHERE usuario_id = ? AND fecha = ?";
                            bd.query(updateCo2, [co2Kg, usuarioId, hoy], (err) => {
                                if(err) console.error(err);
                            });
                        } else {
                            //Insertar nuevo registro
                            const insertCo2 = "INSERT INTO historial_co2 (usuario_id, fecha, co2_ahorrado, habitos_completados) VALUES (?, ?, ?, 1)";
                            bd.query(insertCo2, [usuarioId, hoy, co2Kg], (err) => {
                                if(err) console.error(err);
                            });
                        }
                    });

                    //Actualizar racha
                    actualizarRacha(usuarioId);

                    //Verificar si sube de nivel según puntos acumulados
                    const nivelQuery = "SELECT ecoPuntos, nivel FROM usuarios WHERE id = ?";
                    bd.query(nivelQuery, [usuarioId], (err, userData) => {
                        if (err || userData.length === 0) return;

                        const { ecoPuntos: totalPts, nivel: nivelActual } = userData[0];
                        const nivelEsperado = nivelDesdePuntos(totalPts);

                        if (nivelEsperado > nivelActual) {
                            const updateNivel = "UPDATE usuarios SET nivel = ? WHERE id = ?";
                            bd.query(updateNivel, [nivelEsperado, usuarioId], (err) => {
                                if (err) console.error("Error al subir nivel:", err);
                            });
                        }
                    });

                    res.json({mensaje: "Hábito completado", puntosGanados: puntos, co2Ahorrado: co2Kg});
                });
            });
        });
    });
});

//GUARDAR evaluación inicial y actualizar nivel del usuario
app.post("/evaluacion", (req, res) => {
    const { usuarioId, respuestas, nivel } = req.body;

    if(!usuarioId || !respuestas || !nivel) {
        return res.status(400).json({mensaje: "Datos incompletos"});
    }

    if(respuestas.length !== 4) {
        return res.status(400).json({mensaje: "Se requieren 4 respuestas"});
    }

    //Verificar si ya existe evaluación
    const checkEval = "SELECT id FROM evaluaciones WHERE usuario_id = ?";
    bd.query(checkEval, [usuarioId], (err, result) => {
        if(err) {
            console.error("Error al verificar evaluación:", err);
            return res.status(500).json({mensaje: "Error en el servidor"});
        }

        if(result.length > 0) {
            return res.status(400).json({mensaje: "Evaluación ya existente"});
        }

        //Insertar evaluación
        const insertEval = `
            INSERT INTO evaluaciones (usuario_id, pregunta1, pregunta2, pregunta3, pregunta4, nivel_final)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        bd.query(insertEval, [usuarioId, respuestas[0], respuestas[1], respuestas[2], respuestas[3], nivel], (err, result) => {
            if(err) {
                console.error("Error al guardar evaluación:", err);
                return res.status(500).json({mensaje: "Error al guardar evaluación"});
            }

            //Actualizar nivel del usuario
            const updateNivel = "UPDATE usuarios SET nivel = ? WHERE id = ?";
            bd.query(updateNivel, [nivel, usuarioId], (err, result) => {
                if(err) {
                    console.error("Error al actualizar nivel:", err);
                    return res.status(500).json({mensaje: "Error al actualizar nivel"});
                }

                res.json({mensaje: "Evaluación guardada correctamente", nivel: nivel});
            });
        });
    });
});

//VERIFICAR si el usuario ya tiene evaluación
app.get("/tieneEvaluacion/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT id, nivel_final FROM evaluaciones WHERE usuario_id = ?";

    bd.query(query, [userId], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al verificar evaluación"});
        }

        if(result.length > 0) {
            res.json({ tieneEvaluacion: true, nivel: result[0].nivel_final });
        } else {
            res.json({ tieneEvaluacion: false });
        }
    });
});

//OBTENER recompensas
app.get("/recompensas", (req, res) => {
    const query = "SELECT id, nombre, descripcion, puntosRequeridos, icono, tipo, condicion_valor, condicion_extra FROM recompensas ORDER BY id";
    
    bd.query(query, (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener recompensas"});
        }
        res.json(result);
    });
});

//Obtener fecha en Colombia (UTC-5) con offset opcional de días
const getFechaColombia = (diasOffset = 0) => {
    const ahora = new Date();
    const fecha = new Date(ahora.getTime() + diasOffset * 86400000);
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(fecha);
};

//Calcular nivel según puntos acumulados (fórmula: N × 50 pts entre niveles)
const nivelDesdePuntos = (ecoPuntos) => {
    return Math.floor((1 + Math.sqrt(1 + 0.16 * ecoPuntos)) / 2);
};

//ACTUALIZAR racha del usuario
const actualizarRacha = (usuarioId) => {
    const hoy = getFechaColombia();
    const ayer = getFechaColombia(-1);

    //Consulta combinada: si completó ayer + fecha de última actualización de racha
    const queryCheck = `
        SELECT 
            (SELECT COUNT(*) FROM progreso WHERE usuario_id = ? AND fecha = ? AND completado = TRUE) as completo_ayer,
            fecha_ultima_racha 
        FROM usuarios 
        WHERE id = ?
    `;

    bd.query(queryCheck, [usuarioId, ayer, usuarioId], (err, result) => {
        if (err || result.length === 0) return;

        const { completo_ayer, fecha_ultima_racha } = result[0];

        //Si ya se actualizó hoy, salir (evita múltiples incrementos por día)
        if (fecha_ultima_racha === hoy) return;

        if (completo_ayer > 0) {
            //Continúa la racha: UPDATE atómico con WHERE que evita race conditions
            const updateQuery = "UPDATE usuarios SET racha = racha + 1, fecha_ultima_racha = ? WHERE id = ? AND (fecha_ultima_racha IS NULL OR fecha_ultima_racha < ?)";
            bd.query(updateQuery, [hoy, usuarioId, hoy], (err) => {
                if (err) console.error("Error al actualizar racha:", err);
            });
        } else {
            //Nueva racha comienza en 1
            const updateQuery = "UPDATE usuarios SET racha = 1, fecha_ultima_racha = ? WHERE id = ? AND (fecha_ultima_racha IS NULL OR fecha_ultima_racha < ?)";
            bd.query(updateQuery, [hoy, usuarioId, hoy], (err) => {
                if (err) console.error("Error al actualizar racha:", err);
            });
        }
    });
};

//OBTENER estadísticas de CO2 del usuario
app.get("/co2/:userId", (req, res) => {
    const userId = req.params.userId;

    //CO2 total y por categoría
    const queryTotal = `
        SELECT
            COALESCE(SUM(hc.co2_ahorrado), 0) as co2_total,
            COALESCE(SUM(hc.habitos_completados), 0) as habitos_totales
        FROM historial_co2 hc
        WHERE hc.usuario_id = ?
    `;

    //CO2 por categoría (a través de los hábitos completados)
    const queryPorCategoria = `
        SELECT
            c.nombre as categoria,
            c.icono,
            COUNT(p.id) as completados,
            SUM(h.co2_kg) as co2_ahorrado
        FROM progreso p
        JOIN habitos h ON p.habit_id = h.id
        JOIN categorias c ON h.categoria_id = c.id
        WHERE p.usuario_id = ? AND p.completado = TRUE
        GROUP BY c.id, c.nombre, c.icono
    `;

    //Historial últimos 7 días
    const queryHistorial7 = `
        SELECT fecha, co2_ahorrado, habitos_completados
        FROM historial_co2
        WHERE usuario_id = ?
        ORDER BY fecha DESC
        LIMIT 7
    `;

    bd.query(queryTotal, [userId], (err, totalResult) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener CO2"});
        }

        bd.query(queryPorCategoria, [userId], (err, catResult) => {
            if(err) {
                console.error(err);
                return res.status(500).json({mensaje: "Error al obtener CO2 por categoría"});
            }

            bd.query(queryHistorial7, [userId], (err, histResult) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({mensaje: "Error al obtener historial"});
                }

                res.json({
                    co2_total: parseFloat(totalResult[0].co2_total) || 0,
                    habitos_totales: totalResult[0].habitos_totales || 0,
                    por_categoria: catResult,
                    historial: histResult.reverse()
                });
            });
        });
    });
});

//OBTENER comparativas de CO2 (equivalencias)
app.get("/comparativas/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = "SELECT COALESCE(SUM(co2_ahorrado), 0) as co2_total FROM historial_co2 WHERE usuario_id = ?";

    bd.query(query, [userId], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({mensaje: "Error al obtener comparativas"});
        }

        const co2 = parseFloat(result[0].co2_total) || 0;

        //Equivalencias basadas en las siguientes fuentes:
        //- Árbol: One Tree Planted / Bernal Review (2018) ~22 kg CO₂/año promedio conservador
        //- Coche: BEIS/Defra UK (2022), EPA (2024) ~0.17 kg CO₂e/km promedio global
        //- Bolsa plástica: EPA GHG Emission Factors Hub (2024) ~5 g CO₂e por bolsa HDPE
        //- TV: IEA (2024). LED 50" ~100W × 0.5 kg CO₂/kWh ≈ 0.08 kg/h
        //- Carne res: Poore & Nemecek, Science 360 (2018). Media global 60 kg CO₂e/kg (beef herd)
        //- Huella diaria: Global Carbon Budget (2025). Colombia 1.63 t/año ≈ 4.5 kg/día
        const equivalencias = {
           _arboles: (co2 / 22).toFixed(1),
            kilometrosCoche: (co2 / 0.17).toFixed(0),
            bolsasPlastico: Math.floor(co2 / 0.005),
            horasTV: (co2 / 0.08).toFixed(0),
            kilosCarne: (co2 / 60).toFixed(1),
            diasSinHuella: (co2 / 4.5).toFixed(0)
        };

        res.json({
            co2_total: co2,
            equivalencias: equivalencias
        });
    });
});
