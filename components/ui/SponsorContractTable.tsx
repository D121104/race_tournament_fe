"use client";

import React from "react";
import { Table, Button, Space, Tag, Select } from "antd";
import Card from "antd/es/card/Card";
import { SponsorContractResponse } from "@/types/sponsor";
import { Tournament } from "@/types/tournament";

interface SponsorContractTableProps {
  contracts: SponsorContractResponse[];
  tournaments: Tournament[];
  loading: boolean;
  filterTournamentId: number | undefined;
  onFilterChange: (tournamentId: number | undefined) => void;
  onCreateContract: () => void;
  onViewContract: (contract: SponsorContractResponse) => void;
  onEditContract: (contract: SponsorContractResponse) => void;
  onActivateContract: (id: number) => void;
  onCancelContract: (id: number) => void;
  onDeleteContract: (contract: SponsorContractResponse) => void;
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
  tournaments,
  loading,
  filterTournamentId,
  onFilterChange,
  onCreateContract,
  onViewContract,
  onEditContract,
  onActivateContract,
  onCancelContract,
  onDeleteContract,
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
    {
      title: "Thao tác",
      key: "action",
      width: 320,
      render: (_: any, record: SponsorContractResponse) => (
        <Space size="small" wrap>
          <Button color="default" variant="solid" onClick={() => onViewContract(record)}>
            Xem
          </Button>
          <Button color="primary" variant="solid" onClick={() => onEditContract(record)}>
            Sửa
          </Button>
          {record.status === "DRAFT" && (
            <Button
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "#fff" }}
              onClick={() => onActivateContract(record.id)}
            >
              Kích hoạt
            </Button>
          )}
          {record.status === "ACTIVE" && (
            <Button color="danger" variant="solid" onClick={() => onCancelContract(record.id)}>
              Hủy HĐ
            </Button>
          )}
          <Button color="danger" variant="solid" onClick={() => onDeleteContract(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách hợp đồng"
      extra={
        <Space>
          <Select
            style={{ width: 250 }}
            placeholder="Lọc theo giải đua"
            value={filterTournamentId}
            onChange={onFilterChange}
            allowClear
            options={tournaments.map((t) => ({
              value: t.id,
              label: t.tournamentName,
            }))}
          />
          <Button color="cyan" variant="solid" onClick={onCreateContract}>
            Tạo hợp đồng mới
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={contracts.map((c) => ({ ...c, key: c.id }))}
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} hợp đồng` }}
      />
    </Card>
  );
}
