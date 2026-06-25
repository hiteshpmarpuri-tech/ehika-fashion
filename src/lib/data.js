// Simple in-memory store for prototyping Ehika Fashion
let products = [
  {
    id: "p1",
    title: "Elegance Silk Robe",
    price: 249,
    description: "Hand-finished silk robe with subtle gold threading.",
    image: "/images/placeholder.svg"
  },
  {
    id: "p2",
    title: "Cashmere Wrap",
    price: 399,
    description: "Ultra-soft cashmere wrap for every evening.",
    image: "/images/placeholder.svg"
  }
];

let payments = [
  { id: "pm1", type: "bank-transfer", label: "Bank Transfer (manual)" }
];

export function getProducts() { return products; }
export function getProductById(id) { return products.find(p => p.id === id); }
export function addProduct(product) {
  products.push(product);
  return product;
}
export function getPayments() { return payments; }
export function addPayment(pm) {
  payments.push(pm);
  return pm;
}
