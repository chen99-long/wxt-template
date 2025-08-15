import { makeModuleLog } from "@/utils/log";
import { onMessage } from "@/utils/message";
import { defineProxyService } from "@webext-core/proxy-service";


const log = makeModuleLog("CommonService");
class CommonService {
  constructor() {
    onMessage("showCurrentTabInfo", (data) => {
      return data.sender;
    });
  }

  openNewTab(url: string) {
    log("openNewTab", url);
    browser.tabs.create({ url });
  }


  //关闭所有非当前标签页
  closeAllTabsWithoutCurrent() {
    browser.tabs.query({}).then((tabs) => {
      tabs.forEach((tab) => {
        if (!tab.active) {
          browser.tabs.remove(tab.id!);
        }
      });
    });
  }

}

export const [registerCommonService, getCommonService] = defineProxyService(
  "CommonService",
  () => new CommonService(),
);
