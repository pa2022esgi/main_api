export class MailSeeder {
    static notifyUserCreatedSlot = {
        title : "Vous avez reçu une nouvelle proprosition de créneaux !",
        content : `
            <h3>👨‍🎓 My classes</h3>
            <p>Un nouvelle proposition de créneau pour votre cours "{{params.lesson_name}}" avec {{params.teacher_name}} est disponible sur votre espace.
            <ul>
                <li> de {{params.start_hour}} à {{params.end_hour}} le {{params.date}} pour un montant de {{params.price}} €
                </li>
            </ul>
            <p>Retrouvez tous vos créneaux sur notre <a href="{{params.url}}">site</a></p>
            <p style="text-align: end;">My classes<p>
        `
    }
}