"use client";

import React from "react";
import { Table, Button, Space } from "antd";
import Card from "antd/es/card/Card";
import { Sponsor } from "@/types/sponsor";

interface SponsorTableProps {
  sponsors: Sponsor[];
  loading: boolean;
  onCreateSponsor: () => void;
  onEditSponsor: (sponsor: Sponsor) => void;
  onDeleteSponsor: (sponsor: Sponsor) => void;
}

export default function SponsorTable({
  sponsors,
  loading,
  onCreateSponsor,
  onEditSponsor,
  onDeleteSponsor,
}: SponsorTableProps) {
  const columns = [
    { title: "Tên nhà tài trợ", dataIndex: "sponsorName", key: "sponsorName" },
    { title: "Lĩnh vực", dataIndex: "industry", key: "industry", render: (t: string) => t || "-" },
    { title: "Email", dataIndex: "contactEmail", key: "contactEmail", render: (t: string) => t || "-" },
    { title: "SĐT", dataIndex: "contactPhone", key: "contactPhone", render: (t: string) => t || "-" },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Sponsor) => (
        <Space size="small">
          <Button color="primary" variant="solid" onClick={() => onEditSponsor(record)}>
            Sửa
          </Button>
          <Button color="danger" variant="solid" onClick={() => onDeleteSponsor(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách nhà tài trợ"
      extra={
        <Button color="cyan" variant="solid" onClick={onCreateSponsor}>
          Thêm nhà tài trợ
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={sponsors.map((s) => ({ ...s, key: s.id }))}
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} nhà tài trợ` }}
      />
    </Card>
  );
}
