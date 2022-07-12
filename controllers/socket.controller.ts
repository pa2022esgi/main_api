export class SocketController {
    public static init(server: any) {
        const io = require('socket.io')(server, {
            cors: {origin : process.env.FRONT_URL}
        });

        io.on('connection', (socket: any) => {
            socket.sessionId = socket.handshake.query.userId;
            socket.join(socket.sessionId);
            console.log(socket.id + ' is connected');

            socket.on('message', (content: any) => {
                console.log(socket.sessionId + ' to ' + content.to);
                io.to(content.to).emit('message', `${socket.id} said ${content.message}`);
            });

            socket.on('disconnect', () => {
                console.log('a user disconnected!');
            });
        });
    }
}