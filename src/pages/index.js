import Link from "next/link";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/data";

export default function Home() {
  const products = getProducts();
  return (
    <>
      <Header />
      <main className="container">
        <section className="hero">
          <h1 className="hero-title">Ehika Fashion</h1>
          <p className="gold">Curated pieces for a refined wardrobe.</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl mb-4">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="mt-10">
          <Link href="/products">
            <a className="gold">Browse all products →</a>
          </Link>
        </section>
      </main>
    </>
  );
}
