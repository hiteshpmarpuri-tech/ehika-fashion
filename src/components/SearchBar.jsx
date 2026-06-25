import { useState } from "react";
import { getProducts } from "../lib/data";
import Link from "next/link";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const products = getProducts();
  const results = products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="card">
      <input autoFocus placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)}
        className="w-full p-3 bg-transparent border-b border-white/10 outline-none" />
      {q && (
        <div className="mt-2">
          {results.length === 0 && <div>No products.</div>}
          {results.map(r => (
            <div key={r.id} className="py-2 border-b border-white/5">
              <Link href={`/products/${r.id}`}><a className="text-sm">{r.title}</a></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
