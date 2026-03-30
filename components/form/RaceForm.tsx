// src/components/forms/UserForm.tsx
"use client";
import { Form, Button, Input } from "antd";

interface RaceFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export default function RaceForm({
  initialValues,
  onSubmit,
  isLoading,
  mode,
}: RaceFormProps) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="raceName"
        label="Tên chặng đua"
        rules={[{ required: true }]}
      >
        <Input disabled={mode === "edit"} />{" "}
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
