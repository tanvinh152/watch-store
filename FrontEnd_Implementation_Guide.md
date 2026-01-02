# Frontend Implementation Guide: Watch E-commerce MVP

**Document Type:** Technical Implementation Guide  
**Project:** MVP Watch E-commerce Website  
**Prepared By:** Senior Frontend Developer  
**Date:** January 2, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & System Design](#2-architecture--system-design)
3. [Technology Stack](#3-technology-stack)
4. [Project Setup Guide](#4-project-setup-guide)
5. [Project Structure](#5-project-structure)
6. [Database Schema](#6-database-schema)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [Feature Specifications](#8-feature-specifications)
9. [Screen Flow Diagrams](#9-screen-flow-diagrams)
10. [Form Definitions & Data Models](#10-form-definitions--data-models)
11. [State Management Architecture](#11-state-management-architecture)
12. [API Layer Design](#12-api-layer-design)
13. [Code Quality Standards](#13-code-quality-standards)
14. [Appendices](#appendices)

---

## 1. Executive Summary

This document provides a comprehensive frontend implementation guide for the Watch E-commerce MVP project. It serves as the primary reference for developers to understand the architecture, setup procedures, feature specifications, and screen flows required to build the application.

### 1.1 Project Overview

| Attribute | Details |
|-----------|---------|
| **Project Name** | Watch E-commerce MVP |
| **Application Type** | Full-stack E-commerce Web Application |
| **User Roles** | Admin, User (Guest Customer) |
| **Primary Features** | Storefront, Shopping Cart, Checkout, Admin Dashboard |
| **Estimated Development** | 124-175 hours |

### 1.2 Key Objectives

- Build a responsive, performant storefront for browsing and purchasing watches
- Implement an admin dashboard for product and order management
- Ensure secure authentication for admin users
- Establish scalable architecture for future enhancements

---

## 2. Architecture & System Design

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐            │
│  │     STOREFRONT (User)       │    │     ADMIN PORTAL            │            │
│  ├─────────────────────────────┤    ├─────────────────────────────┤            │
│  │ • Home Page                 │    │ • Login Page                │            │
│  │ • Product Listing (PLP)     │    │ • Dashboard                 │            │
│  │ • Product Detail (PDP)      │    │ • Product Management        │            │
│  │ • Cart                      │    │ • Order Management          │            │
│  │ • Checkout                  │    │                             │            │
│  │ • Order Confirmation        │    │                             │            │
│  └─────────────────────────────┘    └─────────────────────────────┘            │
│                                                                                  │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APPLICATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │
│  │  App Router   │  │  API Routes   │  │  Middleware   │  │  Server       │    │
│  │  (Pages)      │  │  (Optional)   │  │  (Auth Guard) │  │  Components   │    │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        STATE MANAGEMENT LAYER                            │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │  Redux Toolkit (Global State)  │  React Context (Theme, Auth Session)   │    │
│  │  • Cart State                  │  • User Session Context                 │    │
│  │  • UI State                    │  • Theme Context                        │    │
│  │  • Filter State                │                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           API LAYER (Axios)                              │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │  Axios Instance  │  Request Interceptors  │  Response Interceptors      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE BACKEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │
│  │  PostgreSQL   │  │  Auth         │  │  Storage      │  │  RLS          │    │
│  │  Database     │  │  (Email/Pass) │  │  (Images)     │  │  Policies     │    │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘    │
│                                                                                  │
│  Tables: products, orders, order_items                                          │
│  Bucket: product-images                                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Module Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           MODULE INTERACTION FLOW                                 │
└──────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │            PAGES/ROUTES             │
                    │  (Server & Client Components)       │
                    └─────────────────┬───────────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   UI COMPONENTS     │    │   FEATURE           │    │   LAYOUTS           │
│   (shadcn/ui)       │    │   COMPONENTS        │    │                     │
├─────────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│ • Button            │    │ • ProductCard       │    │ • MainLayout        │
│ • Input             │    │ • CartDrawer        │    │ • AdminLayout       │
│ • Card              │    │ • CheckoutForm      │    │ • AuthLayout        │
│ • Table             │    │ • FilterPanel       │    │                     │
│ • Dialog            │    │ • OrderTable        │    │                     │
│ • Sheet             │    │ • KPICard           │    │                     │
└─────────────────────┘    └──────────┬──────────┘    └─────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │             HOOKS LAYER             │
                    ├─────────────────────────────────────┤
                    │ • useProducts    • useCart          │
                    │ • useOrders      • useAuth          │
                    │ • useFilters     • useForm (RHF)    │
                    └─────────────────┬───────────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   REDUX STORE       │    │   CONTEXT           │    │   API SERVICES      │
├─────────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│ Slices:             │    │ • AuthContext       │    │ • productService    │
│ • cartSlice         │    │ • ThemeContext      │    │ • orderService      │
│ • filterSlice       │    │                     │    │ • authService       │
│ • uiSlice           │    │                     │    │ • storageService    │
└─────────────────────┘    └─────────────────────┘    └──────────┬──────────┘
                                                                  │
                                                                  ▼
                                                   ┌─────────────────────────┐
                                                   │     AXIOS INSTANCE      │
                                                   │   (Supabase Client)     │
                                                   └──────────┬──────────────┘
                                                              │
                                                              ▼
                                                   ┌─────────────────────────┐
                                                   │       SUPABASE          │
                                                   │   (Database/Auth/       │
                                                   │    Storage)             │
                                                   └─────────────────────────┘
```

### 2.3 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW PATTERNS                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

PATTERN 1: Server-Side Data Fetching (Products, Orders)
──────────────────────────────────────────────────────

  Server Component ──► Supabase Client ──► PostgreSQL
         │                                      │
         │◄─────────── Data Response ◄──────────┘
         │
         ▼
  Render to Client


PATTERN 2: Client-Side State (Cart, Filters)
────────────────────────────────────────────

  User Action ──► Dispatch Action ──► Redux Reducer ──► Updated State
                                                              │
                        UI Re-render ◄────────────────────────┘
                              │
                              ▼
                     localStorage Sync (Cart Persistence)


PATTERN 3: Form Submission (Checkout, Product CRUD)
───────────────────────────────────────────────────

  Form Input ──► React Hook Form ──► Zod Validation ──► Valid?
                                                          │
                     ┌───────────────────────┬────────────┘
                     │ NO                    │ YES
                     ▼                       ▼
              Display Errors          API Service Call
                                            │
                                            ▼
                                     Supabase Insert/Update
                                            │
                                            ▼
                                     Success/Error Response
                                            │
                                            ▼
                                     Update UI State
```

---

## 3. Technology Stack

### 3.1 Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 14.x+ | React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Latest | Accessible, customizable components |
| **Icons** | Lucide React | Latest | Icon library |

### 3.2 State Management

| Technology | Scope | Use Cases |
|-----------|-------|-----------|
| **Redux Toolkit** | Global Client State | Cart, Filters, UI State |
| **React Context** | App-wide Providers | Auth Session, Theme |
| **React Hook Form** | Form State | All form inputs |

### 3.3 Form & Validation

| Technology | Purpose |
|-----------|---------|
| **React Hook Form** | Form state management, submission handling |
| **Zod** | Schema validation, type inference |
| **@hookform/resolvers** | Zod integration with React Hook Form |

### 3.4 Networking

| Technology | Purpose |
|-----------|---------|
| **Axios** | HTTP client for API calls |
| **@supabase/supabase-js** | Supabase client SDK |

### 3.5 Backend & Database

| Service | Component | Purpose |
|---------|-----------|---------|
| **Supabase** | PostgreSQL | Relational database |
| **Supabase** | Auth | User authentication |
| **Supabase** | Storage | Image file storage |
| **Supabase** | RLS | Row-level security policies |

### 3.6 Code Quality

| Tool | Purpose |
|------|---------|
| **ESLint** | JavaScript/TypeScript linting |
| **Prettier** | Code formatting |
| **TypeScript** | Static type checking |

### 3.7 Additional Libraries

| Library | Purpose |
|---------|---------|
| **Recharts** | Dashboard charts and visualizations |
| **date-fns** | Date formatting and manipulation |
| **clsx / tailwind-merge** | Conditional class utilities |

---

## 4. Project Setup Guide

### 4.1 Prerequisites

Before starting the project setup, ensure the following are installed on your development machine:

| Requirement | Minimum Version | Verification Command |
|-------------|----------------|---------------------|
| Node.js | 18.17.0+ | `node --version` |
| npm or pnpm | npm 9.x+ / pnpm 8.x+ | `npm --version` or `pnpm --version` |
| Git | 2.x+ | `git --version` |
| VS Code (Recommended) | Latest | - |

### 4.2 Supabase Project Setup

#### Step 1: Create Supabase Project

1. Navigate to [supabase.com](https://supabase.com) and sign in
2. Click "New Project" from the dashboard
3. Fill in the project details:
   - **Organization:** Select or create organization
   - **Project Name:** `watch-store`
   - **Database Password:** Generate a strong password (save securely)
   - **Region:** Select closest geographic region
4. Click "Create new project" and wait for provisioning (approximately 2 minutes)

#### Step 2: Obtain Project Credentials

1. Navigate to Project Settings → API
2. Record the following values for environment configuration:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **Anon/Public Key** (safe for browser)
   - **Service Role Key** (server-side only, keep secret)

#### Step 3: Configure Authentication

1. Navigate to Authentication → Providers
2. Ensure "Email" provider is enabled
3. Configure the following settings:
   - **Enable Email Confirmations:** Disable for MVP (enable in production)
   - **Minimum Password Length:** 8 characters

#### Step 4: Create Admin User

1. Navigate to Authentication → Users
2. Click "Add User" → "Create New User"
3. Enter admin credentials:
   - **Email:** admin@watchstore.com (or your preferred email)
   - **Password:** Strong password
   - **Auto Confirm User:** Yes

#### Step 5: Create Storage Bucket

1. Navigate to Storage
2. Click "New Bucket"
3. Configure bucket:
   - **Name:** `product-images`
   - **Public Bucket:** Yes (for public image access)
4. After creation, set up RLS policies for the bucket (see Database Schema section)

### 4.3 Local Development Setup

#### Step 1: Initialize Next.js Project

1. Open terminal in your workspace directory
2. Run the Next.js creation command with the following options:
   - **TypeScript:** Yes
   - **ESLint:** Yes
   - **Tailwind CSS:** Yes
   - **src/ directory:** No (use root app directory)
   - **App Router:** Yes
   - **Import alias:** @/* (default)

#### Step 2: Install Core Dependencies

Install the following dependency groups:

**Production Dependencies:**
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Supabase server-side rendering utilities
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings for Redux
- `redux-persist` - State persistence for Redux
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form validation resolvers
- `zod` - Schema validation
- `axios` - HTTP client
- `recharts` - Charts library
- `lucide-react` - Icon library
- `clsx` - Utility for conditional classes
- `tailwind-merge` - Tailwind class merging
- `date-fns` - Date utilities

**Development Dependencies:**
- `prettier` - Code formatter
- `prettier-plugin-tailwindcss` - Tailwind class sorting
- `eslint-config-prettier` - ESLint Prettier integration

#### Step 3: Initialize shadcn/ui

1. Run the shadcn/ui initialization command
2. Select the following configuration options:
   - **Style:** Default (or New York)
   - **Base Color:** Slate (or preferred theme)
   - **CSS Variables:** Yes
   - **React Server Components:** Yes
   - **Components Directory:** components/ui

#### Step 4: Install shadcn/ui Components

Install the following components from shadcn/ui registry:
- button
- input
- label
- card
- table
- dialog
- sheet
- dropdown-menu
- select
- checkbox
- badge
- toast
- skeleton
- separator
- avatar
- form

#### Step 5: Environment Configuration

Create the following environment files:

**File: `.env.local`**
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) | `eyJhbG...` |

**File: `.env.example`** (commit this file)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |

#### Step 6: Configure ESLint

Update ESLint configuration to include:
- Next.js recommended rules
- TypeScript recommended rules
- Prettier integration
- Custom rules for import ordering

#### Step 7: Configure Prettier

Create Prettier configuration with:
- **Semi:** true
- **Single Quote:** true
- **Tab Width:** 2
- **Trailing Comma:** es5
- **Print Width:** 80
- **Tailwind Plugin:** enabled

#### Step 8: Configure TypeScript Path Aliases

Ensure `tsconfig.json` includes path aliases:
- `@/*` → `./*`
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/types/*` → `./types/*`
- `@/store/*` → `./store/*`
- `@/services/*` → `./services/*`
- `@/hooks/*` → `./hooks/*`

#### Step 9: Git Configuration

Create `.gitignore` entries for:
- `.env.local`
- `.env*.local`
- `node_modules/`
- `.next/`
- `out/`

### 4.4 Verification Checklist

After completing setup, verify the following:

| Check | Status |
|-------|--------|
| Next.js development server starts without errors | ☐ |
| Tailwind CSS classes apply correctly | ☐ |
| shadcn/ui Button component renders | ☐ |
| Supabase client connects (check console for errors) | ☐ |
| ESLint runs without configuration errors | ☐ |
| Prettier formats files correctly | ☐ |
| TypeScript compiles without errors | ☐ |

---

## 5. Project Structure

### 5.1 Directory Tree

```
watch-store/
├── app/                              # Next.js App Router
│   ├── (storefront)/                 # Storefront route group
│   │   ├── layout.tsx                # Main storefront layout
│   │   ├── page.tsx                  # Home page
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing page (PLP)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Product detail page (PDP)
│   │   ├── cart/
│   │   │   └── page.tsx              # Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx              # Checkout page
│   │   └── order-success/
│   │       └── page.tsx              # Order confirmation page
│   │
│   ├── (admin)/                      # Admin route group
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin layout with sidebar
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Add new product
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx  # Edit product
│   │   │   └── orders/
│   │   │       ├── page.tsx          # Order list
│   │   │       └── [id]/
│   │   │           └── page.tsx      # Order detail
│   │   └── login/
│   │       └── page.tsx              # Admin login page
│   │
│   ├── api/                          # API routes (optional)
│   │   └── ...
│   │
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── not-found.tsx                 # 404 page
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── layouts/                      # Layout components
│   │   ├── main-layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── index.tsx
│   │   └── admin-layout/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── index.tsx
│   │
│   ├── storefront/                   # Storefront feature components
│   │   ├── home/
│   │   │   ├── hero-section.tsx
│   │   │   └── featured-products.tsx
│   │   ├── products/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── filter-panel.tsx
│   │   │   ├── product-gallery.tsx
│   │   │   ├── product-info.tsx
│   │   │   └── product-specs.tsx
│   │   ├── cart/
│   │   │   ├── cart-drawer.tsx
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   └── checkout/
│   │       ├── checkout-form.tsx
│   │       └── order-summary.tsx
│   │
│   ├── admin/                        # Admin feature components
│   │   ├── dashboard/
│   │   │   ├── kpi-card.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   └── recent-orders.tsx
│   │   ├── products/
│   │   │   ├── product-table.tsx
│   │   │   ├── product-form.tsx
│   │   │   ├── image-uploader.tsx
│   │   │   └── delete-dialog.tsx
│   │   └── orders/
│   │       ├── order-table.tsx
│   │       ├── order-detail.tsx
│   │       └── status-dropdown.tsx
│   │
│   └── shared/                       # Shared components
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       ├── error-boundary.tsx
│       └── page-header.tsx
│
├── lib/                              # Utility libraries
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server Supabase client
│   │   └── middleware.ts             # Auth middleware helper
│   ├── axios/
│   │   └── instance.ts               # Axios configuration
│   ├── utils.ts                      # General utilities (cn, etc.)
│   └── constants.ts                  # App constants
│
├── services/                         # API service layer
│   ├── product.service.ts
│   ├── order.service.ts
│   ├── auth.service.ts
│   └── storage.service.ts
│
├── store/                            # Redux store
│   ├── index.ts                      # Store configuration
│   ├── provider.tsx                  # Redux provider wrapper
│   └── slices/
│       ├── cart.slice.ts
│       ├── filter.slice.ts
│       └── ui.slice.ts
│
├── hooks/                            # Custom React hooks
│   ├── use-products.ts
│   ├── use-orders.ts
│   ├── use-cart.ts
│   ├── use-auth.ts
│   └── use-debounce.ts
│
├── types/                            # TypeScript type definitions
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── user.types.ts
│   └── database.types.ts             # Supabase generated types
│
├── schemas/                          # Zod validation schemas
│   ├── product.schema.ts
│   ├── order.schema.ts
│   └── checkout.schema.ts
│
├── contexts/                         # React Context providers
│   ├── auth-context.tsx
│   └── theme-context.tsx
│
├── middleware.ts                     # Next.js middleware (auth guard)
│
├── public/                           # Static assets
│   ├── images/
│   │   └── hero-banner.jpg
│   └── favicon.ico
│
├── .env.local                        # Environment variables (git ignored)
├── .env.example                      # Environment template
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
└── README.md                         # Project documentation
```

### 5.2 Directory Responsibilities

| Directory | Responsibility |
|-----------|---------------|
| `app/` | Next.js App Router pages, layouts, and route handlers |
| `components/ui/` | shadcn/ui primitive components (buttons, inputs, cards) |
| `components/layouts/` | Page layout wrappers (navbar, sidebar, footer) |
| `components/storefront/` | Customer-facing feature components |
| `components/admin/` | Admin portal feature components |
| `components/shared/` | Cross-feature shared components |
| `lib/` | Configuration and utility functions |
| `services/` | API abstraction layer for data fetching |
| `store/` | Redux Toolkit store, slices, and provider |
| `hooks/` | Custom React hooks for reusable logic |
| `types/` | TypeScript interfaces and type definitions |
| `schemas/` | Zod validation schemas for forms |
| `contexts/` | React Context providers (auth, theme) |

---

## 6. Database Schema

### 6.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA (Supabase)                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐
│          products           │
├─────────────────────────────┤
│ id          UUID (PK)       │──────────────────────┐
│ name        VARCHAR(255)    │                      │
│ slug        VARCHAR(255)    │                      │
│ brand       VARCHAR(100)    │                      │
│ price       DECIMAL(10,2)   │                      │
│ sale_price  DECIMAL(10,2)   │                      │
│ description TEXT            │                      │
│ specs_json  JSONB           │                      │
│ image_url   TEXT            │                      │
│ stock_status BOOLEAN        │                      │
│ created_at  TIMESTAMPTZ     │                      │
│ updated_at  TIMESTAMPTZ     │                      │
└─────────────────────────────┘                      │
                                                     │
                                                     │
┌─────────────────────────────┐                      │
│           orders            │                      │
├─────────────────────────────┤                      │
│ id          UUID (PK)       │──────────────┐       │
│ customer_info JSONB         │              │       │
│ total_amount DECIMAL(10,2)  │              │       │
│ status      VARCHAR(20)     │              │       │
│ payment_method VARCHAR(50)  │              │       │
│ notes       TEXT            │              │       │
│ created_at  TIMESTAMPTZ     │              │       │
│ updated_at  TIMESTAMPTZ     │              │       │
└─────────────────────────────┘              │       │
                                             │       │
                                             │       │
                                             ▼       ▼
                              ┌─────────────────────────────┐
                              │        order_items          │
                              ├─────────────────────────────┤
                              │ id          UUID (PK)       │
                              │ order_id    UUID (FK)       │
                              │ product_id  UUID (FK)       │
                              │ quantity    INTEGER         │
                              │ price_at_purchase DEC(10,2) │
                              │ created_at  TIMESTAMPTZ     │
                              └─────────────────────────────┘
```

### 6.2 Table Definitions

#### 6.2.1 Products Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Product display name |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| `brand` | VARCHAR(100) | NOT NULL | Watch brand name |
| `price` | DECIMAL(10,2) | NOT NULL, CHECK (price > 0) | Regular price |
| `sale_price` | DECIMAL(10,2) | NULLABLE, CHECK (sale_price < price) | Discounted price |
| `description` | TEXT | NULLABLE | Detailed product description |
| `specs_json` | JSONB | NULLABLE | Technical specifications |
| `image_url` | TEXT | NULLABLE | Primary image URL |
| `stock_status` | BOOLEAN | DEFAULT true | In stock indicator |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_products_brand` on `brand`
- `idx_products_price` on `price`
- `idx_products_created_at` on `created_at`
- `idx_products_slug` on `slug` (unique)

**specs_json Structure:**
```
{
  "case_material": "Stainless Steel",
  "case_diameter": "42mm",
  "movement": "Automatic",
  "water_resistance": "100m",
  "crystal": "Sapphire",
  "strap_material": "Leather",
  "warranty": "2 years"
}
```

#### 6.2.2 Orders Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `customer_info` | JSONB | NOT NULL | Customer details |
| `total_amount` | DECIMAL(10,2) | NOT NULL, CHECK (total_amount >= 0) | Order total |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Order status |
| `payment_method` | VARCHAR(50) | NOT NULL, DEFAULT 'cod' | Payment method |
| `notes` | TEXT | NULLABLE | Order notes |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Order placed timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Status Values:**
- `pending` - Order placed, awaiting processing
- `confirmed` - Order confirmed by admin
- `shipped` - Order shipped to customer
- `delivered` - Order delivered
- `cancelled` - Order cancelled

**Payment Method Values:**
- `cod` - Cash on Delivery
- `bank_transfer` - Bank Transfer

**customer_info Structure:**
```
{
  "name": "Customer Full Name",
  "phone": "+84912345678",
  "email": "customer@email.com",
  "address": {
    "street": "123 Main Street",
    "ward": "Ward 1",
    "district": "District 1",
    "city": "Ho Chi Minh City"
  }
}
```

**Indexes:**
- `idx_orders_status` on `status`
- `idx_orders_created_at` on `created_at`

#### 6.2.3 Order Items Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `order_id` | UUID | NOT NULL, REFERENCES orders(id) ON DELETE CASCADE | Parent order |
| `product_id` | UUID | NOT NULL, REFERENCES products(id) ON DELETE SET NULL | Purchased product |
| `quantity` | INTEGER | NOT NULL, CHECK (quantity > 0) | Item quantity |
| `price_at_purchase` | DECIMAL(10,2) | NOT NULL | Price at time of purchase |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Record creation timestamp |

**Indexes:**
- `idx_order_items_order_id` on `order_id`
- `idx_order_items_product_id` on `product_id`

### 6.3 Row Level Security (RLS) Policies

#### 6.3.1 Products Table Policies

| Policy Name | Operation | Role | Condition |
|-------------|-----------|------|-----------|
| `products_select_public` | SELECT | Public (anon) | `true` (all products visible) |
| `products_insert_admin` | INSERT | Authenticated | `auth.email() = 'admin@watchstore.com'` |
| `products_update_admin` | UPDATE | Authenticated | `auth.email() = 'admin@watchstore.com'` |
| `products_delete_admin` | DELETE | Authenticated | `auth.email() = 'admin@watchstore.com'` |

#### 6.3.2 Orders Table Policies

| Policy Name | Operation | Role | Condition |
|-------------|-----------|------|-----------|
| `orders_insert_public` | INSERT | Public (anon) | `true` (guest checkout) |
| `orders_select_admin` | SELECT | Authenticated | `auth.email() = 'admin@watchstore.com'` |
| `orders_update_admin` | UPDATE | Authenticated | `auth.email() = 'admin@watchstore.com'` |

#### 6.3.3 Order Items Table Policies

| Policy Name | Operation | Role | Condition |
|-------------|-----------|------|-----------|
| `order_items_insert_public` | INSERT | Public (anon) | `true` (with valid order_id) |
| `order_items_select_admin` | SELECT | Authenticated | `auth.email() = 'admin@watchstore.com'` |

#### 6.3.4 Storage Bucket Policies (product-images)

| Policy Name | Operation | Role | Condition |
|-------------|-----------|------|-----------|
| `product_images_select_public` | SELECT | Public | `true` (public viewing) |
| `product_images_insert_admin` | INSERT | Authenticated | `auth.email() = 'admin@watchstore.com'` |
| `product_images_update_admin` | UPDATE | Authenticated | `auth.email() = 'admin@watchstore.com'` |
| `product_images_delete_admin` | DELETE | Authenticated | `auth.email() = 'admin@watchstore.com'` |

---

## 7. User Roles & Permissions

### 7.1 Role Definitions

| Role | Description | Authentication |
|------|-------------|----------------|
| **User (Guest)** | Anonymous customer browsing and purchasing | None required |
| **Admin** | Store administrator managing products and orders | Email/Password |

### 7.2 Permission Matrix

| Feature | User (Guest) | Admin |
|---------|--------------|-------|
| **Storefront** | | |
| View Home Page | ✅ | ✅ |
| Browse Products | ✅ | ✅ |
| View Product Details | ✅ | ✅ |
| Add to Cart | ✅ | ✅ |
| Manage Cart | ✅ | ✅ |
| Complete Checkout | ✅ | ✅ |
| View Order Confirmation | ✅ | ✅ |
| **Admin Portal** | | |
| Access Admin Dashboard | ❌ | ✅ |
| View KPI Analytics | ❌ | ✅ |
| Create Products | ❌ | ✅ |
| Edit Products | ❌ | ✅ |
| Delete Products | ❌ | ✅ |
| View All Orders | ❌ | ✅ |
| Update Order Status | ❌ | ✅ |
| Upload Product Images | ❌ | ✅ |

### 7.3 Route Protection

| Route Pattern | Access Level | Protection Method |
|---------------|-------------|-------------------|
| `/` | Public | None |
| `/products` | Public | None |
| `/products/[id]` | Public | None |
| `/cart` | Public | None |
| `/checkout` | Public | None |
| `/order-success` | Public | None |
| `/login` | Public | Redirect if authenticated |
| `/admin/*` | Admin Only | Next.js Middleware + Server-side check |

---

## 8. Feature Specifications

### 8.1 Storefront Features

#### 8.1.1 Home Page

| Attribute | Details |
|-----------|---------|
| **Route** | `/` |
| **Purpose** | Landing page showcasing brand and featured products |

**Components:**

| Component | Description |
|-----------|-------------|
| Hero Section | Full-width banner with headline, tagline, and CTA button |
| Featured Products | Grid of 4-8 newest products |

**Data Requirements:**
- Fetch latest 4-8 products from database
- Sort by `created_at` descending

**User Actions:**
- Click CTA button → Navigate to Products page
- Click product card → Navigate to Product Detail page

---

#### 8.1.2 Product Listing Page (PLP)

| Attribute | Details |
|-----------|---------|
| **Route** | `/products` |
| **Purpose** | Display all products with filtering capabilities |

**Components:**

| Component | Description |
|-----------|-------------|
| Page Header | Title and product count |
| Filter Panel | Brand filter (checkboxes), Price range filter (min/max inputs) |
| Product Grid | Responsive grid of product cards |
| Empty State | Displayed when no products match filters |

**Filter Specifications:**

| Filter | Type | Options |
|--------|------|---------|
| Brand | Multi-select Checkbox | Dynamic from product data |
| Price Range | Number Inputs | Min price, Max price |

**Data Requirements:**
- Fetch all products with active stock status
- Apply filters client-side or via query parameters

**User Actions:**
- Apply filter → Update product grid
- Clear filters → Show all products
- Click product card → Navigate to Product Detail page

---

#### 8.1.3 Product Detail Page (PDP)

| Attribute | Details |
|-----------|---------|
| **Route** | `/products/[id]` |
| **Purpose** | Display detailed product information and enable add to cart |

**Components:**

| Component | Description |
|-----------|-------------|
| Breadcrumb | Navigation trail (Home > Products > Product Name) |
| Image Gallery | Main product image display |
| Product Info | Name, brand, price (with sale price if applicable), stock status |
| Description | Full product description |
| Specifications | Technical specs table from specs_json |
| Add to Cart | Quantity selector and Add to Cart button |

**Data Requirements:**
- Fetch single product by ID or slug
- Handle 404 for non-existent products

**User Actions:**
- Adjust quantity → Update quantity state
- Click Add to Cart → Add item to cart, show confirmation toast
- Click back → Navigate to Products page

---

#### 8.1.4 Cart

| Attribute | Details |
|-----------|---------|
| **Route** | `/cart` (full page) or Cart Drawer (slide-out) |
| **Purpose** | Review and manage selected items before checkout |

**Components:**

| Component | Description |
|-----------|-------------|
| Cart Items List | List of items with image, name, price, quantity controls, remove button |
| Cart Summary | Subtotal, total, Proceed to Checkout button |
| Empty Cart State | Message and link to continue shopping |

**Data Requirements:**
- Read from Redux store (persisted to localStorage)

**User Actions:**
- Increase quantity → Update cart state
- Decrease quantity → Update cart state (remove if 0)
- Remove item → Remove from cart with confirmation
- Continue Shopping → Navigate to Products page
- Proceed to Checkout → Navigate to Checkout page

---

#### 8.1.5 Checkout

| Attribute | Details |
|-----------|---------|
| **Route** | `/checkout` |
| **Purpose** | Collect customer information and complete order |

**Components:**

| Component | Description |
|-----------|-------------|
| Checkout Form | Customer information inputs |
| Order Summary | Read-only summary of cart items and total |
| Submit Button | Place Order action |

**Form Fields:** (See Section 10 for detailed field definitions)

**User Actions:**
- Fill form → Validate on blur and submit
- Submit order → Create order in database, redirect to success page
- Edit cart → Navigate back to cart

---

#### 8.1.6 Order Success

| Attribute | Details |
|-----------|---------|
| **Route** | `/order-success` |
| **Purpose** | Confirm order placement and provide next steps |

**Components:**

| Component | Description |
|-----------|-------------|
| Success Icon | Checkmark or success illustration |
| Confirmation Message | Order placed successfully message |
| Order Reference | Order ID for customer reference |
| Next Steps | Information about manual payment process |
| Continue Shopping | Link to home page |

**Data Requirements:**
- Order ID passed via query parameter or state
- Clear cart after successful navigation

---

### 8.2 Admin Portal Features

#### 8.2.1 Admin Login

| Attribute | Details |
|-----------|---------|
| **Route** | `/login` |
| **Purpose** | Authenticate admin users |

**Components:**

| Component | Description |
|-----------|-------------|
| Login Form | Email and password inputs |
| Submit Button | Sign In action |
| Error Display | Invalid credentials message |

**Form Fields:** (See Section 10 for detailed field definitions)

**User Actions:**
- Submit credentials → Authenticate with Supabase
- Success → Redirect to Admin Dashboard
- Failure → Display error message

---

#### 8.2.2 Admin Dashboard

| Attribute | Details |
|-----------|---------|
| **Route** | `/admin` |
| **Purpose** | Overview of store performance and recent activity |

**Components:**

| Component | Description |
|-----------|-------------|
| KPI Cards | Total Revenue, Total Orders, Pending Orders |
| Revenue Chart | Bar or Line chart showing last 7 days revenue |
| Recent Orders | Table of last 5 orders with status badges |

**KPI Definitions:**

| KPI | Calculation |
|-----|-------------|
| Total Revenue | SUM of `total_amount` where `status` = 'delivered' |
| Total Orders | COUNT of all orders |
| Pending Orders | COUNT of orders where `status` = 'pending' |

**Data Requirements:**
- Aggregate queries for KPIs
- Daily revenue for last 7 days
- Latest 5 orders with basic info

**User Actions:**
- Click order row → Navigate to Order Detail
- Click "View All Orders" → Navigate to Orders page

---

#### 8.2.3 Product Management

| Attribute | Details |
|-----------|---------|
| **Route** | `/admin/products` |
| **Purpose** | CRUD operations for products |

**Sub-routes:**

| Route | Purpose |
|-------|---------|
| `/admin/products` | Product list table |
| `/admin/products/new` | Add new product form |
| `/admin/products/[id]/edit` | Edit existing product form |

**Components (List Page):**

| Component | Description |
|-----------|-------------|
| Page Header | Title and "Add Product" button |
| Product Table | Columns: Image, Name, Brand, Price, Stock Status, Actions |
| Action Buttons | Edit, Delete per row |
| Delete Dialog | Confirmation modal before deletion |

**Components (Add/Edit Page):**

| Component | Description |
|-----------|-------------|
| Product Form | All product fields (see Section 10) |
| Image Uploader | Drag-and-drop or click to upload |
| Submit Button | Save/Update action |
| Cancel Button | Return to list |

**User Actions (List):**
- Click Add Product → Navigate to New Product form
- Click Edit → Navigate to Edit Product form
- Click Delete → Show confirmation dialog
- Confirm Delete → Remove product from database

**User Actions (Form):**
- Fill form → Validate on blur
- Upload image → Store in Supabase Storage, set URL
- Submit → Create/Update product, redirect to list
- Cancel → Return to list without saving

---

#### 8.2.4 Order Management

| Attribute | Details |
|-----------|---------|
| **Route** | `/admin/orders` |
| **Purpose** | View and manage customer orders |

**Sub-routes:**

| Route | Purpose |
|-------|---------|
| `/admin/orders` | Order list with filtering |
| `/admin/orders/[id]` | Order detail view |

**Components (List Page):**

| Component | Description |
|-----------|-------------|
| Page Header | Title |
| Status Filter | Dropdown/Tabs for filtering by status |
| Order Table | Columns: Order ID, Customer Name, Total, Status, Date, Actions |
| Status Badge | Color-coded status indicator |

**Components (Detail Page):**

| Component | Description |
|-----------|-------------|
| Order Header | Order ID, Date, Status |
| Customer Info | Name, Phone, Email, Address |
| Order Items | Table of purchased products with quantities and prices |
| Order Total | Summary of order amount |
| Status Update | Dropdown to change order status |

**User Actions (List):**
- Filter by status → Update table display
- Click order row → Navigate to Order Detail

**User Actions (Detail):**
- Change status → Update order status in database
- Back to list → Return to Orders list

---

## 9. Screen Flow Diagrams

### 9.1 Customer Flow (Storefront)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CUSTOMER SCREEN FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │  HOME PAGE  │
                              │      /      │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
           ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
           │   PRODUCTS  │  │ Click Hero  │  │  Cart Icon  │
           │  (Navbar)   │  │    CTA      │  │   (Header)  │
           └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
                  │                │                │
                  └────────┬───────┘                │
                           │                        │
                           ▼                        ▼
                  ┌─────────────┐          ┌─────────────┐
                  │  PRODUCT    │          │    CART     │
                  │  LISTING    │          │   /cart     │
                  │ /products   │          │   or Drawer │
                  └──────┬──────┘          └──────┬──────┘
                         │                        │
            ┌────────────┼────────────┐          │
            │            │            │          │
            ▼            ▼            ▼          │
      ┌──────────┐ ┌──────────┐ ┌──────────┐    │
      │  Apply   │ │  Click   │ │   Add    │    │
      │ Filters  │ │ Product  │ │ to Cart  │    │
      └────┬─────┘ └────┬─────┘ └────┬─────┘    │
           │            │            │          │
           │            ▼            │          │
           │   ┌─────────────┐       │          │
           │   │  PRODUCT    │       │          │
           │   │  DETAIL     │───────┘          │
           │   │/products/[id]│                  │
           │   └──────┬──────┘                  │
           │          │                         │
           │          │ Add to Cart             │
           │          │                         │
           └──────────┴─────────────────────────┤
                                                │
                              ┌─────────────────┘
                              │
                              ▼
                     ┌─────────────┐
                     │  CHECKOUT   │
                     │  /checkout  │
                     └──────┬──────┘
                            │
                            │ Submit Order
                            │
                            ▼
                   ┌─────────────────┐
                   │  ORDER SUCCESS  │
                   │ /order-success  │
                   └─────────────────┘
                            │
                            │ Continue Shopping
                            │
                            ▼
                      ┌───────────┐
                      │ HOME PAGE │
                      └───────────┘
```

### 9.2 Admin Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             ADMIN SCREEN FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

                             ┌─────────────────┐
                             │   ADMIN LOGIN   │
                             │     /login      │
                             └────────┬────────┘
                                      │
                                      │ Authenticate
                                      │
                                      ▼
                             ┌─────────────────┐
                             │    DASHBOARD    │
                             │     /admin      │
                             └────────┬────────┘
                                      │
               ┌──────────────────────┼──────────────────────┐
               │                      │                      │
               ▼                      ▼                      ▼
      ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
      │    PRODUCTS     │    │     ORDERS      │    │     LOGOUT      │
      │ (Sidebar Link)  │    │  (Sidebar Link) │    │  (Sidebar Link) │
      └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
               │                      │                      │
               ▼                      ▼                      ▼
      ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
      │  PRODUCT LIST   │    │   ORDER LIST    │    │   LOGIN PAGE    │
      │ /admin/products │    │  /admin/orders  │    │     /login      │
      └────────┬────────┘    └────────┬────────┘    └─────────────────┘
               │                      │
    ┌──────────┼──────────┐          │
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐
│  Add   │ │  Edit  │ │ Delete │ │ View Order │
│Product │ │Product │ │Product │ │   Detail   │
└───┬────┘ └───┬────┘ └───┬────┘ └─────┬──────┘
    │          │          │            │
    ▼          ▼          │            ▼
┌──────────────────┐      │     ┌─────────────────┐
│  PRODUCT FORM    │      │     │  ORDER DETAIL   │
│/admin/products/  │      │     │/admin/orders/[id]│
│new or [id]/edit  │      │     └────────┬────────┘
└────────┬─────────┘      │              │
         │                │              │ Update Status
         │ Save           │              │
         │                │              │
         └────────────────┴──────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  PRODUCT/ORDER  │
                 │      LIST       │
                 └─────────────────┘
```

### 9.3 Cart Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CART INTERACTION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌────────────────┐
                              │ ANY PAGE WITH  │
                              │ PRODUCT CARD   │
                              └───────┬────────┘
                                      │
                                      │ Click "Add to Cart"
                                      │
                                      ▼
                              ┌────────────────┐
                              │  REDUX STORE   │
                              │  cartSlice     │
                              └───────┬────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
           ┌────────────────┐                  ┌────────────────┐
           │  Update Cart   │                  │   localStorage │
           │  Badge Count   │                  │     Sync       │
           └───────┬────────┘                  └────────────────┘
                   │
                   │ Click Cart Icon
                   │
                   ▼
           ┌────────────────┐
           │  CART DRAWER   │
           │  (or /cart)    │
           └───────┬────────┘
                   │
     ┌─────────────┼─────────────────────┐
     │             │                     │
     ▼             ▼                     ▼
┌──────────┐ ┌──────────┐         ┌──────────────┐
│  Update  │ │  Remove  │         │   Proceed    │
│ Quantity │ │   Item   │         │ to Checkout  │
└────┬─────┘ └────┬─────┘         └──────┬───────┘
     │            │                      │
     └──────┬─────┘                      │
            │                            │
            ▼                            ▼
    ┌────────────────┐          ┌────────────────┐
    │  UPDATE STORE  │          │   CHECKOUT     │
    │   + PERSIST    │          │    PAGE        │
    └────────────────┘          └────────────────┘
```

---

## 10. Form Definitions & Data Models

### 10.1 Checkout Form

#### Form Purpose
Collect customer contact and shipping information to complete an order.

#### Field Definitions

| Field Name | Label | Type | Required | Validation Rules | Error Messages |
|------------|-------|------|----------|-----------------|----------------|
| `customerName` | Full Name | text | Yes | Min 2 chars, Max 100 chars | "Name is required", "Name must be at least 2 characters" |
| `phone` | Phone Number | tel | Yes | Valid phone format (10-11 digits) | "Phone number is required", "Please enter a valid phone number" |
| `email` | Email Address | email | No | Valid email format if provided | "Please enter a valid email address" |
| `address.street` | Street Address | text | Yes | Min 5 chars, Max 200 chars | "Street address is required" |
| `address.ward` | Ward/Commune | text | Yes | Min 1 char | "Ward is required" |
| `address.district` | District | text | Yes | Min 1 char | "District is required" |
| `address.city` | City/Province | text | Yes | Min 1 char | "City is required" |
| `paymentMethod` | Payment Method | select | Yes | One of: 'cod', 'bank_transfer' | "Please select a payment method" |
| `notes` | Order Notes | textarea | No | Max 500 chars | "Notes must be under 500 characters" |

#### Payment Method Options

| Value | Display Label | Description |
|-------|--------------|-------------|
| `cod` | Cash on Delivery | Pay when order is delivered |
| `bank_transfer` | Bank Transfer | Transfer to provided bank account |

---

### 10.2 Admin Login Form

#### Form Purpose
Authenticate admin users to access the admin portal.

#### Field Definitions

| Field Name | Label | Type | Required | Validation Rules | Error Messages |
|------------|-------|------|----------|-----------------|----------------|
| `email` | Email | email | Yes | Valid email format | "Email is required", "Please enter a valid email" |
| `password` | Password | password | Yes | Min 8 chars | "Password is required", "Password must be at least 8 characters" |

---

### 10.3 Product Form (Add/Edit)

#### Form Purpose
Create or update product information in the catalog.

#### Field Definitions

| Field Name | Label | Type | Required | Validation Rules | Error Messages |
|------------|-------|------|----------|-----------------|----------------|
| `name` | Product Name | text | Yes | Min 3 chars, Max 255 chars | "Name is required", "Name must be 3-255 characters" |
| `brand` | Brand | text | Yes | Min 1 char, Max 100 chars | "Brand is required" |
| `price` | Regular Price | number | Yes | Greater than 0, Max 2 decimal places | "Price is required", "Price must be greater than 0" |
| `salePrice` | Sale Price | number | No | Less than price, Max 2 decimal places | "Sale price must be less than regular price" |
| `description` | Description | textarea | No | Max 5000 chars | "Description is too long" |
| `image` | Product Image | file | No | Max 5MB, JPEG/PNG/WebP | "File too large", "Invalid file type" |
| `stockStatus` | In Stock | checkbox | Yes | Boolean | - |
| `specs.caseMaterial` | Case Material | text | No | Max 100 chars | - |
| `specs.caseDiameter` | Case Diameter | text | No | Max 50 chars | - |
| `specs.movement` | Movement | text | No | Max 100 chars | - |
| `specs.waterResistance` | Water Resistance | text | No | Max 50 chars | - |
| `specs.crystal` | Crystal | text | No | Max 100 chars | - |
| `specs.strapMaterial` | Strap Material | text | No | Max 100 chars | - |
| `specs.warranty` | Warranty | text | No | Max 100 chars | - |

---

### 10.4 Product Filter Form

#### Form Purpose
Filter products on the Product Listing Page.

#### Field Definitions

| Field Name | Label | Type | Required | Validation Rules | Error Messages |
|------------|-------|------|----------|-----------------|----------------|
| `brands` | Brand | checkbox group | No | Array of strings | - |
| `priceMin` | Min Price | number | No | Greater than or equal to 0 | "Minimum price cannot be negative" |
| `priceMax` | Max Price | number | No | Greater than priceMin if both provided | "Maximum price must be greater than minimum" |

---

### 10.5 Order Status Update Form

#### Form Purpose
Update the status of a customer order.

#### Field Definitions

| Field Name | Label | Type | Required | Validation Rules | Error Messages |
|------------|-------|------|----------|-----------------|----------------|
| `status` | Order Status | select | Yes | One of valid status values | "Please select a status" |

#### Status Options

| Value | Display Label | Badge Color |
|-------|--------------|-------------|
| `pending` | Pending | Yellow |
| `confirmed` | Confirmed | Blue |
| `shipped` | Shipped | Purple |
| `delivered` | Delivered | Green |
| `cancelled` | Cancelled | Red |

---

### 10.6 Data Models (TypeScript Interfaces)

#### Product Model

| Property | Type | Description |
|----------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `name` | string | Product name |
| `slug` | string | URL-friendly name |
| `brand` | string | Brand name |
| `price` | number | Regular price |
| `salePrice` | number | null | Discounted price |
| `description` | string | null | Product description |
| `specsJson` | ProductSpecs | null | Technical specifications |
| `imageUrl` | string | null | Primary image URL |
| `stockStatus` | boolean | Availability status |
| `createdAt` | string (ISO date) | Creation timestamp |
| `updatedAt` | string (ISO date) | Last update timestamp |

#### ProductSpecs Model

| Property | Type | Description |
|----------|------|-------------|
| `caseMaterial` | string | undefined | Case material type |
| `caseDiameter` | string | undefined | Diameter measurement |
| `movement` | string | undefined | Movement type |
| `waterResistance` | string | undefined | Water resistance rating |
| `crystal` | string | undefined | Crystal material |
| `strapMaterial` | string | undefined | Strap material |
| `warranty` | string | undefined | Warranty period |

#### Order Model

| Property | Type | Description |
|----------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `customerInfo` | CustomerInfo | Customer details |
| `totalAmount` | number | Order total |
| `status` | OrderStatus | Current status |
| `paymentMethod` | PaymentMethod | Payment method |
| `notes` | string | null | Order notes |
| `createdAt` | string (ISO date) | Order placed timestamp |
| `updatedAt` | string (ISO date) | Last update timestamp |
| `items` | OrderItem[] | Order line items |

#### CustomerInfo Model

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Customer full name |
| `phone` | string | Contact phone |
| `email` | string | undefined | Contact email |
| `address` | Address | Shipping address |

#### Address Model

| Property | Type | Description |
|----------|------|-------------|
| `street` | string | Street address |
| `ward` | string | Ward/Commune |
| `district` | string | District |
| `city` | string | City/Province |

#### OrderItem Model

| Property | Type | Description |
|----------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `orderId` | string (UUID) | Parent order reference |
| `productId` | string (UUID) | Product reference |
| `quantity` | number | Item quantity |
| `priceAtPurchase` | number | Price at time of order |
| `product` | Product | undefined | Joined product data |

#### CartItem Model (Client-side)

| Property | Type | Description |
|----------|------|-------------|
| `productId` | string (UUID) | Product reference |
| `name` | string | Product name |
| `brand` | string | Brand name |
| `price` | number | Unit price |
| `imageUrl` | string | null | Product image |
| `quantity` | number | Selected quantity |

---

## 11. State Management Architecture

### 11.1 Redux Store Structure

```
store/
├── index.ts              # Store configuration with middleware
├── provider.tsx          # Redux Provider wrapper component
└── slices/
    ├── cart.slice.ts     # Shopping cart state
    ├── filter.slice.ts   # Product filter state
    └── ui.slice.ts       # UI state (modals, drawers, loading)
```

### 11.2 Slice Definitions

#### Cart Slice

| State Property | Type | Initial Value | Description |
|----------------|------|---------------|-------------|
| `items` | CartItem[] | [] | Array of cart items |
| `isOpen` | boolean | false | Cart drawer visibility |

| Action | Payload | Description |
|--------|---------|-------------|
| `addItem` | CartItem | Add or update item in cart |
| `removeItem` | productId: string | Remove item from cart |
| `updateQuantity` | {productId, quantity} | Update item quantity |
| `clearCart` | - | Remove all items |
| `toggleCart` | - | Toggle cart drawer |
| `openCart` | - | Open cart drawer |
| `closeCart` | - | Close cart drawer |

| Selector | Return Type | Description |
|----------|-------------|-------------|
| `selectCartItems` | CartItem[] | All cart items |
| `selectCartCount` | number | Total item count |
| `selectCartTotal` | number | Total cart value |
| `selectIsCartOpen` | boolean | Cart drawer state |

---

#### Filter Slice

| State Property | Type | Initial Value | Description |
|----------------|------|---------------|-------------|
| `selectedBrands` | string[] | [] | Selected brand filters |
| `priceRange` | {min, max} | {min: 0, max: null} | Price range filter |

| Action | Payload | Description |
|--------|---------|-------------|
| `toggleBrand` | brand: string | Toggle brand selection |
| `setBrands` | brands: string[] | Set all selected brands |
| `setPriceRange` | {min?, max?} | Update price range |
| `clearFilters` | - | Reset all filters |

| Selector | Return Type | Description |
|----------|-------------|-------------|
| `selectSelectedBrands` | string[] | Selected brands |
| `selectPriceRange` | {min, max} | Price range values |
| `selectHasActiveFilters` | boolean | Whether filters are active |

---

#### UI Slice

| State Property | Type | Initial Value | Description |
|----------------|------|---------------|-------------|
| `isMobileMenuOpen` | boolean | false | Mobile nav menu state |
| `activeModal` | string | null | Currently open modal ID |
| `globalLoading` | boolean | false | Global loading state |

| Action | Payload | Description |
|--------|---------|-------------|
| `toggleMobileMenu` | - | Toggle mobile menu |
| `openModal` | modalId: string | Open specific modal |
| `closeModal` | - | Close active modal |
| `setGlobalLoading` | boolean | Set loading state |

---

### 11.3 React Context Definitions

#### Auth Context

| Property | Type | Description |
|----------|------|-------------|
| `user` | User | null | Current authenticated user |
| `session` | Session | null | Current session |
| `isLoading` | boolean | Auth state loading |
| `isAdmin` | boolean | Admin role check |
| `signIn` | (email, password) => Promise | Sign in method |
| `signOut` | () => Promise | Sign out method |

#### Theme Context (Optional for MVP)

| Property | Type | Description |
|----------|------|-------------|
| `theme` | 'light' | 'dark' | Current theme |
| `toggleTheme` | () => void | Toggle theme |

---

### 11.4 State Persistence Strategy

| State | Persistence | Method |
|-------|-------------|--------|
| Cart | Yes | redux-persist with localStorage |
| Filters | No | URL query parameters (optional) |
| UI | No | Memory only |
| Auth | Yes | Supabase handles session cookies |

---

## 12. API Layer Design

### 12.1 Service Layer Structure

```
services/
├── product.service.ts    # Product CRUD operations
├── order.service.ts      # Order operations
├── auth.service.ts       # Authentication operations
└── storage.service.ts    # File upload operations
```

### 12.2 Product Service Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `getAll` | filters?: FilterParams | Product[] | Fetch all products with optional filters |
| `getById` | id: string | Product | Fetch single product |
| `getBySlug` | slug: string | Product | Fetch product by slug |
| `getFeatured` | limit?: number | Product[] | Fetch latest products |
| `getBrands` | - | string[] | Fetch unique brands |
| `create` | data: CreateProductDto | Product | Create new product |
| `update` | id: string, data: UpdateProductDto | Product | Update product |
| `delete` | id: string | void | Delete product |

### 12.3 Order Service Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `getAll` | filters?: {status?: string} | Order[] | Fetch all orders |
| `getById` | id: string | Order | Fetch order with items |
| `getRecent` | limit?: number | Order[] | Fetch recent orders |
| `getStats` | - | OrderStats | Fetch order statistics |
| `create` | data: CreateOrderDto | Order | Create new order |
| `updateStatus` | id: string, status: OrderStatus | Order | Update order status |

### 12.4 Auth Service Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `signIn` | email: string, password: string | AuthResponse | Authenticate user |
| `signOut` | - | void | Sign out current user |
| `getSession` | - | Session | null | Get current session |
| `getUser` | - | User | null | Get current user |

### 12.5 Storage Service Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `uploadProductImage` | file: File | string | Upload image, return URL |
| `deleteProductImage` | path: string | void | Delete image from storage |

### 12.6 Axios Configuration

| Configuration | Value | Purpose |
|---------------|-------|---------|
| Base URL | Supabase project URL | API endpoint |
| Timeout | 30000ms | Request timeout |
| Headers | Content-Type: application/json | Default headers |
| Request Interceptor | Attach auth token | Add Authorization header |
| Response Interceptor | Handle errors | Standardized error handling |

---

## 13. Code Quality Standards

### 13.1 ESLint Configuration

| Rule Category | Rules |
|--------------|-------|
| **TypeScript** | strict type checking, no explicit any, consistent type imports |
| **React** | exhaustive deps, rules of hooks, no unused state |
| **Imports** | sorted imports, no unused imports, consistent type imports |
| **Accessibility** | alt text required, valid ARIA roles |

### 13.2 Prettier Configuration

| Setting | Value |
|---------|-------|
| Print Width | 80 |
| Tab Width | 2 |
| Use Tabs | false |
| Semi | true |
| Single Quote | true |
| Trailing Comma | es5 |
| Bracket Spacing | true |
| JSX Single Quote | false |
| Arrow Parens | always |
| Tailwind Plugin | enabled |

### 13.3 TypeScript Configuration

| Setting | Value |
|---------|-------|
| Strict Mode | true |
| No Implicit Any | true |
| Strict Null Checks | true |
| No Unused Locals | true |
| No Unused Parameters | true |
| Consistent Casing | true |
| Force Consistent Casing in File Names | true |

### 13.4 Commit Message Convention

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |

**Format:** `type(scope): description`

**Examples:**
- `feat(cart): add quantity update functionality`
- `fix(checkout): resolve form validation error`
- `docs(readme): update setup instructions`

### 13.5 Branch Naming Convention

| Pattern | Use Case |
|---------|----------|
| `feature/[wbs-id]-description` | New features |
| `fix/[issue-id]-description` | Bug fixes |
| `refactor/description` | Code refactoring |
| `docs/description` | Documentation updates |

**Examples:**
- `feature/3.3-product-listing`
- `fix/123-cart-persistence`
- `refactor/api-service-layer`

---

## Appendices

### Appendix A: Supabase SQL Migrations

The following migrations should be applied to create the database schema. These should be executed through the Supabase MCP or SQL Editor.

#### Migration 1: Enable UUID Extension

**Name:** `001_enable_uuid`

**Purpose:** Enable the UUID generation extension required for primary keys.

**SQL Statement:**
- Enable the `uuid-ossp` extension in the public schema

---

#### Migration 2: Create Products Table

**Name:** `002_create_products_table`

**Purpose:** Create the products table with all required columns and constraints.

**Table Columns:**
- id (UUID, primary key, auto-generated)
- name (VARCHAR 255, not null)
- slug (VARCHAR 255, unique, not null)
- brand (VARCHAR 100, not null)
- price (DECIMAL 10,2, not null, must be positive)
- sale_price (DECIMAL 10,2, nullable, must be less than price)
- description (TEXT, nullable)
- specs_json (JSONB, nullable)
- image_url (TEXT, nullable)
- stock_status (BOOLEAN, default true)
- created_at (TIMESTAMPTZ, default now)
- updated_at (TIMESTAMPTZ, default now)

**Indexes:**
- Index on brand
- Index on price
- Index on created_at
- Unique index on slug

---

#### Migration 3: Create Orders Table

**Name:** `003_create_orders_table`

**Purpose:** Create the orders table for storing customer orders.

**Table Columns:**
- id (UUID, primary key, auto-generated)
- customer_info (JSONB, not null)
- total_amount (DECIMAL 10,2, not null, must be non-negative)
- status (VARCHAR 20, not null, default 'pending')
- payment_method (VARCHAR 50, not null, default 'cod')
- notes (TEXT, nullable)
- created_at (TIMESTAMPTZ, default now)
- updated_at (TIMESTAMPTZ, default now)

**Constraints:**
- Status must be one of: pending, confirmed, shipped, delivered, cancelled

**Indexes:**
- Index on status
- Index on created_at

---

#### Migration 4: Create Order Items Table

**Name:** `004_create_order_items_table`

**Purpose:** Create the order_items junction table linking orders to products.

**Table Columns:**
- id (UUID, primary key, auto-generated)
- order_id (UUID, foreign key to orders, cascade delete)
- product_id (UUID, foreign key to products, set null on delete)
- quantity (INTEGER, not null, must be positive)
- price_at_purchase (DECIMAL 10,2, not null)
- created_at (TIMESTAMPTZ, default now)

**Indexes:**
- Index on order_id
- Index on product_id

---

#### Migration 5: Create Updated At Trigger

**Name:** `005_create_updated_at_trigger`

**Purpose:** Automatically update the updated_at column on row modifications.

**Trigger Function:** Create a function that sets updated_at to current timestamp

**Apply Triggers To:**
- products table
- orders table

---

#### Migration 6: Enable RLS and Create Policies

**Name:** `006_enable_rls_policies`

**Purpose:** Enable Row Level Security and create access policies.

**Products Policies:**
- Enable RLS on products table
- Allow public SELECT
- Allow admin INSERT, UPDATE, DELETE

**Orders Policies:**
- Enable RLS on orders table
- Allow public INSERT (guest checkout)
- Allow admin SELECT, UPDATE

**Order Items Policies:**
- Enable RLS on order_items table
- Allow public INSERT
- Allow admin SELECT

---

### Appendix B: Environment Variables Reference

| Variable | Required | Client-Safe | Description |
|----------|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | No | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | No | Yes | Production site URL (for redirects) |

---

### Appendix C: Component Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Page Components | PascalCase | `ProductListingPage` |
| Feature Components | PascalCase | `ProductCard`, `CheckoutForm` |
| UI Components | PascalCase | `Button`, `Input` |
| Hooks | camelCase with 'use' prefix | `useProducts`, `useCart` |
| Services | camelCase with '.service' suffix | `product.service.ts` |
| Types | PascalCase | `Product`, `OrderStatus` |
| Schemas | camelCase with 'Schema' suffix | `checkoutSchema` |
| Slices | camelCase with '.slice' suffix | `cart.slice.ts` |

---

### Appendix D: Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets, large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large screens |

**Mobile-First Approach:** Default styles apply to mobile; use breakpoint prefixes for larger screens.

---

### Appendix E: Acceptance Criteria Summary

#### Storefront Acceptance Criteria
- Customer can view home page with hero and featured products
- Customer can browse all products on listing page
- Customer can filter products by brand
- Customer can filter products by price range
- Customer can view detailed product information
- Customer can add products to cart from listing and detail pages
- Customer can view cart contents
- Customer can modify item quantities in cart
- Customer can remove items from cart
- Customer can complete checkout with contact information
- Customer receives order confirmation with reference number
- All pages are responsive on mobile, tablet, and desktop

#### Admin Acceptance Criteria
- Admin can log in with email and password
- Unauthenticated users are redirected from admin pages
- Admin can view dashboard with KPIs
- Admin can view revenue chart for last 7 days
- Admin can view recent orders list
- Admin can view all products in table format
- Admin can create new products with image upload
- Admin can edit existing products
- Admin can delete products with confirmation
- Admin can view all orders with status filtering
- Admin can view order details including customer info and items
- Admin can update order status

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-02 | Senior Frontend Developer | Initial implementation guide |

---

*End of Frontend Implementation Guide*

