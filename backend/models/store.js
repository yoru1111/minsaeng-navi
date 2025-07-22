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
  usable_with_fund: {
    type: Boolean,
    default: true
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

export default mongoose.model('Store', storeSchema);

