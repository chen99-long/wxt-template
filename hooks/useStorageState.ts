import { useState, useEffect, useCallback } from "react";

export default function useStorageState<Value, Metadata extends Record<string, unknown>>(
  item: WxtStorageItem<Value, Metadata>,
) {
  const [data, setData] = useState<Value>(item.fallback);

  useEffect(() => {
    item.getValue().then(setData);
    const unwatch = item.watch(setData);
    return unwatch;
  }, [item]);

  return [
    data,
    useCallback(
      async (nextOrUpdater: Value | ((prev: Value) => Value)) => {
        const nextValue =
          typeof nextOrUpdater === "function"
            ? (nextOrUpdater as (prev: Value) => Value)(data)
            : nextOrUpdater;
        await item.setValue(nextValue);
      },
      [item, data],
    ),
  ] as const;
}
