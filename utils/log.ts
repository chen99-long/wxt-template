import { IS_DEV } from "~/constants/env";
import { createConsola } from "consola/browser";

export function initConsole() {
  const cons = createConsola().withTag("WXT - Template");
  return cons;
}

export function makeModuleLog(moduleName: string, hideLog = false) {
  const instance = createConsola().withTag(`WXT - Template - ${moduleName}`);
  return (...args: Parameters<typeof console.log>) => {
    // return;
    if (!IS_DEV) return;
    if (hideLog) {
      return;
    }
    instance.info(...args);
  };
}
