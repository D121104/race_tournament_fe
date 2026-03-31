# 🔄 Refactoring - Filter Dropdowns cho Race Management

## Ngày: 2026-03-31

---

## 📋 THAY ĐỔI

### ✅ **Trước khi refactor:**
- ❌ Chỉ có 1 dropdown "Chọn mùa giải" (hiển thị tất cả seasons từ tất cả tournaments)
- ❌ Dropdown Tournament và Season nằm TRONG RaceForm
- ❌ User phải chọn tournament/season mỗi lần tạo/sửa race

### ✅ **Sau khi refactor:**
- ✅ Có 2 dropdown filter ở trên page: **Giải đua** → **Mùa giải** (cascading)
- ✅ Bảng hiển thị races theo tournament + season đã chọn
- ✅ RaceForm đơn giản, chỉ có các field của race
- ✅ User chọn tournament/season 1 lần, tạo nhiều races

---

## 🎯 KIẾN TRÚC MỚI

### **Race Page Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Quản lý Chặng đua                                      │
├─────────────────────────────────────────────────────────┤
│  [Chọn giải đua: ▼]  [Chọn mùa giải: ▼]              │
│     Tournament           Season (cascade)               │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │  Danh sách chặng đua      [Tạo chặng đua mới]  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Giải đua | Mùa giải | Tên | Địa điểm | ...     │  │
│  │ F1 2024  | Season 1 | ... | ...      | [Sửa/Xóa]│  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### **Race Form (Modal):**

```
┌──────────────────────────────────┐
│ Tạo chặng đua mới / Chỉnh sửa   │
├──────────────────────────────────┤
│ Tên chặng đua: [________]        │
│ Mô tả: [_____________]           │
│ Địa điểm: [________]             │
│ Ngày tổ chức: [📅]               │
│ Độ dài (km): [____]              │
│ Số vòng đua: [____]              │
│                                   │
│           [Tạo mới / Cập nhật]   │
└──────────────────────────────────┘
```

---

## 📝 CHI TIẾT THAY ĐỔI

### **1. File: `app/dashboard/race/page.tsx`**

#### **State Management:**
```typescript
// THÊM MỚI
const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);

// ĐÃ CÓ
const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
```

#### **Cascading Logic:**
```typescript
// Khi chọn tournament → load seasons của tournament đó
useEffect(() => {
  if (selectedTournamentId) {
    loadSeasonsByTournament(selectedTournamentId);
  } else {
    setSeasons([]);
    setSelectedSeasonId(null);
    setRaces([]);
  }
}, [selectedTournamentId]);

// Khi chọn season → load races của season đó
useEffect(() => {
  if (selectedSeasonId) {
    loadRaces(selectedSeasonId);
  } else {
    setRaces([]);
  }
}, [selectedSeasonId]);
```

#### **Load Data Functions:**
```typescript
// THAY ĐỔI: Không load tất cả seasons nữa
// TRƯỚC: loadAllSeasons() - load từ tất cả tournaments
// SAU: loadSeasonsByTournament(tournamentId) - chỉ load của tournament đã chọn

const loadSeasonsByTournament = async (tournamentId: number) => {
  const data = await seasonService.getSeasonsByTournament(tournamentId);
  setSeasons(data);
  
  // Auto-select season đầu tiên
  if (data.length > 0) {
    setSelectedSeasonId(data[0].id);
  } else {
    setSelectedSeasonId(null);
  }
};
```

#### **CRUD Handlers:**
```typescript
// THAY ĐỔI: Inject seasonId từ dropdown vào data
const handleCreateRace = async (values: any) => {
  const raceData = {
    ...values,
    seasonId: selectedSeasonId, // ✅ Inject từ dropdown
  };
  await raceService.createRace(raceData);
  // ...
};
```

#### **UI - Filter Section:**
```typescript
<div style={{ display: 'flex', gap: '16px' }}>
  {/* Tournament Dropdown */}
  <div>
    <label>Chọn giải đua:</label>
    <Select
      value={selectedTournamentId}
      onChange={handleTournamentChange}
      options={tournaments.map(t => ({
        value: t.id,
        label: t.tournamentName,
      }))}
    />
  </div>

  {/* Season Dropdown - Cascade */}
  <div>
    <label>Chọn mùa giải:</label>
    <Select
      value={selectedSeasonId}
      onChange={handleSeasonChange}
      disabled={!selectedTournamentId || seasons.length === 0}
      options={seasons.map(s => ({
        value: s.id,
        label: `${s.seasonName} (${s.yearOfOrganization})`,
      }))}
    />
  </div>
</div>
```

---

### **2. File: `components/form/RaceForm.tsx`**

#### **Đơn giản hóa hoàn toàn:**

**BỎ:**
- ❌ `useState` cho tournaments, seasons
- ❌ `useState` cho loading states
- ❌ `useState` cho selectedTournamentId
- ❌ `loadTournaments()` function
- ❌ `loadSeasons()` function
- ❌ `loadSeasonDetails()` function
- ❌ `handleTournamentChange()` function
- ❌ Dropdown "Giải đua"
- ❌ Dropdown "Mùa giải"

**GIỮ LẠI:**
- ✅ Form state management
- ✅ Edit mode populate
- ✅ Date formatting
- ✅ Form validation
- ✅ 6 fields: raceName, description, location, date, length, numberOfLaps

**Code sau refactor:**
```typescript
export default function RaceForm({ initialData, onSubmit, isLoading, mode }) {
  const [form] = Form.useForm();

  // Chỉ populate form khi edit
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
    <Form form={form} onFinish={handleSubmit}>
      {/* 6 fields only - NO tournament/season dropdowns */}
    </Form>
  );
}
```

---

## 📊 SO SÁNH

| Aspect | Trước | Sau |
|--------|-------|-----|
| **Dropdowns trên page** | 1 (Season only) | 2 (Tournament + Season) |
| **Dropdowns trong form** | 2 (Tournament + Season) | 0 (Removed) |
| **Form complexity** | 🔴 High (100+ lines) | 🟢 Low (50 lines) |
| **User workflow** | Chọn mỗi lần tạo race | Chọn 1 lần, tạo nhiều races |
| **Data loading** | Load tất cả seasons | Load theo tournament |
| **Performance** | ⚠️ Load many | ✅ Load filtered |

---

## ✅ ƯU ĐIỂM CỦA REFACTOR

### **1. Better UX:**
- ✅ User chọn tournament/season 1 lần → tạo nhiều races
- ✅ Context rõ ràng: đang làm việc với tournament/season nào
- ✅ Không phải chọn lại tournament/season mỗi lần tạo race

### **2. Simpler Code:**
- ✅ RaceForm giảm từ 150 lines → 50 lines
- ✅ Không duplicate logic load tournaments/seasons
- ✅ Single source of truth cho tournament/season selection

### **3. Better Performance:**
- ✅ Chỉ load seasons của tournament đã chọn
- ✅ Không load tất cả seasons từ tất cả tournaments

### **4. Logical Flow:**
```
User → Chọn Tournament → Load Seasons → Chọn Season → Load Races
                                                     ↓
                                              [Tạo Race]
                                         (inherit seasonId)
```

---

## 🚀 TESTING

### **Test Cases:**

1. **Load page:**
   - ✅ Auto-select tournament đầu tiên
   - ✅ Auto-load seasons của tournament đó
   - ✅ Auto-select season đầu tiên
   - ✅ Auto-load races của season đó

2. **Change tournament:**
   - ✅ Seasons dropdown updated
   - ✅ Auto-select season đầu tiên của tournament mới
   - ✅ Races table updated

3. **Change season:**
   - ✅ Races table updated
   - ✅ Show races của season đã chọn

4. **Create race:**
   - ✅ Modal mở với form đơn giản (không có tournament/season)
   - ✅ Submit → seasonId tự động inject từ dropdown
   - ✅ Races table refresh

5. **Edit race:**
   - ✅ Form populate với data hiện tại
   - ✅ Submit → seasonId giữ nguyên từ dropdown
   - ✅ Races table refresh

6. **Delete race:**
   - ✅ Confirmation modal
   - ✅ Delete success → races table refresh

---

## 📁 FILES CHANGED

```
✅ app/dashboard/race/page.tsx        (Refactored)
   - Added tournament dropdown
   - Cascading season dropdown
   - Inject seasonId vào CRUD handlers

✅ components/form/RaceForm.tsx       (Simplified)
   - Removed tournament/season logic
   - Removed tournament/season dropdowns
   - Reduced from 150 → 50 lines
```

---

## 🎯 KẾT QUẢ

**Trước:**
```
Page: [Season dropdown với tất cả seasons]
Form: [Tournament dropdown] + [Season dropdown] + [6 race fields]
```

**Sau:**
```
Page: [Tournament dropdown] → [Season dropdown (cascade)]
Form: [6 race fields only]
```

**✅ Cleaner, Simpler, Better UX!**
