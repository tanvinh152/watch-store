# WBS: Watch E-commerce MVP

**Project:** MVP Watch E-commerce Website
**Tech Stack:** Next.js (App Router), Tailwind CSS, Supabase (PostgreSQL, Auth, Storage)
**Goal:** Minimum Viable Product with Storefront and Admin Dashboard.

---

## 1.0 Project Initialization & Configuration

* **1.1 Environment Setup**
    * 1.1.1 Initialize Next.js project (TypeScript, ESLint).
    * 1.1.2 Configure Tailwind CSS and install UI library (e.g., Shadcn/UI or Mantine).
    * 1.1.3 Install dependencies: `@supabase/supabase-js`, `lucide-react` (icons), `zustand` (state management), `recharts` (for dashboard).
* **1.2 Project Architecture**
    * 1.2.1 Set up folder structure (`/app`, `/components`, `/lib`, `/types`).
    * 1.2.2 Configure Supabase Client (environment variables setup).
    * 1.2.3 Set up Global Layouts (Main Layout vs. Admin Layout).

## 2.0 Backend & Database (Supabase)

* **2.1 Database Schema Design**
    * 2.1.1 Create `products` table:
        * `id`, `name`, `brand`, `price`, `sale_price`
        * `description`, `specs_json`, `image_url`
        * `stock_status` (boolean), `created_at`
    * 2.1.2 Create `orders` table:
        * `id`, `customer_info_json` (name, phone, address)
        * `total_amount`, `status` (pending/shipped/done)
        * `payment_method`, `created_at`
    * 2.1.3 Create `order_items` table:
        * Link `order_id` and `product_id`
        * `quantity`, `price_at_purchase`
* **2.2 Storage & Assets**
    * 2.2.1 Create Storage Bucket: `product-images`.
    * 2.2.2 Configure Public Access policies for image viewing.
* **2.3 Security (RLS Policies)**
    * 2.3.1 **Products:** Enable Read access for Public; Enable Insert/Update/Delete for Admin only.
    * 2.3.2 **Orders:** Enable Insert for Public (Guest checkout); Enable Read/Update for Admin only.
* **2.4 Authentication**
    * 2.4.1 Enable Email/Password provider.
    * 2.4.2 Create a single Admin account manually.

## 3.0 Frontend: Storefront (Customer View)

* **3.1 Shared Components**
    * 3.1.1 **Navbar:** Logo, Navigation Links, Shopping Cart Icon (with badge count).
    * 3.1.2 **Footer:** Simple copyright and contact links.
    * 3.1.3 **Product Card:** Reusable component displaying image, title, price.
* **3.2 Home Page**
    * 3.2.1 **Hero Section:** Static banner image with CTA button.
    * 3.2.2 **Featured Products:** Fetch and display limit 4-8 newest items.
* **3.3 Product Listing Page (PLP)**
    * 3.3.1 **Filter Component:** Filter by Brand (Static list) and Price Range.
    * 3.3.2 **Product Grid:** Map through fetched data.
    * 3.3.3 **Empty State:** UI for when no products match filters.
* **3.4 Product Detail Page (PDP)**
    * 3.4.1 **Image Gallery:** Main image display.
    * 3.4.2 **Product Info:** Title, Price, Description.
    * 3.4.3 **Specifications:** Render technical specs list.
    * 3.4.4 **Add to Cart Logic:** Update global state (Zustand/Context).
* **3.5 Cart & Checkout**
    * 3.5.1 **Cart Drawer/Page:** List selected items, allow quantity adjustment/removal.
    * 3.5.2 **Checkout Form:** Inputs for Name, Phone, Address.
    * 3.5.3 **Order Submission:**
        * Validate inputs.
        * Insert data into `orders` and `order_items` tables via Supabase API.
        * Redirect to "Thank You" success page.

## 4.0 Frontend: Admin Portal

* **4.1 Authentication & Security**
    * 4.1.1 **Login Page:** Email/Password form using Supabase Auth.
    * 4.1.2 **Middleware:** Protect `/admin` routes (redirect to login if unauthenticated).
* **4.2 Admin Layout**
    * 4.2.1 **Sidebar:** Navigation links (Dashboard, Products, Orders, Logout).
* **4.3 Dashboard (Analytics)**
    * 4.3.1 **KPI Cards:**
        * *Total Revenue:* Sum of completed orders.
        * *Total Orders:* Count of all orders.
        * *Pending Orders:* Count of orders with status 'pending'.
    * 4.3.2 **Revenue Chart:** Simple Bar/Line chart using `Recharts` (Last 7 days revenue).
    * 4.3.3 **Recent Orders Widget:** Mini-table showing last 5 orders.
* **4.4 Product Management**
    * 4.4.1 **Product List Table:** Show ID, Image, Name, Price, Stock Status.
    * 4.4.2 **Add/Edit Product Form:**
        * Text inputs for details.
        * Image Uploader (Handle Supabase Storage upload).
    * 4.4.3 **Delete Action:** Soft delete or Hard delete logic.
* **4.5 Order Management**
    * 4.5.1 **Order List Table:** Filter by Status (Pending/Shipped/Done).
    * 4.5.2 **Order Detail View:** View customer info and purchased items.
    * 4.5.3 **Status Update:** Dropdown to change order status (e.g., Pending -> Shipped).

## 5.0 Testing & Deployment

* **5.1 QA & Testing**
    * 5.1.1 **User Flow Test:** Test Guest Checkout flow from Home to Success Page.
    * 5.1.2 **Admin Flow Test:** Test Product creation and Order status updates.
    * 5.1.3 **Mobile Responsiveness:** Check UI on mobile breakpoints.
* **5.2 Deployment**
    * 5.2.1 Configure Environment Variables in Vercel.
    * 5.2.2 Deploy to Vercel (Production).
    * 5.2.3 Post-deployment smoke test.