import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import RaceForm from '../form/RaceForm';


interface RaceModalProps {
  initialData?: any;
  onSubmit: (values: any) => void;
  onClose: () => void;
  open: boolean;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export default function RaceModal({ initialData, onSubmit, onClose, isLoading, mode, open }: RaceModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      onClose();
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    onClose();
  };

  return (
    <>
      <Modal
        title={mode === "create" ? "Tạo chặng đua mới" : "Chỉnh sửa chặng đua"}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
      >
        <RaceForm initialData={initialData} onSubmit={onSubmit} isLoading={isLoading} 
            mode={mode}
        />
      </Modal>
    </>
  );
};
