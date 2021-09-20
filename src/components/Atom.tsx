import React from "react";
import { Card, Col, Row, Tag, Tooltip, Typography } from "antd";
import { DataInspector, usePlugin, useValue } from "flipper-plugin";
import { ClockCircleOutlined } from "@ant-design/icons";

import { RowData } from "../types";
import { plugin } from "..";

const Atom: React.FC<RowData> = ({ atom, date, id, content }) => {
  const instance = usePlugin(plugin);
  const expandData = useValue(instance.expandData);

  return (
    <Col span={24} xl={12} xxl={8}>
      <Card
        title={
          <Tooltip title="Atom Name">
            <Tag color="purple">{atom}</Tag>
          </Tooltip>
        }
        key={id}
        extra={
          <Tooltip title="Last Updated">
            <Row align="middle">
              <ClockCircleOutlined style={{ marginRight: 5 }} />
              <Typography.Text type="secondary">{date}</Typography.Text>
            </Row>
          </Tooltip>
        }
        size="small"
        bodyStyle={{ backgroundColor: "#9696961a" }}
      >
        <DataInspector data={content} collapsed={!expandData} />
      </Card>
    </Col>
  );
};

export default Atom;
