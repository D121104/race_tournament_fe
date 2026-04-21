"use client";

import React, { useState } from "react";
import { Modal, Form, InputNumber, Input, Select, Button } from "antd";
import { RaceResultResponse, UpdateRaceResultRequest } from "@/types/raceResult";

interface RaceResultModalProps {
  open: boolean;
  data: RaceResultResponse | null;
  onClose: () => void;
  onSubmit: (resultId: number, values: UpdateRaceResultRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function RaceResultModal({
  open,
  data,
  onClose,
  onSubmit,
  isLoading,
}: RaceResultModalProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (data && open) {
      form.setFieldsValue({
        time: data.time,
        lapsCompleted: data.lapsCompleted,
        finalPosition: data.finalPosition,
        status: data.status,
        points: data.points,
      });
    }
  }, [data, open, form]);

  const handleSubmit = async (values: any) => {
    if (!data) return;
    await onSubmit(data.id, values);
    form.resetFields();
  };

  return (
    <Modal
      title={`Cập nhật kết quả - ${data?.racer?.racerName || ""}`}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden={true}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="finalPosition" label="Vị trí về đích" rules={[{ required: true, message: "Vui lòng nhập vị trí về đích" }]}>
          <Input placeholder="Ví dụ: 1, 2, 3..." />
        </Form.Item>

        <Form.Item name="time" label="Thời gian hoàn thành" rules={[{ required: true, message: "Vui lòng nhập thời gian hoàn thành" }]}>
          <Input placeholder="Ví dụ: 1:30:45.123" />
        </Form.Item>

        <Form.Item name="lapsCompleted" label="Số vòng hoàn thành" rules={[{ required: true, message: "Vui lòng nhập số vòng hoàn thành" }]}>
          <Input placeholder="Ví dụ: 53" />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
          <Select
            options={[
              { value: "Finished", label: "Hoàn thành (Finished)" },
              { value: "DNF", label: "Không hoàn thành (DNF)" },
              { value: "DSQ", label: "Bị loại (DSQ)" },
            ]}
          />
        </Form.Item>

        <Form.Item name="points" label="Điểm số" rules={[{ required: true, message: "Vui lòng nhập điểm số" }]}>
          <InputNumber style={{ width: "100%" }} min={0} step={0.5} />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
