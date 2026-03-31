// src/components/forms/UserForm.tsx
"use client";
import { Form, Button, Input } from "antd";
import { useEffect } from "react";

interface RaceFormProps {
  initialData?: any;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export default function RaceForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: RaceFormProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields(); // Xóa trắng form nếu là chế độ tạo mới
    }
  }, [initialData, form, mode]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Form.Item
        name="raceName"
        label="Tên chặng đua"
        rules={[{ required: true }]}
      >
        <Input/>{" "}
        {/* Edit thì không cho sửa username */}
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input />
      </Form.Item>

      <Form.Item name="location" label="Địa điểm">
        <Input />
      </Form.Item>

      <Form.Item name="date" label="Ngày tổ chức">
        <Input />
      </Form.Item>

      <Form.Item name="length" label="Độ dài (km)">
        <Input />
      </Form.Item>

      <Form.Item name="numberOfLaps" label="Số vòng đua">
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={isLoading}>
        {mode === "create" ? "Tạo mới" : "Cập nhật"}
      </Button>
    </Form>
  );
}
