import {UserTypeModel} from "../models";

export class UserTypesSeeder {
    public static async seed() {
        const types = [
            {
                id: 1,
                role: "admin"
            },
            {
                id: 2,
                role: "teacher"
            },
            {
                id: 3,
                role: "student"
            }
        ];

        for (const type of types) {
            const exist = await UserTypeModel.findById(type.id).exec()

            if (!exist) {
                await new UserTypeModel({
                    _id: type.id,
                    role: type.role
                }).save();
            } else {
                exist.role = type.role
                await exist.save();
            }
        }
    }
}