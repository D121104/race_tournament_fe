"use client";

import RaceTable from "@/components/ui/RaceTable";
import { useState, useEffect } from "react";
import { Race } from "@/types/race";
import { Season } from "@/types/season";
import { Tournament } from "@/types/tournament";
import { raceService } from "@/services/raceService";
import { seasonService } from "@/services/seasonService";
import { tournamentService } from "@/services/tournamentService";
import { message, Spin, Alert, Select } from "antd";

export default function RacePage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ✅ Sử dụng undefined thay vì null để tương thích với Ant Design Select
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | undefined>(undefined);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | undefined>(undefined);

  // Load tournaments và all races khi component mount
  useEffect(() => {
    loadTournaments();
    loadAllRaces(); // ✅ Load all races ngay khi mount
  }, []);

  // Load seasons khi chọn tournament
  useEffect(() => {
    if (selectedTournamentId) {
      loadSeasonsByTournament(selectedTournamentId);
    } else {
      // Khi không chọn tournament (Tất cả) → load all seasons
      loadAllSeasons();
    }
  }, [selectedTournamentId]);

  // Load races khi chọn season
  useEffect(() => {
    if (selectedSeasonId) {
      loadRaces(selectedSeasonId);
    } else if (selectedTournamentId !== undefined) {
      // Chọn tournament nhưng chưa chọn season → clear races
      setRaces([]);
    }
    // Không gọi loadAllRaces() ở đây để tránh infinite loop
  }, [selectedSeasonId, selectedTournamentId]);

  const loadTournaments = async () => {
    try {
      const data = await tournamentService.getAllTournaments();
      // Đảm bảo data là array
      setTournaments(Array.isArray(data) ? data : []);
      
      // KHÔNG auto-select - để mặc định "Tất cả"
      // Load all seasons và all races ngay từ đầu
      await loadAllSeasons();
    } catch (error) {
      setError('Không thể tải danh sách giải đua');
      message.error('Không thể tải danh sách giải đua');
      console.error('Error loading tournaments:', error);
      setTournaments([]);
    }
  };

  const loadAllSeasons = async () => {
    setLoading(true);
    try {
      // Load seasons từ tất cả tournaments
      const allTournaments = await tournamentService.getAllTournaments();
      
      // Đảm bảo allTournaments là array
      if (!Array.isArray(allTournaments) || allTournaments.length === 0) {
        setSeasons([]);
        setError(null);
        return;
      }
      
      const seasonResults = await Promise.all(
        allTournaments.map(tournament =>
          seasonService.getSeasonsByTournament(tournament.id)
        )
      );
      
      const allSeasons: Season[] = [];
      seasonResults.forEach(seasons => {
        // Đảm bảo seasons là array trước khi spread
        if (Array.isArray(seasons)) {
          allSeasons.push(...seasons);
        }
      });
      
      setSeasons(allSeasons);
      setError(null);
    } catch (error) {
      setError('Không thể tải danh sách mùa giải');
      message.error('Không thể tải danh sách mùa giải');
      console.error('Error loading all seasons:', error);
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonsByTournament = async (tournamentId: number) => {
    setLoading(true); // ✅ Thêm loading state
    try {
      const data = await seasonService.getSeasonsByTournament(tournamentId);
      setSeasons(data);
      
      // Reset selectedSeasonId khi đổi tournament
      setSelectedSeasonId(null);
    } catch (error) {
      setError('Không thể tải danh sách mùa giải');
      message.error('Không thể tải danh sách mùa giải');
      console.error('Error loading seasons:', error);
      setSeasons([]);
      setSelectedSeasonId(null);
    } finally {
      setLoading(false); // ✅ Thêm finally block
    }
  };

  const loadAllRaces = async () => {
    setLoading(true);
    try {
      // ✅ Sử dụng API mới: GET /api/races/
      const allRaces = await raceService.getAllRaces(0, 1000);
      // Đảm bảo allRaces là array
      setRaces(Array.isArray(allRaces) ? allRaces : []);
      setError(null);
    } catch (error) {
      setError('Không thể tải danh sách chặng đua');
      message.error('Không thể tải danh sách chặng đua');
      console.error('Error loading all races:', error);
      setRaces([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRaces = async (seasonId: number) => {
    setLoading(true);
    try {
      const data = await raceService.getRacesBySeason(seasonId);
      setRaces(data);
      setError(null);
    } catch (error) {
      setError('Không thể tải danh sách chặng đua');
      message.error('Không thể tải danh sách chặng đua');
      console.error('Error loading races:', error);
      setRaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRace = async (values: any) => {
    // Kiểm tra xem đã chọn tournament và season chưa
    if (!selectedTournamentId || !selectedSeasonId) {
      message.error('Vui lòng chọn giải đua và mùa giải trước khi tạo chặng đua');
      throw new Error('Tournament and Season must be selected');
    }

    try {
      // Thêm seasonId từ dropdown đã chọn
      const raceData = {
        ...values,
        seasonId: selectedSeasonId,
      };
      await raceService.createRace(raceData);
      message.success('Tạo chặng đua thành công');
      if (selectedSeasonId) {
        loadRaces(selectedSeasonId);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Tournament and Season must be selected') {
        // Error đã được handle ở trên
        throw error;
      }
      message.error('Không thể tạo chặng đua');
      console.error('Error creating race:', error);
      throw error;
    }
  };

  const handleUpdateRace = async (id: number, values: any) => {
    try {
      // Thêm seasonId từ dropdown đã chọn
      const raceData = {
        ...values,
        seasonId: selectedSeasonId,
      };
      await raceService.updateRace(id, raceData);
      message.success('Cập nhật chặng đua thành công');
      
      // ✅ Reload đúng dữ liệu
      if (selectedSeasonId) {
        loadRaces(selectedSeasonId);
      } else if (selectedTournamentId === undefined) {
        loadAllRaces(); // Reload all races
      }
    } catch (error) {
      message.error('Không thể cập nhật chặng đua');
      console.error('Error updating race:', error);
      throw error;
    }
  };

  const handleDeleteRace = async (id: number) => {
    try {
      await raceService.deleteRace(id);
      message.success('Xóa chặng đua thành công');
      
      // ✅ Reload đúng dữ liệu
      if (selectedSeasonId) {
        loadRaces(selectedSeasonId);
      } else if (selectedTournamentId === undefined) {
        loadAllRaces(); // Reload all races
      }
    } catch (error) {
      message.error('Không thể xóa chặng đua');
      console.error('Error deleting race:', error);
      throw error; // Re-throw để RaceTable có thể handle
    }
  };

  // ✅ Handler cho Tournament dropdown - value có thể undefined khi clear
  const handleTournamentChange = (tournamentId: number | undefined) => {
    setSelectedTournamentId(tournamentId);
    // Reset season khi clear tournament
    if (tournamentId === undefined) {
      setSelectedSeasonId(undefined);
      loadAllRaces(); // Load tất cả races
    }
  };

  // ✅ Handler cho Season dropdown - value có thể undefined khi clear
  const handleSeasonChange = (seasonId: number | undefined) => {
    setSelectedSeasonId(seasonId);
    // Nếu clear season và tournament cũng chưa chọn → load all races
    if (seasonId === undefined && selectedTournamentId === undefined) {
      loadAllRaces();
    }
  };

  if (error && tournaments.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Quản lý Chặng đua</h1>
      
      {/* Filter Section */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* Tournament Dropdown */}
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Chọn giải đua:
          </label>
          <Select
            style={{ width: 300 }}
            placeholder="Tất cả"
            value={selectedTournamentId}
            onChange={handleTournamentChange}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={tournaments?.map(tournament => ({
              value: tournament.id,
              label: tournament.tournamentName,
            }))}
          />
        </div>

        {/* Season Dropdown */}
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Chọn mùa giải:
          </label>
          <Select
            style={{ width: 300 }}
            placeholder={selectedTournamentId ? "Tất cả" : "Chọn giải đua trước"}
            value={selectedSeasonId}
            onChange={handleSeasonChange}
            disabled={selectedTournamentId === undefined}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={
              selectedTournamentId
                ? seasons.map(season => ({
                    value: season.id,
                    label: `${season.seasonName} (${season.yearOfOrganization})`,
                  }))
                : []
            }
          />
        </div>
      </div>

      {/* Race Table */}
      <RaceTable
        races={races}
        loading={loading}
        onCreateRace={handleCreateRace}
        onUpdateRace={handleUpdateRace}
        onDeleteRace={handleDeleteRace}
        seasons={seasons}
        tournaments={tournaments}
        canCreate={selectedTournamentId !== undefined && selectedSeasonId !== undefined}
      />
    </div>
  );
}
