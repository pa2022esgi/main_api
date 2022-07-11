import {ChatModel, UserDocument} from "../models";

export class ChatService {
    private static instance?: ChatService;

    public static getInstance(): ChatService {
        if(ChatService.instance === undefined) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    async create(users: UserDocument[]) {
        const chat = new ChatModel({
            users: users
        })

        return await chat.save();
    }

    async exist(users: UserDocument[]) {
        return ChatModel.findOne({users: {$all: users}});
    }
}