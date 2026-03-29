# PLAN: Lorebook UI Enhancements & Simple Export

Bản kế hoạch này tập trung vào việc cải thiện trải nghiệm người dùng (UX) và thêm tính năng xuất dữ liệu tinh gọn cho ứng dụng Lorebook Workspace.

## User Review Required

> [!IMPORTANT]
> **Cấu trúc Export mới:** Bên cạnh nút Export JSON (đầy đủ cho SillyTavern), tôi sẽ thêm một nút **"Export Simple Map"** để xuất tệp JSON theo cấu trúc: `{"Tên Category": ["uid thẻ 1", "uid thẻ 2"], ...}` như bạn yêu cầu.

> [!NOTE]
> **Tooltip**: Tooltip sẽ hiển thị khi bạn di chuột (hover) vào thẻ ở bất kỳ cột nào (Library hoặc Workspace) để xem tiêu đề đầy đủ mà không bị cắt bớt.

## Proposed Changes

---

### UI Core Components (index.html)

#### [MODIFY] index.html
- **Tooltip Implementation:**
  - Gắn thuộc tính `title` HTML tiêu chuẩn vào các thẻ Card để hiển thị `e.comment` đầy đủ khi di chuột.
- **Category Renaming:**
  - Trong **Groups Panel (Cột Phải)**: Thay thế tiêu đề nhóm bằng một ô `contenteditable` hoặc thêm nút biểu tượng "Edit". 
  - Khi tên nhóm thay đổi, thực hiện cập nhật trường `group` của tất cả `entries` có liên quan trong mảng `entries` toàn cục.
- **Simple Export Feature:**
  - Thêm một nút mới: **"Map Export"** cạnh nút Export cũ.
  - Viết hàm `exportSimpleJSON()` để tạo cấu trúc map `Category -> [UIDs]`.

---

## Task Breakdown

1. `[ ]` Thêm thuộc tính `title` vào template render thẻ.
2. `[ ]` Cập nhật giao diện Groups Panel hỗ trợ chỉnh sửa (Rename UI).
3. `[ ]` Viết hàm cập nhật hàng loạt (Batch update) khi đổi tên Group.
4. `[ ]` Thêm nút và logic cho tính năng Export Simple JSON.
5. `[ ]` Kiểm tra lại hiển thị và xuất file thử nghiệm.

## Verification Plan

### Manual Verification
1. Di chuột vào một thẻ có tiêu đề rất dài -> Tooltip hiển thị trọn vẹn tiêu đề.
2. Đổi tên một Group -> Kiểm tra xem các thẻ thuộc Group đó có được cập nhật tên Group mới không.
3. Nhấn "Map Export" -> Kiểm tra file JSON tải về có đúng định dạng: `{"Tên Group": ["uid1", "uid2"]}` không.
