import {CoursDocument, SlotDocument, SlotModel, SlotProps, UserDocument} from "../models";
import startOfDay from 'date-fns/startOfDay'
import { MailSeeder } from "../seeders";

const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_KEY

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export class SlotService {
    private static instance?:SlotService;

    static getInstance():SlotService{
        if(!SlotService.instance){
            SlotService.instance = new SlotService();
        }
        return SlotService.instance;
    }

    async createSlot(props: Partial<SlotProps>) {
        const model = new SlotModel({
            date: props.date,
            start_time: props.start_time,
            end_time: props.end_time,
            user: props.user,
            cours: props.cours,
            online: props.online
        });

        const client = new Sib.TransactionalEmailsApi()

        const sender = {
            email: process.env.SENDINBLUE_EMAIL,
            name: process.env.SENDINBLUE_NAME,
        }
        const receivers = [
            {
                email: model.user.email,
                name: model.user.firstname + ' ' + model.user.lastname,
            },
        ]
        
        client.sendTransacEmail({
            sender,
            to: receivers,
            subject: MailSeeder.notifyUserCreatedSlot.title,
            htmlContent: MailSeeder.notifyUserCreatedSlot.content,
            params: {
                lesson_name: model.cours.name,
                teacher_name: model.cours.user.firstname + ' ' + model.cours.user.lastname,
                start_hour: model.start_time.replace(':', 'h'),
                end_hour: model.end_time.replace(':', 'h'),
                date: new Date(model.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                price: await this.calculateFullPrice(model),
                url: process.env.FRONT_URL + '/slots/',
            },
        })

        return await model.save();
    }

    async getSlots(cours: CoursDocument, type: string) {
        if (type === "incoming") {
            return await SlotModel.find({
                cours: cours,
                date: {
                    $gte: startOfDay(new Date()),
                }
            }).sort({date: 'asc'}).exec();
        } else {
            return await SlotModel.find({cours: cours}).sort({date: 'asc'}).exec();
        }
    }

    async getUserSlots(user: UserDocument, type: string) {
        if (type === "incoming") {
            return await SlotModel.find({
                user: user,
                date: {
                    $gte: startOfDay(new Date()),
                }
            }).sort({date: 'asc'}).exec();
        } else {
            return await SlotModel.find({user: user}).sort({date: 'asc'}).exec();
        }
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await SlotModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async findOneById(id: string) {
        return await SlotModel.findById(id).exec();
    }

    async paySlot(slot: SlotDocument, token: string) {
        const price = await this.calculateFullPrice(slot);

        await stripe.charges.create({
            amount: +price * 100,
            currency: 'eur',
            description: 'Slot id: ' + slot._id,
            source: token,
        });

        slot.price = parseInt(price);
        slot.paid = true;
        await slot.save();
    }

    async getAllSlots(groupBy: boolean) {
        if (groupBy) {
            return await SlotModel.aggregate([
                {$match: { paid: true }},
                {$group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} }, count:{$sum:"$price"}}},
                {$project: {date: '$_id', count: 1, _id: 0}},
                {$sort: { "date" : 1}},
            ]).exec();
        } else {
            return await SlotModel.find({paid: true}).sort({createdAt: 'desc'}).exec();
        }
    }

    async calculateFullPrice(slot: SlotDocument) {
        const time_start = new Date();
        const time_end = new Date();
        const value_start = slot.start_time.split(':');
        const value_end = slot.end_time.split(':');

        time_start.setHours(parseInt(value_start[0]), parseInt(value_start[1]));
        time_end.setHours(parseInt(value_end[0]), parseInt(value_end[1]));

        let diff = (time_start.getTime() - time_end.getTime()) / 1000;
        diff /= 60 * 60;
        const price = Math.abs(diff) * slot.cours.price;

        return price.toFixed(2);
    }
}