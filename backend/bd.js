

import mysql from "mysql2"; 

const conexion = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "20061102",
    database: "ecoRutina"
});

conexion.connect((err) => {
    if(err){
        console.error("ERROR en la conexión", err);
        return;
    }
    console.log("Conexión exitosa a la base de datos");
});

export default conexion; 