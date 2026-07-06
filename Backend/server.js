import express from 'express';
import http from 'http';
//http is used to create server instead of using express, because socket.io uses http. The main reason is that socket.io uses http to create a server.
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';


const app = express(); //create express app
const server = http.createServer(app); //create http server
const io = new Server(server, {
 cors: {
   origin: '*',
   methods: ['GET', 'POST'],
 }
}); //create socket.io server
const ySocketIO = new YSocketIO(io); //create y-socket.io server

app.get("/", (req, res) => {
 res.send("Hello World");
})

server.listen(3000, () => {
 console.log('Server listening on port 3000');
})