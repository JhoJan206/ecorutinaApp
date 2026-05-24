

import mysql from "mysql2"; 
import dotenv from "dotenv";

dotenv.config();

let config;
if (process.env.MYSQL_URL) {
    const url = new URL(process.env.MYSQL_URL);
    config = {
        host: url.hostname,
        port: parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.replace('/', ''),
        dateStrings: true,
        ssl: { rejectUnauthorized: false }
    };
} else {
    config = {
        host: process.env.MYSQL_HOST || process.env.MYSQLHOST || process.env.DB_HOST || "127.0.0.1",
        user: process.env.MYSQL_USER || process.env.MYSQLUSER || process.env.DB_USER || "root",
        password: process.env.MYSQL_ROOT_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || process.env.DB_NAME || "ecoRutina",
        port: parseInt(process.env.MYSQL_PORT || process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
        dateStrings: true,
        ssl: { rejectUnauthorized: false }
    };
}

const conexion = mysql.createConnection(config);

conexion.connect((err) => {
    if(err){
        console.error("ERROR en la conexión", err);
        return;
    }
    console.log("Conexión exitosa a la base de datos");
});

export default conexion; 
