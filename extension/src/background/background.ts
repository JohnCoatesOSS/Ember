import { FirebaseConfig } from "../shared/Controllers/FirebaseConfig"
import { Authentication } from "../shared/Controllers/Authentication"
import { SizingData } from "../shared/Controllers/SizingData"
import { EmberMessage, EmberMessageType, EmberMeasurements } from "../shared/Models/Communication/MessagePassing"

class EmberBackground {
  static shared: EmberBackground

  constructor() {
    this.initializeFirebase()
    this.exposeDebugFunctions()
    this.listenForMessages()
  }

  initializeFirebase() {
    FirebaseConfig.configure()
    Authentication.configure()
  }

  exposeDebugFunctions() {
    (window as any).emberSignUp = function () {
        console.log("signing in")
        let email = "test@johncoates.dev"
        let password = "password1"
        Authentication.signUp(email, password)
    };

    (window as any).emberSignIn = function () {
        console.log("signing in")
        let email = "test@johncoates.dev"
        let password = "password1"
        Authentication.signIn(email, password)  
    };
  }
  
  listenForMessages() {
    chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      const tab = sender.tab
      if (tab == undefined) { return }
      const tabId = tab.id
      if (tabId == undefined) { return }
      
      console.log("received message: ", request, sender)

      const user = Authentication.currentUser()
      if (!user) {
        console.log("No signed in user")
        return
      }
      console.log("user", user)

      // SizingData.for(user).then(value => {
      //   console.log("value response:", value)
      //   let message: EmberMessage = {
      //     ember: true,
      //     type: EmberMessageType.FromBackground
      //   }

      //   EmberBackground.sendMessage(tabId, message)
      // })

      return new Promise<EmberMessage>(async () => {
        console.log("running async function")
        let data = await SizingData.for(user)
        // sendResponse(data)
        let message: EmberMeasurements = {
          ember: true,
          type: EmberMessageType.GetMeasurements,
          measurements: data
        }
        sendResponse(message)
        return message
      })
    });
  }

  respondWithSizingData() {

  }

  static sendMessage(tabId: number, message: EmberMessage) {
    console.log("sending to", tabId, message)
    chrome.tabs.sendMessage(tabId, message, value => {
      if (!value) { return }
      console.log("sendMessage response", value)
    })
  }
}

EmberBackground.shared = new EmberBackground()