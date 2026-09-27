# Milestone 2 — Functions, Objects, the DOM & Styling Projects

Covers lessons 07–10: functions, objects (+ JSON & localStorage), the DOM, and combining HTML/CSS/JS to finish real projects.

## Contents

1. [Functions](#lesson-7--functions)
2. [Objects](#lesson-8--objects)
3. [The DOM (Document Object Model)](#lesson-9--the-dom-document-object-model)
4. [CSS, File Organization & Finishing the Projects](#lesson-10--css-file-organization--finishing-the-projects)

---

# Lesson 7 — Functions

## What is a function?

A **function** lets us reuse a block of code instead of writing it out repeatedly.

```js
function functionOne() {
  console.log("hello");
  console.log(2 + 2);
}
```

- `function` creates a function; `functionOne` is its name (camelCase, verb-based names are best, e.g. `pickComputerMove`).
- The code inside `{ }` is the **function body**.
- **Important:** writing this code only _creates_ the function — it does not run it.

To actually run it, we **call** (or "invoke") the function:

```js
functionOne(); // runs the code inside
functionOne(); // can call it again as many times as we want
```

## Why use functions?

Reusing code means:

- Less duplication
- Easier updates — fix the logic in **one place** instead of everywhere it's copy-pasted

### Example — Rock Paper Scissors cleanup

Before: the same "pick a random computer move" code was repeated in all 3 buttons.
After:

```js
function pickComputerMove() {
  const randomNumber = Math.random();
  let computerMove = "";
  if (randomNumber < 1 / 3) {
    computerMove = "rock";
  } else if (randomNumber < 2 / 3) {
    computerMove = "paper";
  } else {
    computerMove = "scissors";
  }
  return computerMove;
}
```

Now every button just calls `pickComputerMove()`.

## Functions create a scope

Just like `if` statements, a function's `{ }` creates a **scope**. Variables declared inside only exist inside.

```js
function pickComputerMove() {
  const computerMove = "rock"; // only exists in here
}
console.log(computerMove); // ❌ ReferenceError
```

Two ways to get a value out:

1. **Global variable** — declare it outside the function (works, but riskier — can cause naming conflicts)
2. **Return statement** — the preferred, safer approach (keeps the scope clean)

## Return statements

A `return` statement sends a value **out** of a function, back to where it was called.

```js
function calculate() {
  return 5;
}
const result = calculate(); // result = 5
```

Rules:

- `return` can send back any value — a number, string, calculation, variable, etc.
- If there's no `return` (or `return;` with nothing after it), the function gives back `undefined`.
- `return` **immediately ends** the function — no code after it runs.

```js
function pickComputerMove() {
  const randomNumber = Math.random();
  let computerMove = "";
  if (randomNumber < 1 / 3) {
    computerMove = "rock";
  } else if (randomNumber < 2 / 3) {
    computerMove = "paper";
  } else {
    computerMove = "scissors";
  }
  return computerMove; // gets the move out of the function's scope
}

const computerMove = pickComputerMove(); // saved outside, safely
```

## Parameters — putting values _into_ a function

While `return` gets a value **out**, a **parameter** lets us put a value **in**.

```js
function calculateTax(cost) {
  console.log(cost * 0.1);
}

calculateTax(2000); // cost = 2000 → logs 200
calculateTax(5000); // cost = 5000 → logs 500
```

- The value passed in when calling the function (`2000`) is called the **argument**.
- The variable receiving it inside the function (`cost`) is the **parameter**.
- Parameters exist only inside the function's scope — just like any local variable.

### Multiple parameters

```js
function calculateTax(cost, taxPercent) {
  console.log(cost * taxPercent);
}
calculateTax(2000, 0.2); // 20% tax
```

If you don't pass a value for a parameter, it becomes `undefined`.

### Default parameter values

```js
function calculateTax(cost, taxPercent = 0.1) {
  console.log(cost * taxPercent);
}
calculateTax(5000); // uses default 0.1 → 500
```

## Combining parameters + return: reusing Rock Paper Scissors logic

```js
function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = "";
  if (playerMove === "scissors") {
    // compare & set result
  } else if (playerMove === "paper") {
    // compare & set result
  } else if (playerMove === "rock") {
    // compare & set result
  }

  alert(
    `You picked: ${playerMove}, Computer picked: ${computerMove}, Result: ${result}`,
  );
}
```

Now each button just calls: `playGame('rock')`, `playGame('paper')`, `playGame('scissors')`.

## Functions calling other functions

Functions can call each other. Tracing through the code step by step (called **tracing**) helps you follow the jumps:

```
button click → playGame('rock') → pickComputerMove() runs → returns a move
             → back in playGame → compares moves → shows alert
```

## Key takeaways

- `function name() { }` creates a reusable block of code — it doesn't run until you **call** it with `name()`.
- Functions create their own **scope** — use `return` (not global variables) to get values out safely.
- **Parameters** let you pass values _into_ a function; the passed value is called an **argument**.
- Parameters can have **default values** (`param = value`).
- `alert()` and `Math.random()` are themselves functions — this is code we've been using since lesson 1!

## Try it yourself

- Write a function `square(n)` that returns `n * n`.
- Write a function `greet(name = 'friend')` that logs `Hello, name!` — try calling it with and without an argument.
- Refactor any repeated code you've written so far into a function with parameters.

---

# Lesson 8 — Objects

## What is an object?

An **object** groups multiple related values together.

```js
const product = {
  name: "socks",
  price: 1090,
};
```

- Each `key: value` pair is called a **property-value pair**.
- Access a value with **dot notation**: `product.name` → `'socks'`.
- Change a value: `product.name = 'cotton socks';`
- Add a new property: `product.newProperty = true;`
- Delete a property: `delete product.newProperty;`
- `typeof product` → `'object'`

## Why use objects?

- Groups related data together (instead of many separate variables)
- Lets you work with multiple values as a single unit (e.g. log the whole object at once)

## Bracket notation

An alternative way to access/set properties:

```js
product["name"]; // same as product.name
product["delivery-time"] = "1 day"; // needed because "-" breaks dot notation (looks like subtraction)
```

Use **dot notation by default** — it's shorter and easier to read. Switch to **bracket notation** when:

- The property name has special characters (like `-`)
- You need to use a variable or expression as the property name

## Nested objects & methods

Objects can contain **any** type of value — including other objects and functions:

```js
const product = {
  name: "shirt",
  rating: {
    stars: 4.5,
    count: 87,
  },
  fun: function () {
    console.log("function inside object");
  },
};

product.rating.count; // 87 — access nested values by chaining
product.fun(); // calling a function stored in an object = calling a "method"
```

A function stored inside an object is called a **method**. We've been using methods the whole course:

- `console.log()` → `log` is a method on the built-in `console` object
- `Math.random()` → `random` is a method on the built-in `Math` object

## Practical example — adding a score to Rock Paper Scissors

```js
const score = {
  wins: 0,
  losses: 0,
  ties: 0,
};

if (result === "You win") {
  score.wins += 1;
} else if (result === "You lose") {
  score.losses += 1;
} else if (result === "Tie") {
  score.ties += 1;
}
```

The `score` object is declared **outside** any function so it persists across multiple plays (functions would reset it every call).

## Built-in objects: JSON

**JSON** (JavaScript Object Notation) is a _syntax_ similar to JS objects but more universal — understood by nearly every language. Differences from JS objects:

- Property names and strings **must** use double quotes
- No functions allowed

```js
JSON.stringify(product); // converts a JS object → JSON string
JSON.parse(jsonString); // converts a JSON string → JS object
```

We use JSON when sending data between systems, or when saving data to storage (since storage only accepts strings).

## Built-in objects: localStorage

Variables disappear when you refresh the page. **localStorage** persists data even after a refresh or closing the browser.

```js
localStorage.setItem("score", JSON.stringify(score)); // save (must be a string!)
const savedScore = JSON.parse(localStorage.getItem("score")); // load back as an object
localStorage.removeItem("score"); // delete
```

### Handling missing data

If nothing's saved yet, `getItem` returns `null`. Trying to use `null` like an object causes an error — so provide a fallback:

```js
let score = JSON.parse(localStorage.getItem("score"));

// Shortcut using the "default operator" (||) from the booleans lesson:
score = score || { wins: 0, losses: 0, ties: 0 };
```

`null` is falsy, so `||` swaps in the default object automatically when there's nothing saved.

## `null` vs `undefined`

Both represent "no value," but:

- `undefined` = a value was never set
- `null` = **intentionally** set to empty (e.g. you explicitly cleared it)

## Autoboxing

Simple values like strings also have properties/methods, thanks to a JS feature called **autoboxing** (JS automatically wraps the value in a temporary object):

```js
"hello".length; // 5
"hello".toUpperCase(); // 'HELLO'
```

(Doesn't work with `null`/`undefined`.)

## ⚠️ Objects are references

Assigning an object to a variable stores a **reference** (like a shortcut/pointer), not a copy of the actual data.

```js
const objectOne = { message: "hello" };
const objectTwo = objectOne; // copies the REFERENCE, not the object

objectTwo.message = "good job";
console.log(objectOne.message); // 'good job' — same underlying object!
```

Implications:

- `const` prevents reassigning the _variable_ — but you can still change the object's contents.
- Comparing two separately-created objects with `===` is always `false`, even with identical contents — you're comparing references, not values.

```js
const objectThree = { message: "good job" };
objectThree === objectOne; // false — different objects in memory
objectTwo === objectOne; // true  — same reference
```

## Handy object shortcuts

**Destructuring** — pull properties straight into variables:

```js
const { message, price } = product;
// same as: const message = product.message; const price = product.price;
```

**Shorthand property** — when the variable name matches the property name:

```js
const message = "hi";
const obj = { message }; // same as { message: message }
```

**Shorthand method** — skip the `function` keyword and function name:

```js
const obj = {
  method() {
    console.log("method");
  },
};
```

## Key takeaways

- Objects group related values with `key: value` pairs; access with `.` (dot) or `[]` (bracket) notation.
- A function stored in an object is called a **method**.
- `JSON.stringify()` / `JSON.parse()` convert between JS objects and JSON strings — needed for `localStorage`.
- `localStorage.setItem/getItem/removeItem` persists data across page reloads.
- Objects are **references** — copying a variable copies the pointer, not the data; `===` compares references.
- Shortcuts: destructuring, shorthand properties, shorthand methods.

## Try it yourself

- Create a `user` object with `name`, `age`, and a nested `address` object; access a nested value.
- Save a `user` object to `localStorage`, refresh the page, and load it back.
- Predict (then test) what happens when you compare two objects with identical properties using `===`.

---

# Lesson 9 — The DOM (Document Object Model)

## What is the DOM?

The **DOM** is a built-in object called `document` that represents the web page. Because it's _linked_ to the actual page, changing its properties changes what you see on screen.

```js
document.body.innerHTML = "hello"; // wipes the page, replaces with "hello"
document.title = "good job"; // changes the browser tab text
```

This is the same code from Lesson 1 — now it makes full sense as **object + dot notation + property**.

## `document.body`

Getting `document.body` pulls the actual `<body>` HTML element into your JavaScript as an object:

```js
document.body; // the <body> element, now usable as a JS object
typeof document.body; // 'object'
document.body.innerHTML; // gets all HTML inside <body>
document.body.innerHTML = "<button>Good job</button>"; // replaces it
```

This is the core idea of the DOM: **HTML elements become JavaScript objects**, giving JS full control of the page.

## `document.querySelector()`

Gets **any** element from the page (not just `body`) and returns it as a JS object.

```js
document.querySelector("button"); // gets the FIRST <button> on the page
document.querySelector(".js-score"); // "." means "select by class" — gets the element with class="js-score"
```

Every element gotten this way has properties like:

```js
element.innerHTML; // HTML inside the element
element.innerText; // just the text, no extra whitespace/newlines (safer for exact string comparisons)
```

Save it in a variable for reuse:

```js
const buttonElement = document.querySelector(".js-subscribe-button");
```

> Convention: name classes used only for JS targeting with a `js-` prefix (e.g. `js-score`) to separate them from CSS-only classes.

## Practical pattern — YouTube-style subscribe button

```js
function subscribe() {
  const buttonElement = document.querySelector(".js-subscribe-button");

  if (buttonElement.innerText === "Subscribe") {
    buttonElement.innerHTML = "Subscribed";
  } else {
    buttonElement.innerHTML = "Subscribe";
  }
}
```

```html
<button class="js-subscribe-button" onclick="subscribe()">Subscribe</button>
```

## Events & event listeners

`onclick` is one **event listener** — code that runs when an **event** happens. Another useful one: `onkeydown`, which fires when a key is pressed.

```html
<input
  class="js-cost-input"
  onkeydown="handleCostKeydown(event)"
  placeholder="Cost of order"
/>
```

```js
function handleCostKeydown(event) {
  if (event.key === "Enter") {
    calculateTotal();
  }
}
```

- Event listeners receive a special `event` object with details about what happened (e.g. `event.key`).
- Pass it into your function as a **parameter**.

## Working with `<input>` elements

Input boxes don't use `innerHTML` — they use the **`value`** property:

```js
const inputElement = document.querySelector(".js-cost-input");
const cost = inputElement.value; // gets the text typed in the box
```

⚠️ **`value` is always a string**, even if the user typed numbers. Doing math directly causes bugs (type coercion glues strings together instead of adding):

```js
"25" + 10; // '2510'  ❌ — string concatenation, not math!
```

Fix it with the built-in `Number()` function:

```js
const cost = Number(inputElement.value); // now it's an actual number
const cost = +inputElement.value; // unary operator + to convert a string to a number
```

The reverse conversion also exists: `String(25)` → `'25'`.

## Key takeaways

- `document` is a built-in object linking JS to the live web page — this is the **DOM**.
- `document.querySelector('selector')` gets any element; `.` prefix = class selector.
- `innerHTML` reads/writes HTML inside an element; `innerText` reads/writes just the text (no stray whitespace); `value` is for `<input>` elements.
- Values from the page (like `input.value`) are always **strings** — convert with `Number()` before doing math.
- `onclick`, `onkeydown` etc. are event listeners; they can receive an `event` object with details like `event.key`.
- `window` is the built-in object representing the browser itself — `document`, `console`, and `alert` all live inside it (JS lets us drop the `window.` prefix as a shortcut).

## Try it yourself

- Build a simple counter: a button that increases a number shown on the page each time it's clicked.
- Build a text input that shows "Please enter something" if you press Enter while it's empty.
- Try `document.querySelector('body')` vs `document.body` — confirm they return the same thing.

---

# Lesson 10 — CSS, File Organization & Finishing the Projects

This lesson focuses on **styling** the DOM projects with CSS, and organizing code into separate files.

## Styling with classes

Add a dedicated CSS-only class alongside any JS-targeting class (elements can have multiple classes, space-separated):

```html
<button class="js-subscribe-button subscribe-button">Subscribe</button>
```

```css
.subscribe-button {
  border: none;
  background-color: black;
  color: white;
  padding: 15px;
  font-weight: bold;
  border-radius: 50px; /* very high value = fully rounded */
  cursor: pointer; /* hand icon on hover */
}
```

## Useful CSS properties covered

| Property                                    | Purpose                                     |
| ------------------------------------------- | ------------------------------------------- |
| `background-color` / `color`                | background / text color                     |
| `padding`                                   | space **inside** an element                 |
| `margin`                                    | space **outside** an element                |
| `border`                                    | `width style color`, e.g. `3px solid white` |
| `border-radius`                             | rounds corners (pixels = roundness)         |
| `font-family` / `font-size` / `font-weight` | text styling                                |
| `cursor: pointer`                           | hand icon on hover                          |
| `width` / `height`                          | exact element size                          |

**Padding/margin shorthand:**

```css
padding: 10px; /* all sides */
padding: 12px 15px; /* vertical horizontal */
padding: 10px 12px 14px 16px; /* top right bottom left [clockwise] */
```

Tip: You can copy exact colors/values from a reference design using DevTools → Elements tab → inspect the element → read its computed styles.

## Toggling styles with JavaScript: `classList`

Every DOM element has a `classList` property with methods to add/remove classes dynamically:

```js
buttonElement.classList.add("is-subscribed"); // add a class
buttonElement.classList.remove("is-subscribed"); // remove a class
```

```css
.is-subscribed {
  background-color: gray;
  color: black;
}
```

This is how the subscribe button toggles color when clicked — no need to hardcode every style change in JS.

## Loading images

```html
<img src="images/rock-emoji.png" class="move-icon" />
```

- `<img>` is a **void element** (no closing tag).
- `src` supports **file paths** — `images/rock-emoji.png` looks inside a folder called `images`.

## Rock Paper Scissors, styled

Key CSS ideas applied to the final game:

- `background-color: transparent` — buttons blend into the page background
- `border: 3px solid white` + `border-radius: 60px` — circular buttons
- `width`/`height` (not padding) for consistent button sizing when content (images) varies in size
- `margin-right` between buttons for spacing

## Organizing code into separate files

Mixing HTML, CSS, and JS in one file gets messy. Split them:

**JavaScript → its own `.js` file:**

```html
<script src="scripts/rock-paper-scissors.js"></script>
```

- Move all JS code into `scripts/rock-paper-scissors.js`.
- `<script src="...">` loads and runs it — same idea as `<img src="...">`.
- You can have **multiple** `<script>` tags; they run top to bottom.

**CSS → its own `.css` file, using `<link>`:**

```html
<link rel="stylesheet" href="styles/rock-paper-scissors.css" />
```

- `rel="stylesheet"` tells the browser what kind of file it's loading.
- `href` supports file paths, just like `src`.
- `<link>` is a void element (no closing tag).
- You can use **multiple** `<link>` tags to load several CSS files.

### Why separate files?

- Each file only contains **one language** — easier to read.
- Smaller files overall, less scrolling.
- This is the standard way real-world websites are structured.

## Key takeaways

- Use a dedicated CSS class (separate from any `js-` class) to style elements — keeps JS targeting and CSS styling independent.
- `classList.add()` / `classList.remove()` toggle styles dynamically from JavaScript.
- Core CSS box-model properties: `padding` (inside), `margin` (outside), `border`, `border-radius`, `width`/`height`.
- `<img src="...">` loads images; `src`/`href` support folder paths.
- Split real projects into `.html`, `.css`, and `.js` files, connected via `<script src="...">` and `<link rel="stylesheet" href="...">`.

## Try it yourself

- Style a button so it changes color and rounds its corners when clicked, using `classList`.
- Move any project you've built into separate `.html`, `.css`, and `.js` files.
- Add an image to a page using a relative folder path (e.g. `images/photo.png`).
