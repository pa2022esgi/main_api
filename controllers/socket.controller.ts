import {ChatService, MessageService, UserService} from "../services";

export class SocketController {
    public static init(server: any) {
        try {
            const io = require('socket.io')(server, {
                cors: {origin : process.env.FRONT_URL}
            });

            io.on('connection', (socket: any) => {
                socket.sessionId = socket.handshake.query.userId;
                socket.join(socket.sessionId);
                console.log(socket.sessionId + ' connected!');

                socket.on('message', async (content: any) => {
                    const sender = await UserService.getInstance().getOneById(socket.sessionId);
                    const target = await UserService.getInstance().getOneById(content.to);

                    if (sender && target) {
                        const chat = await ChatService.getInstance().exist([target, sender]);

                        await MessageService.getInstance().createMessage({
                            text: content.message,
                            user: sender
                        }, chat!);
                    }

                    io.to(content.to).emit('message', content.message);
                });

                socket.on('disconnect', () => {
                    console.log(socket.sessionId + ' disconnected!');
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
}