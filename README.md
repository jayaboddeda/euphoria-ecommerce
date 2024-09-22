## README

# Euphoria

This project is an e-commerce application built using modern web technologies for an efficient and smooth user experience. Below is a detailed overview of the technologies used and the core features implemented in the project.

## Tech Stack

### Frontend
- **Next.js**: Used for building server-side rendered React applications.
- **React**: A JavaScript library for building user interfaces.
- **Shadcn**: A component library that enhances the UI design and functionality.

### Backend
- **Next.js API Routes**: Used for server-side logic and API endpoints.

### Database
- **MongoDB**: A NoSQL database used to store product information and other necessary data.

## Features

1. **Search**
   - Allows users to search for products using keywords. 
   - Supports partial and full-text search to enhance the user experience.

2. **Filters**
   - Includes filters for categories, price range, colors, sizes, and dress style.
   - Filters can be applied individually or in combination to narrow down the product list.

3. **Sorting**
   - Supports sorting of products based on price, popularity, and relevance.
   - Users can choose from different sorting options to find products easily.

4. **Product Listing**
   - Displays a list of products with key details such as name, price, image, and brand.
   - Each product card provides a quick view, and users can click to view detailed information.

5. **Pagination**
   - Implements pagination with a "Load More" feature to dynamically fetch more products.
   - Improves performance by loading a limited number of products initially and loading more as needed.

6. **Product Details Page**
   - Shows detailed information about a specific product, including multiple images, detailed descriptions, available sizes, colors, and dress styles.
   - Includes related products to enhance cross-selling opportunities.

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jayaboddeda/euphoria-ecommerce.git
   cd euphoria-ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following variables:
   ```bash
   MONGODB_URI=<your-mongodb-connection-string>
   NEXT_PUBLIC_API_URL=<your-nextjs-api-url>
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Building and Running for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## Project Structure

- `public/`: Static assets (fonts, images, favicon)
- `src/`: Main application code
  - `app/`: Application layout and pages
  - `components/`: Reusable React components
  - `images/`: Application images
  - `lib/`: Utility functions
  - `models/`: Data models (e.g., Product.ts)
  - `utils/`: Utility functions (e.g., database connection)


## API Endpoints

1. **`GET /api/products`**:
   - Fetches a list of products with optional query parameters for search, filters, and sorting.
   - Supports pagination with `page` and `limit` query parameters.

2. **`GET /api/products/by-slug?slug=slugname`**:
   - Fetches detailed information for a single product based on the product slug.



## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any queries or suggestions, please contact [Jayasaiavinash@gmail.com].
