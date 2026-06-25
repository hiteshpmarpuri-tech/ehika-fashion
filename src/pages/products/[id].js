import Header from "../../components/Header";
import { getProductById } from "../../lib/data";

export default function ProductPage({ product }) {
  if (!product) return <div>Not found</div>;
  return (
    <>
      <Header />
      <main className="container mt-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div style={{height:420, background:`url(${product.image}) center/cover no-repeat`}} className="rounded"></div>
          <div>
            <h1 className="hero-title">{product.title}</h1>
            <p className="gold text-2xl mt-2">${product.price}</p>
            <p className="mt-6">{product.description}</p>
            <div className="mt-8">
              <button className="px-6 py-3 bg-white/5 border rounded">Checkout</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// For this prototype, we render on server with simple data access
export async function getServerSideProps(context) {
  const { id } = context.params;
  const product = getProductById(id) || null;
  return { props: { product } };
}
