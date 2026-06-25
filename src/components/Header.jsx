import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a aria-label="Ehika Fashion home">
              <img src="/images/ehika-logo.svg" alt="Ehika Fashion" style={{height:48}} />
            </a>
          </Link>
        </div>
        <nav className="flex items-center">
          <Link href="/products"><a>Products</a></Link>
          <Link href="/about"><a>About</a></Link>
          <Link href="/free-text"><a>Notes</a></Link>
          <button onClick={() => setOpen(o => !o)} aria-label="Search" className="ml-4 p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="#000" strokeWidth="1.5"/></svg>
          </button>
          <Link href="/admin"><a className="ml-6">Admin</a></Link>
        </nav>
      </div>
      {open && <div className="container mt-3"><SearchBar /></div>}
    </header>
  );
}
