import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/cart-oop.js";
import { loadProducts } from "../data/products.js";
import { loadCart } from "../data/cart.js";

Promise.all([
  new Promise((resolve) => {
    loadProducts(() => {
      resolve("someValue");
    });
  }),
  new Promise((resolve) => {
    loadCart(() => {
      resolve("anotherValue");
    });
  }),
]).then((values) => {
  renderOrderSummary();
  renderPaymentSummary();
});

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
