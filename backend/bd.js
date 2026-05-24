

import mysql from "mysql2"; 
import dotenv from "dotenv";

dotenv.config();

const conexion = mysql.createConnection({
    host: process.env.MYSQL_HOST || process.env.MYSQLHOST || process.env.DB_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || process.env.MYSQLUSER || process.env.DB_USER || "root",
    password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || process.env.DB_NAME || "ecoRutina",
    port: parseInt(process.env.MYSQL_PORT || process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
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
