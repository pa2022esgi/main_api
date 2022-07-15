import {CoursDocument, CoursModel, UserDocument} from "../models";

export class CommentService {
    private static instance?:CommentService;

    static getInstance():CommentService{
        if(!CommentService.instance){
            CommentService.instance = new CommentService();
        }
        return CommentService.instance;
    }

    canComment(user: UserDocument, cours: CoursDocument) {
        cours.comments.forEach(el => {
          if (el.user === user) {
              return false;
          }
        })

        return true;
    }
}