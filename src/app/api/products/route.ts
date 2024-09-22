import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';
import { authorize } from '../../../utils/auth';
import { Types } from 'mongoose';

// Helper function for error responses
const errorResponse = (message: string, status: number) => 
  NextResponse.json({ success: false, message }, { status });

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

export async function GET(req: NextRequest) {
  await dbConnect();
 
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];  
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000');
  const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
  const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
  const dressStyles = searchParams.get('dressStyles')?.split(',').filter(Boolean) || [];

  const query: any = {};
  if (minPrice > 0 || maxPrice < 1000000) {
    query.price = {
      ...(minPrice > 0 && { $gte: minPrice }),
      ...(maxPrice < 1000000 && { $lte: maxPrice })
    };
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (categories.length) query.category = { $in: categories };
  if (colors.length) query.colors = { $in: colors };
  if (sizes.length) query.sizes = { $in: sizes };
  if (dressStyles.length) query.dressStyle = { $in: dressStyles };

  const sortOptions: any = {};
  if (sort === 'new') {
    sortOptions.createdAt = -1;
  } else if (sort === 'recommended') {
    sortOptions.popularity = -1; // Sort by popularity in descending order
  } else if (sort === 'priceLowToHigh') {
    sortOptions.price = 1;
  } else if (sort === 'priceHighToLow') {
    sortOptions.price = -1;
  } else {
    sortOptions.createdAt = -1; // Default to newest
  }
  // Always include _id in sorting to ensure consistent order
  sortOptions._id = 1;

  try {
    const totalProducts = await Product.countDocuments(query);
    const skip = (page - 1) * limit;
    console.log('Skip:', skip);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    console.log('Query:', query);
    console.log('Sort options:', sortOptions);
    console.log('Products found:', products.length);
    console.log('First product ID:', products[0]?._id);

    return NextResponse.json({
      success: true,
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // const authResult = await authorize(req, 'admin');
    // if (!authResult.success) {
    //   return authResult.response!;
    // }

    await dbConnect();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return errorResponse('Failed to create product', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authorize(req, 'admin');
    if (!authResult.success) {
      return authResult.response!;
    }

    await dbConnect();
    const { id, ...updateData } = await req.json();

    if (!isValidObjectId(id)) {
      return errorResponse('Invalid product ID', 400);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!product) {
      return errorResponse('Product not found', 404);
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    return errorResponse('Failed to update product', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authorize(req, 'admin');
    if (!authResult.success) {
      return authResult.response!;
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id || !isValidObjectId(id)) {
      return errorResponse('Invalid or missing product ID', 400);
    }

    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return errorResponse('Product not found', 404);
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return errorResponse('Failed to delete product', 500);
  }
}