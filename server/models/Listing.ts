import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  material_type: String,
  framing: String,
  quantity: Number,
  unit: String,
  estimated_value_per_unit: String,
  total_estimated_value: String,
  province: String,
  production: String,
  withdrawals_per_year: String,
  storage: String,
  sustainability_impact: {
    co2_saved_kg: Number,
    water_saved_liters: Number,
    trees_equivalent: Number,
  },
  potential_buyers: [String],
  image_url: String, // Or base64 for simplicity in hackathon
  status: { type: String, default: 'active' },
  isHazardous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Listing', listingSchema);
