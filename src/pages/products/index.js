import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../lib/data";

export default function Products() {
  const products = getProducts();
  return (
    <>
      <Header />
      <main className="container mt-8">
        <h1 className="hero-title">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </>
  );
}
