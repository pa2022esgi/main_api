import {CommentModel, CommentProps, CoursDocument, FileDocument, UserDocument} from "../models";
import {SlotService} from "./slot.service";
import endOfDay from 'date-fns/endOfDay'

export class CommentService {
    private static instance?:CommentService;

    static getInstance():CommentService{
        if(!CommentService.instance){
            CommentService.instance = new CommentService();
        }
        return CommentService.instance;
    }

    async createOne(props: Partial<CommentProps>, user: UserDocument, cours: CoursDocument) {
        const model = new CommentModel({
            text: props.text,
            rating: props.rating,
            user: user
        });

        const comment = await model.save();

        cours.comments.push(comment);
        await cours.save();

        return comment;
    }

    async canComment(user: UserDocument, cours: CoursDocument) {
        const slots = await SlotService.getInstance().getSlots(cours, "all");
        const today = new Date();

        let res = 0;
        for (let slot of slots) {
            if (slot.paid && slot.date <= endOfDay(today) && slot.user._id.equals(user._id)) {
                res++;
            }
        }

        if (res === 0) {
            return false;
        }

        for (let comment of cours.comments) {
            if (comment.user._id.equals(user._id)) {
                return false;
            }
        }

        return true;
    }

    async getPopularComments() {
        return await CommentModel.find({rating : {$gte: 4}}).sort({createdAt: 'desc'}).limit(3).exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await CommentModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }
}