import firebase from "firebase/app"
import "firebase/auth"
import { SizingData } from "./SizingData"

export class Authentication {
    static signUp(email: string, password: string): void {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
            console.log("sign up error", error);
        })
        .then(function (userCredential) {
            const credential = userCredential as firebase.auth.UserCredential
            if (!credential) { return }
            const user = credential.user
            if (!user) { return }
            user.sendEmailVerification().catch(function (error) {
                console.log("failed to send email verification")
            })
        })
    }

    static signIn(email: string, password: string): void {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            console.log("sign in error", error);
        }).then( function (userCredential) {
            const credential = userCredential as firebase.auth.UserCredential
            if (!credential) { return }
            const user = credential.user
            if (!user) { return }

            if (!user.emailVerified)  {
                user.sendEmailVerification().catch(function (error) {
                    console.log("failed to send email verification")
                })
            }

            console.log("signed in user", user)
        })
    }

    static subscribeToChanges(): void {
        firebase.auth().onAuthStateChanged(this.stateChanged.bind(this));
    }

    static stateChanged(user: firebase.User | null): void {
      if (!user) {
        console.log("user is signed out")
        return
      }
      console.log("user is signed in", user)

      SizingData.for(user)
    }

    static currentUser(): firebase.User | null {
        return firebase.auth().currentUser
    }

    static isLoggedIn(): boolean {
        return this.currentUser() != null
    }

    static configure(): void {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        this.subscribeToChanges()
    }

}