"use client";

import React, { useState, useEffect } from "react";
import { message, Tabs, Modal } from "antd";
import {
  Sponsor,
  SponsorContractResponse,
  ContractRequirement,
} from "@/types/sponsor";
import { Tournament } from "@/types/tournament";
import { Season } from "@/types/season";
import { sponsorService } from "@/services/sponsorService";
import { tournamentService } from "@/services/tournamentService";
import { seasonService } from "@/services/seasonService";
import dayjs from "dayjs";

// Components
import SponsorTable from "@/components/ui/SponsorTable";
import SponsorModal from "@/components/ui/SponsorModal";
import SponsorContractTable from "@/components/ui/SponsorContractTable";
import SponsorContractModal from "@/components/ui/SponsorContractModal";
import ContractRequirementTable from "@/components/ui/ContractRequirementTable";
import ContractRequirementModal from "@/components/ui/ContractRequirementModal";

export default function SponsorPage() {
  // Data states
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [contracts, setContracts] = useState<SponsorContractResponse[]>([]);
  const [requirements, setRequirements] = useState<ContractRequirement[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);

  // Sponsor modal
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [sponsorModalMode, setSponsorModalMode] = useState<"create" | "edit">("create");
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  // Contract modal
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [contractModalMode, setContractModalMode] = useState<"create" | "edit" | "view">("create");
  const [editingContract, setEditingContract] = useState<SponsorContractResponse | null>(null);

  // Requirement modal
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);

  // Filters
  const [filterTournamentId, setFilterTournamentId] = useState<number | undefined>(undefined);
  const [formTournamentId, setFormTournamentId] = useState<number | undefined>(undefined);

  // ─── DATA LOADING ───
  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (filterTournamentId) {
      loadContractsByTournament(filterTournamentId);
    } else {
      loadContracts();
    }
  }, [filterTournamentId]);

  useEffect(() => {
    if (formTournamentId) {
      loadSeasons(formTournamentId);
    } else {
      setSeasons([]);
    }
  }, [formTournamentId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [sponsorData, contractData, reqData, tournamentData] = await Promise.all([
        sponsorService.getAllSponsors(),
        sponsorService.getAllContracts(),
        sponsorService.getAllRequirements(),
        tournamentService.getAllTournaments(),
      ]);
      setSponsors(Array.isArray(sponsorData) ? sponsorData : []);
      setContracts(Array.isArray(contractData) ? contractData : []);
      setRequirements(Array.isArray(reqData) ? reqData : []);
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
    } catch (error) {
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const loadContracts = async () => {
    try {
      const data = await sponsorService.getAllContracts();
      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Không thể tải danh sách hợp đồng");
    }
  };

  const loadContractsByTournament = async (tournamentId: number) => {
    try {
      const data = await sponsorService.getContractsByTournament(tournamentId);
      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Không thể tải danh sách hợp đồng");
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

  const reloadSponsors = async () => {
    try {
      const data = await sponsorService.getAllSponsors();
      setSponsors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error reloading sponsors:", error);
    }
  };

  const reloadRequirements = async () => {
    try {
      const data = await sponsorService.getAllRequirements();
      setRequirements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error reloading requirements:", error);
    }
  };

  // ─── SPONSOR HANDLERS ───
  const handleCreateSponsor = () => {
    setSponsorModalMode("create");
    setEditingSponsor(null);
    setSponsorModalOpen(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setSponsorModalMode("edit");
    setEditingSponsor(sponsor);
    setSponsorModalOpen(true);
  };

  const handleSponsorSubmit = async (values: any) => {
    try {
      if (sponsorModalMode === "create") {
        await sponsorService.createSponsor(values);
        message.success("Tạo nhà tài trợ thành công");
      } else if (editingSponsor) {
        await sponsorService.updateSponsor(editingSponsor.id, values);
        message.success("Cập nhật nhà tài trợ thành công");
      }
      setSponsorModalOpen(false);
      loadAll();
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const handleDeleteSponsor = (sponsor: Sponsor) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa nhà tài trợ "${sponsor.sponsorName}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await sponsorService.deleteSponsor(sponsor.id);
          message.success("Xóa nhà tài trợ thành công");
          loadAll();
        } catch (error) {
          message.error("Không thể xóa nhà tài trợ");
        }
      },
    });
  };

  // ─── CONTRACT HANDLERS ───
  const handleCreateContract = () => {
    setContractModalMode("create");
    setEditingContract(null);
    setFormTournamentId(undefined);
    setContractModalOpen(true);
  };

  const handleViewContract = (contract: SponsorContractResponse) => {
    setContractModalMode("view");
    setEditingContract(contract);
    setContractModalOpen(true);
  };

  const handleEditContract = (contract: SponsorContractResponse) => {
    setContractModalMode("edit");
    setEditingContract(contract);
    setFormTournamentId(contract.tournamentId);
    setContractModalOpen(true);
  };

  const handleContractSubmit = async (values: any) => {
    try {
      if (contractModalMode === "create") {
        await sponsorService.createContract(values);
        message.success("Tạo hợp đồng thành công");
      } else if (editingContract) {
        await sponsorService.updateContract(editingContract.id, values);
        message.success("Cập nhật hợp đồng thành công");
      }
      setContractModalOpen(false);
      loadAll();
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const handleActivateContract = async (id: number) => {
    try {
      await sponsorService.activateContract(id);
      message.success("Kích hoạt hợp đồng thành công");
      loadAll();
    } catch (error) {
      message.error("Không thể kích hoạt hợp đồng");
    }
  };

  const handleCancelContract = (id: number) => {
    Modal.confirm({
      title: "Xác nhận hủy hợp đồng",
      content: "Bạn có chắc chắn muốn hủy hợp đồng này?",
      okText: "Hủy hợp đồng",
      okType: "danger",
      cancelText: "Quay lại",
      onOk: async () => {
        try {
          await sponsorService.cancelContract(id);
          message.success("Hủy hợp đồng thành công");
          loadAll();
        } catch (error) {
          message.error("Không thể hủy hợp đồng");
        }
      },
    });
  };

  const handleDeleteContract = (contract: SponsorContractResponse) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa hợp đồng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await sponsorService.deleteContract(contract.id);
          message.success("Xóa hợp đồng thành công");
          loadAll();
        } catch (error) {
          message.error("Không thể xóa hợp đồng");
        }
      },
    });
  };

  // ─── REQUIREMENT HANDLERS ───
  const handleCreateRequirement = () => {
    setRequirementModalOpen(true);
  };

  const handleRequirementSubmit = async (values: any) => {
    try {
      await sponsorService.createRequirement(values);
      message.success("Tạo yêu cầu thành công");
      setRequirementModalOpen(false);
      reloadRequirements();
    } catch (error) {
      message.error("Không thể tạo yêu cầu");
    }
  };

  // ─── RENDER ───
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Quản lý Nhà tài trợ & Hợp đồng</h1>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Nhà tài trợ",
            children: (
              <SponsorTable
                sponsors={sponsors}
                loading={loading}
                onCreateSponsor={handleCreateSponsor}
                onEditSponsor={handleEditSponsor}
                onDeleteSponsor={handleDeleteSponsor}
              />
            ),
          },
          {
            key: "2",
            label: "Hợp đồng tài trợ",
            children: (
              <SponsorContractTable
                contracts={contracts}
                tournaments={tournaments}
                loading={loading}
                filterTournamentId={filterTournamentId}
                onFilterChange={setFilterTournamentId}
                onCreateContract={handleCreateContract}
                onViewContract={handleViewContract}
                onEditContract={handleEditContract}
                onActivateContract={handleActivateContract}
                onCancelContract={handleCancelContract}
                onDeleteContract={handleDeleteContract}
              />
            ),
          },
          {
            key: "3",
            label: "Danh mục yêu cầu",
            children: (
              <ContractRequirementTable
                requirements={requirements}
                loading={loading}
                onCreateRequirement={handleCreateRequirement}
                onDeleted={reloadRequirements}
              />
            ),
          },
        ]}
      />

      {/* Modals */}
      <SponsorModal
        open={sponsorModalOpen}
        mode={sponsorModalMode}
        editingSponsor={editingSponsor}
        onClose={() => setSponsorModalOpen(false)}
        onSubmit={handleSponsorSubmit}
      />

      <SponsorContractModal
        open={contractModalOpen}
        mode={contractModalMode}
        editingContract={editingContract}
        sponsors={sponsors}
        tournaments={tournaments}
        seasons={seasons}
        requirements={requirements}
        formTournamentId={formTournamentId}
        onFormTournamentChange={setFormTournamentId}
        onClose={() => setContractModalOpen(false)}
        onSubmit={handleContractSubmit}
        onSponsorsUpdated={reloadSponsors}
        onRequirementsUpdated={reloadRequirements}
      />

      <ContractRequirementModal
        open={requirementModalOpen}
        onClose={() => setRequirementModalOpen(false)}
        onSubmit={handleRequirementSubmit}
      />
    </div>
  );
}
