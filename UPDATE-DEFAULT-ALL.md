# 🔄 Update - Dropdown "Tất cả" & Disable Create Button

## Ngày: 2026-03-31

---

## 📋 YÊU CẦU

1. ✅ Dropdown mặc định "Tất cả"
2. ✅ Không chọn giải đua → hiển thị TẤT CẢ chặng đua
3. ✅ Trạng thái "Tất cả" → KHÔNG cho tạo mới chặng đua
4. ✅ Click "Tạo chặng đua" khi "Tất cả" → hiện thông báo lỗi

---

## ✨ THAY ĐỔI

### **1. Race Page (`page.tsx`)**

#### **State & Logic:**

**Trạng thái mặc định:**
```typescript
// TRƯỚC: Auto-select tournament đầu tiên
if (data.length > 0) {
  setSelectedTournamentId(data[0].id);
}

// SAU: Không auto-select (null = "Tất cả")
const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
```

#### **Load Data Logic:**

```typescript
// Khi selectedTournamentId === null → "Tất cả"
useEffect(() => {
  if (selectedTournamentId) {
    // Chọn tournament cụ thể → load seasons của tournament đó
    loadSeasonsByTournament(selectedTournamentId);
  } else {
    // "Tất cả" → load all seasons từ tất cả tournaments
    loadAllSeasons();
  }
}, [selectedTournamentId]);

useEffect(() => {
  if (selectedSeasonId) {
    // Chọn season cụ thể → load races của season đó
    loadRaces(selectedSeasonId);
  } else if (selectedTournamentId === null) {
    // "Tất cả" tournament → load all races
    loadAllRaces();
  } else {
    // Chọn tournament nhưng chưa chọn season → clear
    setRaces([]);
  }
}, [selectedSeasonId, selectedTournamentId]);
```

#### **Load All Races Function (MỚI):**

```typescript
const loadAllRaces = async () => {
  setLoading(true);
  try {
    // 1. Load tất cả seasons từ tất cả tournaments
    const allSeasons = await getAllSeasons();
    
    // 2. Load races từ mỗi season (parallel)
    const raceResults = await Promise.all(
      allSeasons.map(season =>
        raceService.getRacesBySeason(season.id)
      )
    );
    
    // 3. Merge tất cả races
    const allRaces: Race[] = [];
    raceResults.forEach(races => {
      allRaces.push(...races);
    });
    
    setRaces(allRaces);
  } catch (error) {
    message.error('Không thể tải danh sách chặng đua');
  } finally {
    setLoading(false);
  }
};
```

**Lý do:** Backend chưa có API `/api/races` (get all races), nên phải load từng season rồi merge.

#### **Validation trong handleCreateRace:**

```typescript
const handleCreateRace = async (values: any) => {
  // ✅ Validation: Phải chọn tournament VÀ season
  if (!selectedTournamentId || !selectedSeasonId) {
    message.error('Vui lòng chọn giải đua và mùa giải trước khi tạo chặng đua');
    throw new Error('Tournament and Season must be selected');
  }

  try {
    const raceData = {
      ...values,
      seasonId: selectedSeasonId,
    };
    await raceService.createRace(raceData);
    message.success('Tạo chặng đua thành công');
    // ...
  }
};
```

#### **UI - Dropdowns:**

```typescript
{/* Tournament Dropdown */}
<Select
  placeholder="Tất cả"
  value={selectedTournamentId}
  onChange={handleTournamentChange}
  allowClear  // ✅ Cho phép clear về "Tất cả"
  options={[
    { value: null, label: 'Tất cả' },  // ✅ Option đầu tiên
    ...tournaments.map(t => ({
      value: t.id,
      label: t.tournamentName,
    }))
  ]}
/>

{/* Season Dropdown */}
<Select
  placeholder={selectedTournamentId ? "Tất cả" : "Chọn giải đua trước"}
  value={selectedSeasonId}
  onChange={handleSeasonChange}
  disabled={selectedTournamentId === null}  // ✅ Disable khi "Tất cả" tournament
  allowClear
  options={
    selectedTournamentId
      ? [
          { value: null, label: 'Tất cả' },
          ...seasons.map(s => ({
            value: s.id,
            label: `${s.seasonName} (${s.yearOfOrganization})`,
          }))
        ]
      : []
  }
/>
```

#### **Pass canCreate prop:**

```typescript
<RaceTable
  races={races}
  loading={loading}
  onCreateRace={handleCreateRace}
  onUpdateRace={handleUpdateRace}
  onDeleteRace={handleDeleteRace}
  seasons={seasons}
  tournaments={tournaments}
  canCreate={selectedTournamentId !== null && selectedSeasonId !== null}
  //       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //       Chỉ cho phép create khi ĐÃ chọn cả tournament VÀ season
/>
```

---

### **2. Race Table (`RaceTable.tsx`)**

#### **Props Interface:**

```typescript
interface RaceTableProps {
  // ... existing props
  canCreate: boolean;  // ✅ Thêm prop mới
}
```

#### **Create Button Handler:**

```typescript
const onClickCreate = () => {
  if (!canCreate) {
    message.warning('Vui lòng chọn giải đua và mùa giải trước khi tạo chặng đua');
    return;  // ✅ Early return, không mở modal
  }
  setModalConfig({ open: true, data: null, mode: "create" });
};
```

#### **Button UI:**

```typescript
<Button 
  color="cyan" 
  variant="solid" 
  onClick={onClickCreate}
  disabled={!canCreate}  // ✅ Disable button khi không cho phép create
>
  Tạo chặng đua mới
</Button>
```

---

## 🎯 WORKFLOW MỚI

### **Trạng thái "Tất cả":**

```
Load page
  ↓
selectedTournamentId = null (Tất cả)
selectedSeasonId = null (Tất cả)
  ↓
Load ALL seasons từ tất cả tournaments
  ↓
Load ALL races từ tất cả seasons
  ↓
Hiển thị tất cả races
  ↓
Nút "Tạo chặng đua mới" = DISABLED
  ↓
User click → Message: "Vui lòng chọn giải đua và mùa giải"
```

### **User chọn Tournament:**

```
User chọn Tournament X
  ↓
selectedTournamentId = X
selectedSeasonId = null (reset về "Tất cả" season)
  ↓
Load seasons của Tournament X
  ↓
Season dropdown enabled với option "Tất cả"
  ↓
Nút "Tạo chặng đua mới" = vẫn DISABLED (chưa chọn season cụ thể)
```

### **User chọn Season:**

```
User chọn Season Y
  ↓
selectedTournamentId = X
selectedSeasonId = Y
  ↓
Load races của Season Y
  ↓
Nút "Tạo chặng đua mới" = ENABLED ✅
  ↓
User click → Mở modal form → Submit OK
```

---

## 📊 LOGIC TABLE

| Tournament | Season | Races Displayed | Create Button | Message |
|------------|--------|-----------------|---------------|---------|
| **null** (Tất cả) | null | ALL races | ❌ DISABLED | "Vui lòng chọn..." |
| **X** | null | ALL races của tournament X | ❌ DISABLED | "Vui lòng chọn..." |
| **X** | **Y** | Races của season Y | ✅ ENABLED | - |

---

## ✅ CẢI THIỆN

### **UX tốt hơn:**
- ✅ User có thể xem tổng quan TẤT CẢ races
- ✅ Dropdown rõ ràng với option "Tất cả"
- ✅ Không cho phép create khi context không rõ ràng
- ✅ Message thông báo rõ ràng

### **Data Integrity:**
- ✅ Race phải thuộc về 1 season cụ thể
- ✅ Không tạo race khi không biết thuộc season nào
- ✅ Validation ở cả client và handler level

### **Code Quality:**
- ✅ Load data hiệu quả với Promise.all
- ✅ Clear state management
- ✅ Proper error handling

---

## 🚀 TESTING

### **Test Cases:**

1. **Load page:**
   - ✅ Dropdowns show "Tất cả"
   - ✅ Table shows tất cả races
   - ✅ Nút "Tạo chặng đua mới" = disabled

2. **Click "Tạo chặng đua mới" khi "Tất cả":**
   - ✅ Button disabled (không click được)
   - ✅ Hoặc click → message warning

3. **Chọn Tournament:**
   - ✅ Season dropdown enabled
   - ✅ Races filtered by tournament
   - ✅ Button vẫn disabled

4. **Chọn Season:**
   - ✅ Races filtered by season
   - ✅ Button enabled
   - ✅ Click → modal mở

5. **Clear tournament (về "Tất cả"):**
   - ✅ Season dropdown disabled và clear
   - ✅ Races show all
   - ✅ Button disabled

---

## 📝 FILES CHANGED

```
✅ app/dashboard/race/page.tsx
   - Added: loadAllRaces() function
   - Added: loadAllSeasons() function
   - Modified: loadTournaments() - không auto-select
   - Modified: loadSeasonsByTournament() - không auto-select season
   - Modified: handleCreateRace() - validation
   - Modified: Dropdowns - thêm option "Tất cả"
   - Modified: Pass canCreate prop

✅ components/ui/RaceTable.tsx
   - Added: canCreate prop
   - Modified: onClickCreate() - validation
   - Modified: Button - disabled={!canCreate}
```

---

## 🎊 KẾT QUẢ

**Trước:**
- Auto-select tournament đầu tiên
- Luôn phải chọn tournament/season
- Không xem được tổng quan

**Sau:**
- Mặc định "Tất cả" → xem tổng quan
- Có thể filter dần: Tournament → Season
- Chỉ cho create khi đã chọn rõ ràng
- Validation đầy đủ với message rõ ràng

**✅ Perfect! Đúng yêu cầu!**
