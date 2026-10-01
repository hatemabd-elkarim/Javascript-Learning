import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/cart-oop.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

loadPage();

async function loadPage() {
  await loadProductsFetch(); // this function returns a promise, so we can await it

  const value = await new Promise((resolve) => {
    loadCart(() => {
      // this function takes a callback, so we wrap it in a promise
      resolve();
    });
  });

  renderOrderSummary();
  renderPaymentSummary();
}

// Promise.all([
//   loadProductsFetch(),
//   new Promise((resolve) => {
//     loadCart(() => {
//       resolve("anotherValue");
//     });
//   }),
// ]).then((values) => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve("someValue");
//   });
// })

//   .then((value) => {
//     return new Promise((resolve) => {
//       loadCart(() => {
//         resolve();
//       });
//     });
//   })

//   .then(() => {
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
