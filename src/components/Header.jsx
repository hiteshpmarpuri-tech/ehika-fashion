import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="py-6 border-b border-white/5">
      <div className="container flex items-center justify-between">
        <Link href="/"><a className="text-xl font-serif">Ehika Fashion</a></Link>
        <nav className="flex items-center gap-6">
          <Link href="/about"><a>About</a></Link>
          <Link href="/products"><a>Products</a></Link>
          <Link href="/free-text"><a>Notes</a></Link>
          <button onClick={() => setOpen(o => !o)} aria-label="Search" className="p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#CBA135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="#CBA135" strokeWidth="1.5"/></svg>
          </button>
          <Link href="/admin"><a className="px-4 py-2 border rounded">Admin</a></Link>
        </nav>
      </div>
      {open && <div className="container mt-4"><SearchBar /></div>}
    </header>
  );
}
