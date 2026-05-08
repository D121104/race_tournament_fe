"use client";

import React, { useState } from "react";
import { Table, Tag, Button, Modal, Descriptions } from "antd";
import Card from "antd/es/card/Card";
import { EyeOutlined } from "@ant-design/icons"; // Import icon
import { SponsorContractResponse } from "@/types/sponsor";

interface SponsorContractTableProps {
  contracts: SponsorContractResponse[];
  loading: boolean;
}

const getStatusTag = (status: string) => {
  switch (status) {
    case "DRAFT": return <Tag color="default">Bản nháp</Tag>;
    case "ACTIVE": return <Tag color="green">Đang hiệu lực</Tag>;
    case "EXPIRED": return <Tag color="orange">Hết hạn</Tag>;
    case "CANCELLED": return <Tag color="red">Đã hủy</Tag>;
    default: return <Tag>{status}</Tag>;
  }
};

export default function SponsorContractTable({ contracts, loading }: SponsorContractTableProps) {
  // 1. Quản lý trạng thái Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<SponsorContractResponse | null>(null);

  const showDetails = (record: SponsorContractResponse) => {
    setSelectedContract(record);
    setIsModalOpen(true);
  };

  const columns = [
    { title: "Nhà tài trợ", dataIndex: "sponsorName", key: "sponsorName" },
    { title: "Giải đua", dataIndex: "tournamentName", key: "tournamentName" },
    {
      title: "Giá trị (VNĐ)",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (v: number) => (v ? v.toLocaleString("vi-VN") : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    // 2. Thêm cột Hành động
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: SponsorContractResponse) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => showDetails(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card title="Danh sách hợp đồng">
      <Table
        columns={columns}
        dataSource={contracts.map((c) => ({ ...c, key: c.id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* 3. Modal hiển thị chi tiết */}
      <Modal
        title="Chi tiết hợp đồng tài trợ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>
        ]}
        width={700}
      >
        {selectedContract && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Nhà tài trợ">{selectedContract.sponsorName}</Descriptions.Item>
            <Descriptions.Item label="Giải đua">{selectedContract.tournamentName}</Descriptions.Item>
            <Descriptions.Item label="Mùa giải">{selectedContract.seasonName || "Tất cả"}</Descriptions.Item>
            <Descriptions.Item label="Giá trị">{selectedContract.contractValue?.toLocaleString("vi-VN")} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Thời hạn">
              {selectedContract.startDate} → {selectedContract.endDate}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedContract.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Yêu cầu cụ thể">
              <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                {selectedContract.requirements?.map((req, idx) => (
                  <li key={idx}>{req.requirementName}</li>
                )) || "Không có yêu cầu"}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
}