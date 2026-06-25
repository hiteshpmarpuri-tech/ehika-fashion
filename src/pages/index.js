import Link from "next/link";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/data";

export default function Home() {
  const products = getProducts();
  return (
    <>
      <Header />
      <main className="container mt-8">
        <section className="hero">
          <h1 className="hero-title">EHIKA FASHION</h1>
          <p className="tagline">Contemporary wardrobe essentials</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl mb-4">Featured</h2>
          {products.length === 0 ? (
            <div className="card">No products yet. Use the Admin page to add products.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        <section className="mt-10">
          <Link href="/products">
            <a className="">Browse all products →</a>
          </Link>
        </section>
      </main>
    </>
  );
}
