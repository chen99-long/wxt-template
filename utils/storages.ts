// demo:持久化存储一个count
export const numState = storage.defineItem<number>("local:num", {
  defaultValue: 0,
});