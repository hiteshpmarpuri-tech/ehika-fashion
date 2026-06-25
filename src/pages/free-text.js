import Header from "../components/Header";
import { useState } from "react";

export default function FreeText() {
  const [text, setText] = useState("");
  return (
    <>
      <Header />
      <main className="container mt-8">
        <h1 className="hero-title">Notes</h1>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full h-64 mt-4 p-4 card" placeholder="Type whatever you want..."></textarea>
      </main>
    </>
  );
}
