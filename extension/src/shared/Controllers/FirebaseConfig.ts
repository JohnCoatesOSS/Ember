import firebase from "firebase/app"

export class FirebaseConfig {
    static configured = false

    static configure(): void {
        if (this.configured) {
            return
        }
        this.configured = true

        const config = {
            apiKey: "AIzaSyDYQRjwz7NYknd2w48H3wuMARS-phFQwAk",
            authDomain: "ember-extension.firebaseapp.com",
            databaseURL: "https://ember-extension.firebaseio.com",
            projectId: "ember-extension",
            storageBucket: "ember-extension.appspot.com",
            messagingSenderId: "778616174790",
            appId: "1:778616174790:web:0db376c45cef5e53dfbfc7",
            measurementId: "G-EFMB7JJE8P"
            };
        
            firebase.initializeApp(config)
            console.log("configured firebase", config)
    }
}