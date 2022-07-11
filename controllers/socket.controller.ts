export class SocketController {
    public static init(server: any) {
        const io = require('socket.io')(server, {
            cors: {origin : process.env.FRONT_URL}
        });

        io.on('connection', (socket: any) => {
            socket.id = socket.handshake.query.userId;
            console.log('a user connected');

            socket.on('message', (message: string, to: any) => {
                console.log(message);
                io.to(to).emit('message', `${socket.id} said ${message}`);
            });

            socket.on('disconnect', () => {
                console.log('a user disconnected!');
            });
        });
    }
}