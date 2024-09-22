"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import * as Slider from "@radix-ui/react-slider";
import { ChevronRight, X } from 'lucide-react' 

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from './ui/input'
import Link from 'next/link'

const categories = ["Tops", "Dresses", "Pants", "Skirts", "Jackets", "T-shirts", "Jeans"]
const colors = [
  { name: "Purple", hex: "#A020F0" },
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#FF0000" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Navy", hex: "#000080" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Brown", hex: "#A52A2A" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Grey", hex: "#808080" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Blue", hex: "#0000FF" }
]
const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"]
const dressStyles = ["Casual", "Formal", "Party", "Gym", "Floral"]

interface Product {
  _id: string
  name: string
  price: number
  image: string
  brand: string
  slug: string
}

export default function ProductListing() {
  const [wishlist, setWishlist] = useState<Product[]>([]); 
  const [wishlistupdated, setWishlistupdated] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user')
  const [activeFilter, setActiveFilter] = useState('New')
  const [priceRange, setPriceRange] = useState([10, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedDressStyles, setSelectedDressStyles] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const router = useRouter()
  const { toast } = useToast()



  const handlePriceChange = (newValues: number[]) => {
    setPriceRange(newValues);
    fetchProducts(newValues, true);
  };



  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }, [])

  const handleColorChange = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleDressStyle = useCallback((style: string) => {
    setSelectedDressStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style) 
        : [...prev, style]
    )
  }, [])
  


  
  

  const fetchUserRole = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('/api/user/role', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setUserRole(data.role)
      } else {
        console.warn('Failed to fetch user role:', data.message)
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
    }
  }, [])

  const fetchProducts = useCallback(async (priceRangeArg = priceRange, resetProducts: boolean = false) => {
    if (isLoading || (!hasMore && !resetProducts)) return;

    setIsLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams({
        page: resetProducts ? '1' : page.toString(),
        limit: '4',
        sort: activeFilter.toLowerCase(),
        minPrice: priceRangeArg[0].toString(),
        maxPrice: priceRangeArg[1].toString(),
        categories: selectedCategories.join(','),
        colors: selectedColors.join(','),
        sizes: selectedSizes.join(','),
        dressStyles: selectedDressStyles.join(','),
      });

      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        const newProducts = data.data;

        setProducts(prevProducts => {
          if (resetProducts) {
            return newProducts;
          } else {
            const uniqueNewProducts = newProducts.filter(
              (newProduct: Product) => !prevProducts.some(
                existingProduct => existingProduct._id === newProduct._id
              )
            );
            return [...prevProducts, ...uniqueNewProducts];
          }
        });

        setHasMore(data.currentPage < data.totalPages);
        setPage(prevPage => resetProducts ? 2 : prevPage + 1);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, activeFilter, priceRange, selectedCategories, selectedDressStyles,selectedColors, selectedSizes, isLoading, hasMore, toast]);


  useEffect(() => {
    fetchUserRole()
  
  }, [fetchUserRole])

  useEffect(() => {
    loadWishlist()
  }, [wishlistupdated])

  useEffect(() => {
    setProducts([])
    setPage(1)
    setHasMore(true)
    fetchProducts(priceRange,true)
  }, [activeFilter, priceRange, selectedCategories,selectedDressStyles, selectedColors, selectedSizes])

  const handleCreateProduct = () => {
    router.push('/products/create')
  }

  const loadWishlist = () => {
    const storedWishlist = localStorage.getItem('wishlist')
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist))
    }
  }

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist = []) => {
      let newWishlist;
  
      // Check if the product is already in the wishlist
      const exists = prevWishlist.some((item) => item && item._id === product._id);
  
      if (exists) {
        // Remove the product from the wishlist
        newWishlist = prevWishlist.filter((item) => item && item._id !== product._id);
        toast({
          title: "Removed from Wishlist",
          description: "The item has been removed from your wishlist.",
        });
      } else {
        // Add the product to the wishlist
        newWishlist = [...prevWishlist, product];
        toast({
          title: "Added to Wishlist",
          description: "The item has been added to your wishlist.",
        });
      }
  
      // Save the updated wishlist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setWishlistupdated(wishlistupdated + 1); // Trigger re-render if necessary
  
      return newWishlist;
    });
  };
  
  

  const handleEditProduct = (productId: string) => {
    router.push(`/products/edit/${productId}`)
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setProducts(products.filter(product => product._id !== productId))
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const formatPrice = (price: number) => {
    return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  const handleInputChange = (value: string, index: number) => {
    const newValue = parseInt(value, 10);
      const newPriceRange = [...priceRange];
      newPriceRange[index] = newValue;
      setPriceRange(newPriceRange);
    fetchProducts(newPriceRange,true);

  };

  
  
  
  

  return (
    <div>
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <div className="bg-white border border-t-0">
            <div className='flex items-center justify-between border-b p-8'>
              <h2 className="text-xl font-semibold text-gray-500">Filter</h2>
              <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.83333 6.33333L2.83333 1.75M2.83333 18.25L2.83333 10M13.8333 18.25L13.8333 10M8.33333 18.25V13.6667M8.33333 10V1.75M13.8333 6.33333L13.8333 1.75M1 6.33333H4.66667M6.5 13.6667H10.1667M12 6.33333L15.6667 6.33333" stroke="#807D7E" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </div>

            {/* Categories */}
            <div className=" p-8 border-b">
              {categories.map((category) => (
                <div 
                  key={category} 
                  className="flex items-center justify-between mb-4 text-gray-500 cursor-pointer hover:text-black"
                  onClick={() => toggleCategory(category)}
                >
                  <p className='font-medium'>{category}</p>
                  {selectedCategories.includes(category) ? (
                    <X size={20} className="text-red-500" />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </div>
              ))}
            </div>

              <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3','item-4']}>
                <AccordionItem value="item-1" className=''>
                  <AccordionTrigger className='px-8 py-6 hover:no-underline'>      
                    <h3 className="font-semibold text-gray-500 text-xl">Price</h3>
                  </AccordionTrigger>
                  <div className='border-b'></div>
                  <AccordionContent className='py-11'>
                  <div className="p-4 px-8 bg-white rounded-lg">
  <Slider.Root
    className="relative flex items-center select-none touch-none w-full h-5"
    value={priceRange}
    onValueChange={handlePriceChange} 
    min={10}
    max={1000}
    step={1}
    minStepsBetweenThumbs={1}
  >
    <Slider.Track className="bg-slate-400 relative grow rounded-full h-[4px]">
      <Slider.Range className="absolute bg-[#8A33FD] rounded-full h-full" />
    </Slider.Track>
    <Slider.Thumb
      className="block w-5 h-5 bg-[#8A33FD] shadow-lg rounded-full hover:bg-[#8A33FD] focus:outline-none focus:ring-2 focus:ring-[#8A33FD]"
      aria-label="Minimum price"
    />
    <Slider.Thumb
      className="block w-5 h-5 bg-[#8A33FD] shadow-lg rounded-full hover:bg-[#8A33FD] focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Maximum price"
    />
  </Slider.Root>

  <div className="flex justify-center gap-8 items-center mt-2">
    <Input
      type="number"
      className="appearance-none text-lg font-medium border rounded-lg w-[80px] text-center py-2"
      value={priceRange[0]} // Minimum price value
      onChange={(e) => handleInputChange(e.target.value, 0)} // Input change handler for min price
    />
    <Input
      type="number"
      className="appearance-none text-lg font-medium border rounded-lg w-[80px] text-center py-2"
      value={priceRange[1]} // Maximum price value
      onChange={(e) => handleInputChange(e.target.value, 1)} // Input change handler for max price
    />
  </div>
</div>

                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className='px-8 py-6 hover:no-underline'><h3 className="font-semibold text-gray-500 text-xl">
                Colors
              </h3></AccordionTrigger>
              <div className='border-b'></div>
                  <AccordionContent className='px-1 py-10'>
                  <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <div key={color.name} className="flex flex-col items-center">
                   <button
                      className={`w-8 h-8 rounded-lg mb-1 ${selectedColors.includes(color.name) ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      onClick={() => handleColorChange(color.name)}
                    />
                    <span className="text-xs">{color.name}</span>
                  </div>
                ))}
              </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                <AccordionTrigger className='px-8 py-6 hover:no-underline font-semibold text-gray-500 text-xl'>      
                Size
                  </AccordionTrigger>
              <div className='border-b'></div>

                  <AccordionContent className='p-8'>
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                {sizes.map((size) => (
                 <button
                 key={size}
                 className={`font-semibold px-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 w-[70px] ${selectedSizes.includes(size) ? 'bg-blue-500 text-white' : ''}`}
                 onClick={() => handleSizeChange(size)}
               >
                 {size}
               </button>
                ))}
              </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                <AccordionTrigger className='px-8 py-6 hover:no-underline font-semibold text-gray-500 text-xl'>      
                Dress Style
                  </AccordionTrigger>
              <div className='border-b'></div>

                  <AccordionContent className='p-8'>
                  {dressStyles.map((style) => (
                <div 
                  key={style} 
                  className="flex items-center justify-between mb-4 text-gray-500 cursor-pointer hover:text-black"
                  onClick={() => toggleDressStyle(style)}
                >
                  <p className="ml-2 text-sm">{style}</p>
                  {selectedDressStyles.includes(style) ? (
                    <X size={20} className="text-red-500" />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </div>
              ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
          </div>

        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4 py-8 px-4 md:px-0">
          {/* Header and Filter Buttons */}
          <div className='flex justify-between items-center mb-8'>
            <h4 className="text-xl font-medium">Women&apos;s Clothing</h4>
            <div className="flex items-center">
              {['New', 'Recommended'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-2 font-medium text-xl",
                    activeFilter === filter
                      ? "text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {filter}
                </button>
              ))}
              {userRole === 'admin' && (
                <Button onClick={handleCreateProduct} className="ml-4">
                  Create Product
                </Button>
              )}
            </div>
          </div>
          
          {/* Product Grid */}
          {isLoading && products.length === 0 ? (
  <div className="text-center py-10">
    <p className="text-xl font-semibold">Loading...</p>
  </div>
) : error ? (
  <div className="text-center py-10">
    <p className="text-xl font-semibold text-red-500">{error}</p>
  </div>
) : products.length === 0 ? (
  <div className="text-center py-10">
    <p className="text-xl font-semibold">No products found.</p>
    <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
  </div>
) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
      <Link key={product._id} href={`/product/${product.slug}`} className="block">
                <div key={product._id} className="bg-white rounded-lg overflow-hidden relative transform transition-transform duration-300 hover:scale-105">
                  <Image
                    src={ product.image}
                    alt={product.name}
                    className="rounded-lg w-full object-cover"
                    width={100}
                    height={370}
                  />
                  <div className="absolute top-2 right-2">
                  <button 
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
                onClick={() => toggleWishlist(product)}
              >
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  className="h-5 w-5 text-gray-600 hover:text-black"
  viewBox="0 0 24 24" 
  fill={wishlist.some(item => item && item._id === product._id) ? "red" : "none"}
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
                        <p className="font-bold px-4 py-2 bg-[#F6F6F6] rounded-lg">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    {userRole === 'admin' && (
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button onClick={() => handleEditProduct(product._id)} variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => handleDeleteProduct(product._id)} variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <Button className='text-lg bg-white text-gray-400 shadow-none hover:bg-white hover:text-black' onClick={()=> fetchProducts(priceRange,false)} disabled={isLoading}>
                {isLoading ? "Loading..." : "See More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}