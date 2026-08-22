import mongoose from 'mongoose';

const demandRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  materialName:  { type: String, required: true },  // e.g. "Cotton", "Steel Slag"
  category:      { type: String },                   // e.g. "Textile", "Metal"
  quantityNeeded: { type: Number },
  unit:          { type: String, default: 'kg' },
  province:      { type: String },
  description:   { type: String },
  status:        { type: String, default: 'active' },
  createdAt:     { type: Date, default: Date.now },
});

export default mongoose.model('DemandRequest', demandRequestSchema);
