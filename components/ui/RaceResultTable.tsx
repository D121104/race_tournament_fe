"use client";

import React, { useState } from "react";
import { Table, Button, Space, Tag, message } from "antd";
import type { TableProps } from "antd";
import Card from "antd/es/card/Card";
import RaceResultModal from "./RaceResultModal";
import { RaceResultResponse, UpdateRaceResultRequest } from "@/types/raceResult";

interface RaceResultTableProps {
  results: RaceResultResponse[];
  loading: boolean;
  onUpdateResult: (resultId: number, values: UpdateRaceResultRequest) => Promise<void>;
}

export default function RaceResultTable({
  results,
  loading,
  onUpdateResult,
}: RaceResultTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<RaceResultResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (record: RaceResultResponse) => {
    setSelectedResult(record);
    setModalOpen(true);
  };

  const handleSubmit = async (resultId: number, values: UpdateRaceResultRequest) => {
    setSubmitting(true);
    try {
      await onUpdateResult(resultId, values);
      setModalOpen(false);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Finished":
        return <Tag color="green">Hoàn thành</Tag>;
      case "DNF":
        return <Tag color="orange">DNF</Tag>;
      case "DSQ":
        return <Tag color="red">Bị loại</Tag>;
      default:
        return <Tag color="default">{status || "Chưa cập nhật"}</Tag>;
    }
  };

  const columns: TableProps<RaceResultResponse>["columns"] = [
    {
      title: "Vị trí",
      dataIndex: "finalPosition",
      key: "finalPosition",
      width: 80,
      sorter: (a, b) => {
        const posA = parseInt(a.finalPosition) || 999;
        const posB = parseInt(b.finalPosition) || 999;
        return posA - posB;
      },
      render: (text) => text || "-",
    },
    {
      title: "Tay đua",
      key: "racerName",
      render: (_, record) => record.racer?.racerName || "-",
    },
    {
      title: "Quốc tịch",
      key: "nationality",
      render: (_, record) => record.racer?.nationality || "-",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      render: (text) => text || "-",
    },
    {
      title: "Vòng hoàn thành",
      dataIndex: "lapsCompleted",
      key: "lapsCompleted",
      render: (text) => text || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Điểm",
      dataIndex: "points",
      key: "points",
      sorter: (a, b) => a.points - b.points,
      render: (points) => (points !== undefined && points !== null ? points : "-"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            color="primary"
            variant="solid"
            onClick={() => handleEdit(record)}
          >
            Cập nhật
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Bảng kết quả chặng đua" style={{ width: "100%" }}>
      <Table<RaceResultResponse>
        columns={columns}
        dataSource={results.map((r) => ({ ...r, key: r.id }))}
        loading={loading}
        pagination={false}
        locale={{
          emptyText: "Chọn chặng đua để xem kết quả",
        }}
      />
      <RaceResultModal
        open={modalOpen}
        data={selectedResult}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </Card>
  );
}
