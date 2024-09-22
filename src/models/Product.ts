import  { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: string; 
  name: string;
  slug: string;
  price: number;
  brand: string;
  image: string;
  category: string;
  dressStyle: string;
  colors: string[];
  sizes: string[];
  description: string;
  popularity: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, index: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    dressStyle: { type: String, required: true, index: true },
    colors: { type: [String], required: true, index: true },
    sizes: { type: [String], required: true, index: true },
    description: { type: String, required: true },
    popularity: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

productSchema.index({ category: 1, price: 1, popularity: -1 });

const Product = models.Product || model<IProduct>('Product', productSchema);

export default Product;