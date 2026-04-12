/*
11/04/2026

Conexión a la base de datos LOCAL del equipo de Juan Moreno 

-JuanMoreno 
*/

const mysql = require("mysql2"); 

const conexion = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "13462597Ju",
    database: "ecoRutina"
});

conexion.connect((err) => {
    if(err){
        console.error("ERROR en la conexión", err);
        return;
    }
    console.log("Conexión exitosa a la base de datos");
});

module.exports = conexion; 