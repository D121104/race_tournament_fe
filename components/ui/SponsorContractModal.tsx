"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  Sponsor,
  ContractRequirement,
} from "@/types/sponsor";
import { Tournament } from "@/types/tournament";
import { Season } from "@/types/season";
import { sponsorService } from "@/services/sponsorService";
import { contractRequirementService } from "@/services/contractRequirementService";
import { tournamentService } from "@/services/tournamentService";
import { seasonService } from "@/services/seasonService";
import SponsorModal from "@/components/ui/SponsorModal";
import RequirementModal from "@/components/ui/ContractRequirementModal";

interface SponsorContractModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export default function SponsorContractModal({
  open,
  onClose,
  onSubmit,
}: SponsorContractModalProps) {
  const [contractForm] = Form.useForm();
  const [quickSponsorOpen, setQuickSponsorOpen] = useState(false);
  const [quickRequirementOpen, setQuickRequirementOpen] = useState(false);

  // Self-managed data states
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [requirements, setRequirements] = useState<ContractRequirement[]>([]);
  const [formTournamentId, setFormTournamentId] = useState<number | undefined>(undefined);
  const [loadingData, setLoadingData] = useState(false);

  // Load dropdown data when modal opens
  useEffect(() => {
    if (open) {
      contractForm.resetFields();
      setFormTournamentId(undefined);
      setSeasons([]);
      loadDropdownData();
    }
  }, [open]);

  // Load seasons when tournament changes
  useEffect(() => {
    if (formTournamentId) {
      loadSeasons(formTournamentId);
    } else {
      setSeasons([]);
    }
  }, [formTournamentId]);

  const loadDropdownData = async () => {
    setLoadingData(true);
    try {
      const [sponsorData, reqData, tournamentData] = await Promise.all([
        sponsorService.getAllSponsors(),
        contractRequirementService.getAllRequirements(),
        tournamentService.getAllTournaments(),
      ]);
      setSponsors(Array.isArray(sponsorData) ? sponsorData : []);
      setRequirements(Array.isArray(reqData) ? reqData : []);
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadSeasons = async (tournamentId: number) => {
    try {
      const data = await seasonService.getSeasonsByTournament(tournamentId);
      setSeasons(Array.isArray(data) ? data : []);
    } catch (error) {
      setSeasons([]);
    }
  };

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : undefined,
      endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : undefined,
    };
    await onSubmit(payload);
    contractForm.resetFields();
  };

  return (
    <>
      <Modal
        title="Ký hợp đồng tài trợ"
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnHidden={true}
        width={700}
      >
        <Spin spinning={loadingData}>
          <Form form={contractForm} layout="vertical" onFinish={handleFinish}>
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
                onChange={(value) => setFormTournamentId(value)}
                options={tournaments.map((t) => ({ value: t.id, label: t.tournamentName }))}
              />
            </Form.Item>
            <Form.Item name="seasonId" label="Mùa giải" rules={[{ required: true, message: "Chọn mùa giải" }]}>
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

            <Form.Item name="contractValue" label="Giá trị hợp đồng (VNĐ)" rules={[{ required: true, message: "Nhập giá trị hợp đồng" }]}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              />
            </Form.Item>
            <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="terms" label="Điều khoản" rules={[{ required: true, message: "Nhập điều khoản" }]}>
              <Input.TextArea rows={3} placeholder="Các điều khoản của hợp đồng..." />
            </Form.Item>

            {/* Requirement select + quick create */}
            <Form.Item name="requirementIds" label="Các yêu cầu trong hợp đồng" rules={[{ required: true, message: "Chọn yêu cầu" }]}>
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
                Ký hợp đồng
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>

      <SponsorModal
        open={quickSponsorOpen}
        onClose={() => setQuickSponsorOpen(false)}
        onCreated={(newSponsor) => {
          setQuickSponsorOpen(false);
          setSponsors((prev) => [...prev, newSponsor]);
          contractForm.setFieldsValue({ sponsorId: newSponsor.id });
        }}
      />

      <RequirementModal
        open={quickRequirementOpen}
        onClose={() => setQuickRequirementOpen(false)}
        onCreated={(newReq) => {
          setQuickRequirementOpen(false);
          setRequirements((prev) => [...prev, newReq]);
          const currentIds = contractForm.getFieldValue("requirementIds") || [];
          contractForm.setFieldsValue({ requirementIds: [...currentIds, newReq.id] });
        }}
      />
    </>
  );
}
