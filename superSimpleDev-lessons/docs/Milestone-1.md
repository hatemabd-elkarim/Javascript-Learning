# Milestone 1 — JavaScript Basics

Covers lessons 1–3 (JS basics, numbers & math, strings) and 04–06 (HTML/CSS/JS integration, variables, booleans & if statements).

## Contents

1. [What is JavaScript?](#lesson-1--what-is-javascript)
2. [Numbers & Math](#lesson-2--numbers--math)
3. [Strings (Text)](#lesson-3--strings-text)
4. [HTML, CSS & JavaScript Working Together](#lesson-4--html-css--javascript-working-together)
5. [Variables](#lesson-5--variables)
6. [Booleans & If Statements](#lesson-6--booleans--if-statements)

---

# Lesson 1 — What is JavaScript?

## The three web technologies

A website is built with three technologies working together:

| Technology     | Job                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **HTML**       | Creates the _content_ (buttons, text, images)                                                     |
| **CSS**        | Changes the _appearance_ (colors, layout, fonts)                                                  |
| **JavaScript** | Makes the website _interactive_ (things happen when you click, type, etc. without page reloading) |

Without JavaScript, buttons on a page don't actually _do_ anything when clicked.

## The core idea

JavaScript is just **giving instructions to a computer**, and the computer follows them one by one.

- The instructions = **code**
- Making the computer follow them = **running the code**
- The rules you must follow when writing code = **syntax**

## Where to write and run code (for now)

While learning the very basics, you can run JS directly in the browser:

1. Right-click any webpage → **Inspect**
2. Click the **Console** tab
3. Type code and press **Enter** to run it

> Later on we'll run JS from actual files instead of the console — the console is just great for quick experiments.

## Your first lines of code

```js
alert("hello");
```

Pops up a message box with the text "hello".

```js
alert("good job");
```

Same instruction, different text — shows what changing the text inside the quotes does.

```js
2 + 2; // 4
10 - 3; // 7
```

JavaScript can do math directly.

```js
document.body.innerHTML = "hello";
```

This wipes the whole page and replaces it with the text "hello". This shows JS can **modify a webpage** — one of its most important powers, and something we'll use constantly.

## Syntax matters — exactly

JavaScript is very strict about syntax. Every bracket, quote, and semicolon has a job. If you leave one out:

```js
alert('hello';   // ❌ missing closing bracket → SyntaxError
```

The computer won't guess what you meant — unlike English, there's no room for "close enough."

## Key takeaways

- JS = instructions for the computer to run, in order.
- **Code** → written instructions. **Running code** → computer executes them.
- **Syntax** = the exact rules of the language (brackets, quotes, semicolons...).
- The console (in DevTools) is a quick playground to try JS on any webpage.
- `alert()` shows a popup; `document.body.innerHTML = '...'` replaces page content.

## Try it yourself

- Open the console on any website and make it say "hi" in a popup.
- Change `document.body.innerHTML` to your own name.
- Try removing a bracket or quote on purpose and read the error message — get comfortable with errors, they're normal!

---

# Lesson 2 — Numbers & Math

## Basic operators

```js
2 + 2; // 4  (add)
10 - 3; // 7  (subtract)
10 * 3; // 30 (multiply — star)
10 / 2; // 5  (divide — forward slash)
```

Math works the same as you'd write it on paper, and you can chain multiple numbers:

```js
2 + 2 + 2; // 6
2.2 + 2.2; // 4.4  — decimals work too
```

## Order of operations

JavaScript follows normal math rules:

1. **Brackets** `()` first
2. **Multiply / divide** next (left to right)
3. **Add / subtract** last (left to right)

```js
1 +
  1 *
    3(
      // 4  → multiply happens first (1*3=3, then +1)
      1 + 1,
    ) *
    3; // 6  → brackets force the addition first
```

Use brackets whenever you want to control _what happens first_.

## ⚠️ Floating point numbers are sometimes inaccurate

- Whole numbers (2, 3, 4) = **integers**
- Decimal numbers (2.2, 2.5) = **floats**

Computers store numbers in binary (0s and 1s), and some decimals just can't be stored exactly:

```js
0.1 + 0.2; // 0.30000000000000004
```

This isn't a JS bug — most programming languages have this issue.

### Best practice for money: calculate in cents

```js
// ❌ inaccurate
20.95 +
  7.99(
    // ✅ accurate — work in cents, then convert back to dollars
    2095 + 799,
  ) /
    100;
```

## Rounding: `Math.round()`

```js
Math.round(2.2); // 2
Math.round(2.8); // 3
```

Combine it with the cents trick to round money precisely:

```js
Math.round((2095 + 799) * 0.1) / 100;
// 1. calculate in cents
// 2. round to the nearest cent
// 3. divide by 100 to get dollars
```

Note: `Math.round` has a **capital M** — JavaScript is case-sensitive!

## Percentages

There's no `%` operator for "percent of" — you calculate it manually:

```js
// 10% = 10/100 = 0.1
36.93 * 0.1; // 10% of 36.93
```

## Key takeaways

- `+ - * /` work like normal math; order of operations applies (`()` → `* /` → `+ -`).
- Floats can be inaccurate — for money, **calculate in cents, then divide by 100**.
- `Math.round(x)` rounds to the nearest whole number.
- To get a percentage, multiply by the decimal form (10% → `0.1`).
- Googling "javascript how to \_\_\_" is a completely normal and expected part of coding.

## Try it yourself

- Calculate the total of 3 items at $12.49 each, correctly rounded to the cent.
- Predict the result of `2 + 3 * (4 - 1)` before running it, then check.
- Calculate 15% tax on a $49.99 item.

---

# Lesson 3 — Strings (Text)

A **string** represents text. You've actually already used one: `alert('hello')` — `'hello'` is a string.

## Three ways to create a string

```js
"hello"; // single quotes  ✅ default choice
"hello" // double quotes  — useful if the text has a ' inside
`hello`; // backticks      — "template strings", extra features (below)
```

### Why double quotes sometimes help

```js
'I'm learning JavaScript'   // ❌ breaks — the ' inside ends the string early
"I'm learning JavaScript"   // ✅ works
```

### Or use an escape character

```js
'I\'m learning JavaScript'; // ✅ \' means "just a quote, not the end of the string"
```

Common escape characters:
| Code | Meaning |
|---|---|
| `\'` | a literal single quote |
| `\"` | a literal double quote |
| `\n` | new line |

## Combining strings (concatenation)

```js
"sum" + "text"; // 'sumtext'
"sum" + " " + "more"; // 'sum more'
```

## Mixing strings and numbers (type coercion)

```js
"hello" + 3; // 'hello3'
```

When you add a string and a number, JS automatically converts the number into text first. This is called **type coercion**. It's convenient, but can bite you:

```js
"$" + 20.95 + 7.99; // '$20.957.99'  ❌ — not math, just text stuck together!
"$" + (20.95 + 7.99); // '$28.94'      ✅ — brackets force the math first
```

Strings follow the **same order of operations** as numbers — brackets are always calculated first.

## Template strings & interpolation (the modern way)

Instead of gluing strings and numbers with `+`, use backticks and `${}`:

```js
const quantity = 2;
const total = 28.94;

// Old way (concatenation)
"Items (" + quantity + "): $" + total;

// New way (interpolation) — cleaner!
`Items (${quantity}): $${total}`;
```

You can put any expression inside `${...}`, including calculations:

```js
`Total: $${(2095 + 799) / 100}`;
```

## Multi-line strings

Only template strings can span multiple lines directly:

```js
`line one
line two`;
```

## Checking a value's type

```js
typeof 2; // 'number'
typeof "hello"; // 'string'
```

## Key takeaways

- A string = text, wrapped in `'single'`, `"double"`, or `` `backticks` ``.
- Use **single quotes by default**; double quotes when the text has a `'`; backticks when you need to insert values or multiple lines.
- `+` on strings joins text; `+` on a string and number converts the number to text (type coercion).
- Use `${expression}` inside backticks for clean value insertion — this is called **interpolation**.
- `typeof value` tells you what kind of value you're working with.

## Try it yourself

- Build the string `"Cart: 3 items, Total: $45.50"` using interpolation and a real calculation.
- Try writing a sentence with an apostrophe using all three quoting methods (single+escape, double, backtick).

---

# Lesson 4 — HTML, CSS & JavaScript Working Together

So far we ran JS in the browser console. Real websites run JS from **files**. This lesson connects the dots between HTML, CSS, and JS.

## Tools you need

- **Google Chrome** (or any browser) — to view websites
- **VS Code** — a code editor, for writing HTML/CSS/JS files

## Quick HTML review

HTML uses **tags** to create **elements**:

```html
<button>Hello</button>
<p>A paragraph of text</p>
```

- `<button>` = opening tag, `</button>` = closing tag
- Elements can be **nested** (an element inside another element)
- Multiple spaces/new lines in HTML collapse into a single space on the page — so we use indentation freely to keep code readable without affecting the output.

### The standard HTML structure

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
    <style>
      /* CSS goes here */
    </style>
  </head>
  <body>
    <!-- visible content goes here -->
    <script>
      // JavaScript goes here
    </script>
  </body>
</html>
```

- `<!DOCTYPE html>` tells the browser to use modern HTML.
- `<head>` = info about the page (not visible), e.g. `<title>`, `<style>`.
- `<body>` = everything visible on the page.

## Quick CSS review

```html
<style>
  button {
    background-color: red;
    color: white;
    border: none;
  }
</style>
```

- `button` here is the **selector** — which elements to style.
- `background-color`, `color`, `border` are **properties**; the text after `:` is the **value**.

### Styling specific elements with `class`

```html
<button class="red-button">Buy</button>
```

```css
.red-button {
  background-color: red;
}
```

The `.` in the CSS selector means "select by class."

## Running JavaScript from a file

### Option 1: the `<script>` element

```html
<body>
  <button>Hello</button>

  <script>
    alert("hello");
  </script>
</body>
```

We put `<script>` near the **bottom of `<body>`** so the page's content loads first, then JS runs.

### Option 2: the `onclick` attribute

```html
<button onclick="alert('good job')">Click me</button>
```

This code runs **only when the button is clicked**.

## Comments (code the computer ignores)

```js
// This is a single-line comment in JavaScript

/* This is a
   multi-line comment */
```

```html
<!-- This is an HTML comment -->
```

```css
/* This is a CSS comment (same syntax as JS multi-line) */
```

Comments are useful for:

- Explaining what a piece of code does
- **Commenting out** code you want to disable temporarily without deleting it

## `console.log()` — seeing results from a file

When code runs inside a **file** (not the console), results don't automatically show up anywhere. `console.log()` sends a value to the console so you can inspect it:

```js
console.log(2 + 2); // 4
console.log("sum" + "text"); // 'sumtext'
```

## Handy VS Code setup

- Use **2 spaces** per indent (standard for HTML/CSS/JS)
- Install the **Live Server** extension — auto-refreshes your page whenever you save a file
- Turn on **word wrap** so long lines don't force horizontal scrolling

## Key takeaways

- HTML = content, CSS = appearance, JS = interactivity — and they all live together in one `.html` file for now.
- Standard structure: `<!DOCTYPE html><html><head>...</head><body>...</body></html>`
- Run JS with `<script>` (runs on page load) or `onclick="..."` (runs on click).
- Comments (`//`, `/* */`, `<!-- -->`) are ignored by the computer — use them to explain code or disable it temporarily.
- `console.log()` is how you "see" values when JS is running from a file instead of the console.

## Try it yourself

- Build a page with 3 buttons, each styled with a different class and color.
- Make one button show an `alert`, and use `console.log` to print a message when the page first loads.

---

# Lesson 5 — Variables

A **variable** is a container that stores a value (a number, string, etc.) so you can use it later.

## Creating a variable

```js
let variableOne = 3;
console.log(variableOne); // 3
```

- `let` creates the variable
- `variableOne` is its name
- `= 3` saves the value `3` inside it (this is called **assigning**)

Variables can hold the result of a calculation too:

```js
let calculation = 2 + 2; // 4
let result = calculation + 2; // 6 — reuses the variable's value
```

And strings:

```js
let message = "hello";
```

## Naming rules

- Can't use reserved words (`let`, etc.) as a name.
- Can't start with a number (`1name` ❌, `name1` ✅).
- No spaces or most special characters — except `$` and `_`.

## Reassigning a variable (changing its value later)

```js
let variableOne = 3;
variableOne = 5; // no "let" this time — that would try to create a new variable
```

- **Assigning** = giving it a value the first time.
- **Reassigning** = changing that value later. Don't repeat `let`/`const`.

## Semicolons

A semicolon `;` marks the end of an instruction — like a period ends a sentence. JS _can_ auto-insert missing semicolons, but it's best practice to always write them yourself to avoid subtle bugs.

## Shorthand for updating a variable

```js
cartQuantity = cartQuantity + 2; // long way
cartQuantity += 2; // shorthand
cartQuantity++; // shorthand for "+= 1"
```

Same idea exists for `-=`, `*=`, `/=`, and `--`.

## Naming conventions

| Style         | Example         | Used in                                          |
| ------------- | --------------- | ------------------------------------------------ |
| **camelCase** | `cartQuantity`  | ✅ Standard for JS variables                     |
| PascalCase    | `CartQuantity`  | Used for a specific JS feature (later in course) |
| kebab-case    | `cart-quantity` | HTML, CSS, file names                            |
| snake_case    | `cart_quantity` | Not really used in JS                            |

Pick names that are clear but not overly long: `cartQuantity` ✅, not `c` (too vague) or `quantityOfProductsInTheCart` (too long).

## Three ways to declare a variable

```js
const variableTwo = 3; // ✅ default choice — value can't be reassigned later
let variableOne = 3; // use only when you know you'll reassign it
var variableThree = 3; // ❌ old way — avoid in new code (has scope quirks, covered next lesson)
```

**Best practice:** use `const` by default. Only switch to `let` if you know the value needs to change later. This makes code easier to reason about.

```js
const x = 5;
x = 10; // ❌ TypeError: Assignment to constant variable.
```

## Mini project idea: cart quantity tracker

```js
let cartQuantity = 0;

function addToCart(amount) {
  cartQuantity += amount;
  console.log(`Cart quantity: ${cartQuantity}`);
}
```

_(We haven't covered functions yet — for now this pattern is just `cartQuantity += n` triggered from an `onclick` attribute, same idea as Lesson 4.)_

## Key takeaways

- `let` and `const` create variables; `const` can't be reassigned, `let` can.
- Default to `const`; use `let` only when the value must change.
- Avoid `var` in new code.
- camelCase is the JS naming standard.
- Shorthand operators: `+=`, `-=`, `*=`, `/=`, `++`, `--`.

## Try it yourself

- Create a `let` variable for a shopping cart total, then add 3 items to it one at a time using `+=`.
- Try reassigning a `const` variable and read the error message.
- Rewrite `x = x + 1` two different shorter ways.

---

# Lesson 6 — Booleans & If Statements

## Booleans

A **boolean** is a value that's either `true` or `false` — nothing else. It represents whether something _is_ or _isn't_ the case.

```js
true;
false;

typeof true; // 'boolean'
```

⚠️ Don't quote them — `'true'` is a **string**, not a boolean.

## Comparison operators

Comparing two values produces a boolean:

```js
3 < 5; // true
3 > 5; // false
3 >= 5;
3 <= 5;
5 === "5"; // false — different types, no conversion
5 == "5"; // true  — converts types first, avoid this!
5 !== "5"; // true
```

**Always use `===` and `!==`** (triple) instead of `==`/`!=` (double). Double-equals silently converts types, which can hide bugs.

## Logical operators

Combine booleans together:

```js
true && true; // AND — true only if both sides are true
true || false; // OR  — true if at least one side is true
!true; // NOT — flips true ↔ false
```

Example — checking if a number is in a range:

```js
const n = 0.2;
n >= 0 && n < 1 / 3; // true — n is between 0 and 1/3
```

## If statements

Lets your code choose which block to run based on a condition.

```js
if (age >= 16) {
  console.log("You can drive");
} else {
  console.log("You cannot drive");
}
```

Add more conditions with `else if`:

```js
if (age >= 16) {
  console.log("You can drive");
} else if (age >= 14) {
  console.log("Almost there");
} else {
  console.log("You cannot drive");
}
```

JS checks conditions **top to bottom** and runs the first branch that's true.

> If a branch has only one line, `{}` are optional — but with 2+ lines, they're required.

## Scope

Variables created **inside** `{ }` only exist inside those brackets:

```js
if (true) {
  const move = "rock";
  console.log(move); // ✅ works here
}
console.log(move); // ❌ ReferenceError — move doesn't exist out here
```

To use a value both inside and outside an `if`, declare it **outside** first, then just reassign it inside:

```js
let move = "";
if (true) {
  move = "rock"; // reassign, don't redeclare
}
console.log(move); // ✅ 'rock'
```

This is another reason to avoid `var` — it doesn't respect scope the way `let`/`const` do.

## Truthy & falsy values

`if` doesn't just work with `true`/`false` — any value can be tested. It's treated as either "truthy" or "falsy."

**The only falsy values in JS:**

```
false, 0, '', NaN, undefined, null
```

Everything else is truthy.

```js
if (cartQuantity) {
  console.log("Cart has products"); // runs if cartQuantity isn't 0
}
```

## Shorthand operators (all are compact versions of if/else)

```js
// Ternary — shorthand for if/else that returns a value
const result = isTrue ? "yes" : "no";

// Guard (&&) — right side only runs if left side is truthy
isLoggedIn && console.log("Welcome back");

// Default (||) — fallback value if the left side is falsy
const currency = selectedCurrency || "USD";
```

## Algorithms

An **algorithm** is just a set of steps to solve a problem. Before coding something like Rock Paper Scissors, plan the steps first:

1. Generate a random move for the computer
2. Compare it to the player's move
3. Show the result

```js
const randomNumber = Math.random(); // 0 to just under 1

let computerMove = "";
if (randomNumber < 1 / 3) {
  computerMove = "rock";
} else if (randomNumber < 2 / 3) {
  computerMove = "paper";
} else {
  computerMove = "scissors";
}

let result = "";
if (computerMove === "rock") {
  result = "tie";
} else if (computerMove === "paper") {
  result = "you lose";
} else if (computerMove === "scissors") {
  result = "you win";
}

alert(`You picked: rock, Computer picked: ${computerMove}, Result: ${result}`);
```

_(This example assumes the player picked "rock" — the real project repeats this logic for paper and scissors too.)_

## Key takeaways

- Booleans (`true`/`false`) represent yes/no facts about your code.
- Use `===`/`!==`, not `==`/`!=`.
- `if / else if / else` picks which code block runs.
- Variables declared inside `{ }` only exist inside that scope — declare outside if you need them elsewhere.
- Falsy values: `false, 0, '', NaN, undefined, null` — everything else is truthy.
- `? :` (ternary), `&&` (guard), `||` (default) are shorthand versions of if/else logic.
- Planning steps (an **algorithm**) before writing code makes complex logic much easier.

## Try it yourself

- Write an if/else chain that grades a test score into `'A'`, `'B'`, `'C'`, or `'F'`.
- Use `Math.random()` to simulate a coin flip and log "heads" or "tails".
- Rewrite `if (stock > 0) { message = 'In stock' } else { message = 'Out of stock' }` using the ternary operator.
