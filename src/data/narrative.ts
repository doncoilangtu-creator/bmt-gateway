export type ProjectFact = {
  value: string;
  label: string;
};

export type ResidenceUnit = {
  id: string;
  index: string;
  name: string;
  code: string;
  bedrooms: string;
  usableArea: string;
  wallArea: string;
  description: string;
  image: string;
  pdf: string;
  locatorImage: string;
  locatorLabel: string;
};

export type LocationMarker = {
  label: string;
  detail: string;
  className: string;
};

export type DetailItem = { label: string; value: string };
export type AmenityGroup = { title: string; items: string[] };
export type LowriseProduct = {
  id: string;
  index: string;
  name: string;
  type: string;
  model: string;
  format: string;
  description: string;
  image: string;
  source: string;
  planImage: string;
  planSource: string;
  planLabel: string;
  planDescription: string;
  floors: Array<{
    id: string;
    label: string;
    image: string;
    pdf: string;
    architectureImage: string;
    architectureSource: string;
    architectureLabel: string;
  }>;
};

export const projectFacts: ProjectFact[] = [
  { value: '4,86 ha', label: 'Quy mô khu đô thị' },
  { value: '984', label: 'Căn hộ trong hai tháp' },
  { value: '152', label: 'Sản phẩm thấp tầng' },
  { value: '35%', label: 'Mật độ xây dựng' },
];

export const landscapeFacts: ProjectFact[] = [
  { value: '25%', label: 'Tỷ lệ cây xanh' },
  { value: '12.000 m²', label: 'Công viên trung tâm' },
  { value: '5.000 m²', label: 'Hồ cảnh quan' },
];

export const lowriseProducts: LowriseProduct[] = [
  {
    id: 'shophouse',
    index: '01',
    name: 'NHÀ PHỐ THƯƠNG MẠI',
    type: 'Shophouse',
    model: 'PHỐ THƯƠNG MẠI · KHỐI THẤP TẦNG',
    format: 'Tầng trệt thương mại · Không gian phía trên linh hoạt',
    description: 'Mặt tiền kính rộng, hiên phố và các lớp sân vườn tạo nên dãy thương mại hiện đại trên trục nội khu.',
    image: '/images/pdf-source/shophouse-overview.webp',
    source: '/images/pdf-source/shophouse-source.pdf',
    planImage: '/images/floor-plans/lowrise/shophouse-xh22-d1-ground.webp',
    planSource: '/images/floor-plans/lowrise/shophouse-xh22-d1-ground.pdf',
    planLabel: 'MẶT BẰNG TẦNG 1 · NHÀ PHỐ THƯƠNG MẠI',
    planDescription: 'Bộ mặt bằng các tầng từ hồ sơ StudioMilou. Bố trí phòng khách, bếp + ăn, thang, các khoảng sân và không gian phía trên của nhà phố thương mại.',
    floors: [
      { id: 'tang-1', label: 'TẦNG 1', image: '/images/floor-plans/lowrise/shophouse-tang-1.webp', pdf: '/images/floor-plans/lowrise/shophouse-tang-1.pdf', architectureImage: '/images/pdf-source/shophouse-overview.webp', architectureSource: '/images/pdf-source/shophouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ PHỐ THƯƠNG MẠI' },
      { id: 'tang-2', label: 'TẦNG 2', image: '/images/floor-plans/lowrise/shophouse-tang-2.webp', pdf: '/images/floor-plans/lowrise/shophouse-tang-2.pdf', architectureImage: '/images/pdf-source/shophouse-overview.webp', architectureSource: '/images/pdf-source/shophouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ PHỐ THƯƠNG MẠI' },
      { id: 'tang-3', label: 'TẦNG 3', image: '/images/floor-plans/lowrise/shophouse-tang-3.webp', pdf: '/images/floor-plans/lowrise/shophouse-tang-3.pdf', architectureImage: '/images/pdf-source/shophouse-overview.webp', architectureSource: '/images/pdf-source/shophouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ PHỐ THƯƠNG MẠI' },
      { id: 'tang-mai', label: 'TẦNG MÁI', image: '/images/floor-plans/lowrise/shophouse-tang-mai.webp', pdf: '/images/floor-plans/lowrise/shophouse-tang-mai.pdf', architectureImage: '/images/pdf-source/shophouse-overview.webp', architectureSource: '/images/pdf-source/shophouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ PHỐ THƯƠNG MẠI' },
    ],
  },
  {
    id: 'townhouse',
    index: '02',
    name: 'NHÀ LIỀN KỀ',
    type: 'Townhouse',
    model: 'NHÀ Ở THẤP TẦNG · NHIỀU LỚP KHÔNG GIAN',
    format: 'Nhà ở nhiều tầng · Ban công · Sân và vị trí đỗ xe',
    description: 'Nhịp mặt đứng đứng, ban công trồng cây và khoảng lùi trước nhà hình thành một tuyến phố ở riêng tư nhưng giàu kết nối.',
    image: '/images/pdf-source/townhouse-view-2.webp',
    source: '/images/pdf-source/townhouse-source.pdf',
    planImage: '/images/floor-plans/lowrise/townhouse-m21-b1-ground.webp',
    planSource: '/images/floor-plans/lowrise/townhouse-m21-b1-ground.pdf',
    planLabel: 'MẶT BẰNG TẦNG 1 · NHÀ LIỀN KỀ',
    planDescription: 'Bộ mặt bằng các tầng từ hồ sơ StudioMilou. Bố trí phòng khách, bếp + ăn, sảnh tầng, phòng ngủ, ban công, sân và tầng mái của nhà liền kề.',
    floors: [
      { id: 'tang-1', label: 'TẦNG 1', image: '/images/floor-plans/lowrise/townhouse-tang-1.webp', pdf: '/images/floor-plans/lowrise/townhouse-tang-1.pdf', architectureImage: '/images/pdf-source/townhouse-view-2.webp', architectureSource: '/images/pdf-source/townhouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ LIỀN KỀ' },
      { id: 'tang-2', label: 'TẦNG 2', image: '/images/floor-plans/lowrise/townhouse-tang-2.webp', pdf: '/images/floor-plans/lowrise/townhouse-tang-2.pdf', architectureImage: '/images/pdf-source/townhouse-view-2.webp', architectureSource: '/images/pdf-source/townhouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ LIỀN KỀ' },
      { id: 'tang-3', label: 'TẦNG 3', image: '/images/floor-plans/lowrise/townhouse-tang-3.webp', pdf: '/images/floor-plans/lowrise/townhouse-tang-3.pdf', architectureImage: '/images/pdf-source/townhouse-view-2.webp', architectureSource: '/images/pdf-source/townhouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ LIỀN KỀ' },
      { id: 'tang-4', label: 'TẦNG 4', image: '/images/floor-plans/lowrise/townhouse-tang-4.webp', pdf: '/images/floor-plans/lowrise/townhouse-tang-4.pdf', architectureImage: '/images/pdf-source/townhouse-view-2.webp', architectureSource: '/images/pdf-source/townhouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ LIỀN KỀ' },
      { id: 'tang-mai', label: 'TẦNG MÁI', image: '/images/floor-plans/lowrise/townhouse-tang-mai.webp', pdf: '/images/floor-plans/lowrise/townhouse-tang-mai.pdf', architectureImage: '/images/pdf-source/townhouse-view-2.webp', architectureSource: '/images/pdf-source/townhouse-source.pdf', architectureLabel: 'PHỐI CẢNH ĐẠI DIỆN · NHÀ LIỀN KỀ' },
    ],
  },
];

export const projectProfile: DetailItem[] = [
  { label: 'Tên thương mại', value: 'EraCity' },
  { label: 'Vị trí', value: '161 Nguyễn Chí Thanh, P. Tân An, TP. Buôn Ma Thuột, Đắk Lắk' },
  { label: 'Chủ đầu tư', value: 'Xuân Mai Corporation' },
  { label: 'Tư vấn thiết kế', value: 'studioMilou' },
  { label: 'Cấu trúc dự án', value: 'Hai tháp căn hộ, khối đế thương mại và khu thấp tầng' },
  { label: 'Loại hình', value: 'Căn hộ, townhouse, shophouse và nhà ở xã hội' },
];

export const planningProgram: DetailItem[] = [
  { label: 'Khối căn hộ', value: 'Hai tháp, dự kiến 33 tầng căn hộ điển hình' },
  { label: 'Khối đế', value: 'Thương mại dịch vụ, sảnh căn hộ và tiện ích cộng đồng' },
  { label: 'Không gian cộng đồng', value: 'Nhà trẻ, phòng sinh hoạt cộng đồng và cảnh quan nội khu' },
  { label: 'Giao thông tĩnh', value: 'Hai tầng hầm phục vụ nhu cầu đỗ xe theo hồ sơ thiết kế' },
];

export const amenityProgram: AmenityGroup[] = [
  { title: 'Mặt nước', items: ['Hồ cảnh quan', 'Bể bơi chính', 'Bể trẻ em', 'Jacuzzi', 'Pool cabana'] },
  { title: 'Sức khỏe', items: ['Đồi thiền & yoga', 'Outdoor fitness', 'Sân thể thao đa năng', 'Đường dạo'] },
  { title: 'Gia đình', items: ['Sân chơi trẻ em', 'Vườn kết nối', 'Bãi cỏ đa năng', 'Vườn sân thượng'] },
  { title: 'Cộng đồng', items: ['Quảng trường', 'Central pavilion', 'BBQ hill', 'Fire-pit garden'] },
];

export const connectivity: DetailItem[] = [
  { label: 'Trục tiếp cận', value: 'Nguyễn Chí Thanh' },
  { label: 'Lõi đô thị', value: 'Khoảng 3 km tới Ngã 6 Ban Mê' },
  { label: 'Liên vùng', value: 'Kết nối Quốc lộ 14 và trục Hà Huy Tập' },
  { label: 'Điểm đến', value: 'Sân bay, Bảo tàng Thế Giới Cà Phê và Hồ Ông Vả' },
];

export const ownershipAndProgress: DetailItem[] = [
  { label: 'Hình thức sở hữu', value: 'Lâu dài với công dân Việt Nam; theo quy định hiện hành với người nước ngoài' },
  { label: 'Bàn giao thấp tầng', value: 'Dự kiến Quý 2/2027 theo thông tin công bố' },
  { label: 'Hồ sơ nguồn', value: 'Mặt bằng và thông số đang trình bày từ bộ hồ sơ thiết kế tháng 04/2026' },
];

export const residenceUnits: ResidenceUnit[] = [
  {
    id: '1br-plus',
    index: '01',
    name: 'Căn hộ 1BR+',
    code: 'CH-A1',
    bedrooms: '1 phòng ngủ mở rộng',
    usableArea: '45,6 m²',
    wallArea: '49,2 m²',
    description: 'Không gian vừa đủ cho người trẻ, chuyên gia và nhu cầu khai thác linh hoạt.',
    image: '/images/floor-plans/final/plan-1br-plus.png',
    pdf: '/images/floor-plans/original-pdf/ch-a1-1br-plus.pdf',
    locatorImage: '/images/floor-plans/locators/ch-a1-locator.webp',
    locatorLabel: 'VỊ TRÍ CĂN HỘ CH-A1 TRÊN MẶT BẰNG TẦNG',
  },
  {
    id: '2br-b1',
    index: '02',
    name: 'Căn hộ 2BR',
    code: 'CH-B1',
    bedrooms: '2 phòng ngủ',
    usableArea: '71,0 m²',
    wallArea: '77,2 m²',
    description: 'Phương án cân bằng cho gia đình trẻ với khu sinh hoạt chung và hai logia.',
    image: '/images/floor-plans/final/plan-2br-b1.png',
    pdf: '/images/floor-plans/original-pdf/ch-b1-2br.pdf',
    locatorImage: '/images/floor-plans/locators/ch-b1-locator.webp',
    locatorLabel: 'VỊ TRÍ CĂN HỘ CH-B1 TRÊN MẶT BẰNG TẦNG',
  },
  {
    id: '2br-b2',
    index: '03',
    name: 'Căn hộ 2BR',
    code: 'CH-B2',
    bedrooms: '2 phòng ngủ',
    usableArea: '70,5 m²',
    wallArea: '77,5 m²',
    description: 'Mặt bằng tối ưu diện tích sử dụng, phù hợp nhu cầu ở thực và nắm giữ dài hạn.',
    image: '/images/floor-plans/final/plan-2br-b2.png',
    pdf: '/images/floor-plans/original-pdf/ch-b2-2br.pdf',
    locatorImage: '/images/floor-plans/locators/ch-b2-locator.webp',
    locatorLabel: 'VỊ TRÍ CĂN HỘ CH-B2 TRÊN MẶT BẰNG TẦNG',
  },
  {
    id: '3br',
    index: '04',
    name: 'Căn hộ 3BR',
    code: 'CH-C1',
    bedrooms: '3 phòng ngủ',
    usableArea: '100,5 m²',
    wallArea: '109,7 m²',
    description: 'Không gian rộng cho gia đình đa thế hệ, có kho, logia lớn và phòng ngủ master.',
    image: '/images/floor-plans/final/plan-3br.png',
    pdf: '/images/floor-plans/original-pdf/ch-c1-3br.pdf',
    locatorImage: '/images/floor-plans/locators/ch-c1-locator.webp',
    locatorLabel: 'VỊ TRÍ CĂN HỘ CH-C1 TRÊN MẶT BẰNG TẦNG',
  },
];

export const locationMarkers: LocationMarker[] = [
  { label: 'EraCity', detail: '161 Nguyễn Chí Thanh · Tân An', className: 'marker-project' },
];

export const urbanCaptions = [
  'Lam đứng và ban công tạo chiều sâu cho mặt đứng.',
  'Cây xanh được đưa lên từng lớp kiến trúc.',
  'Tầng trệt thương mại kết nối nhịp sống nội khu.',
];
