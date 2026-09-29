function Cart(localStorageKey) {
  const cart = {
    items: undefined,
    loadFromStorage() {
      this.items = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    },

    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.items));
    },

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
    },

    removeFromCart(productId) {
      const newCart = [];
      this.items.forEach((item) => {
        if (item.productId !== productId) {
          newCart.push(item);
        }
      });
      this.items = newCart;
      this.aveToStorage();
    },

    updateDeliveryOption(productId, deliveryOptionId) {
      let matchingItem = "";
      this.items.forEach((item) => {
        if (productId === item.productId) {
          matchingItem = item;
        }
      });

      matchingItem.deliveryOptionId = deliveryOptionId;
      this.saveToStorage();
    },
  };
  return cart;
}

const cart = Cart("cart-oop");
cart.loadFromStorage();
