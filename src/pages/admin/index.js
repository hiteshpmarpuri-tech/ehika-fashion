import Header from "../../components/Header";
import { useState } from "react";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");

  async function submitProduct(e) {
    e.preventDefault();
    const token = prompt("Enter admin token:");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id: `p${Date.now()}`, title, price: Number(price), description: desc, image: "/images/placeholder.svg" })
    });
    const json = await res.json();
    setMsg(json.message || "Done");
  }

  return (
    <>
      <Header />
      <main className="container mt-8">
        <h1 className="hero-title">Admin</h1>
        <form onSubmit={submitProduct} className="mt-6 card">
          <label className="block">Title<input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
          <label className="block mt-3">Price<input value={price} onChange={e=>setPrice(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
          <label className="block mt-3">Description<textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
          <div className="mt-4"><button type="submit" className="px-4 py-2 border rounded">Add Product</button></div>
          {msg && <p className="mt-2">{msg}</p>}
        </form>
      </main>
    </>
  );
}
