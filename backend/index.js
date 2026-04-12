/*
11/04/2026

Correr el servidor
Ademas de código del registro de usuarios de EcoRutina y
Validación de usuarios existentes e insertación de usuarios nuevos. 

- JuanMoreno 
*/


import express from "express";
//Cors para que no haga peticiones a otro servidor 
import cors from "cors";
//Llamar a la conexión de la base de datos
import bd from "./bd.js"; 

const app = express(); 

app.use(cors());
app.use(express.json());



//Correr el servidor 
app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.listen(3000, () => {
    console.log("Server corriendo en http://localhost:3000")
})



//Registro 
app.post("/registro", (req, res) => {
    const {correo, password, usuario} = req.body; 
    //Si estan vacios los campos 
    if(!correo || !password || !usuario){
        return res.status(400).json({Mensaje:"Datos incompletos"}); 
    }

    //Si existe un usuario con el mismo correo

    const checkQuery = "SELECT * FROM usuarios WHERE correo = ?"; 

    bd.query(checkQuery, [correo], (err, result) => {
        if(err) return res.status(500).json({mensaje: "Error en el servidor"});
        if(result.length > 0) return res.status(400).json({mensaje: "Usuario ya existente"});

        //Si el usuario no existe llega aquí             
        
        const insertQuery = "INSERT INTO usuarios (correo, password, nombre, fechaRegistro) VALUES (?, ?, ?, NOW())"; 
        bd.query(insertQuery, [correo, password, usuario], (err, result) => {
            if(err){
               console.error("Error al insertar:", err); 
                return res.status(500).json({mensaje:"Error al registrar"});
            }
            res.json({mensaje: "Usuario registrado correctamente"});
        });
    });
});

//Iniciar sesión 
app.post("/login", (req, res) => {
    const {correo, password} = req.body; 
    //Si están vacios
    if(!correo || !password) return res.status(400).json({mensaje: "Datos incompletos"});

    //Consulta a la base de datos 
    const query = "SELECT * FROM usuarios WHERE correo = ? AND password = ?"; 

    //Ingresa el correo y contraseña y valida si existe el registro
    bd.query(query, [correo, password], (err, result) => {
        if(err){
            console.error("Error al iniciar sesión:", err);
            return res.status(500).json({memsaje: "Error en el servidor"});
        }
        if(result.length === 0) return res.status(401).json({mensaje: "Correo o contraseña incorrectos"});

        
        console.log("Usuario encontrado:", result[0]); 
        res.json({mensaje: "Login exitoso", usuario: result[0].nombre, fechaRegistro: result[0].fechaRegistro}); //(usuario:) es lo que se manda al front para que te diga "Bienvenido [usuario]"
    });
});


//Actualizar nombre y correo 
