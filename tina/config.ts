import { defineConfig } from "tinacms";

// Nhánh Git mặc định cho Tina Cloud
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "projectSettings",
        label: "Cấu hình Dự án & Liên hệ",
        path: "content/settings",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          router: () => "/",
        },
        fields: [
          { type: "string", name: "name", label: "Tên dự án" },
          { type: "string", name: "shortName", label: "Tên viết tắt" },
          { type: "string", name: "kicker", label: "Dòng dẫn đề" },
          { type: "string", name: "title", label: "Tiêu đề chính" },
          { type: "string", name: "subtitle", label: "Mô tả phụ", ui: { component: "textarea" } },
          { type: "string", name: "location", label: "Địa chỉ dự án" },
          { type: "string", name: "developer", label: "Chủ đầu tư" },
          { type: "string", name: "hotline", label: "Hotline" },
          { type: "string", name: "zalo", label: "Số Zalo tư vấn" },
          { type: "string", name: "zaloUrl", label: "Đường dẫn link Zalo (https://zalo.me/...)" },
          { type: "string", name: "email", label: "Email liên hệ" },
          { type: "string", name: "ctaPrimary", label: "Nút hành động chính" },
          { type: "string", name: "ctaSecondary", label: "Nút hành động phụ" },
          { type: "string", name: "footerNote", label: "Ghi chú chân trang (Footer)", ui: { component: "textarea" } },
        ],
      },
      {
        name: "homePage",
        label: "Trang chủ (Landing Page)",
        path: "content/pages",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          router: () => "/",
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Khối Hero đầu trang",
            fields: [
              { type: "string", name: "lineLeft", label: "Dòng tiêu đề trái (ví dụ: BẢN SẮC CAO NGUYÊN)" },
              { type: "string", name: "lineRight", label: "Dòng tiêu đề phải (ví dụ: NHỊP SỐNG ĐÔ THỊ MỚI)" },
              { type: "image", name: "mediaImage", label: "Ảnh nền Hero" },
              { type: "string", name: "ctaText", label: "Chữ nút CTA Hero" },
              { type: "string", name: "metaLocation", label: "Địa danh chân Hero (trái)" },
              { type: "string", name: "metaCity", label: "Địa danh chân Hero (phải)" },
            ],
          },
          {
            type: "object",
            name: "manifesto",
            label: "Khối 6 Chuyển Động (Manifesto)",
            fields: [
              { type: "string", name: "editorial", label: "Dòng dẫn lối" },
              { type: "string", name: "title", label: "Tiêu đề chính" },
              {
                type: "object",
                name: "items",
                label: "Danh sách 6 điểm",
                list: true,
                fields: [
                  { type: "string", name: "index", label: "Số thứ tự (01, 02...)" },
                  { type: "string", name: "text", label: "Nội dung" },
                  { type: "string", name: "href", label: "Liên kết cuộn (#overview...)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "overview",
            label: "Khối Tổng quan & Số liệu",
            fields: [
              { type: "string", name: "editorial", label: "Dòng dẫn lối" },
              { type: "string", name: "title", label: "Tiêu đề chính" },
              { type: "image", name: "image", label: "Ảnh phối cảnh tổng quan" },
              {
                type: "object",
                name: "facts",
                label: "3 Chỉ số nổi bật",
                list: true,
                fields: [
                  { type: "string", name: "value", label: "Giá trị (vd: 4,86 ha)" },
                  { type: "string", name: "label", label: "Nhãn (vd: Quy mô)" },
                ],
              },
              {
                type: "object",
                name: "profile",
                label: "Bảng chi tiết thông số dự án",
                list: true,
                fields: [
                  { type: "string", name: "label", label: "Tên thông số" },
                  { type: "string", name: "value", label: "Giá trị" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "identity",
            label: "Khối Cửa ngõ kiến trúc",
            fields: [
              { type: "string", name: "editorial", label: "Dòng dẫn lối" },
              { type: "string", name: "title", label: "Tiêu đề chính" },
              { type: "string", name: "description", label: "Đoạn văn mô tả", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Ảnh phối cảnh mặt đứng" },
            ],
          },
          {
            type: "object",
            name: "cinematicVideo",
            label: "Khối Phim Kiến Trúc",
            fields: [
              { type: "string", name: "videoSrc", label: "Đường dẫn video MP4" },
              { type: "image", name: "poster", label: "Ảnh bìa poster" },
              { type: "string", name: "caption", label: "Dòng chú thích phim" },
            ],
          },
          {
            type: "object",
            name: "identitySlides",
            label: "Danh sách slide ảnh Phối cảnh mặt đứng",
            list: true,
            fields: [
              { type: "image", name: "src", label: "Ảnh slide" },
              { type: "string", name: "alt", label: "Mô tả ảnh" },
            ],
          },
          {
            type: "object",
            name: "amenitySlides",
            label: "Danh sách slide ảnh Tiện ích Mảng Xanh",
            list: true,
            fields: [
              { type: "image", name: "src", label: "Ảnh slide" },
              { type: "string", name: "alt", label: "Mô tả ảnh" },
            ],
          },
        ],
      },
      {
        name: "residences",
        label: "Bộ sưu tập Căn hộ (Residences)",
        path: "content/residences",
        format: "json",
        ui: {
          router: () => "/#residences",
        },
        fields: [
          { type: "string", name: "unitId", label: "Mã định danh căn hộ" },
          { type: "string", name: "index", label: "Số thứ tự (01, 02...)" },
          { type: "string", name: "name", label: "Tên căn hộ (vd: CĂN HỘ 1 PHÒNG NGỦ+)" },
          { type: "string", name: "code", label: "Ký hiệu căn (vd: 1BR+1)" },
          { type: "string", name: "bedrooms", label: "Số phòng ngủ" },
          { type: "string", name: "usableArea", label: "Diện tích sử dụng" },
          { type: "string", name: "wallArea", label: "Diện tích tim tường" },
          { type: "string", name: "description", label: "Mô tả công năng", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Ảnh mặt bằng bố trí" },
          { type: "string", name: "pdf", label: "Đường dẫn tài liệu PDF gốc" },
          { type: "image", name: "locatorImage", label: "Ảnh vị trí căn trên mặt bằng tầng" },
          { type: "string", name: "locatorLabel", label: "Nhãn vị trí tầng" },
        ],
      },
      {
        name: "townhouses",
        label: "Bộ sưu tập Nhà phố (Townhouses)",
        path: "content/townhouses",
        format: "json",
        ui: {
          router: () => "/#townhouses",
        },
        fields: [
          { type: "string", name: "productId", label: "Mã định danh sản phẩm" },
          { type: "string", name: "index", label: "Số thứ tự" },
          { type: "string", name: "name", label: "Tên loại hình (vd: NHÀ PHỐ THƯƠNG MẠI)" },
          { type: "string", name: "type", label: "Phân loại (Shophouse / Townhouse)" },
          { type: "string", name: "model", label: "Mô hình" },
          { type: "string", name: "format", label: "Quy cách" },
          { type: "string", name: "description", label: "Mô tả", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Ảnh phối cảnh kiến trúc" },
          { type: "string", name: "source", label: "Nguồn thiết kế" },
          { type: "image", name: "planImage", label: "Ảnh mặt cắt/bản vẽ" },
          { type: "string", name: "planSource", label: "Nguồn bản vẽ" },
          { type: "string", name: "planLabel", label: "Tiêu đề bản vẽ" },
          { type: "string", name: "planDescription", label: "Mô tả bản vẽ" },
          {
            type: "object",
            name: "floors",
            label: "Mặt bằng các tầng",
            list: true,
            fields: [
              { type: "string", name: "floorId", label: "Mã tầng (f1, f2...)" },
              { type: "string", name: "label", label: "Tên tầng (TẦNG 1...)" },
              { type: "image", name: "image", label: "Ảnh mặt bằng tầng" },
              { type: "string", name: "pdf", label: "Đường dẫn PDF gốc" },
              { type: "image", name: "architectureImage", label: "Bản vẽ mặt đứng kiến trúc" },
              { type: "string", name: "architectureSource", label: "Nguồn bản vẽ" },
              { type: "string", name: "architectureLabel", label: "Tiêu đề bản vẽ tầng" },
            ],
          },
        ],
      },
      {
        name: "amenities",
        label: "Mặt bằng Tiện ích (Masterplan)",
        path: "content/amenities",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          router: () => "/#amenity-masterplan",
        },
        fields: [
          { type: "string", name: "editorial", label: "Dòng dẫn lối" },
          { type: "string", name: "title", label: "Tiêu đề chính" },
          { type: "string", name: "description", label: "Mô tả" },
          { type: "image", name: "masterplanImage", label: "Ảnh mặt bằng tổng thể (2D)" },
          { type: "string", name: "source", label: "Nguồn bản vẽ" },
          {
            type: "object",
            name: "groups",
            label: "Các phân nhóm tiện ích",
            list: true,
            fields: [
              { type: "string", name: "groupId", label: "Mã nhóm (water, garden...)" },
              {
                type: "object",
                name: "items",
                label: "Danh sách tiện ích trong nhóm",
                list: true,
                fields: [
                  { type: "string", name: "number", label: "Số thứ tự pin" },
                  { type: "string", name: "label", label: "Tên tiện ích" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
