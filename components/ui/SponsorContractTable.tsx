"use client";

import React from "react";
import { Table, Tag } from "antd";
import Card from "antd/es/card/Card";
import { SponsorContractResponse } from "@/types/sponsor";

interface SponsorContractTableProps {
  contracts: SponsorContractResponse[];
  loading: boolean;
}

const getStatusTag = (status: string) => {
  switch (status) {
    case "DRAFT":
      return <Tag color="default">Bản nháp</Tag>;
    case "ACTIVE":
      return <Tag color="green">Đang hiệu lực</Tag>;
    case "EXPIRED":
      return <Tag color="orange">Hết hạn</Tag>;
    case "CANCELLED":
      return <Tag color="red">Đã hủy</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export default function SponsorContractTable({
  contracts,
  loading,
}: SponsorContractTableProps) {
  const columns = [
    { title: "Nhà tài trợ", dataIndex: "sponsorName", key: "sponsorName" },
    { title: "Giải đua", dataIndex: "tournamentName", key: "tournamentName" },
    {
      title: "Mùa giải",
      dataIndex: "seasonName",
      key: "seasonName",
      render: (t: string) => t || "Tất cả",
    },
    {
      title: "Giá trị (VNĐ)",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (v: number) => (v ? v.toLocaleString("vi-VN") : "-"),
    },
    {
      title: "Thời hạn",
      key: "period",
      render: (_: any, r: SponsorContractResponse) =>
        r.startDate && r.endDate ? `${r.startDate} → ${r.endDate}` : "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Yêu cầu",
      key: "requirements",
      render: (_: any, r: SponsorContractResponse) =>
        r.requirements?.length ? `${r.requirements.length} yêu cầu` : "-",
    },
  ];

  return (
    <Card title="Danh sách hợp đồng">
      <Table
        columns={columns}
        dataSource={contracts.map((c) => ({ ...c, key: c.id }))}
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} hợp đồng` }}
      />
    </Card>
  );
}
