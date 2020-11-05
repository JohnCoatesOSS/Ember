import { EmberMessage } from "../shared/Models/Communication/MessagePassing"

console.log("content script")

class EmberContentScript {
	static shared: EmberContentScript

	port: chrome.runtime.Port

	constructor() {
		this.port = chrome.runtime.connect()
		this.embedExtensionScript('build/embedded.js')
		this.listenForMessages()
	}

	embedExtensionScript(filename: string) {
		var embeddedScript = document.createElement('script');
		let embeddedScriptUrl = chrome.extension.getURL(filename);
		console.log("embeddedScriptUrl", embeddedScriptUrl);
		this.embedIdentifierElement(embeddedScriptUrl)

		embeddedScript.src = embeddedScriptUrl;
		embeddedScript.type = "module";
		embeddedScript.onload = function(this: HTMLScriptElement) {
			let parentNode = this.parentNode
			if (!parentNode) {
				return
			}
			// remove script from DOM. Script still functions the same.
			parentNode.removeChild(this);
		} as any;

		(document.head||document.documentElement).appendChild(embeddedScript);
	}

	embedIdentifierElement(extensionUrl: string) {
		let url = new URL(extensionUrl)
		let element = document.createElement('meta')
		element.id = "ember-identifier";
		element.setAttribute("identifier", url.host);
		(document.head||document.documentElement).appendChild(element)
	}
	
	// MARK: - Listener

	listenForMessages() {
		console.log("listening for messages")
		window.addEventListener("message", this.onEvent.bind(this), false);

		chrome.runtime.onMessage.addListener(this.onBackgroundPageMessage.bind(this))
	}

	onEvent(event: MessageEvent) {
		if (event.source != window) { return }
		let data = event.data as EmberMessage
		if (!data) { return }
		if (!data.ember) { return }

		console.log("received message", data)

		// if (event.data.type && (event.data.type == "FROM_PAGE")) {
		// 	console.log("Content script received: " + event.data.text);
		// 	port.postMessage(event.data.text);
		// }
	}

	onBackgroundPageMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
		if (sender.tab != undefined) { return }
		console.log("received message", request)
		// sendResponse({farewell: "goodbye"});
		sendResponse()
		return true
	}
}

EmberContentScript.shared = new EmberContentScript()