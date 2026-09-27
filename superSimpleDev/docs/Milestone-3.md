# Milestone 3 — Arrays, Loops & Advanced Functions

Covers lesson 11 (arrays & loops, parts 1–2) and lesson 12 (advanced functions, parts 1–2).

## Contents

1. [Arrays](#lesson-11-part-1--arrays)
2. [Loops & the To-Do List Project](#lesson-11-part-2--loops--the-to-do-list-project)
3. [Functions Are Values](#lesson-12-part-1--functions-are-values)
4. [Array Methods, Arrow Functions & Event Listeners](#lesson-12-part-2--array-methods-arrow-functions--event-listeners)

---

# Lesson 11 (Part 1) — Arrays

## What is an array?

An **array** represents a **list of values**.

```js
const myArray = [10, 20, 30];
console.log(myArray); // [10, 20, 30]
```

## Accessing & changing values — the index

Each value has a position called an **index**, starting at **0** (a "zero-indexed array"):

```js
myArray[0]; // 10 — first value
myArray[1]; // 20 — second value

myArray[0] = 99; // change the first value
```

## Array syntax rules

- `[ ]` wraps the list; values separated by commas.
- Can span multiple lines for readability.
- Can hold **any type of value** — numbers, strings, booleans, objects, even other arrays:

```js
const mixed = [1, "hello", true, { name: "socks" }, [1, 2]];
```

## Arrays are a special kind of object

```js
typeof [1, 2]; // 'object'
Array.isArray([1, 2]); // true — the reliable way to check specifically for an array
```

## Useful array properties & methods

```js
myArray.length; // how many values are in the array

myArray.push(100); // adds a value to the END of the array

myArray.splice(0, 1); // removes values starting at index 0
// first arg = start index, second arg = how many to remove
```

## Key takeaways

- Arrays hold ordered lists of any value type; access/change items with `array[index]`.
- Indexes start at **0**.
- `.length` — number of items. `.push(value)` — add to the end. `.splice(start, count)` — remove items.
- `Array.isArray(x)` is the reliable way to check if something is an array (since `typeof` just says `'object'`).

## Try it yourself

- Create an array of your 3 favorite foods, then log the second one.
- Add a 4th food with `.push()`, then remove the first one with `.splice()`.

---

# Lesson 11 (Part 2) — Loops & the To-Do List Project

## Why loops?

Loops let us run code **over and over** — essential for working with arrays of unknown or changing length.

## The `while` loop

```js
let i = 1;
while (i <= 5) {
  console.log(i);
  i = i + 1; // increment step — without this, infinite loop!
}
```

- **Loop condition** (in `()`) — checked before each run; loop continues while it's `true`.
- **Loop body** (in `{}`) — the code that repeats.
- **Loop variable** (`i`) — tracked/updated each time.
- **Increment step** — must change the loop variable, or you get an **infinite loop**.
- Each run-through is called an **iteration**.
- Loops create their own **scope**, just like functions and `if` statements.

## The `for` loop

A more compact way to write a standard loop — groups variable, condition, and increment together:

```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

**When to use which:**

- **Standard loop** (has a variable, condition, increment) → prefer `for` — shorter & more organized.
- **Non-standard loop** (e.g. "keep going until some random condition is met") → `while` is more flexible.

```js
// Non-standard example: keep generating until we get ≥ 0.5
let randomNumber = 0;
while (randomNumber < 0.5) {
  randomNumber = Math.random();
}
```

## Looping through an array

```js
const toDoList = ["make dinner", "wash dishes", "watch YouTube"];

for (let i = 0; i < toDoList.length; i++) {
  const value = toDoList[i];
  console.log(value);
}
```

- Loop from `0` to `array.length - 1` — shorthand: use `i < array.length` (avoids the `-1` math).
- The loop variable is often named `i` (short for "index").

## The accumulator pattern

A technique to **build up a result** while looping — e.g. totals, or a transformed array.

```js
// Sum all numbers
const nums = [1, 1, 3];
let total = 0;
for (let i = 0; i < nums.length; i++) {
  total += nums[i];
}
// total = 5
```

```js
// Build a new array (doubled values)
const numsDoubled = [];
for (let i = 0; i < nums.length; i++) {
  numsDoubled.push(nums[i] * 2);
}
// numsDoubled = [2, 2, 6]
```

Steps: 1) create an **accumulator variable** to hold the result, 2) loop through the source, 3) update the accumulator each time.

## Building the To-Do List project (step by step)

### Step 1 — store data, generate HTML, make it interactive

This is the standard 3-step process for JS-powered websites:

1. **Save the data** (usually in an array/object)
2. **Generate HTML** from that data
3. **Make it interactive** (event handlers that update the data + re-render)

### Generating HTML from an array (accumulator + loop)

```js
function renderToDoList() {
  let toDoListHTML = "";

  toDoList.forEach((toDoObject, index) => {
    const { name, dueDate } = toDoObject; // destructuring shortcut

    const html = `
      <div class="to-do-grid">
        <div>${name}</div>
        <div>${dueDate}</div>
        <button class="delete-to-do-button" onclick="toDoList.splice(${index}, 1); renderToDoList();">
          Delete
        </button>
      </div>
    `;

    toDoListHTML += html;
  });

  document.querySelector(".js-to-do-list").innerHTML = toDoListHTML;
}

renderToDoList(); // run once at page load
```

### The `<div>` element

Used as a generic **container**. Unlike `<p>`, it has **no default spacing/styling**, and (unlike `<p>`) it can legally contain other block elements — useful when generating structured HTML like grids.

### Grouping related data in an object

Instead of a plain array of strings, each to-do becomes an object so it can carry more than one piece of data:

```js
const toDoList = [
  { name: "make dinner", dueDate: "2022-12-22" },
  { name: "wash dishes", dueDate: "2022-12-23" },
];
```

### Adding a to-do

```js
function addToDo() {
  const inputElement = document.querySelector(".js-name-input");
  const name = inputElement.value;

  const dateInputElement = document.querySelector(".js-due-date-input");
  const dueDate = dateInputElement.value;

  toDoList.push({ name, dueDate }); // shorthand property syntax

  inputElement.value = ""; // reset the text box
  renderToDoList(); // re-render after every change!
}
```

### Deleting a to-do

Reuses `.splice(index, 1)` — the index comes from the loop, inserted via template-string interpolation into the generated `onclick`.

### Date input

```html
<input type="date" />
```

`type="date"` (default is `type="text"`) turns a plain text box into a native date picker.

## Key takeaways

- `while` and `for` both repeat code; use `for` for standard counted loops, `while` for open-ended ones.
- Looping through an array: `for (let i = 0; i < arr.length; i++)`.
- The **accumulator pattern**: start with a variable (number, string, or array), update it every iteration.
- Real websites follow: **save data → generate HTML from it → make it interactive**, then **re-render** after every change.
- `<div>` = a plain container element, no default styling, can nest block elements.
- Objects let each list item carry multiple related fields (e.g. `name` + `dueDate`).

## Try it yourself

- Loop through an array of prices and calculate the total using the accumulator pattern.
- Build a simple "shopping list" that renders `<li>`-style items from an array of objects (`name`, `quantity`).

---

## Bonus details from Lesson 11

### Arrays are references (just like objects)

```js
const array1 = [1, 2, 3];
const array2 = array1; // copies the REFERENCE, not the values

array2.push(4);
console.log(array1); // [1, 2, 3, 4] — array1 changed too!
```

To make an actual **copy** of the values:

```js
const array2 = array1.slice(); // independent copy
```

### Destructuring an array

```js
const [firstValue, secondValue] = [1, 2, 3];
// firstValue = 1, secondValue = 2
```

### `break` and `continue`

```js
for (let i = 1; i <= 10; i++) {
  if (i === 8) break; // exits the loop entirely
  if (i === 3) continue; // skips just this iteration, loop continues
  console.log(i);
}
```

⚠️ In a `while` loop, `continue` **skips the increment step** — you must increment manually before `continue`, or you'll get an infinite loop:

```js
let i = 1;
while (i <= 10) {
  if (i % 3 === 0) {
    // remainder operator "%" checks divisibility
    i++;
    continue;
  }
  console.log(i);
  i++;
}
```

### Loops inside functions

Wrapping a loop in a function (with a parameter) lets you reuse it on **any** array:

```js
function doubleArray(nums) {
  const numsDoubled = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) return numsDoubled; // return also breaks out of the loop early
    numsDoubled.push(nums[i] * 2);
  }
  return numsDoubled;
}
```

---

# Lesson 12 (Part 1) — Functions Are Values

## The core idea

Just like numbers, strings, and booleans — **functions are values** too. Anything you can do with a value, you can do with a function.

## Saving a function in a variable

```js
const functionOne = function () {
  console.log("hello");
};

functionOne(); // call it via the variable
typeof functionOne; // 'function'
```

When a function is only accessed through a variable, it doesn't need its own name — this is an **anonymous function**.

> The familiar `function name() {}` syntax is actually shorthand. It has one big advantage over the variable-assignment style: **hoisting** — you can call a `function name(){}` _before_ it appears in the code. Hoisting does **not** work for functions saved in variables.

## Saving a function in an object (a method)

```js
const objectOne = {
  num: 2,
  fun: function () {
    console.log("hello");
  },
};

objectOne.fun(); // calling a method
```

## Passing a function into another function (callback)

```js
function run(param) {
  param(); // param holds a function — call it
}

run(function () {
  console.log("hello");
});
```

The function passed in is called a **callback function**.

## `setTimeout` — run code later

```js
setTimeout(function () {
  console.log("timeout");
}, 3000); // 1000ms = 1 second, so 3000ms = 3 seconds

console.log("next line");
```

Output order: **"next line" appears first**, then "timeout" after 3 seconds.

## Synchronous vs. asynchronous code

- **Synchronous**: the computer waits for each line to finish before moving to the next (this is everything you've written so far).
- **Asynchronous**: the computer does _not_ wait — it sets things up in the background and immediately continues (e.g. `setTimeout`, `setInterval`).

This lets your code keep running instead of freezing while waiting for a timer.

## `setInterval` — run code repeatedly

```js
const intervalId = setInterval(function () {
  console.log("interval");
}, 3000); // runs every 3 seconds, forever, until stopped

clearInterval(intervalId); // stop it, using the ID returned by setInterval
```

### Practical example — Auto-play button

```js
let isAutoPlaying = false;
let intervalId = undefined;

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
  }
}
```

## Key takeaways

- Functions are values — store them in variables/objects, pass them as arguments, return them.
- `function name(){}` supports **hoisting** (call before defined); function-in-a-variable does not.
- A function passed into another function is a **callback**.
- `setTimeout(fn, ms)` runs once after a delay; `setInterval(fn, ms)` runs repeatedly; `clearInterval(id)` stops it.
- `setTimeout`/`setInterval` are **asynchronous** — the rest of your code keeps running without waiting.

## Try it yourself

- Write a function that logs "Loading..." then, after 2 seconds via `setTimeout`, logs "Done!"
- Build a simple counter that increases every second with `setInterval`, with a button to stop it via `clearInterval`.

---

# Lesson 12 (Part 2) — Array Methods, Arrow Functions & Event Listeners

## `.forEach()` — the preferred way to loop through arrays

```js
const toDoList = ["make dinner", "wash dishes", "watch YouTube"];

toDoList.forEach(function (value, index) {
  console.log(index, value);
});
```

- Cleaner/more readable than a manual `for` loop — **preferred style** going forward.
- `return;` inside the callback skips to the next iteration (like `continue`).
- ⚠️ There's no easy way to `break` out of a `.forEach()` early — use a regular `for` loop if you need that.

## Arrow functions — a shorter function syntax

```js
const regularFunction = function (param) {
  return param + 1;
};

const arrowFunction = (param) => {
  return param + 1;
};
```

Shortcuts arrow functions offer:

- **One parameter** → parentheses optional: `param => { ... }`
- **One-line body** → braces _and_ `return` optional (implicit return):
  ```js
  const add = (a, b) => a + b;
  ```

**When to use arrow functions:** recommended whenever passing a function into another function (callbacks, `.forEach()`, event listeners) — reads cleaner. For named, standalone functions, the classic `function name(){}` style is often still preferred (readability + hoisting).

```js
// Cleaner with an arrow function:
toDoList.forEach((toDoObject, index) => {
  // ...
});
```

## `addEventListener` — the preferred way to handle events

More powerful than the `onclick="..."` HTML attribute:

```js
const buttonElement = document.querySelector(".js-button");

buttonElement.addEventListener("click", () => {
  console.log("click");
});
```

Advantages over `onclick`:

- Can attach **multiple** listeners to the same event
- Can **remove** a listener later:
  ```js
  const eventListener = () => console.log("click");
  buttonElement.addEventListener("click", eventListener);
  buttonElement.removeEventListener("click", eventListener); // must be the same function reference
  ```

### Listening for keyboard events

```js
document.body.addEventListener("keydown", (event) => {
  if (event.key === "r") {
    playGame("rock");
  } else if (event.key === "p") {
    playGame("paper");
  } else if (event.key === "s") {
    playGame("scissors");
  }
});
```

The callback automatically receives an `event` object (via a parameter) with details like `event.key`.

### Selecting multiple elements: `querySelectorAll`

`querySelector` only returns the **first** match. To get every matching element, use `querySelectorAll` — it returns an array-like list you can loop over with `.forEach()`:

```js
document
  .querySelectorAll(".js-delete-to-do-button")
  .forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", () => {
      toDoList.splice(index, 1);
      renderToDoList();
    });
  });
```

## `.filter()` — keep only some values

```js
const nums = [1, -3, 5];

const positiveNums = nums.filter((value, index) => {
  return value >= 0;
});
// [1, 5]
```

The callback returns `true` (keep the value) or `false` (drop it) for each item — builds a new, filtered array.

## `.map()` — transform every value

```js
const nums = [1, 1, 3];

const numsDoubled = nums.map((value, index) => value * 2);
// [2, 2, 6]
```

The callback's return value becomes the new array's value at that position — builds a new array the same length as the original, with each item transformed.

## Closures

**A closure** means: if a function has access to a value, it will **always** have access to that value — even after the code that created it has finished running.

```js
document
  .querySelectorAll(".js-delete-to-do-button")
  .forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", () => {
      console.log(index); // still works, even long after forEach finished!
    });
  });
```

Even though `index` technically "goes away" once `.forEach()` finishes, the inner arrow function keeps access to it via closure — this is what lets each delete button remember _its own_ index.

## Key takeaways

- Prefer `.forEach()` over manual `for` loops for readability (but use `for` if you need `break`).
- **Arrow functions** (`() => {}`) are shorter, especially good for callbacks; classic `function` syntax is still fine (and hoists) for named/standalone functions.
- **`addEventListener(event, callback)`** is preferred over `onclick=""` — supports multiple listeners and removal.
- **`querySelectorAll`** + `.forEach()` handles multiple matching elements (e.g. all delete buttons).
- **`.filter()`** builds a new array keeping only items where the callback returns `true`.
- **`.map()`** builds a new array by transforming every item via the callback's return value.
- **Closures**: inner functions retain access to outer variables even after the outer code has finished executing.

## Try it yourself

- Use `.filter()` to get only even numbers from an array.
- Use `.map()` to convert an array of Celsius temperatures to Fahrenheit.
- Refactor a project's `onclick` attributes to use `addEventListener` instead.
- Add a keyboard shortcut to any project you've built (e.g. pressing "Enter" submits a form).
