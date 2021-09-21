import React from "react";
import { usePlugin, useValue, Layout } from "flipper-plugin";
import { PluginClient, createState } from "flipper-plugin";
import dayjs from "dayjs";
import { v4 } from "uuid";

import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

import { RowData, PluginEvents, Selection } from "./types";
import { NavigationHeader } from "./components";
import { AtomStates, RecoilLogs } from "./pages";

export function plugin(client: PluginClient<PluginEvents, {}>) {
  const rows = createState<RowData[]>([], { persist: "rows" });
  const atoms = createState<Record<string, RowData>>({}, { persist: "atoms" });
  const selection = createState<Selection>("atoms", {
    persist: "selection",
  });
  const expandData = createState<boolean>(false, { persist: "expandData" });

  client.onMessage("newRow", (row) => {
    const formattedRow = {
      ...row,
      date: dayjs(row.date).format("LTS"),
      id: v4(),
    };
    rows.update((draft) => [...draft, formattedRow]);
    atoms.update((draft) => ({ ...draft, [row.atom]: formattedRow }));
  });

  const setSelection = (newSelection: Selection) => {
    selection.set(newSelection);
  };

  const setExpandData = (newExpandData: boolean) => {
    expandData.set(newExpandData);
  };

  const clearRows = () => {
    rows.set([]);
  };

  return {
    clearRows,
    rows,
    atoms,
    selection,
    setSelection,
    expandData,
    setExpandData,
  };
}

export function Component() {
  const instance = usePlugin(plugin);
  const selection = useValue(instance.selection);

  return (
    <Layout.Container grow>
      <NavigationHeader />
      {selection === "logs" && <RecoilLogs />}
      {selection === "atoms" && <AtomStates />}
    </Layout.Container>
  );
}
