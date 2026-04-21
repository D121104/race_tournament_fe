"use client";

import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { Sponsor } from "@/types/sponsor";
import { sponsorService } from "@/services/sponsorService";

interface SponsorModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (newSponsor: Sponsor) => void;
}

export default function SponsorModal({
  open,
  onClose,
  onCreated,
}: SponsorModalProps) {
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    try {
      const newSponsor = await sponsorService.createSponsor(values);
      message.success(`Tạo nhà tài trợ "${newSponsor.sponsorName}" thành công`);
      form.resetFields();
      onCreated(newSponsor);
    } catch (error) {
      message.error("Không thể tạo nhà tài trợ");
    }
  };

  return (
    <Modal
      title="Tạo nhanh nhà tài trợ"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden={true}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="sponsorName"
          label="Tên nhà tài trợ"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input placeholder="Ví dụ: Petronas, DHL, Rolex..." />
        </Form.Item>
        <Form.Item name="industry" label="Lĩnh vực" rules={[{ required: true, message: "Vui lòng nhập lĩnh vực" }]}>
          <Input placeholder="Ví dụ: Dầu khí, Logistics, Đồng hồ..." />
        </Form.Item>
        <Form.Item name="contactEmail" label="Email liên hệ" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
          <Input placeholder="contact@sponsor.com" />
        </Form.Item>
        <Form.Item name="contactPhone" label="SĐT" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
          <Input placeholder="+84..." />
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
