import Header from "../../components/Header";
import { useState } from "react";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrlManual, setLogoUrlManual] = useState("");

  async function uploadToCloudinaryUnsigned(file) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) throw new Error('Cloudinary not configured (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)');

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);

    const res = await fetch(url, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Image upload failed');
    const json = await res.json();
    return json.secure_url;
  }

  async function submitProduct(e) {
    e.preventDefault();
    setMsg('');

    let imageUrl = '/images/placeholder.svg';
    try {
      if (file) {
        setUploading(true);
        imageUrl = await uploadToCloudinaryUnsigned(file);
        setUploading(false);
      } else if (logoUrlManual) {
        imageUrl = logoUrlManual;
      }

      const token = prompt("Enter admin token:");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: `p${Date.now()}`, title, price: Number(price), description: desc, image: imageUrl })
      });
      const json = await res.json();
      setMsg(json.message || "Done");
      if (res.ok) {
        setTitle(''); setPrice(''); setDesc(''); setFile(null); setPreview(null);
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
      setMsg(err.message || 'An error occurred');
    }
  }

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }

  function onLogoFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setLogoFile(f);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function uploadLogo(e) {
    e.preventDefault();
    setMsg('');
    try {
      let logoUrl = '';
      if (logoFile) {
        setUploading(true);
        logoUrl = await uploadToCloudinaryUnsigned(logoFile);
        setUploading(false);
      } else if (logoUrlManual) {
        logoUrl = logoUrlManual;
      } else {
        setMsg('Choose a logo file or enter a logo URL');
        return;
      }

      const token = prompt('Enter admin token to save logo:');
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ logoUrl })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Save failed');
      setMsg('Logo updated');
      setLogoFile(null); setLogoPreview(null); setLogoUrlManual('');
    } catch (err) {
      console.error(err);
      setUploading(false);
      setMsg(err.message || 'An error occurred');
    }
  }

  return (
    <>
      <Header />
      <main className="container mt-8">
        <h1 className="hero-title">Admin</h1>

        <form onSubmit={submitProduct} className="mt-6 card">
          <h2 className="text-lg font-semibold">Add product</h2>
          <label className="block">Title<input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
          <label className="block mt-3">Price<input value={price} onChange={e=>setPrice(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
          <label className="block mt-3">Description<textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>

          <label className="block mt-3">Product image (upload to Cloudinary or enter URL)
            <input type="file" accept="image/*" onChange={onFileChange} className="w-full mt-1 p-2" />
          </label>

          <label className="block mt-3">Or image URL
            <input value={logoUrlManual} onChange={e=>setLogoUrlManual(e.target.value)} placeholder="https://..." className="w-full mt-1 p-2 bg-transparent border rounded" />
          </label>

          {preview && (
            <div className="mt-3">
              <div className="product-image" style={{backgroundImage:`url(${preview})`, height:160}}></div>
            </div>
          )}

          <div className="mt-4"><button type="submit" className="px-4 py-2 border rounded" disabled={uploading}>{uploading ? 'Uploading...' : 'Add Product'}</button></div>
          {msg && <p className="mt-2">{msg}</p>}
        </form>

        <form onSubmit={uploadLogo} className="mt-6 card">
          <h2 className="text-lg font-semibold">Site logo</h2>
          <label className="block">Upload logo image (or enter URL)
            <input type="file" accept="image/*" onChange={onLogoFileChange} className="w-full mt-1 p-2" />
          </label>
          <label className="block mt-3">Or logo URL
            <input value={logoUrlManual} onChange={e=>setLogoUrlManual(e.target.value)} placeholder="https://..." className="w-full mt-1 p-2 bg-transparent border rounded" />
          </label>
          {logoPreview && (
            <div className="mt-3"><div className="product-image" style={{backgroundImage:`url(${logoPreview})`, height:120}}></div></div>
          )}
          <div className="mt-4"><button type="submit" className="px-4 py-2 border rounded" disabled={uploading}>{uploading ? 'Uploading...' : 'Save Logo'}</button></div>
        </form>

        <section className="mt-8">
          <h2 className="text-lg">Notes</h2>
          <p className="small">Images are uploaded to Cloudinary using an unsigned upload preset. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your Vercel project settings before using. If you don’t want to use Cloudinary, paste an image URL in the fields above.</p>
        </section>
      </main>
    </>
  );
}
