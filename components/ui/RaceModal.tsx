import React from 'react';
import { Modal } from 'antd';
import RaceForm from '../form/RaceForm';


interface RaceModalProps {
  initialData?: any;
  onSubmit: (values: any) => void;
  onClose: () => void;
  open: boolean;
  isLoading?: boolean;
  mode: "create" | "edit" | "view";
}

export default function RaceModal({ initialData, onSubmit, onClose, isLoading, mode, open }: RaceModalProps) {
  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Tạo chặng đua mới";
      case "edit":
        return "Chỉnh sửa chặng đua";
      case "view":
        return "Chi tiết chặng đua";
      default:
        return "Chặng đua";
    }
  };

  return (
    <Modal
      title={getTitle()}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden={true}
      width={600}
    >
      <RaceForm 
        initialData={initialData} 
        onSubmit={onSubmit} 
        isLoading={isLoading} 
        mode={mode}
        onClose={onClose}
      />
    </Modal>
  );
};
