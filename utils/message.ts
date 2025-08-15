import { defineExtensionMessaging } from '@webext-core/messaging'

interface ProtocolMap {
	showCurrentTabInfo: () => Browser.runtime.MessageSender
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
