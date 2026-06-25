import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const sessionHook = useSession();
  const session = sessionHook?.data || null;
  const [logoUrl, setLogoUrl] = useState('/images/ehika-logo.svg');
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) return;
        const json = await res.json();
        if (json.settings?.logoUrl) setLogoUrl(json.settings.logoUrl);
      } catch (err) {
        // ignore and keep default
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    async function loadIcons() {
      try {
        const res = await fetch('/api/icons');
        if (!res.ok) return;
        const json = await res.json();
        setIcons(json.icons || []);
      } catch (err) {
        // ignore
      }
    }
    loadIcons();
  }, []);

  return (
    <header className="header py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a aria-label="Ehika Fashion home">
              <img src={logoUrl} alt="Ehika Fashion" style={{height:48, objectFit:'contain'}} />
            </a>
          </Link>
        </div>

        <nav className="flex items-center">
          <Link href="/products"><a className="mr-4">Products</a></Link>
          <Link href="/about"><a className="mr-4">About</a></Link>

          {/* tiny icons area */}
          <div style={{display:'flex', alignItems:'center', gap:8, marginRight:12}}>
            {icons.map(ic => (
              <a key={ic.id} href={ic.href || '#'} title={ic.label || ''} style={{width:28,height:28,display:'inline-block'}}>
                {ic.image ? (<img src={ic.image} alt={ic.label || 'icon'} style={{width:28,height:28,objectFit:'cover',borderRadius:4}}/>) : (<span style={{display:'inline-block',width:28,height:28,background:'#eee',borderRadius:4}} />)}
              </a>
            ))}
          </div>

          {/* Auth / Admin links */}
          {session?.isAdmin ? (
            <>
              <Link href="/admin"><a className="ml-4">Admin</a></Link>
              <button onClick={() => signOut()} className="ml-4">Sign out</button>
            </>
          ) : session?.user ? (
            <>
              <span className="ml-4">{session.user.email}</span>
              <button onClick={() => signOut()} className="ml-4">Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => signIn()} className="ml-4">Login</button>
              <Link href="/signup"><a className="ml-4">Signup</a></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
