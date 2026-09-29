class Cart {
  item;
  localStorageKey;

  constructor(loadFromStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.items = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
  }
  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.items));
  }

  addToCart(productId) {
    let matchingItem = "";
    this.items.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });
    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      this.items.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: "1",
      });
    }
    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];
    this.items.forEach((item) => {
      if (item.productId !== productId) {
        newCart.push(item);
      }
    });
    this.items = newCart;
    this.aveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem = "";
    this.items.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}
const cart = new Cart("cart-oop");
