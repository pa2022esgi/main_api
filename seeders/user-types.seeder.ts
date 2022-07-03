import {UserTypeModel} from "../models";

export class UserTypesSeeder {
    public static async seed() {
        const types = [
            {
                id: 1,
                name: "admin"
            },
            {
                id: 2,
                name: "teacher"
            },
            {
                id: 3,
                name: "student"
            }
        ];

        for (const type of types) {
            const exist = await UserTypeModel.findById(type.id).exec()

            if (!exist) {
                await new UserTypeModel({
                    _id: type.id,
                    name: type.name
                }).save();
            } else {
                exist.name = type.name
                await exist.save();
            }
        }
    }
}