export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveOrderToStorage();
}

function saveOrderToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}
