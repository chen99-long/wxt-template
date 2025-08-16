import { ExtInfo } from "@/@types/ext";

// demo:持久化存储一个count
export const numState = storage.defineItem<number>("local:num", {
  defaultValue: 0,
});

export const themeState = storage.defineItem<"light" | "dark">("local:theme", {
  defaultValue: "light",
});

export const extInfoState = storage.defineItem<ExtInfo>("sync:extInfo", {
  defaultValue: {
    install_time: 0,
    update_time: 0,
    uuid: "",
  },
});
