# EcoRutina App

Aplicacion movil hibrida para promover habitos ecologicos mediante un sistema de gamificacion. Los usuarios completan desafios diarios relacionados con ahorro de agua, energia, residuos y transporte verde para ganar EcoPuntos y desbloquear recompensas.

## Caracteristicas

- Registro e inicio de sesion de usuarios
- Cuestionario de evaluacion inicial para determinar nivel
- Sistema de habitos diarios por categoria (Principiante, Intermedio, Profesional)
- Seguimiento de progreso y rachas
- Sistema de recompensas y logros
- Simulador de huella de carbono con calculo de CO2 ahorrado
- Estadisticas y comparativas ambientales

## Stack Tecnologico

### Frontend
- React 19
- Ionic Framework 8
- TypeScript
- Vite (build tool)
- Cypress (e2e testing)
- Vitest (unit testing)

### Backend
- Node.js
- Express.js
- MySQL (base de datos)
- bcryptjs (hash de contrasenas)

## Estructura del Proyecto

```
ecorutinaApp/
├── src/
│   ├── pages/           # Paginas de la aplicacion
│   │   ├── Portada.tsx
│   │   ├── Login.tsx
│   │   ├── Registro.tsx
│   │   ├── EvaluacionInicial.tsx
│   │   ├── Home.tsx
│   │   ├── Perfil.tsx
│   │   ├── Recompensas.tsx
│   │   └── Simulador.tsx
│   ├── components/     # Componentes reutilizables
│   ├── theme/          # Estilos de Ionic
│   └── App.tsx         # Componente principal con rutas
├── backend/
│   ├── index.js        # Servidor Express
│   ├── bd.js          # Conexion a MySQL
│   └── crear_base_datos.sql
└── package.json
```

## Requisitos Previos

- Node.js 18+
- MySQL 8.0+
- npm o yarn

## Instalacion

### 1. Clonar el repositorio
```bash
git clone <repositorio>
cd ecorutinaApp
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 4. Configurar la base de datos

1. Ejecutar MySQL
2. Ejecutar el script `backend/crear_base_datos.sql` en MySQL Workbench o desde linea de comandos:
```bash
mysql -u root -p < backend/crear_base_datos.sql
```

### 5. Configurar conexion a la base de datos

Editar `backend/bd.js` con tus credenciales de MySQL:
```javascript
const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu_contrasena',
    database: 'ecoRutina'
});
```

## Ejecucion

### Iniciar el backend
```bash
cd backend
npm start
```
El servidor correra en http://localhost:3000

### Iniciar el frontend
```bash
npm run dev
```
La aplicacion correra en http://localhost:5173

## Rutas de la Aplicacion

| Ruta | Descripcion |
|------|-------------|
| / | Portada de bienvenida |
| /login | Inicio de sesion |
| /registro | Registro de nuevo usuario |
| /evaluacion | Cuestionario inicial |
| /home | Panel principal con habitos |
| /perfil | Perfil del usuario |
| /recompensas | Sistema de recompensas |
| /simulador | Calculadora de CO2 |

## Endpoints del API

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /registro | Registrar nuevo usuario |
| POST | /login | Iniciar sesion |
| PUT | /actualizarUsuario | Actualizar perfil |
| GET | /stats/:userId | Obtener estadisticas |
| GET | /habitos/:nivel | Obtener habitos por nivel |
| GET | /progreso/:userId | Obtener progreso del dia |
| POST | /completarHabito | Completar un habito |
| POST | /evaluacion | Guardar evaluacion inicial |
| GET | /recompensas | Listar recompensas |
| GET | /co2/:userId | Obtener estadisticas CO2 |
| GET | /comparativas/:userId | Obtener equivalencias |

## Sistema de Niveles

- **Principiante (nivel 1-4)**: 20 habitos basicos
- **Intermedio (nivel 5-10)**: 28 habitos (incluye nivel 2)
- **Profesional (nivel 11+)**: 36 habitos (incluye nivel 2 y 3)

## Calculo de CO2

Cada habito tiene un valor de CO2 asociado (co2_kg). Al completar un habito:
1. Se registran los puntos ganados
2. Se registra el CO2 ahorrado en historial_co2
3. Se actualiza el progreso diario

## Contribuidores

- JuanMoreno (Desarrollador principal)

## Licencia

MIT