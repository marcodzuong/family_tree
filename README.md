# family_tree

Website cây gia phả — React + Vite, lưu dữ liệu trên `localStorage`, hỗ trợ export/import JSON.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview
```

## Tính năng

- Thêm / sửa / xóa thành viên (tên bắt buộc, các trường khác optional: ngày sinh/mất, nghề nghiệp, tiểu sử, ảnh đại diện)
- Gán quan hệ cha/mẹ, vợ/chồng — con cái và anh chị em được suy ra tự động
- Sơ đồ cây trực quan, zoom/pan, click vào một người để xem chi tiết
- Tìm kiếm theo tên
- Xuất dữ liệu ra file JSON, nhập lại từ file JSON
- Tự động lưu vào `localStorage` của trình duyệt

## Deploy

Dự án tự động build & deploy lên GitHub Pages qua GitHub Actions (`.github/workflows/deploy.yml`) mỗi khi có push lên nhánh `master`. Trang sẽ có tại `https://<username>.github.io/family_tree/`.

Lưu ý: cần bật GitHub Pages với nguồn "GitHub Actions" trong Settings > Pages của repo.
