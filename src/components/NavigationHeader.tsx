import React from "react";
import { Radio, Row, Typography } from "antd";
import { Toolbar, usePlugin, useValue } from "flipper-plugin";
import {
  BarsOutlined,
  DeploymentUnitOutlined,
  GithubOutlined,
} from "@ant-design/icons";

import { plugin } from "..";

const NavigationHeader: React.FC = () => {
  const instance = usePlugin(plugin);
  const selection = useValue(instance.selection);

  return (
    <Toolbar
      position="bottom"
      right={
        <Row align="middle">
          <Typography.Link
            type="secondary"
            href="https://github.com/BenJeau/flipper-plugin-react-recoil"
          >
            Open Source
            <GithubOutlined style={{ margin: 8 }} />
          </Typography.Link>
        </Row>
      }
    >
      <Radio.Group
        defaultValue={selection}
        onChange={({ target: { value } }) => instance.setSelection(value)}
      >
        <Radio.Button value="atoms">
          <DeploymentUnitOutlined style={{ marginRight: 5 }} />
          <Typography.Text>Atom States</Typography.Text>
        </Radio.Button>
        <Radio.Button value="logs">
          <BarsOutlined style={{ marginRight: 5 }} />
          <Typography.Text>Recoil Logs</Typography.Text>
        </Radio.Button>
      </Radio.Group>
    </Toolbar>
  );
};

export default NavigationHeader;
