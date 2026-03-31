# 🚀 Quick Start Guide - Race Management

## Bước 1: Cài đặt package dayjs

```bash
cd E:\PTIT\race-tournament-fe\race-tournament-fe
npm install dayjs
```

## Bước 2: Khởi động Backend

Đảm bảo backend đang chạy:
- API Gateway: http://localhost:8000
- Các microservices (Tournament, Season, Race)

## Bước 3: Khởi động Frontend

```bash
npm run dev
```

## Bước 4: Truy cập

Mở browser: **http://localhost:3000/dashboard/race**

---

## 📝 Cách sử dụng

### Tạo chặng đua mới:
1. Click nút **"Tạo chặng đua mới"**
2. **Chọn Giải đua** từ dropdown
3. **Chọn Mùa giải** (sẽ tự động load sau khi chọn giải đua)
4. Điền thông tin:
   - Tên chặng đua (bắt buộc)
   - Mô tả (tùy chọn)
   - Địa điểm (bắt buộc)
   - Ngày tổ chức (chọn từ calendar)
   - Độ dài (km)
   - Số vòng đua
5. Click **"Tạo mới"**

### Chỉnh sửa chặng đua:
1. Click nút **"Sửa"** ở hàng cần sửa
2. Form sẽ tự động điền thông tin hiện tại
3. Chỉnh sửa và click **"Cập nhật"**

### Xóa chặng đua:
1. Click nút **"Xóa"** ở hàng cần xóa
2. Xác nhận trong dialog
3. Chặng đua sẽ bị xóa

---

## ⚠️ Lưu ý

- Phải có ít nhất 1 **Tournament** và 1 **Season** trong database trước khi tạo Race
- Dropdown Season chỉ active sau khi chọn Tournament
- Tất cả thay đổi được lưu ngay vào database qua API

---

## 🎯 Files đã được tạo/cập nhật

### ✨ Files mới:
- `.env.local`
- `types/tournament.ts`
- `types/season.ts`
- `types/race.ts`
- `lib/api.ts`
- `services/tournamentService.ts`
- `services/seasonService.ts`
- `services/raceService.ts`
- `INSTALLATION.md`

### 📝 Files đã cập nhật:
- `components/form/RaceForm.tsx`
- `components/ui/RaceTable.tsx`
- `app/dashboard/race/page.tsx`

---

**✅ Done! Giao diện quản lý chặng đua đã sẵn sàng sử dụng.**
