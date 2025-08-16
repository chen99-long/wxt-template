import { ExtInfo } from "@/@types/ext";
import { registerCommonService } from "@/services/CommonService";
import { v4 as uuidv4 } from "uuid";

const log = makeModuleLog("background");
export default defineBackground(() => {
  log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      setExtInfo("install_time", Date.now());
    } else if (details.reason === "update") {
      setExtInfo("update_time", Date.now());
    }
  });

  registerCommonService()
});


async function setExtInfo(key: keyof ExtInfo, value: ExtInfo[keyof ExtInfo]) {
  const extInfo = await extInfoState.getValue();
  if (extInfo.uuid === "") {
    extInfo.uuid = uuidv4();
  }
  extInfoState.setValue({
    ...extInfo,
    [key]: value,
  });
}