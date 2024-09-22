import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import playstore from "@/images/playstore.png"
import appstore from "@/images/appstore.png"
import Image from "next/image"


export default function Footer() {
  return (
    <footer className="bg-[#3A3F3F] text-white py-8 px-4 md:px-8">
      <div className="container mx-auto  max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10">
          <div>
            <h3 className="font-semibold text-lg mb-4">Need Help</h3>
            <ul className="space-y-4">
              <li>Contact Us</li>
              <li>Track Order</li>
              <li>Returns & Refunds</li>
              <li>FAQ&apos;s</li>
              <li>Career</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-4">
              <li>About Us</li>
              <li>euphoria Blog</li>
              <li>euphoriastan</li>
              <li>Collaboration</li>
              <li>Media</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">More Info</h3>
            <ul className="space-y-4">
              <li>Term and Conditions</li>
              <li>Privacy Policy</li>
              <li>Shipping Policy</li>
              <li>Sitemap</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Location</h3>
            <p>support@euphoria.in</p>
            <p className="my-4">Eklingpura Chouraha, Ahmedabad Main Road</p>
            <p>(NH 8- Near Mahadev Hotel) Udaipur, India- 313002</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end px-10">
        
        <div className="mt-8 flex flex-wrap items-center justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="bg-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3A3F3F]">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="bg-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3A3F3F]">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="bg-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3A3F3F]">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="bg-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3A3F3F]">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
          </div>
          <div className="mt-8">
          <h3 className="font-semibold text-xl mb-4">Download The App</h3>
          <div className="flex space-x-4">
            <Image width={120} height={10} src={playstore.src} alt="Google Play" className="h-10 w-full" />
            <Image width={120} height={10} src={appstore.src} alt="App Store" className="h-10 w-full" />
          </div>
        </div>
          </div>
          <Collapsible className="w-full md:w-auto">
            <CollapsibleTrigger asChild >
            <div className="flex justify-between items-center px-6 py-5 my-8 border-gray-400 border-t border-b">
              <Button variant="ghost" className="w-full md:w-auto justify-between text-xl">
                Popular Categories
              </Button>
              <ChevronDown className="h-4 w-4 ml-2" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-2">
                <li>Category 1</li>
                <li>Category 2</li>
                <li>Category 3</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.</p>
        </div>
    </footer>
  )
}