# Milestone 4 — The Amazon Project, Modules, MVC & Testing

Covers lessons 13–16: starting the real-world Amazon project (with git), organizing code with modules, using external libraries + the MVC pattern to finish the checkout page, and testing code (manual, automated, and with the Jasmine framework).

## Contents

1. [Starting the Amazon Project & Git](#lesson-13--starting-the-amazon-project--git)
2. [Modules](#lesson-14--modules)
3. [External Libraries & MVC](#lesson-15--external-libraries--mvc)
4. [Testing (Manual, Automated & Jasmine)](#lesson-16--testing-manual-automated--jasmine)

---

# Lesson 13 — Starting the Amazon Project & Git

## The project

A multi-page e-commerce site (homepage → cart/checkout → orders → tracking). Starting code (HTML/CSS only, no JS) is provided so the course can focus purely on the JavaScript layer.

## Git — tracking changes

**Git** tracks every change made to a project so you can review, undo, or understand history.

Setup steps:

1. VS Code → **Source Control** tab → **Initialize Repository** (turns the folder into a **repository** — a tracked folder).
2. Configure identity once:
   ```
   git config user.name "Your Name"
   git config user.email "you@example.com"
   ```
3. Write a short **commit message** describing what changed, then **Commit** — this saves a snapshot and starts tracking future changes.

Everyday git workflow used throughout the rest of the course:

- Make code changes → check the **Source Control** panel to see exactly which lines changed per file → write a message describing the change → **Commit**.
- Each file's diff view shows old code vs. new code side by side — you can revert a single file or all changes.
- The **Timeline** view (right-click a file → enable "git history" filter) shows a step-by-step **version history** with your commit messages attached — very useful for understanding _why_ something changed later.

## The core JavaScript workflow (used for every feature from here on)

1. **Save the data** — represent real-world info as a JS data structure (arrays + objects).
2. **Generate the HTML** — loop through the data and build markup instead of hand-writing it.
3. **Make it interactive** — attach event listeners that update the data and re-render.

## Step 1 — Data structures: representing the product list

Instead of hardcoded HTML per product, save the info as an array of objects:

```js
const products = [
  {
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Socks (6 Pairs)",
    rating: { stars: 4.5, count: 87 },
    priceCents: 1090, // always store money in cents!
  },
  // ...more products
];
```

- Every object should share the **same structure** — this lets one loop handle every product identically.
- This is called a **data structure** — it organizes real-world data into JS so code can work with it.

## Step 2 — Generating HTML from data

```js
let productsHTML = "";

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <img src="${product.image}">
      <div>${product.name}</div>
      <img src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div>${product.rating.count}</div>
      <div>$${(product.priceCents / 100).toFixed(2)}</div>
    </div>
  `;
});

document.querySelector(".js-products-grid").innerHTML = productsHTML;
```

Key details:

- **`.forEach()` + the accumulator pattern** builds the combined HTML string.
- Image filenames sometimes need value transformation to match what actually exists (`4.5` stars → file named `rating-45.png`, so multiply by 10).
- **`.toFixed(2)`** forces exactly two decimal places for prices (`10.9` → `"10.90"`).
- **Benefit of generating HTML:** adding a new product is now just adding one object to the array — no copy-pasting HTML.

### Splitting data into its own file

Real product data was moved into `data/products.js` and loaded via its own `<script>` tag _before_ the file that uses it — **script tag order matters** because each runs top-to-bottom on the shared global scope.

## Step 3 — Making "Add to Cart" interactive

### Data attributes — attaching custom info to HTML

```html
<button class="js-add-to-cart" data-product-id="${product.id}">
  Add to Cart
</button>
```

- Data attributes **must** start with `data-`, and use kebab-case.
- Read them in JS via the element's **`.dataset`** property — kebab-case converts to camelCase automatically:
  ```js
  button.dataset.productId; // "e43638ce-..."
  ```
- Always use a **unique product ID** (not the name) to identify products — names could collide.

### Building the cart array

```js
const cart = []; // [{ productId, quantity }, ...]
```

### Add-to-cart logic (check for existing item first)

```js
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;

    let matchingItem;
    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
  });
});
```

This is the classic "does it already exist? increment vs. push" pattern you'll see reused for delivery options, wishlist items, etc.

### Interactive cart quantity badge

```js
let cartQuantity = 0;
cart.forEach((item) => {
  cartQuantity += item.quantity;
});

document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
```

## Key takeaways

- Git tracks changes with **repositories**, **commits**, and a browsable **version history** — commit after every meaningful change.
- Every JS-driven feature follows: **save data → generate HTML → make interactive**.
- Store money in **cents**; format for display with `.toFixed(2)`.
- **Data attributes** (`data-*`) attach custom info to elements; read via `.dataset` (auto camelCase).
- Always identify records by a **unique ID**, never by a display name.
- The "add-or-increment" pattern (loop to find a match, then branch) recurs throughout the project.

---

# Lesson 14 — Modules

## The problem: naming conflicts with `<script>` tags

Loading files with plain `<script src="...">` tags runs them all in **one shared global scope** — as if they were pasted into a single file. Declaring the same variable name (e.g. `cart`) in two files causes:

```
Uncaught SyntaxError: Identifier 'cart' has already been declared
```

This gets worse as a project grows — it's hard to know what names are already "taken" by other files.

## The fix: ES Modules

A **module** keeps a file's variables **contained** — they don't leak into the global scope or conflict with other files.

### Three steps to use modules

1. **Enable modules** on the file that will _import_ things:
   ```html
   <script src="scripts/amazon.js" type="module"></script>
   ```
2. **`export`** whatever should be usable elsewhere:
   ```js
   // cart.js
   export const cart = [];
   ```
3. **`import`** it where needed, using a **relative file path**:
   ```js
   // amazon.js
   import { cart } from "../data/cart.js";
   ```

### File path rules for imports

- `./` = the **current** folder
- `../` = go **up/out** one folder
- Chain them as needed: `../../data/products.js` to go up two levels, etc.

### If a file is now a module, drop its `<script>` tag entirely

Once `cart.js`'s variable is only ever reached via `import`, you no longer load it with its own `<script>` tag — the importing file (the **entry point**, e.g. `amazon.js`) pulls it in automatically. Only the entry point still needs `<script type="module">`.

### Extra module features

- **Renaming on import** to dodge a conflict:
  ```js
  import { cart as myCart } from "../data/cart.js";
  ```
- **Default exports** — for files that export exactly one thing:

  ```js
  // money.js
  export default function formatCurrency(priceCents) { ... }

  // elsewhere:
  import formatCurrency from './utils/money.js';   // no curly braces!
  ```

  A file can have only **one** default export, but any number of **named exports** (`export const x = ...`).

- **Import everything as an object:**
  ```js
  import * as cartUtils from "../data/cart.js";
  cartUtils.cart;
  cartUtils.addToCart("id");
  ```

### ⚠️ Module requirement: must use a local server

Modules **do not work** if you open the HTML file directly (`file://...`) — you must serve it (e.g. via **Live Server**) or `import`/`export` silently fail.

## Why modules are better than script tags

1. **No naming conflicts** — variables stay scoped to their file unless explicitly exported/imported.
2. **No load-order dependency** — with script tags, `cart.js` had to load _before_ `amazon.js` because it created a global `cart`. With modules, `import` resolves dependencies automatically regardless of tag order.

## Refactor: splitting responsibilities into files

As the project grew, large chunks of inline logic were extracted into **named functions**, then moved into the file that owns that responsibility:

```js
// amazon.js — before: one giant onclick handler doing everything
// after: split into small, purpose-named functions
function addToCart(productId) {
  /* ... */
}
function updateCartQuantity() {
  /* ... */
}
```

Then `addToCart` (cart-related logic) was **moved into `cart.js`** and exported/imported — the guiding rule:

> **Group related code together, by file.** Anything that manages the cart's data belongs in `cart.js`; anything that updates the _page_ belongs with the file responsible for that page section.

## Key takeaways

- Modules solve **naming conflicts** and remove the need to carefully order `<script>` tags.
- Three steps: `type="module"` on the entry file → `export` in the source file → `import { name } from 'path'` where needed.
- `./` = current folder, `../` = up one folder — chain for deeper paths.
- **Default export** (one per file, no braces on import) vs. **named export** (many per file, braces required, can rename with `as`).
- Modules require a local server (Live Server) — they silently fail when opened as a plain file.
- As a project grows, **extract functions and move them into the file responsible for that data/feature** (e.g. cart logic → `cart.js`).

---

# Lesson 15 — External Libraries & MVC

## External libraries

Code written by someone else, hosted online, that you load into your project instead of writing it yourself.

### Loading via `<script src="URL">`

```html
<script src="https://.../hello.js"></script>
```

This works exactly like loading a local file — just points at a URL instead of a local path. Load libraries **before** your own code that depends on them.

### Minification

Production libraries are usually **minified** — whitespace stripped, variable names shortened — to reduce file size/load time. It looks unreadable, but it's just compressed JavaScript.

### Day.js — a date library

Rather than hand-rolling date math, the course uses **Day.js** for: getting today's date, adding time spans, and formatting dates for display.

```js
const today = dayjs();
const deliveryDate = today.add(7, "days");
const dateString = deliveryDate.format("dddd, MMMM D"); // e.g. "Monday, June 3"
```

General principle: **before writing complex logic yourself, check if a well-tested library already solves it** — saves time and avoids reinventing the wheel (and its edge-case bugs).

### External libraries + modules together (ESM builds)

Many libraries ship an **ESM (ECMAScript Modules) version** so they can be `import`ed like local modules instead of loaded via `<script>`:

```js
import hello from "https://.../hello.esm.js"; // default export
import dayjs from "https://.../dayjs.esm.js"; // default export
```

Not every library has an ESM build — some still require a `<script>` tag.

## Normalizing data

Instead of duplicating full product details inside the cart, the cart only stores **IDs** that reference the real records elsewhere:

```js
// cart item — normalized (good)
{ productId: 'abc-123', quantity: 2, deliveryOptionId: '1' }

// NOT duplicating full product/delivery-option details inside the cart item
```

Lookups reconstruct the full object on demand via shared **getter functions**:

```js
// products.js
export function getProduct(productId) {
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) matchingProduct = product;
  });
  return matchingProduct;
}
```

```js
// deliveryOptions.js
export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) deliveryOption = option;
  });
  return deliveryOption || deliveryOptions[0]; // default operator (||) as fallback
}
```

This is a major **refactor theme** across the project: any "find the matching X" loop that gets repeated across files gets extracted into one exported function, living in the file that owns that data (`products.js` owns `getProduct`, `deliveryOptions.js` owns `getDeliveryOption`).

## Shared utility extraction

Repeated formatting logic (`priceCents / 100`, `.toFixed(2)`) was pulled into a shared utility:

```js
// utils/money.js
export function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}
```

> **Bug fix discovered along the way:** `.toFixed(2)` can round some `.5`-ending cent values incorrectly. Wrapping the value in `Math.round()` first avoids the floating-point rounding glitch.

## MVC (Model–View–Controller)

A design pattern for keeping UI code predictable: **the page always reflects the data.**

| Part           | Role                          | Example in this project                                                         |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| **Model**      | Data + logic to manage it     | Everything in `data/` (`cart.js`, `products.js`, `deliveryOptions.js`)          |
| **View**       | Generates HTML from the model | `render...()` functions (e.g. `renderOrderSummary()`, `renderPaymentSummary()`) |
| **Controller** | Responds to user interaction  | Event listeners that call model functions, then re-render                       |

### The MVC loop

```
Model → generates → View
View → user interacts → triggers → Controller
Controller → updates → Model
Model (updated) → regenerates → View
```

### In code: update data, then **re-render everything**

Instead of manually patching the DOM in multiple places when something changes:

```js
// ❌ old approach — update each affected DOM node individually
document.querySelector(".js-cart-quantity").innerHTML = newQuantity;
document.querySelector(".js-total-price").innerHTML = newTotal;
// ...easy to forget one!
```

```js
// ✅ MVC approach — update the model, then regenerate the whole view
removeFromCart(productId);
renderOrderSummary();
renderPaymentSummary();
```

Wrapping each section's generation code in a function (`renderOrderSummary()`, `renderPaymentSummary()`) means any data change just calls these again — nothing gets missed, and a function calling itself again later (e.g. from within an event listener defined inside it) is a normal use of **recursion**.

> ⚠️ Because re-rendering regenerates the HTML from scratch, event listeners must be **re-attached inside the render function itself** every time it runs — old DOM nodes (and their listeners) are gone once `innerHTML` is replaced.

## File organization refactor

The single, growing `checkout.js` was split by responsibility:

- `checkout/orderSummary.js` — the cart/products list (left side)
- `checkout/paymentSummary.js` — cost breakdown (right side)
- A slim `checkout.js` becomes the **entry point**, importing and running both render functions.

This mirrors the earlier `cart.js` extraction — **one file, one responsibility.**

## Key takeaways

- External libraries are loaded via `<script src="URL">` or, for ESM builds, via `import ... from 'URL'`.
- **Day.js** simplifies date math and formatting — check for a library before writing complex logic yourself.
- **Normalize data**: store IDs, not duplicated full records; reconstruct via shared `getX(id)` lookup functions.
- Repeated formatting/lookup code gets extracted into shared, exported utility functions.
- **MVC**: Model (data) → View (render functions) → Controller (event listeners) → back to Model.
- The core technique: **update the model, then call the render function(s) again** — don't hand-patch the DOM piece by piece.
- Re-rendering wipes old DOM nodes, so **event listeners must be re-added on every render**.
- Split large files by responsibility (e.g. `orderSummary.js` vs. `paymentSummary.js`), matching the pattern used for `cart.js`.

---

# Lesson 16 — Testing (Manual, Automated & Jasmine)

## Why test?

**Manual testing** (clicking around the live site) is fast for a quick check but has two big weaknesses:

1. **Hard to cover every situation** — testing edge cases like `0` or `2095.5` means manually engineering that exact scenario every time.
2. **Hard to re-test** — after any code change, you must manually redo every scenario by hand.

**Automated testing** solves both: you write code that tests your code, and re-running it takes seconds regardless of how many scenarios exist.

## Automated testing from scratch (no framework)

```js
// money-test.js
import { formatCurrency } from "../scripts/utils/money.js";

if (formatCurrency(2095) === "20.95") {
  console.log("Passed");
} else {
  console.log("Failed");
}
```

Loaded via a small test HTML page (`type="module"` required for `import`).

### Test cases: basic vs. edge cases

- **Basic test case** — a normal, expected input (`2095` → `"20.95"`).
- **Edge case** — tricky/boundary values that are valid but easy to get wrong (`0` → `"0.00"`; `2000.5` → rounds up to `"20.01"`).
- Good coverage = at least one basic case + relevant edge cases; don't duplicate near-identical basic cases.

### Naming tests & grouping into suites

```js
console.log("Test suite: formatCurrency");

console.log("converts cents into dollars");
if (formatCurrency(2095) === "20.95") {
  console.log("Passed");
} else {
  console.log("Failed");
}

console.log("works with zero");
if (formatCurrency(0) === "0.00") {
  console.log("Passed");
} else {
  console.log("Failed");
}
```

- A **test case** = one scenario being checked.
- A **test suite** = a named group of related test cases.
- Clear names make it obvious _what_ broke when something fails.

---

## Jasmine — a testing framework

A **testing framework** is itself an external library — it automates all the boilerplate above (naming, grouping, pass/fail display) and adds a lot more.

### Setup

1. Download the standalone Jasmine `.zip`, extract it, and drop the folder into the project (e.g. renamed `tests/`).
2. It ships with a `SpecRunner.html` (renamed here to `tests.html`) that loads Jasmine itself plus your test files.
3. In Jasmine, a **test** is called a **spec**, and the runner file is a **spec runner**.
4. Open the runner with **Live Server** — Jasmine renders a results page with a colored dot per test (green = pass, red = fail) and randomizes test order by default.

### Core Jasmine functions

| Function                      | Purpose                                                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `describe(name, fn)`          | Defines a **test suite** — groups related tests under a name                                                                           |
| `it(name, fn)`                | Defines a single **test** (a "spec") with a descriptive name                                                                           |
| `expect(value)`               | Starts an assertion — returns a matcher object                                                                                         |
| `.toEqual(expected)`          | Checks strict equality between actual and expected values                                                                              |
| `.toContain(substring)`       | Checks that a string/array contains a given value (useful when you only care about part of the text, e.g. inside a larger DOM element) |
| `.not`                        | Negates the next matcher, e.g. `expect(x).not.toEqual(null)`                                                                           |
| `spyOn(object, 'methodName')` | Creates a **mock** — replaces a real method with a fake, trackable one                                                                 |
| `.and.callFake(fn)`           | Defines what the mocked method should actually do/return                                                                               |
| `.toHaveBeenCalledTimes(n)`   | Checks how many times a mocked method was called                                                                                       |
| `beforeEach(fn)`              | A **hook** — runs `fn` before every test in the suite (shared setup)                                                                   |
| `afterEach(fn)`               | A **hook** — runs `fn` after every test (shared cleanup)                                                                               |

### Basic Jasmine test example

```js
import { formatCurrency } from "../../scripts/utils/money.js";

describe("test suite: formatCurrency", () => {
  it("converts cents into dollars", () => {
    expect(formatCurrency(2095)).toEqual("20.95");
  });

  it("works with zero", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });

  it("rounds up to the nearest cent", () => {
    expect(formatCurrency(2000.5)).toEqual("20.01");
  });
});
```

Notice how Jasmine's chained syntax (`expect(...).toEqual(...)`) reads almost like English — a deliberate design choice that makes specs self-documenting.

### Mocking `localStorage` — a critical, recurring pattern

Code that reads/writes `localStorage` is **impossible to test reliably** without mocking it — real browser storage state leaks between tests and pages ("flaky tests" that pass or fail depending on what's currently saved).

```js
describe("test suite: addToCart", () => {
  beforeEach(() => {
    spyOn(localStorage, "setItem"); // block real writes
    spyOn(localStorage, "getItem").and.callFake(() => {
      // control what's "read"
      return null; // or JSON.stringify([...]) for a specific starting cart
    });
    loadFromStorage(); // re-run so the module's state picks up the mock
  });

  it("adds a new product to the cart", () => {
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("adds an existing product to the cart", () => {
    localStorage.getItem.and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });
    loadFromStorage();

    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(2);
  });
});
```

**Why the order matters:** a mock only takes effect _after_ it's created. If a module runs a side effect (like auto-loading from `localStorage`) at **import time**, that happens before any `spyOn` exists in your test — so the fix is to wrap that side effect in an exported function (`loadFromStorage()`) and **call it again inside the test**, after mocking, so it re-runs under the mock.

### Refactor this lesson introduces: extracting side effects into a callable function

```js
// Before: runs automatically on import — untestable in isolation
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// After: wrapped so tests can control exactly when/how it runs
export let cart;
export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}
loadFromStorage(); // still runs once for real usage
```

This single change is what makes the module properly testable — a good general rule: **any code that runs automatically at module load time (especially I/O like `localStorage`) should be wrapped in an exported function**, so tests can re-trigger it under controlled conditions.

### Test coverage strategy

For code with an `if`/`else`, aim to test **each branch**:

```js
// addToCart has an if/else — so we write (at least) two tests:
it("adds a new product to the cart", () => {
  /* tests the "else" branch */
});
it("adds an existing product to the cart", () => {
  /* tests the "if" branch */
});
```

This is called maximizing **test coverage** — how much of the code's logic paths are actually exercised by tests.

### Unit tests vs. integration tests

- **Unit test** — tests one isolated function (`formatCurrency`, `addToCart`).
- **Integration test** — tests multiple pieces working together, e.g. rendering an entire page section (`renderOrderSummary()`), which itself calls the DOM, other modules, and formatting utilities.

### Integration test example — testing a rendered section of the page

```js
describe("test suite: renderOrderSummary", () => {
  const productId1 = "54e397d8-...";
  const productId2 = "15b6fc6f-...";

  beforeEach(() => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        { productId: productId1, quantity: 2, deliveryOptionId: "1" },
        { productId: productId2, quantity: 1, deliveryOptionId: "2" },
      ]);
    });
    spyOn(localStorage, "setItem");
    loadFromStorage();

    document.querySelector(".js-test-container").innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
    `;

    renderOrderSummary();
  });

  it("displays the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2,
    );

    const quantityLabel1 = document.querySelector(
      `.js-product-quantity-${productId1}`,
    );
    expect(quantityLabel1.innerText).toContain("Quantity: 2");

    document.querySelector(".js-test-container").innerHTML = ""; // cleanup
  });

  it("removes a product", () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();

    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      1,
    );
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`),
    ).toEqual(null);
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`),
    ).not.toEqual(null);

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);

    document.querySelector(".js-test-container").innerHTML = ""; // cleanup
  });
});
```

Key integration-testing techniques used here:

- A dedicated **`.js-test-container`** element in `tests.html` isolates generated test markup from Jasmine's own results UI.
- Since `renderOrderSummary()` also calls `renderPaymentSummary()` internally (MVC re-render), the container must include **both** target elements (`.js-order-summary` and `.js-payment-summary`) or the code throws `Cannot set properties of null`.
- `.click()` on a real DOM element simulates a user interaction end-to-end — event listener, model update, and re-render all get exercised together.
- Both DOM state (`querySelector` checks) **and** underlying data state (`cart` array checks) are verified — an integration test checks both "how the page looks" and "how the page behaves."
- Cleanup (`innerHTML = ''`) after each test keeps the results page readable and prevents one test's leftover markup from affecting the next.

### Using `beforeEach` to eliminate duplicated setup

Since almost every test needs the same mocked storage + rendered container, that setup was consolidated into a single `beforeEach` — removing repetition and making each `it()` block focus purely on its own assertions. Variables needed by both the hook and the tests (like `productId1`) must be declared in the **outer `describe` scope**, not inside the hook, so both can see them.

## Key takeaways

- **Manual testing** is fast for spot checks but doesn't scale — hard to cover edge cases or re-verify after changes.
- **Automated testing** = code testing code; a **test framework** (Jasmine) automates naming, grouping, running, and reporting.
- Core Jasmine API: `describe` (suite) → `it` (test) → `expect(...).toMatcher(...)` (assertion).
- **`spyOn` + `.and.callFake()`** mocks out side-effecting APIs like `localStorage` — essential for deterministic, non-flaky tests.
- Any module code that runs automatically on import (especially reading storage) should be refactored into an **exported, callable function** so tests can control exactly when it runs.
- Aim to test **every branch** of conditional logic (test coverage).
- **Unit tests** check one function in isolation; **integration tests** check multiple pieces (DOM + data + logic) working together.
- `beforeEach`/`afterEach` hooks remove duplicated setup/cleanup code across tests.
- Testing is folded into the standard workflow: **change code → re-run tests → commit to git.**
