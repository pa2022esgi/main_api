import {ChatDocument, MessageModel, MessageProps} from "../models";
import {AuthUtil} from "../utils";

export class MessageService {
    private static instance?:MessageService;

    static getInstance():MessageService{
        if(!MessageService.instance){
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }

    async createMessage(props: Partial<MessageProps>, chat: ChatDocument) {
        const model = new MessageModel({
            text: props.text,
            user: props.user
        });

        const msg = await model.save();

        chat.messages.push(msg);
        await chat.save();

        return msg;
    }
}