import firebase from "firebase/app"
import "firebase/firestore"
import { Recommendation, Measurements } from "./Recommendation"

export class SizingData {
    static async for(user: firebase.User): Promise<Measurements | undefined> {
        let userId = user.uid
        let db = firebase.firestore()
        var ref = db.collection("measurements").doc(userId);

        let doc = await ref.get()
        console.log("userId: ", userId)
        if (doc.exists) {
            let measurements = doc.data() as Measurements
            console.log("user's measurements", measurements);
            return measurements
        } else {
            return undefined
        }
    }
}