"use client";

import React, { useState, useEffect } from "react";
import { message, Select, Spin } from "antd";
import RaceResultTable from "@/components/ui/RaceResultTable";
import { RaceResultResponse, UpdateRaceResultRequest } from "@/types/raceResult";
import { Race } from "@/types/race";
import { Season } from "@/types/season";
import { Tournament } from "@/types/tournament";
import { raceResultService } from "@/services/raceResultService";
import { raceService } from "@/services/raceService";
import { seasonService } from "@/services/seasonService";
import { tournamentService } from "@/services/tournamentService";

export default function RaceResultPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [results, setResults] = useState<RaceResultResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTournamentId, setSelectedTournamentId] = useState<number | undefined>(undefined);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | undefined>(undefined);
  const [selectedRaceId, setSelectedRaceId] = useState<number | undefined>(undefined);

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      loadSeasons(selectedTournamentId);
    } else {
      setSeasons([]);
      setSelectedSeasonId(undefined);
    }
  }, [selectedTournamentId]);

  useEffect(() => {
    if (selectedSeasonId) {
      loadRaces(selectedSeasonId);
    } else {
      setRaces([]);
      setSelectedRaceId(undefined);
    }
  }, [selectedSeasonId]);

  useEffect(() => {
    if (selectedRaceId) {
      loadResults(selectedRaceId);
    } else {
      setResults([]);
    }
  }, [selectedRaceId]);

  const loadTournaments = async () => {
    try {
      const data = await tournamentService.getAllTournaments();
      setTournaments(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải danh sách giải đua");
    }
  };

  const loadSeasons = async (tournamentId: number) => {
    try {
      const data = await seasonService.getSeasonsByTournament(tournamentId);
      setSeasons(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải danh sách mùa giải");
    }
  };

  const loadRaces = async (seasonId: number) => {
    try {
      const data = await raceService.getRacesBySeason(seasonId);
      setRaces(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải danh sách chặng đua");
    }
  };

  const loadResults = async (raceId: number) => {
    setLoading(true);
    try {
      const data = await raceResultService.getResultsByRaceId(raceId);
      setResults(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải kết quả chặng đua");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResult = async (resultId: number, values: UpdateRaceResultRequest) => {
    try {
      await raceResultService.updateResult(resultId, values);
      message.success("Cập nhật kết quả thành công");
      if (selectedRaceId) {
        loadResults(selectedRaceId);
      }
    } catch {
      message.error("Không thể cập nhật kết quả");
      throw new Error("Update failed");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>Cập nhật Kết quả Chặng đua</h1>

      {/* Filter Section */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Tournament */}
        <div>
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>Giải đua:</label>
          <Select
            style={{ width: 250 }}
            placeholder="Chọn giải đua"
            value={selectedTournamentId}
            onChange={(value) => {
              setSelectedTournamentId(value);
              setSelectedSeasonId(undefined);
              setSelectedRaceId(undefined);
            }}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={tournaments.map((t) => ({ value: t.id, label: t.tournamentName }))}
          />
        </div>

        {/* Season */}
        <div>
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>Mùa giải:</label>
          <Select
            style={{ width: 250 }}
            placeholder={selectedTournamentId ? "Chọn mùa giải" : "Chọn giải đua trước"}
            value={selectedSeasonId}
            onChange={(value) => {
              setSelectedSeasonId(value);
              setSelectedRaceId(undefined);
            }}
            disabled={!selectedTournamentId}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={seasons.map((s) => ({
              value: s.id,
              label: `${s.seasonName} (${s.yearOfOrganization})`,
            }))}
          />
        </div>

        {/* Race */}
        <div>
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>Chặng đua:</label>
          <Select
            style={{ width: 300 }}
            placeholder={selectedSeasonId ? "Chọn chặng đua" : "Chọn mùa giải trước"}
            value={selectedRaceId}
            onChange={(value) => setSelectedRaceId(value)}
            disabled={!selectedSeasonId}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={races.map((r) => ({
              value: r.id,
              label: `${r.raceName} - ${r.location}`,
            }))}
          />
        </div>
      </div>

      {/* Results Table */}
      <RaceResultTable
        results={results}
        loading={loading}
        onUpdateResult={handleUpdateResult}
      />
    </div>
  );
}
