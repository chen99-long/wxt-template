import { registerCommonService } from "@/services/CommonService";

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  registerCommonService()
});
