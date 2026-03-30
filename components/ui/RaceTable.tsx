import React from "react";
import { Flex, Space, Table, Button } from "antd";
import type { TableProps } from "antd";
import Card from "antd/es/card/Card";
import style from "antd/es/_util/wave/style";

interface DataType {
  id: number;
  raceName: string;
  description: string;
  location: string;
  date: string;
  length: number;
  numberOfLaps: number;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Tên chặng đua",
    dataIndex: "raceName",
    key: "raceName",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Địa điểm",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Ngày tổ chức",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Độ dài (km)",
    dataIndex: "length",
    key: "length",
  },
  {
    title: "Số vòng đua",
    dataIndex: "numberOfLaps",
    key: "numberOfLaps",
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_, record) => (
      <Space size="medium">
        <Button color="primary" variant="solid">
          {" "}
          Sửa{" "}
        </Button>
        <Button color="danger" variant="solid">
          {" "}
          Xóa{" "}
        </Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    id: 1,
    raceName: "Italian Grand Prix",
    description:
      "Thánh đường tốc độ với những đoạn thẳng dài và góc cua huyền thoại.",
    location: "Autodromo Nazionale Monza, Italy",
    date: "2026-09-06",
    length: 5.793,
    numberOfLaps: 53,
  },
  {
    id: 2,
    raceName: "Singapore Grand Prix",
    description:
      "Chặng đua đêm đầy thử thách dưới ánh đèn rực rỡ của vịnh Marina.",
    location: "Marina Bay Street Circuit, Singapore",
    date: "2026-09-20",
    length: 4.94,
    numberOfLaps: 62,
  },
  {
    id: 3,
    raceName: "Japanese Grand Prix",
    description:
      "Đường đua duy nhất có cấu trúc hình số 8, đòi hỏi kỹ thuật cực cao.",
    location: "Suzuka International Racing Course, Japan",
    date: "2026-10-11",
    length: 5.807,
    numberOfLaps: 53,
  },
  {
    id: 5,
    raceName: "Belgian Grand Prix",
    description:
      "Đường đua xuyên qua rừng Ardennes với góc cua Eau Rouge nổi tiếng.",
    location: "Circuit de Spa-Francorchamps, Belgium",
    date: "2026-08-30",
    length: 7.004,
    numberOfLaps: 44,
  },
  {
    id: 6,
    raceName: "Monaco Grand Prix",
    description: "Chặng đua huyền thoại qua các con phố của Monte Carlo.",
    location: "Circuit de Monaco",
    date: "2026-05-24",
    length: 3.337,
    numberOfLaps: 78,
  },
  {
    id: 7,
    raceName: "Monaco Grand Prix",
    description: "Chặng đua huyền thoại qua các con phố của Monte Carlo.",
    location: "Circuit de Monaco",
    date: "2026-05-24",
    length: 3.337,
    numberOfLaps: 78,
  },
];

export default function RaceTable() {
  return (
    <Card
      title="Danh sách chặng đua"
      style={{ width: "100%" }}
      extra={
        <a href="#">
          <Button color="cyan" variant="solid">
            Tạo chặng đua mới
          </Button>
        </a>
      }
    >
      <Table<DataType> columns={columns} dataSource={data} />;
    </Card>
  );
}
