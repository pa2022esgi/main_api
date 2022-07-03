import {UserModel} from "../models";

export class SeedUtil {
    public static async seed(test: boolean = false, fresh: boolean = false) {
        if (fresh) {
            await this.erase();
        }
    }

    public static async erase() {
        await UserModel.deleteMany();
    }
}