// src/components/forms/RaceForm.tsx
"use client";
import { Form, Button, Input, DatePicker, InputNumber, Descriptions } from "antd";
import { useEffect } from "react";
import { Race } from "@/types/race";
import dayjs from "dayjs";

interface RaceFormProps {
  initialData?: Race | null;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
  mode: "create" | "edit" | "view";
  onClose?: () => void;
}

// Component riêng cho View Mode (không dùng Form)
function RaceViewDetail({ initialData, onClose }: { initialData: Race; onClose?: () => void }) {
  return (
    <div style={{ padding: '16px 0' }}>
      <Descriptions 
        bordered 
        column={1}
        styles={{ label: { fontWeight: 'bold', width: '150px' } }}
      >
        <Descriptions.Item label="Tên chặng đua">
          {initialData.raceName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          {initialData.description || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Địa điểm">
          {initialData.location || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tổ chức">
          {initialData.date ? dayjs(initialData.date).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Độ dài">
          {initialData.length ? `${initialData.length} km` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Số vòng đua">
          {initialData.numberOfLaps || '-'}
        </Descriptions.Item>
      </Descriptions>
      
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <Button onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
  );
}

// Component cho Create/Edit Mode (dùng Form)
function RaceEditForm({ 
  initialData, 
  onSubmit, 
  isLoading, 
  mode 
}: { 
  initialData?: Race | null;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}) {
  const [form] = Form.useForm();

  // Populate form khi edit
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.setFieldsValue({
        ...initialData,
        date: initialData.date ? dayjs(initialData.date) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form, mode]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="raceName"
        label="Tên chặng đua"
        rules={[
          { required: true, message: 'Vui lòng nhập tên chặng đua' },
          { max: 255, message: 'Tên chặng đua không được quá 255 ký tự' }
        ]}
      >
        <Input placeholder="Ví dụ: Italian Grand Prix" />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={3} placeholder="Mô tả chi tiết về chặng đua" />
      </Form.Item>

      <Form.Item
        name="location"
        label="Địa điểm"
        rules={[
          { required: true, message: 'Vui lòng nhập địa điểm' },
          { max: 255, message: 'Địa điểm không được quá 255 ký tự' }
        ]}
      >
        <Input placeholder="Ví dụ: Autodromo Nazionale Monza, Italy" />
      </Form.Item>

      <Form.Item
        name="date"
        label="Ngày tổ chức"
        rules={[{ required: true, message: 'Vui lòng chọn ngày tổ chức' }]}
      >
        <DatePicker 
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          placeholder="Chọn ngày"
        />
      </Form.Item>

      <Form.Item
        name="length"
        label="Độ dài (km)"
        rules={[
          { required: true, message: 'Vui lòng nhập độ dài' },
          { type: 'number', min: 0.1, message: 'Độ dài phải lớn hơn 0' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0.1}
          step={0.1}
          placeholder="Ví dụ: 5.793"
        />
      </Form.Item>

      <Form.Item
        name="numberOfLaps"
        label="Số vòng đua"
        rules={[
          { required: true, message: 'Vui lòng nhập số vòng đua' },
          { type: 'number', min: 1, message: 'Số vòng đua phải lớn hơn 0' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          step={1}
          placeholder="Ví dụ: 53"
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={isLoading}>
        {mode === "create" ? "Tạo mới" : "Cập nhật"}
      </Button>
    </Form>
  );
}

// Main component - điều hướng dựa trên mode
export default function RaceForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
  onClose,
}: RaceFormProps) {
  // View mode: render Descriptions (không có useForm)
  if (mode === "view" && initialData) {
    return <RaceViewDetail initialData={initialData} onClose={onClose} />;
  }

  // Create/Edit mode: render Form (có useForm)
  return (
    <RaceEditForm 
      initialData={initialData}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode={mode as "create" | "edit"}
    />
  );
}
