import React from "react";
import { Checkbox, Form, Row, Typography } from "antd";
import { Layout, theme, Toolbar, usePlugin, useValue } from "flipper-plugin";
import { CoffeeOutlined } from "@ant-design/icons";

import Atom from "../components/Atom";
import { plugin } from "..";

const AtomStates: React.FC = () => {
  const instance = usePlugin(plugin);
  const expandData = useValue(instance.expandData);
  const atoms = useValue(instance.atoms);

  return (
    <>
      <Toolbar position="bottom">
        <Checkbox
          checked={expandData}
          onChange={({ target: { checked } }) =>
            instance.setExpandData(checked)
          }
        >
          Expand atom states
        </Checkbox>
      </Toolbar>
      <Layout.ScrollContainer style={{ marginTop: 8, marginBottom: 8 }}>
        {Object.values(atoms).length > 0 ? (
          <Row wrap gutter={[8, 8]} style={{ marginLeft: 4, marginRight: 4 }}>
            {Object.values(atoms).map((row) => (
              <Atom {...row} />
            ))}
          </Row>
        ) : (
          <Layout.Container
            center
            style={{
              width: "100%",
              padding: 40,
              color: theme.textColorSecondary,
            }}
          >
            <CoffeeOutlined style={{ fontSize: "2em", margin: 8 }} />
            <Typography.Text
              type="secondary"
              style={{ maxWidth: 300, textAlign: "center" }}
            >
              No recorded atom change, states will appear once atoms will be
              modified
            </Typography.Text>
          </Layout.Container>
        )}
      </Layout.ScrollContainer>
    </>
  );
};

export default AtomStates;
