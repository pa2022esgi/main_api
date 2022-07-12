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

    async getUserChats(user: UserDocument) {
        return await ChatModel.find({users: { $elemMatch: {$eq: user} }}).exec();
    }

    async getChat(id: string) {
        return await ChatModel.findById(id).exec();
    }

    async exist(users: UserDocument[]) {
        return await ChatModel.findOne({users: {$all: users}}).exec();
    }
}