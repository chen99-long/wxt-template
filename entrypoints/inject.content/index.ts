import { listenEvent } from "@/utils/event";


const log = makeModuleLog("inject.content");
export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  world: 'MAIN',
  async main () {
    console.log('WXT - Template Inject Content Script loaded!');
    listenEvent("injectMessage",  async (message) => {
      console.log(message);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "收到contentscript的消息: " + message.message;
    });
  },
});
  