# Hướng dẫn cài đặt và chạy dự án

## Bước 1: Cài đặt dependencies

Vui lòng chạy lệnh sau trong thư mục dự án để cài đặt package dayjs (cần thiết cho DatePicker):

```bash
cd E:\PTIT\race-tournament-fe\race-tournament-fe
npm install dayjs
```

## Bước 2: Khởi động Backend Services

Đảm bảo các backend services đang chạy trên các port sau:
- API Gateway: http://localhost:8000
- Tournament Service: http://localhost:8082
- Season Service: http://localhost:8081
- Race Service: http://localhost:8080

## Bước 3: Khởi động Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Bước 4: Truy cập trang quản lý chặng đua

Truy cập: http://localhost:3000/dashboard/race

## Tính năng đã triển khai

✅ **Form tạo/sửa chặng đua với:**
- Dropdown chọn Giải đua (Tournament)
- Dropdown chọn Mùa giải (Season) - cascade theo Tournament
- Các trường: Tên chặng đua, Mô tả, Địa điểm, Ngày tổ chức (DatePicker), Độ dài (km), Số vòng đua
- Validation đầy đủ cho các trường

✅ **Bảng danh sách chặng đua với:**
- Hiển thị: Giải đua, Mùa giải, Tên chặng, Địa điểm, Ngày, Độ dài, Số vòng
- Tích hợp API backend
- Loading states
- Pagination
- CRUD operations: Create, Edit, Delete (có confirm modal)

✅ **API Integration:**
- API client base với error handling
- Services: tournamentService, seasonService, raceService
- TypeScript types đầy đủ

## Cấu trúc mới được tạo

```
race-tournament-fe/
├── .env.local                    # API configuration
├── types/
│   ├── tournament.ts            # Tournament types
│   ├── season.ts                # Season types
│   └── race.ts                  # Race types
├── lib/
│   └── api.ts                   # API client base
├── services/
│   ├── tournamentService.ts     # Tournament API calls
│   ├── seasonService.ts         # Season API calls
│   └── raceService.ts           # Race API calls
├── components/
│   ├── form/
│   │   └── RaceForm.tsx         # ✨ Updated với dropdowns
│   └── ui/
│       └── RaceTable.tsx        # ✨ Updated với API integration
└── app/
    └── dashboard/
        └── race/
            └── page.tsx         # ✨ Updated với state management
```

## Lưu ý

- Đảm bảo backend services đang chạy trước khi test frontend
- API base URL được cấu hình trong `.env.local`
- Cần có ít nhất 1 Tournament và 1 Season trong database để tạo Race
