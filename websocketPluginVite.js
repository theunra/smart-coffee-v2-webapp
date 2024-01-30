import injectSocketIo from './services/socketIoHandler.js';

export const websocketServer = {
  name: 'websocketServer',
  configureServer(server){
    injectSocketIo(server.httpServer);
  }
}
