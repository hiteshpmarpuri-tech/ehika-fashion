import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Signup failed');
      setMsg('Signup successful — redirecting to sign in');
      setTimeout(() => router.push('/api/auth/signin'), 800);
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <main className="container mt-8">
      <h1 className="hero-title">Sign up</h1>
      <form onSubmit={submit} className="mt-6 card max-w-md">
        <label className="block">Name<input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 p-2 border rounded" /></label>
        <label className="block mt-3">Email<input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" /></label>
        <label className="block mt-3">Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full mt-1 p-2 border rounded" /></label>
        <div className="mt-4"><button className="px-4 py-2 border rounded">Create account</button></div>
        {msg && <p className="mt-2">{msg}</p>}
      </form>
    </main>
  );
}
