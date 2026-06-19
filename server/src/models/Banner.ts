import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle: string;
  tagline: string;
  backgroundGradient: string;
  accentColor: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

const bannerSchema = new Schema<IBanner>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  tagline: { type: String, required: true },
  backgroundGradient: { type: String, required: true },
  accentColor: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

export default mongoose.model<IBanner>('Banner', bannerSchema);
