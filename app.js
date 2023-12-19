import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = new Map();

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('set nickName', (nickName) => {
      users.set(socket.id, nickName);
      console.log(users);
      io.emit('set nickName', nickName);
    });

    socket.on('chat message', (msg, nickName) => {
      console.log(nickName + ': ' + msg);
      io.emit('chat message', msg, nickName);
    });

    socket.on('disconnect', () => {
      users.delete(socket.id);
        console.log('user disconnected');
      });
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});