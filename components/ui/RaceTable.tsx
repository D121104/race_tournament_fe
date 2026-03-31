import React, { useState, useEffect } from "react";
import { Flex, Space, Table, Button, message, Modal } from "antd";
import type { TableProps } from "antd";
import Card from "antd/es/card/Card";
import RaceModal from "./RaceModal";
import { Race } from "@/types/race";
import { Season } from "@/types/season";
import { Tournament } from "@/types/tournament";

interface DataType extends Race {
  key: number;
  tournamentName?: string;
  seasonName?: string;
}

interface ModalConfig {
  open: boolean;
  data: Race | null;
  mode: "create" | "edit" | "view";
}

interface RaceTableProps {
  races: Race[];
  loading: boolean;
  onCreateRace: (values: any) => Promise<void>;
  onUpdateRace: (id: number, values: any) => Promise<void>;
  onDeleteRace: (id: number) => Promise<void>;
  seasons: Season[];
  tournaments: Tournament[];
  canCreate: boolean; // Thêm prop để control nút tạo mới
}

export default function RaceTable({
  races,
  loading,
  onCreateRace,
  onUpdateRace,
  onDeleteRace,
  seasons,
  tournaments,
  canCreate,
}: RaceTableProps) {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({ 
    open: false, 
    data: null, 
    mode: "create" 
  });
  const [submitting, setSubmitting] = useState(false);

  // Tạo data với thông tin tournament và season
  const dataSource: DataType[] = races.map((race) => {
    const season = seasons.find(s => s.id === race.seasonId);
    const tournament = season ? tournaments.find(t => t.id === season.tournamentId) : null;
    
    return {
      ...race,
      key: race.id,
      seasonName: season?.seasonName ?? '-', // ✅ Default value
      tournamentName: tournament?.tournamentName ?? '-', // ✅ Default value
    };
  });

  const onClickCreate = () => {
    if (!canCreate) {
      message.warning('Vui lòng chọn giải đua và mùa giải trước khi tạo chặng đua');
      return;
    }
    setModalConfig({ open: true, data: null, mode: "create" });
  };

  const onClickEdit = (record: DataType) => {
    setModalConfig({ open: true, data: record, mode: "edit" });
  };

  const onClickView = (record: DataType) => {
    setModalConfig({ open: true, data: record, mode: "view" });
  };

  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa chặng đua "${record.raceName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await onDeleteRace(record.id);
          // Message được handle ở page.tsx
        } catch (error) {
          // Error message được handle ở page.tsx
          console.error('Delete error:', error);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      if (modalConfig.mode === "create") {
        await onCreateRace(values);
        // Message được handle ở page.tsx
      } else if (modalConfig.data) {
        await onUpdateRace(modalConfig.data.id, values);
        // Message được handle ở page.tsx
      }
      setModalConfig({ ...modalConfig, open: false });
    } catch (error) {
      // Error message được handle ở page.tsx
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Giải đua",
      dataIndex: "tournamentName",
      key: "tournamentName",
      render: (text) => text || '-',
    },
    {
      title: "Mùa giải",
      dataIndex: "seasonName",
      key: "seasonName",
      render: (text) => text || '-',
    },
    {
      title: "Tên chặng đua",
      dataIndex: "raceName",
      key: "raceName",
      render: (text) => <a>{text}</a>,
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
      render: (value) => value?.toFixed(2),
    },
    {
      title: "Số vòng",
      dataIndex: "numberOfLaps",
      key: "numberOfLaps",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button 
            color="default" 
            variant="solid" 
            onClick={() => onClickView(record)}
          >
            Xem
          </Button>
          <Button 
            color="primary" 
            variant="solid" 
            onClick={() => onClickEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            color="danger" 
            variant="solid"
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách chặng đua"
      style={{ width: "100%" }}
      extra={
        <Button 
          color="cyan" 
          variant="solid" 
          onClick={onClickCreate}
          disabled={!canCreate}
        >
          Tạo chặng đua mới
        </Button>
      }
    >
      <Table<DataType> 
        columns={columns} 
        dataSource={dataSource}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} chặng đua`,
        }}
      />
      <RaceModal 
        open={modalConfig.open} 
        initialData={modalConfig.data} 
        onClose={() => setModalConfig({ ...modalConfig, open: false })}
        onSubmit={handleSubmit}
        mode={modalConfig.mode}
        isLoading={submitting}
      />
    </Card>
  );
}
