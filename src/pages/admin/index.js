import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

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

  // icons state
  const [icons, setIcons] = useState([]);
  const [iconLabel, setIconLabel] = useState('');
  const [iconHref, setIconHref] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  // about
  const [about, setAbout] = useState('');

  useEffect(()=>{ loadIcons(); loadSettings(); }, []);

  async function loadIcons(){
    try{
      const res = await fetch('/api/icons');
      const json = await res.json();
      setIcons(json.icons || []);
    }catch(err){ }
  }

  async function loadSettings(){
    try{
      const res = await fetch('/api/settings');
      const json = await res.json();
      setAbout(json.settings?.about || '');
    }catch(err){}
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
  function onIconFileChange(e){
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    setIconFile(f);
    const reader = new FileReader();
    reader.onload = ()=> setIconPreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function getCloudinarySignature(){
    const res = await fetch('/api/cloudinary/sign', { method: 'POST' });
    if (!res.ok) throw new Error('Could not get signature');
    return res.json();
  }

  async function uploadToCloudinarySigned(file){
    const { signature, apiKey, timestamp, cloudName } = await getCloudinarySignature();
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', apiKey);
    fd.append('timestamp', timestamp);
    fd.append('signature', signature);
    const res = await fetch(url, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.secure_url;
  }

  async function submitProduct(e){
    e.preventDefault(); setMsg('');
    try{
      let imageUrl = '';
      if (file){ setUploading(true); imageUrl = await uploadToCloudinarySigned(file); setUploading(false); }
      else if (logoUrlManual) imageUrl = logoUrlManual;
      const res = await fetch('/api/products', { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title, price: Number(price)||0, description: desc, image: imageUrl }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error');
      setMsg('Product added'); setTitle(''); setPrice(''); setDesc(''); setFile(null); setPreview(null);
    }catch(err){ setUploading(false); setMsg(err.message || 'An error occurred'); }
  }

  async function saveLogo(e){
    e.preventDefault(); setMsg('');
    try{
      let logoUrl = '';
      if (logoFile){ setUploading(true); logoUrl = await uploadToCloudinarySigned(logoFile); setUploading(false); }
      else if (logoUrlManual) logoUrl = logoUrlManual;
      const res = await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ logoUrl }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setMsg('Logo updated'); setLogoFile(null); setLogoPreview(null); setLogoUrlManual('');
    }catch(err){ setUploading(false); setMsg(err.message || 'An error occurred'); }
  }

  async function addIcon(e){
    e.preventDefault(); setMsg('');
    try{
      let imageUrl = '';
      if (iconFile){ setUploading(true); imageUrl = await uploadToCloudinarySigned(iconFile); setUploading(false); }
      const res = await fetch('/api/icons', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ label: iconLabel, href: iconHref, image: imageUrl }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Add icon failed');
      setIconFile(null); setIconLabel(''); setIconHref(''); setIconPreview(null);
      setMsg('Icon added');
      loadIcons();
    }catch(err){ setUploading(false); setMsg(err.message || 'An error occurred'); }
  }

  async function deleteIcon(id){
    if(!confirm('Delete icon?')) return;
    try{
      const res = await fetch(`/api/icons?id=${id}`, { method:'DELETE' });
      if(!res.ok) throw new Error('Delete failed');
      setMsg('Icon deleted'); loadIcons();
    }catch(err){ setMsg(err.message); }
  }

  async function saveAbout(e){
    e.preventDefault(); setMsg('');
    try{
      const res = await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ about }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setMsg('About updated');
    }catch(err){ setMsg(err.message || 'An error occurred'); }
  }

  return (
    <>
      <Header />
      <main className="container mt-8">
        <h1 className="hero-title">Admin</h1>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold">Add product</h2>
          <form onSubmit={submitProduct}>
            <label className="block">Title<input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
            <label className="block mt-3">Price<input value={price} onChange={e=>setPrice(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
            <label className="block mt-3">Description<textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full mt-1 p-2 bg-transparent border rounded" /></label>
            <label className="block mt-3">Product image (upload)
              <input type="file" accept="image/*" onChange={onFileChange} className="w-full mt-1 p-2" />
            </label>
            {preview && <div className="mt-3"><div className="product-image" style={{backgroundImage:`url(${preview})`, height:160}}></div></div>}
            <div className="mt-4"><button type="submit" className="px-4 py-2 border rounded" disabled={uploading}>{uploading ? 'Uploading...' : 'Add Product'}</button></div>
          </form>
        </section>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold">Site logo</h2>
          <form onSubmit={saveLogo}>
            <label className="block">Upload logo image (or enter URL)
              <input type="file" accept="image/*" onChange={onLogoFileChange} className="w-full mt-1 p-2" />
            </label>
            <label className="block mt-3">Or logo URL
              <input value={logoUrlManual} onChange={e=>setLogoUrlManual(e.target.value)} placeholder="https://..." className="w-full mt-1 p-2 bg-transparent border rounded" />
            </label>
            {logoPreview && <div className="mt-3"><div className="product-image" style={{backgroundImage:`url(${logoPreview})`, height:120}}></div></div>}
            <div className="mt-4"><button className="px-4 py-2 border rounded" disabled={uploading}>{uploading ? 'Uploading...' : 'Save Logo'}</button></div>
          </form>
        </section>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold">Top icons</h2>
          <form onSubmit={addIcon} className="mb-4">
            <label className="block">Label<input value={iconLabel} onChange={e=>setIconLabel(e.target.value)} className="w-full mt-1 p-2 border rounded" /></label>
            <label className="block mt-3">Link (href)<input value={iconHref} onChange={e=>setIconHref(e.target.value)} className="w-full mt-1 p-2 border rounded" /></label>
            <label className="block mt-3">Icon image (upload)
              <input type="file" accept="image/*" onChange={onIconFileChange} className="w-full mt-1 p-2" />
            </label>
            {iconPreview && <div className="mt-3"><div className="product-image" style={{backgroundImage:`url(${iconPreview})`, height:48, width:48}}></div></div>}
            <div className="mt-4"><button className="px-4 py-2 border rounded" disabled={uploading}>{uploading ? 'Uploading...' : 'Add Icon'}</button></div>
          </form>

          <div>
            {icons.map(ic => (
              <div key={ic.id} className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center gap-3">
                  {ic.image ? <img src={ic.image} alt={ic.label} style={{width:36,height:36,objectFit:'cover'}} /> : <div style={{width:36,height:36,background:'#f0f0f0'}}/>}
                  <div>
                    <div className="font-semibold">{ic.label}</div>
                    <div className="text-sm text-gray-600">{ic.href}</div>
                  </div>
                </div>
                <div>
                  <button onClick={()=>deleteIcon(ic.id)} className="px-3 py-1 border rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold">About page</h2>
          <form onSubmit={saveAbout}>
            <label className="block">About content (HTML allowed)
              <textarea value={about} onChange={e=>setAbout(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={10} />
            </label>
            <div className="mt-4"><button className="px-4 py-2 border rounded">Save About</button></div>
            {msg && <p className="mt-2">{msg}</p>}
          </form>
        </section>

      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session || (session.user?.email || '').toLowerCase() !== (process.env.ADMIN_EMAIL || '').toLowerCase()) {
    return { redirect: { destination: '/api/auth/signin', permanent: false } };
  }
  return { props: {} };
}
