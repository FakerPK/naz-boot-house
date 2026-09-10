import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="max-w-lg text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Naz Boot House</p>
        <h1 className="text-4xl font-bold text-gray-900">That product is unavailable</h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          This product may have been removed or is not available in the catalogue yet. Browse the shop to see what is currently in stock.
        </p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
