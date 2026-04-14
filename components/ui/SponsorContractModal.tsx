"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Descriptions,
  Tag,
  Divider,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  Sponsor,
  SponsorContractResponse,
  ContractRequirement,
} from "@/types/sponsor";
import { Tournament } from "@/types/tournament";
import { Season } from "@/types/season";
import { sponsorService } from "@/services/sponsorService";
import dayjs from "dayjs";

interface SponsorContractModalProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  editingContract: SponsorContractResponse | null;
  sponsors: Sponsor[];
  tournaments: Tournament[];
  seasons: Season[];
  requirements: ContractRequirement[];
  formTournamentId: number | undefined;
  onFormTournamentChange: (tournamentId: number | undefined) => void;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  onSponsorsUpdated: () => void;
  onRequirementsUpdated: () => void;
}

const getStatusTag = (status: string) => {
  switch (status) {
    case "DRAFT":
      return <Tag color="default">Bản nháp</Tag>;
    case "ACTIVE":
      return <Tag color="green">Đang hiệu lực</Tag>;
    case "EXPIRED":
      return <Tag color="orange">Hết hạn</Tag>;
    case "CANCELLED":
      return <Tag color="red">Đã hủy</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export default function SponsorContractModal({
  open,
  mode,
  editingContract,
  sponsors,
  tournaments,
  seasons,
  requirements,
  formTournamentId,
  onFormTournamentChange,
  onClose,
  onSubmit,
  onSponsorsUpdated,
  onRequirementsUpdated,
}: SponsorContractModalProps) {
  const [contractForm] = Form.useForm();
  const [quickSponsorOpen, setQuickSponsorOpen] = useState(false);
  const [quickRequirementOpen, setQuickRequirementOpen] = useState(false);
  const [quickSponsorForm] = Form.useForm();
  const [quickRequirementForm] = Form.useForm();

  React.useEffect(() => {
    if (open) {
      if (mode === "edit" && editingContract) {
        contractForm.setFieldsValue({
          ...editingContract,
          startDate: editingContract.startDate ? dayjs(editingContract.startDate) : undefined,
          endDate: editingContract.endDate ? dayjs(editingContract.endDate) : undefined,
          requirementIds: editingContract.requirements?.map((r) => r.id) || [],
        });
      } else if (mode === "create") {
        contractForm.resetFields();
      }
    }
  }, [open, mode, editingContract, contractForm]);

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : undefined,
      endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : undefined,
    };
    await onSubmit(payload);
    contractForm.resetFields();
  };

  // ── Quick create sponsor ──
  const handleQuickCreateSponsor = async (values: any) => {
    try {
      const newSponsor = await sponsorService.createSponsor(values);
      message.success(`Tạo nhà tài trợ "${newSponsor.sponsorName}" thành công`);
      setQuickSponsorOpen(false);
      quickSponsorForm.resetFields();
      onSponsorsUpdated();
      // Auto-select the new sponsor
      contractForm.setFieldsValue({ sponsorId: newSponsor.id });
    } catch (error) {
      message.error("Không thể tạo nhà tài trợ");
    }
  };

  // ── Quick create requirement ──
  const handleQuickCreateRequirement = async (values: any) => {
    try {
      const newReq = await sponsorService.createRequirement(values);
      message.success(`Tạo yêu cầu "${newReq.requirementName}" thành công`);
      setQuickRequirementOpen(false);
      quickRequirementForm.resetFields();
      onRequirementsUpdated();
      // Auto-add the new requirement to selected list
      const currentIds = contractForm.getFieldValue("requirementIds") || [];
      contractForm.setFieldsValue({ requirementIds: [...currentIds, newReq.id] });
    } catch (error) {
      message.error("Không thể tạo yêu cầu");
    }
  };

  // ── View mode ──
  if (mode === "view" && editingContract) {
    return (
      <Modal
        title="Chi tiết hợp đồng"
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnHidden={true}
        width={700}
      >
        <div style={{ padding: "16px 0" }}>
          <Descriptions bordered column={1} styles={{ label: { fontWeight: "bold", width: "150px" } }}>
            <Descriptions.Item label="Nhà tài trợ">{editingContract.sponsorName}</Descriptions.Item>
            <Descriptions.Item label="Giải đua">{editingContract.tournamentName}</Descriptions.Item>
            <Descriptions.Item label="Mùa giải">{editingContract.seasonName || "Tất cả"}</Descriptions.Item>
            <Descriptions.Item label="Giá trị">
              {editingContract.contractValue?.toLocaleString("vi-VN")} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Thời hạn">
              {editingContract.startDate} → {editingContract.endDate}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(editingContract.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Điều khoản">
              {editingContract.terms || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Yêu cầu hợp đồng">
              {editingContract.requirements?.length > 0
                ? editingContract.requirements.map((r) => (
                    <Tag key={r.id} color="blue" style={{ marginBottom: 4 }}>
                      {r.requirementName}
                    </Tag>
                  ))
                : "-"}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Create/Edit mode ──
  return (
    <>
      <Modal
        title={mode === "create" ? "Tạo hợp đồng tài trợ" : "Sửa hợp đồng"}
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnHidden={true}
        width={700}
      >
        <Form form={contractForm} layout="vertical" onFinish={handleFinish}>
          {mode === "create" && (
            <>
              {/* Sponsor select + quick create */}
              <Form.Item
                name="sponsorId"
                label="Nhà tài trợ"
                rules={[{ required: true, message: "Chọn nhà tài trợ" }]}
              >
                <Select
                  placeholder="Chọn nhà tài trợ"
                  showSearch
                  optionFilterProp="children"
                  options={sponsors.map((s) => ({ value: s.id, label: s.sponsorName }))}
                />
              </Form.Item>
              <div style={{ marginTop: -16, marginBottom: 16 }}>
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => setQuickSponsorOpen(true)}
                  style={{ paddingLeft: 0 }}
                >
                  Tạo nhà tài trợ mới
                </Button>
              </div>

              <Form.Item
                name="tournamentId"
                label="Giải đua"
                rules={[{ required: true, message: "Chọn giải đua" }]}
              >
                <Select
                  placeholder="Chọn giải đua"
                  showSearch
                  optionFilterProp="children"
                  onChange={(value) => onFormTournamentChange(value)}
                  options={tournaments.map((t) => ({ value: t.id, label: t.tournamentName }))}
                />
              </Form.Item>
              <Form.Item name="seasonId" label="Mùa giải (tùy chọn)">
                <Select
                  placeholder="Tất cả mùa giải"
                  allowClear
                  disabled={!formTournamentId}
                  options={seasons.map((s) => ({
                    value: s.id,
                    label: `${s.seasonName} (${s.yearOfOrganization})`,
                  }))}
                />
              </Form.Item>
            </>
          )}

          <Form.Item name="contractValue" label="Giá trị hợp đồng (VNĐ)">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={1000000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="terms" label="Điều khoản">
            <Input.TextArea rows={3} placeholder="Các điều khoản của hợp đồng..." />
          </Form.Item>

          {/* Requirement select + quick create */}
          <Form.Item name="requirementIds" label="Các yêu cầu trong hợp đồng">
            <Select
              mode="multiple"
              placeholder="Chọn các yêu cầu có sẵn"
              optionFilterProp="children"
              options={requirements.map((r) => ({
                value: r.id,
                label: `${r.requirementName}${r.category ? ` (${r.category})` : ""}`,
              }))}
            />
          </Form.Item>
          <div style={{ marginTop: -16, marginBottom: 16 }}>
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => setQuickRequirementOpen(true)}
              style={{ paddingLeft: 0 }}
            >
              Tạo yêu cầu mới
            </Button>
          </div>

          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {mode === "create" ? "Ký hợp đồng" : "Cập nhật"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── Quick Create Sponsor Modal ── */}
      <Modal
        title="Tạo nhanh nhà tài trợ"
        open={quickSponsorOpen}
        onCancel={() => setQuickSponsorOpen(false)}
        footer={null}
        destroyOnHidden={true}
        width={500}
      >
        <Form form={quickSponsorForm} layout="vertical" onFinish={handleQuickCreateSponsor}>
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
          <Form.Item name="contactPhone" label="SĐT">
            <Input placeholder="+84..." />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setQuickSponsorOpen(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── Quick Create Requirement Modal ── */}
      <Modal
        title="Tạo nhanh yêu cầu hợp đồng"
        open={quickRequirementOpen}
        onCancel={() => setQuickRequirementOpen(false)}
        footer={null}
        destroyOnHidden={true}
        width={500}
      >
        <Form form={quickRequirementForm} layout="vertical" onFinish={handleQuickCreateRequirement}>
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
          <Form.Item name="category" label="Danh mục">
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
            <Button onClick={() => setQuickRequirementOpen(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
