export type Product = {
  id: string;
  name: string;
  category: 'apartment' | 'shophouse' | 'townhouse' | 'social';
  count?: string;
  usableArea?: string;
  wallArea?: string;
  bedrooms?: string;
  audience?: string;
  description: string;
  highlights: string[];
  planImage: string;
};

export const productMix: Product[] = [
  {
    id: 'apartments',
    name: 'Căn hộ cao cấp',
    category: 'apartment',
    count: '984 căn',
    audience: 'Gia đình trẻ, chuyên gia, nhà đầu tư cho thuê',
    description:
      'Khối tháp căn hộ với ban công phủ xanh, kính lớn đón sáng, tầm nhìn về quảng trường và cảnh quan nội khu.',
    highlights: ['Ban công vườn xanh', 'Cửa kính panorama', 'Sảnh đón sang trọng'],
    planImage: '/images/crops/plan-2br-b1-crop.webp',
  },
  {
    id: 'townhouse-mix',
    name: 'Townhouse thấp tầng',
    category: 'townhouse',
    count: '152 căn',
    audience: 'Gia đình cần không gian riêng tư trong khu đô thị',
    description:
      'Nhà phố thấp tầng với sân vườn, ban công xanh và ngôn ngữ kiến trúc ấm áp, tạo cảm giác biệt lập nhưng vẫn kết nối tiện ích.',
    highlights: ['Sân vườn riêng', 'Ban công phủ xanh', 'Kiến trúc thấp tầng'],
    planImage: '/images/new-media/dusk-facade.webp',
  },
  {
    id: 'shophouse-mix',
    name: 'Shophouse thương mại',
    category: 'shophouse',
    audience: 'Khai thác kinh doanh, F&B, dịch vụ, văn phòng nhỏ',
    description:
      'Tuyến nhà phố thương mại mặt tiền trục nội khu, khai thác kép vừa ở vừa kinh doanh trong dòng lưu chuyển cư dân hằng ngày.',
    highlights: ['Mặt tiền thương mại', 'Khai thác kép', 'Dòng khách nội khu'],
    planImage: '/images/new-media/street-life.webp',
  },
  {
    id: 'social-housing',
    name: 'Nhà ở xã hội',
    category: 'social',
    audience: 'Nhu cầu an cư chất lượng với mức giá hợp lý',
    description:
      'Dòng sản phẩm an sinh nằm trong cùng quần thể, tiếp cận hệ tiện ích, cảnh quan và hạ tầng chung của khu đô thị.',
    highlights: ['Cơ hội an cư', 'Tiện ích dùng chung', 'Cộng đồng đa tầng'],
    planImage: '/images/new-media/overview-aerial.webp',
  },
];

export const products: Product[] = [
  {
    id: '1br-plus',
    name: 'Căn hộ 1BR+',
    category: 'apartment',
    usableArea: '45.6 m²',
    wallArea: '49.2 m²',
    bedrooms: '1BR+',
    description:
      'Không gian linh hoạt cho người trẻ, chuyên gia hoặc nhà đầu tư tìm kiếm sản phẩm vừa đủ, dễ quản lý và dễ khai thác.',
    highlights: ['Diện tích gọn', 'Logia riêng', 'Phù hợp đầu tư'],
    planImage: '/images/floor-plans/pdf-detail/plan-1br-plus.png',
  },
  {
    id: '2br-b1',
    name: 'Căn hộ 2BR - B1',
    category: 'apartment',
    usableArea: '71.0 m²',
    wallArea: '77.2 m²',
    bedrooms: '2BR',
    description:
      'Cấu trúc cân bằng cho gia đình trẻ, tối ưu khu sinh hoạt chung, hai phòng ngủ, bếp và logia.',
    highlights: ['2 phòng ngủ', 'Không gian cân bằng', 'Gia đình trẻ'],
    planImage: '/images/floor-plans/pdf-detail/plan-2br-b1.png',
  },
  {
    id: '2br-b2',
    name: 'Căn hộ 2BR - B2',
    category: 'apartment',
    usableArea: '70.5 m²',
    wallArea: '77.5 m²',
    bedrooms: '2BR',
    description:
      'Phương án 2 phòng ngủ tối ưu diện tích sử dụng, phù hợp nhu cầu ở thực, giữ tài sản hoặc cho thuê.',
    highlights: ['2 phòng ngủ', 'Tối ưu diện tích', 'Có logia'],
    planImage: '/images/floor-plans/pdf-detail/plan-2br-b2.png',
  },
  {
    id: '3br',
    name: 'Căn hộ 3BR',
    category: 'apartment',
    usableArea: '100.5 m²',
    wallArea: '109.7 m²',
    bedrooms: '3BR',
    description:
      'Không gian rộng hơn cho gia đình nhiều thế hệ, có thêm phòng ngủ, kho và logia lớn.',
    highlights: ['3 phòng ngủ', 'Có kho', 'Diện tích rộng'],
    planImage: '/images/floor-plans/pdf-detail/plan-3br.png',
  },
];
