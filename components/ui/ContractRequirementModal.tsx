"use client";

import React from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { ContractRequirement } from "@/types/sponsor";
import { contractRequirementService } from "@/services/contractRequirementService";

interface ContractRequirementModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (newRequirement: ContractRequirement) => void;
}

export default function ContractRequirementModal({
  open,
  onClose,
  onCreated,
}: ContractRequirementModalProps) {
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    try {
      const newReq = await contractRequirementService.createRequirement(values);
      message.success(`Tạo yêu cầu "${newReq.requirementName}" thành công`);
      form.resetFields();
      onCreated(newReq);
    } catch (error) {
      message.error("Không thể tạo yêu cầu");
    }
  };

  return (
    <Modal
      title="Tạo nhanh yêu cầu hợp đồng"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden={true}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="requirementName"
          label="Tên yêu cầu"
          rules={[{ required: true, message: "Vui lòng nhập tên yêu cầu" }]}
        >
          <Input placeholder="Ví dụ: Logo trên xe đua, Quảng cáo tại sự kiện..." />
        </Form.Item>
        <Form.Item name="description" label="Mô tả chi tiết">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
          <Select
            placeholder="Chọn hoặc nhập danh mục"
            allowClear
            options={[
              { value: "Quảng cáo", label: "Quảng cáo" },
              { value: "Thương hiệu", label: "Thương hiệu" },
              { value: "Sự kiện", label: "Sự kiện" },
              { value: "Truyền thông", label: "Truyền thông" },
              { value: "Khác", label: "Khác" },
            ]}
          />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Tạo mới
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
