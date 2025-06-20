const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static('public')); // Servir archivos estáticos de la carpeta 'public'

let turnos = [];
let letraActual = 'A';
let numeroTurno = 1;

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");
    socket.on("solicitarTurno", (dni) => {
        console.log("DNI recibido en servidor:", dni); // ← Debugging
        // Aquí continúa la lógica de asignación de turnos
        

    });
    socket.on("solicitarTurno", (dni) => {
        if (numeroTurno > 100) {
            letraActual = 'B';
            numeroTurno = 1;
        }

        const turno = `${letraActual}${numeroTurno}`;
        turnos.push({ dni, turno });
        numeroTurno++;

        socket.emit("turnoAsignado", `Su turno es: ${turno}`);
        io.emit("actualizarTurnos", turnos); // Notifica a todas las pantallas
        console.log(`Turno asignado a ${dni}: ${turno}`);//control de flujo
    });
    socket.on("asignarTurno", (puesto) => {//lo ultimo agregado
        if (turnos.length > 0) {
            const turnoAsignado = turnos.shift(); // Elimina el primer turno en cola
            io.emit("turnoAsignadoUsuario", { turno: turnoAsignado.turno, puesto });
            io.emit("actualizarTurnos", turnos); // Actualiza la cola en todas las pantallas
        }
    });
});


server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
