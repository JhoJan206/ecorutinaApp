

import mysql from "mysql2"; 
import dotenv from "dotenv";

dotenv.config();

const conexion = mysql.createConnection({
    host: process.env.MYSQLHOST || "127.0.0.1",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQL_ROOT_PASSWORD || process.env.MYSQLPASSWORD || "",
    database: "ecoRutina",
    port: parseInt(process.env.MYSQLPORT || "3306"),
    dateStrings: true,
    ssl: { rejectUnauthorized: false }
});

conexion.connect((err) => {
    if(err){
        console.error("ERROR en la conexión", err);
        return;
    }
    console.log("Conexión exitosa a la base de datos");
});

export default conexion; 
