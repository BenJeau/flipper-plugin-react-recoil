import React from "react";
import {
  DataTableColumn,
  MasterDetail,
  theme,
  usePlugin,
  useValue,
} from "flipper-plugin";

import { AtomLoadableState, RowData, stateTagColor } from "../types";
import { plugin } from "..";

export const rowStyle = (state: AtomLoadableState) => ({
  ...theme.monospace,
  color: stateTagColor[state],
  margin: 0,
});

const columns: DataTableColumn<RowData>[] = [
  {
    key: "atom",
    onRender: (row) => <p style={rowStyle(row.state)}>{row.atom}</p>,
    width: 130,
  },
  {
    key: "date",
    title: "Time",
    width: 150,
    onRender: (row) => <p style={rowStyle(row.state)}>{row.date}</p>,
  },
  {
    key: "state",
    onRender: (row) => <p style={rowStyle(row.state)}>{row.state}</p>,
    filters: Object.keys(AtomLoadableState).map((value) => ({
      label: value,
      value,
      enabled: false,
    })),
    width: 90,
  },
  {
    key: "content",
    wrap: true,
    onRender: (row) => (
      <pre style={rowStyle(row.state)}>
        {JSON.stringify(row.content, null, 2)}
      </pre>
    ),
  },
];

const RecoilLogs: React.FC = () => {
  const instance = usePlugin(plugin);
  const rows = useValue(instance.rows);

  return (
    <MasterDetail
      columns={columns}
      records={rows}
      recordsKey="id"
      enableClear
      onClear={instance.clearRows}
    />
  );
};

export default RecoilLogs;
