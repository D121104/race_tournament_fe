"use client";

import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { Sponsor } from "@/types/sponsor";

interface SponsorModalProps {
  open: boolean;
  mode: "create" | "edit";
  editingSponsor: Sponsor | null;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export default function SponsorModal({
  open,
  mode,
  editingSponsor,
  onClose,
  onSubmit,
}: SponsorModalProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) {
      if (mode === "edit" && editingSponsor) {
        form.setFieldsValue(editingSponsor);
      } else {
        form.resetFields();
      }
    }
  }, [open, mode, editingSponsor, form]);

  const handleFinish = async (values: any) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={mode === "create" ? "Thêm nhà tài trợ" : "Sửa nhà tài trợ"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden={true}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="sponsorName"
          label="Tên nhà tài trợ"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input placeholder="Ví dụ: Petronas, DHL, Rolex..." />
        </Form.Item>
        <Form.Item name="industry" label="Lĩnh vực">
          <Input placeholder="Ví dụ: Dầu khí, Logistics, Đồng hồ..." />
        </Form.Item>
        <Form.Item name="contactEmail" label="Email liên hệ">
          <Input placeholder="contact@sponsor.com" />
        </Form.Item>
        <Form.Item name="contactPhone" label="Số điện thoại">
          <Input placeholder="+84..." />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
