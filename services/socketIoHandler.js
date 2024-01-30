import { Server } from 'socket.io';

export let io;

export default function injectSocketIo(server) {
  io = new Server(server);

  io.on('conection', (socket) => {
    socket.emit('message', "hello");
  });
}
