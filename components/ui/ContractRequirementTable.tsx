"use client";

import React from "react";
import { Table, Button, Modal, message } from "antd";
import Card from "antd/es/card/Card";
import { ContractRequirement } from "@/types/sponsor";
import { sponsorService } from "@/services/sponsorService";

interface ContractRequirementTableProps {
  requirements: ContractRequirement[];
  loading: boolean;
  onCreateRequirement: () => void;
  onDeleted: () => void;
}

export default function ContractRequirementTable({
  requirements,
  loading,
  onCreateRequirement,
  onDeleted,
}: ContractRequirementTableProps) {
  const handleDelete = (record: ContractRequirement) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Xóa yêu cầu "${record.requirementName}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await sponsorService.deleteRequirement(record.id);
          message.success("Đã xóa yêu cầu");
          onDeleted();
        } catch (error) {
          message.error("Không thể xóa yêu cầu");
        }
      },
    });
  };

  const columns = [
    { title: "Tên yêu cầu", dataIndex: "requirementName", key: "requirementName" },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (t: string) => t || "-",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (t: string) => t || "-",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: ContractRequirement) => (
        <Button color="danger" variant="solid" onClick={() => handleDelete(record)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Danh mục yêu cầu hợp đồng"
      extra={
        <Button color="cyan" variant="solid" onClick={onCreateRequirement}>
          Thêm yêu cầu
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={requirements.map((r) => ({ ...r, key: r.id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
