"use client";

import React, { useState, useEffect } from "react";
import { message, Button } from "antd";
import { SponsorContractResponse } from "@/types/sponsor";
import { sponsorContractService } from "@/services/sponsorContractService";

// Components
import SponsorContractTable from "@/components/ui/SponsorContractTable";
import SponsorContractModal from "@/components/ui/SponsorContractModal";

export default function SponsorContractPage() {
  const [contracts, setContracts] = useState<SponsorContractResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const data = await sponsorContractService.getAllContracts();
      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const handleContractSubmit = async (values: any) => {
    try {
      await sponsorContractService.createContract(values);
      message.success("Tạo hợp đồng thành công");
      setContractModalOpen(false);
      loadContracts();
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Quản lý Hợp đồng tài trợ</h1>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          size="large"
          onClick={() => setContractModalOpen(true)}
          loading={loading}
        >
          Tạo hợp đồng mới
        </Button>
      </div>

      <SponsorContractTable
        contracts={contracts}
        loading={loading}
      />

      <SponsorContractModal
        open={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        onSubmit={handleContractSubmit}
      />
    </div>
  );
}
