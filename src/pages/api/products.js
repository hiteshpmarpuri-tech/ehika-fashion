import { getProducts, addProduct } from "../../lib/data";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ products: getProducts() });
  }
  if (req.method === "POST") {
    const token = req.headers["x-admin-token"];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const body = req.body;
    if (!body || !body.id) return res.status(400).json({ message: "Invalid product" });
    addProduct(body);
    return res.status(201).json({ message: "Product added", product: body });
  }
  res.setHeader("Allow", ["GET","POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
