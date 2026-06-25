import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <article className="card">
      <div className="product-image" style={{backgroundImage: `url(${product.image || '/images/placeholder.svg'})`}}></div>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">${product.price}</p>
      <div className="mt-3">
        <Link href={`/products/${product.id}`}><a className="button">View</a></Link>
      </div>
    </article>
  );
}
