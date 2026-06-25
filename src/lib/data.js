// Empty in-memory store for Ehika Fashion starting with no products
let products = [];

let payments = [];

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
