import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolioProject extends Document {
  title: string;
  category: 'vivienda' | 'interior' | 'comercial';
  location: string;
  municipality: string;
  m2: string;
  year: string;
  image: string;
  description: string;
  approval: string;
  highlights: string[];
  tags: string[];
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolioProject>(
  {
    title: {
      type: String,
      required: [true, 'El título del proyecto es obligatorio'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['vivienda', 'interior', 'comercial'],
      required: true,
      default: 'vivienda',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    municipality: {
      type: String,
      required: true,
      trim: true,
    },
    m2: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    approval: {
      type: String,
      required: true,
      trim: true,
      default: 'Plano Aprobado Obras Particulares',
    },
    highlights: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PortfolioProject =
  mongoose.models.PortfolioProject ||
  mongoose.model<IPortfolioProject>('PortfolioProject', PortfolioSchema);
