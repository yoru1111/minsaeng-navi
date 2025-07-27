import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    default: '',
    trim: true
  },
  si: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    default: '',
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [경도, 위도]
      required: true
    }
  },
  // 충전식 카드 취급여부
  usable_with_fund: {
    type: Boolean,
    default: false
  },
  // 지류 취급여부
  accepts_paper: {
    type: Boolean,
    default: false
  },
  // 모바일 취급여부
  accepts_mobile: {
    type: Boolean,
    default: false
  },
  has_coupon_sticker: {
    type: Boolean,
    default: false
  },
  verified_by_official: {
    type: Boolean,
    default: false
  },
  is_franchise: {
    type: Boolean,
    default: false
  },
  is_headstore: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 복합 유니크 인덱스: name + address
storeSchema.index({ name: 1, address: 1 }, { unique: true });

// 지리공간 인덱스: location 필드
storeSchema.index({ location: '2dsphere' });

// 지역 및 카테고리 필터링을 위한 인덱스
storeSchema.index({ area: 1, si: 1, category: 1 });

export default mongoose.model('Store', storeSchema);

