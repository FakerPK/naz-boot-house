# Naz Boot House - Premium Footwear E-commerce

A professional, full-featured shoe e-commerce website built with Next.js 14, deployed on Vercel.

## Features

- **Product Catalog**: Shoes, Slippers, School Shoes, Sports, Casual, Formal
- **Product Details**: Multiple images, color variants, size selection with stock tracking
- **Shopping Cart**: Persistent cart with localStorage
- **Checkout**: Multi-step checkout with COD, Card, Bank Transfer options
- **Admin Dashboard**: Full product management (CRUD) with image URLs, colors, sizes, stock
- **Responsive Design**: Mobile-first, works on all devices
- **Vercel KV**: Serverless Redis for products and orders
- **SEO Optimized**: Meta tags, Open Graph, structured data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel KV (Redis)
- **Storage**: Vercel Blob (for images)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd naz-boot-house

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Vercel KV and Blob tokens to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Vercel Setup

1. Push to GitHub
2. Import project in Vercel
3. Add Vercel KV and Blob storage from Vercel Dashboard
4. Environment variables will be auto-configured
5. Deploy!

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── products/      # Product CRUD
│   │   └── orders/        # Order management
│   ├── admin/             # Admin dashboard
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Multi-step checkout
│   ├── product/[id]/      # Product detail
│   ├── shop/              # Product listing with filters
│   └── order-success/     # Order confirmation
├── components/            # React components
├── lib/                   # Utilities & database
│   ├── db.ts             # Vercel KV operations
│   └── utils.ts          # Helper functions
└── types/                # TypeScript types
```

## Admin Dashboard

Access `/admin` to manage products:
- Add new products with images, colors, sizes, stock
- Edit existing products
- Delete products
- Toggle featured, new, sale status
- Search and filter products

## Environment Variables

| Variable | Description |
|----------|-------------|
| `KV_REST_API_URL` | Vercel KV REST API URL |
| `KV_REST_API_TOKEN` | Vercel KV REST API Token |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `NEXT_PUBLIC_SITE_URL` | Your site URL |

## Deployment

The site is configured for deployment on Vercel at `nazboothouse.vercel.app`.

### Custom Domain

To use a custom domain:
1. Add domain in Vercel project settings
2. Update DNS records as instructed
3. SSL is automatic

## License

MIT License - feel free to use for your own projects.