import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGatewayClass implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebSocketGatewayClass');
  private connectedUsers: Map<string, string> = new Map();

  constructor(private jwtService: JwtService) { }

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token;
    if (typeof token !== 'string') {
      this.logger.error('Invalid token received:', token);
      return;
    }
    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload.username;
      this.connectedUsers.set(payload.username, client.id);
      this.logger.log(`Client connected: ${client.id}, User: ${payload.username}`);
    } catch (error) {
      this.logger.error('Error verifying token:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.forEach((socketId, username) => {
      if (socketId === client.id) {
        this.connectedUsers.delete(username);
      }
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { recipient: string; text: string }): void {
    const from = client.id; 
    this.logger.log(`Message received: ${JSON.stringify(payload)} from Socket ID: ${from}`);
    const recipientSocketId = this.connectedUsers.get(payload.recipient);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('message', { from: from, text: payload.text });
    } else {
      client.emit('message', { from: 'Server', text: 'Recipient not connected' });
    }
  }
}
