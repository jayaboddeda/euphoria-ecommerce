import ProductPage from '@/components/ProductDetails';
import { IProduct } from '@/models/Product';

async function getProduct(slug: string): Promise<IProduct> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/by-slug?slug=${slug}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  const data = await res.json();
  return data.data;
}

async function getSimilarProducts(category: string, currentProductId: string): Promise<IProduct[]> {
  const queryParams = new URLSearchParams({
    page: '1',
    limit: '4',
    categories: category,
  });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryParams}`);
  if (!res.ok) {
    throw new Error('Failed to fetch similar products');
  }
  const data = await res.json();
  // Filter out the current product from similar products
  return data.data.filter((product: IProduct) => product._id !== currentProductId);
}

export default async function Page({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  const similarProducts = await getSimilarProducts(product.category, product._id);

  return (
    <div>
      <ProductPage product={product} similarProducts={similarProducts} />
    </div>
  );
}