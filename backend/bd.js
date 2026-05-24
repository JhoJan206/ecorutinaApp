

import mysql from "mysql2"; 
import dotenv from "dotenv";

dotenv.config();

const conexion = mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || "127.0.0.1",
    user: process.env.MYSQLUSER || process.env.DB_USER || "root",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || "ecoRutina",
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
    dateStrings: true
});

conexion.connect((err) => {
    if(err){
        console.error("ERROR en la conexión", err);
        return;
    }
    console.log("Conexión exitosa a la base de datos");
});

export default conexion; 
