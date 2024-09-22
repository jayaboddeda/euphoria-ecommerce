'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MessageSquareIcon, ShoppingCart, CreditCard, Shirt, Truck, RotateCwSquareIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { IProduct } from '@/models/Product'
import Link from 'next/link'

interface ProductImage {
  src: string
  alt: string
}



  interface SimilarProductProps {
    product: IProduct;
  }



  const SimilarProductCard = ({ product }: SimilarProductProps) => {
    return (
      <Link href={`/product/${product.slug}`} className="block">
        <div className="bg-white rounded-lg overflow-hidden relative hover:shadow-lg transition duration-300 ease-in-out">
          <Image
            src={product.image}
            alt={product.name}
            className="rounded-lg w-full object-cover"
            width={100}
            height={370}
          />
          <div className="absolute top-2 right-2">
            <button
              className="bg-white p-1 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 hover:text-black"
                viewBox="0 0 24 24"
                fill={"none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6a5.4 5.4 0 00-7.6 0l-.9.9-.9-.9a5.4 5.4 0 00-7.6 7.6l.9.9L12 21.5l7.6-7.6.9-.9a5.4 5.4 0 000-7.6z"></path>
              </svg>
            </button>
          </div>
          <div className="pb-3 pt-6">
            <div className="flex items-center justify-between">
              <div className="w-1/2">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 truncate">{product.brand}</p>
              </div>
              <div>
                <p className="font-bold px-4 py-2 bg-[#F6F6F6] rounded-lg">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

const ProductGallery = ({ images }: { images: ProductImage[] }) => {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 ">
      <div className="order-2 justify-center items-center md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:h-[600px] md:w-24">
        {images.map((img, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`p-0 w-20 h-20 flex-shrink-0 ${currentImage === index ? 'ring-1 ring-primary p-1' : ''}`}
            onClick={() => setCurrentImage(index)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </Button>
        ))}

<div className="flex md:flex-col gap-2">
          <Button size="icon" variant="ghost" onClick={prevImage} className="bg-[#F6F6F6] hover:bg-black rounded-full hover:text-white">
            <ChevronUp className="h-4 w-4 " />
          </Button>
          <Button size="icon" variant="ghost" onClick={prevImage} className="bg-[#F6F6F6] hover:bg-black rounded-full hover:text-white">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="order-1 md:order-2 relative md:w-[500px]">
      <div className="w-full h-full relative">
  <div className="aspect-w-4 aspect-h-5 md:aspect-w-3 md:aspect-h-4 w-full h-full">
    <Image
      src={images[currentImage].src}
      alt={images[currentImage].alt}
      objectFit="cover"
      className="rounded-lg h-full w-full"
      height={500}
      width={100}
    />

  </div>
</div>
       
      </div>
    </div>
  )
}

export default function ProductPage({ product, similarProducts }: { product: IProduct; similarProducts: IProduct[] }) {

      const images: ProductImage[] = [
    { src: product.image, alt: "Product main image" },
    { src: "https://assets.ajio.com/medias/sys_master/root/20221114/FZsH/6372777af997ddfdbd7374f5/-473Wx593H-469288421-navy-MODEL.jpg", alt: "Product thumbnail 1" },
    { src: "https://assets.ajio.com/medias/sys_master/root/20220927/GTO6/63331783aeb269dbb3aa8733/-473Wx593H-469329521-purple-MODEL.jpg", alt: "Product thumbnail 2" },
  ]

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const sizes = product.sizes[0].split(', ')
  const colors = product.colors[0].split(', ')

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        <ProductGallery images={images} />
        {/* Product details section */}
        <div className="space-y-6">
          <div className="text-gray-500 breadcrumbs mb-4 pt-8">
            <ul className="flex items-center">
              <li className="flex items-center">
                Shop
                <ChevronRight className="w-4 h-4 mx-2" />
              </li>
              <li className="flex items-center">
                {product.category}
                <ChevronRight className="w-4 h-4 mx-2" />
              </li>
              <li>{product.name}</li>
            </ul>
          </div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-5 h-5 ${star <= Math.floor(product.popularity) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold">{product.popularity.toFixed(1)}</span>
            <span className="text-gray-500 flex items-center"> <MessageSquareIcon className='w-4 h-4 mx-2'/> 120 comments</span>
          </div>
          <div>
            <h2 className="font-medium mb-2">Select Size</h2>
            <div className="flex space-x-2">
              {sizes.map((size) => (
                <Button 
                  key={size} 
                  variant={selectedSize === size ? "default" : "outline"} 
                  className="w-10 h-10 rounded-xl border-gray-300"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-medium mb-2">Colours Available</h2>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  className={` w-5 h-5 px-0 py-0 border-0 rounded-full ${selectedColor === color ? 'ring-1 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-6 border-b pb-6">
            <Button className="bg-[#8A33FD] hover:bg-purple-700 text-white px-8 py-5 rounded-lg">
              <ShoppingCart className='w-4 h-4 mx-2'/> Add to cart
            </Button>
            <span className="text-lg font-semibold border rounded-lg px-7 py-1 border-black">${product.price.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-8 h-8 mx-2 rounded-full bg-[#F6F6F6] p-2" />    
              <span>Secure payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-8 h-8 mx-2 rounded-full bg-[#F6F6F6] p-2" />    
              <span>Free shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shirt className="w-8 h-8 mx-2 rounded-full bg-[#F6F6F6] p-2" />    
              <span>Size & Fit</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCwSquareIcon className="w-8 h-8 mx-2 rounded-full bg-[#F6F6F6] p-2" />    
              <span>Free Shipping & Returns</span>
            </div>
          </div>
          
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts.map(similarProduct => (
            <SimilarProductCard
              key={similarProduct._id}
              product={similarProduct}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


