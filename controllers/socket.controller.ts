export class SocketController {
    public static init(server: any) {
        const io = require('socket.io')(server, {
            cors: {origin : process.env.FRONT_URL}
        });

        io.on('connection', (socket: any) => {
            socket.id = socket.handshake.query.userId;
            console.log('a user connected');

            socket.on('message', (content: any) => {
                console.log(content.message);
                io.emit('message', `${socket.id} said ${content.message}`);
            });

            socket.on('disconnect', () => {
                console.log('a user disconnected!');
            });
        });
    }
}