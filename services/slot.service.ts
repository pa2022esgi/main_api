import {CoursDocument, SlotDocument, SlotModel, SlotProps, UserDocument} from "../models";
import startOfDay from 'date-fns/startOfDay'

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

    async paySlot(slot: SlotDocument) {
        let time_start = new Date();
        let time_end = new Date();
        let value_start = slot.start_time.split(':');
        let value_end = slot.end_time.split(':');

        time_start.setHours(Number(value_start[0]), Number(value_start[1]));
        time_end.setHours(Number(value_end[0]), Number(value_end[1]));

        let diff = (time_start.getTime() - time_end.getTime()) / 1000;
        diff /= 60 * 60;
        const price = Math.abs(diff) * slot.cours.price;

        slot.price = Number(price.toFixed(2));
        slot.paid = true;
        await slot.save();
    }

    async getAllSlots() {
        return await SlotModel.find({paid: true}).exec();
    }
}