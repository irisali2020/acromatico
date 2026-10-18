import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceItem extends Document {
  id: string;
  num: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  badge: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IServiceItem>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    num: {
      type: String,
      required: true,
      trim: true,
      default: '01',
    },
    icon: {
      type: String,
      required: true,
      trim: true,
      default: 'Home',
    },
    title: {
      type: String,
      required: [true, 'El título del servicio es obligatorio'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      trim: true,
      default: 'Especialidad',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceModel =
  mongoose.models.Service || mongoose.model<IServiceItem>('Service', ServiceSchema);
