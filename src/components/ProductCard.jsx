import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <article className="card">
      <div style={{height:200, background:`linear-gradient(180deg, rgba(0,0,0,0.2), transparent), url(${product.image}) center/cover no-repeat`}} className="rounded mb-4"></div>
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-sm text-white/70">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="gold">${product.price}</span>
        <Link href={`/products/${product.id}`}><a className="px-4 py-2 border rounded">View</a></Link>
      </div>
    </article>
  );
}
