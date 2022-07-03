import {UserTypesSeeder} from "../seeders";
import {UserModel, UserTypeModel} from "../models";

export class SeedUtil {
    public static async seed(test: boolean = false, fresh: boolean = false) {
        if (fresh) {
            await this.erase();
        }
        await UserTypesSeeder.seed();
    }

    public static async erase() {
        await UserModel.deleteMany();
        await UserTypeModel.deleteMany();
    }
}