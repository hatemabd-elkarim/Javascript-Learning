# Milestone 5 — Object-Oriented Programming

Covers lesson 17 (OOP in the Amazon project) plus a deep-dive supplement on the four OOP pillars — encapsulation, abstraction, inheritance, and polymorphism — illustrated with TypeScript examples.

## Contents

1. [Lesson 17 — OOP in JavaScript](#lesson-17--oop-in-javascript)
2. [Supplement — The Four OOP Pillars (TypeScript)](#supplement--the-four-oop-pillars-typescript)

---

# Lesson 17 — OOP in JavaScript

## Procedural vs. object-oriented programming

Up to this point, the course used **procedural programming**: data and the functions that operate on it are kept **separate** (e.g. `cart` the array, plus standalone functions like `addToCart()`, `removeFromCart()`).

**Object-oriented programming (OOP)** instead **groups data and behavior together inside an object**. It's not a different language — it's a different _style_ of organizing the same code, and it's worth knowing because many languages (Java, C#, Python) lean on it heavily.

## Step 1 — Manually grouping code into an object

Taking the existing `cart.js` (separate `cart` variable + separate functions) and converting it by hand:

```js
const cart = {
  cartItems: undefined, // was: export let cart

  loadFromStorage() {
    // shorthand method syntax
    this.cartItems = JSON.parse(localStorage.getItem("cart-oop")) || [];
  },

  saveToStorage() {
    localStorage.setItem("cart-oop", JSON.stringify(this.cartItems));
  },

  addToCart(productId) {
    let matchingItem;
    this.cartItems.forEach((item) => {
      if (productId === item.productId) matchingItem = item;
    });

    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      this.cartItems.push({ productId, quantity: 1, deliveryOptionId: "1" });
    }

    this.saveToStorage();
  },

  // removeFromCart, updateDeliveryOption, etc. follow the same pattern
};

cart.loadFromStorage();
```

Key mechanics:

- Inside an object literal you **can't** use `export`, `let`, or the `function` keyword the same way — properties use `name: value`, and methods use **shorthand method syntax**: `methodName() { ... }` instead of `methodName: function() { ... }`.
- **`this`** inside a method refers to the object the method is attached to — it's how the method reaches the object's _own_ data without hardcoding the object's variable name. Using `this` (rather than the outer variable name `cart`) means the code still works even if the object is renamed or copied.
- ⚠️ Regular `function` syntax is required for methods that use `this` this way — **arrow functions don't get their own `this`** (see the `this` section below).

### Why bother? OOP mirrors real-world objects

A physical shopping cart has **things inside it** (data) and **actions you can take on it** (add/remove items). Representing it as a JS object with both properties and methods together can feel more intuitive — the object _is_ the cart, not "an array plus some loose functions that happen to work on it."

## Step 2 — Generating multiple objects with a function

Copy-pasting the whole object to create a second, independent cart (e.g. a "business cart") works but duplicates a lot of code. Cleaner: wrap the object literal in a function that returns a new one each call:

```js
function Cart(localStorageKey) {
  const cart = {
    cartItems: undefined,
    loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    },
    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },
    // ...other methods
  };
  return cart;
}

const cart = Cart("cart-oop");
const businessCart = Cart("cart-business");
cart.loadFromStorage();
businessCart.loadFromStorage();
```

- **Naming convention:** functions/classes that _generate_ objects use **PascalCase** (every word capitalized, including the first) — here, `Cart` instead of `cart`.
- Passing `localStorageKey` as a **parameter** lets each generated object store to a different place, instead of every copy fighting over the same storage key.

## Step 3 — A cleaner generator: the `class` keyword

A **class** is a dedicated, built-in feature for generating objects — an "object generator" with extra capabilities a plain function doesn't have.

```js
class Cart {
  cartItems = undefined;
  localStorageKey = undefined;

  loadFromStorage() {
    this.cartItems =
      JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
  }

  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId) {
    // ...same logic as before, using this.cartItems / this.saveToStorage()
  }
}

const cart = new Cart();
cart.localStorageKey = "cart-oop";
cart.loadFromStorage();
```

Syntax differences from a plain object:

- Properties: `name = value;` (semicolon, not comma).
- Methods: no comma at the end.
- Generating an object: `new ClassName()` — the `new` keyword is required for classes.
- Each generated object is called an **instance** of the class. Check with `businessCart instanceof Cart` → `true`.

### The constructor — automatic setup code

A **constructor** is a special method that runs automatically every time `new` creates an object — the ideal place for setup logic (instead of manually setting properties after the fact):

```js
class Cart {
  cartItems;
  #localStorageKey; // private — see below

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems =
      JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }
  // ...
}

const cart = new Cart("cart-oop");
const businessCart = new Cart("cart-business");
```

- The method **must** be named `constructor`.
- It should not `return` anything.
- Parameters passed inside `new ClassName(...)` land in the constructor's parameters.
- A property that would just be `= undefined;` can be shortened to a bare `propertyName;`.

### Private properties & methods

A property or method prefixed with **`#`** is **private** — only accessible _inside_ the class. Attempting `cart.#localStorageKey` from outside throws a **syntax error** (a private field can't be reached from outside).

```js
class Cart {
  #localStorageKey; // private — 'field' is another word for 'property'

  #loadFromStorage() {
    /* private method */
  }
}
```

Why it matters: prevents other code (e.g. a teammate, or your own future self) from reaching in and mutating internal state in ways that break the object's invariants — a common real-world bug source without this guard rail. A property/method **without** `#` is called **public**.

## Applying OOP to the real project: converting `Product` into a class

```js
class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }
}
```

This is called **"converting an object into a class"** — wrap plain data objects to get extra class features (private fields, methods, etc.) while keeping the same shape.

### Converting the whole array with `.map()`

```js
export const products = productsData.map((productDetails) => {
  return new Product(productDetails);
});
```

`.map()` transforms each plain data object into a `Product` instance — no more manually writing `new Product({...})` for every entry.

### Refactor payoff: moving calculation logic into methods

Instead of computing the stars-image URL or formatted price inline inside HTML-generation code, that logic moved **onto the class** (`getStarsUrl()`, `getPrice()`) — keeping related logic grouped with the data it operates on, and simplifying the HTML-generation code to a single method call: `product.getPrice()`.

## Inheritance — reusing code between classes

**Inheritance** lets one class (**child**) automatically get all the properties and methods of another (**parent**), avoiding duplicated code for "a more specific version of X."

```js
class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails); // calls Product's constructor — sets id, image, name, rating, priceCents
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  // Overrides Product's version of this method
  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}
```

- `extends ParentClass` inherits all properties/methods.
- **`super(...)`** calls the parent's constructor — avoids re-writing `this.id = ...`, `this.name = ...`, etc. all over again.
- If a child class defines **no constructor at all**, the parent's constructor runs automatically by default.

### Method overriding & polymorphism

```js
class Product {
  extraInfoHTML() {
    return ""; // default: nothing extra to show
  }
}

class Clothing extends Product {
  extraInfoHTML() {
    return `<a href="${this.sizeChartLink}" target="_blank">Size chart</a>`;
  }
}
```

- Defining a method in the child with the **same name** as one in the parent **overrides** (replaces) it — called **method overriding**.
- If the overriding method still needs the parent's version, `super.methodName()` calls it explicitly.
- Calling `product.extraInfoHTML()` on a mixed array of `Product`s and `Clothing`s works correctly for **either** type **without checking which one it is** — each object's own class determines the behavior. This is **polymorphism**: using a method without needing to know exactly which class the object belongs to. It replaces sprawling `if (type === 'clothing') { ... } else { ... }` branching — adding a new product type later (e.g. `Appliance`) requires no changes to the calling code at all.

### Picking the right class with a discriminator property

```js
export const products = productsData.map((productDetails) => {
  if (productDetails.type === "clothing") {
    return new Clothing(productDetails);
  }
  return new Product(productDetails);
});
```

A **discriminator property** (`type` here) tells the conversion code which class to instantiate for each raw data object.

## More details on `this`

`this` isn't only usable inside class methods — it exists everywhere in JS, with rules that depend on _where_ it's used:

| Context                                                 | Value of `this`                                                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Inside a regular method on an object                    | The object itself                                                                                     |
| Standalone, outside any object (in a module)            | `undefined`                                                                                           |
| Inside a regular `function` (not attached to an object) | `undefined`                                                                                           |
| Inside an **arrow function**                            | Whatever `this` was in the **surrounding** (outer) scope — arrow functions never get their own `this` |

```js
function logThis() {
  console.log(this); // undefined (plain function call)
}
logThis();

// Force a specific value of `this` with .call():
logThis.call("hello"); // this === 'hello' inside the function
```

**Why arrow functions matter here:** before arrow functions existed, calling a regular function _inside_ a method (e.g. inside a `.forEach()` callback) would silently reset `this` to `undefined`, losing access to the outer object. Arrow functions were designed specifically to **not** reset `this` — they transparently keep whatever `this` was outside them, which is exactly why arrow-function callbacks are recommended inside methods that need to reach `this.something`.

## Which style should you use?

There's no universal right answer — it's a **team/codebase decision**. The course's stated personal preference is **procedural** for plain JavaScript (simpler), reserving OOP for teams/projects that favor it, or languages where OOP is the dominant idiom (Java, C#, etc.) — still worth knowing well since it shows up constantly outside JS.

## Key takeaways

- **OOP = grouping data + the functions that act on it into one object**, instead of keeping them separate (procedural style).
- `this` inside a method refers to the object; use it instead of hardcoding a variable name so the code survives renaming/copying.
- A **class** is a cleaner, purpose-built way to generate objects (vs. a plain function): supports **constructors** (auto-run setup code), **private fields/methods** (`#name`), and **inheritance**.
- `new ClassName()` creates an **instance**; check with `instanceof`.
- `extends` + `super(...)` implement **inheritance** — reuse a parent's properties/methods in a more specific child class.
- **Method overriding**: a child class redefining a parent's method; **polymorphism**: calling that method without needing to know which subclass the object actually is.
- A **discriminator property** in raw data (e.g. `type: 'clothing'`) picks which class to instantiate.
- `this` behaves differently in methods, plain functions, and arrow functions — arrow functions deliberately don't get their own `this`, which is why they're preferred for callbacks inside methods.

---

# Supplement — The Four OOP Pillars (TypeScript)

Based on two supplementary walkthroughs (in Arabic, summarized here in English) that focus specifically on the four classical OOP pillars — **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism** — using TypeScript, which makes access modifiers (`private`/`public`) and types explicit in the syntax itself.

> Note: the concepts here are **language-agnostic** — the same ideas apply whether you write them in TypeScript, JavaScript, Java, Python, or C++. TypeScript is just used because it makes the access modifiers and typing visible directly in the code.

## Part 1 — Encapsulation & Abstraction (the "Employee" example)

### The starting problem: everything as loose variables

Before OOP, representing an employee's data as separate variables — and a separate function to compute derived values — looks like this:

```ts
const employeeName = "Youssef";
const employeeSalary = 12000;
const employeeStartDate = 2020;

function printEmployeeInfo(name: string, salary: number, startDate: number) {
  const yearsInService = new Date().getFullYear() - startDate;
  const bonus = Math.floor(salary * 0.1); // 10% bonus, floored

  console.log(name, salary, yearsInService, bonus);
}

printEmployeeInfo(employeeName, employeeSalary, employeeStartDate);
```

**The scaling problem:** with 1 employee, that's 3 loose variables. With 3 employees, it's 9 separate variables (`employee1Name`, `employee2Name`, `employee3Name`, ...) and every function call needs to pass them all individually. This grows linearly and gets unmanageable fast — the exact pain point encapsulation solves.

### Step 1 — Encapsulation: bundle related data into one container

**Encapsulation** = taking data (and eventually behavior) that conceptually belongs together and wrapping it inside a single unit (a class), so the rest of the code interacts with _one thing_ instead of a pile of loose variables.

```ts
export class Employee {
  private name: string;
  private salary: number;
  private startDate: number;
}
```

This alone is already a minimal, valid class — a new "data type" made of a `name`, a `salary`, and a `startDate`, bundled under one label: `Employee`.

### Step 2 — The constructor: create-and-fill in one step

```ts
export class Employee {
  private name: string;
  private salary: number;
  private startDate: number;

  constructor(name: string, salary: number, startDate: number) {
    this.name = name;
    this.salary = salary;
    this.startDate = startDate;
  }
}

const employee1 = new Employee("Youssef", 12000, 2020);
```

- `new` signals "generate a new instance from this blueprint" — required because a class isn't a primitive type (`string`, `number`, `boolean`); it's a custom one you define, so the language needs `new` to know when to construct it.
- Without a constructor, you'd otherwise have to create the object empty and then set each property one by one (`employee1.name = ...`) — the constructor collapses that into a single step.

### Step 3 — Move behavior in too (not just data)

Classes can hold **functions** as well as data — encapsulation isn't limited to properties. Move `printEmployeeInfo`'s logic into the class as **methods**:

```ts
export class Employee {
  private name: string;
  private salary: number;
  private startDate: number;

  constructor(name: string, salary: number, startDate: number) {
    this.name = name;
    this.salary = salary;
    this.startDate = startDate;
  }

  calculateYearsInService(): number {
    return new Date().getFullYear() - this.startDate;
    // no longer needs a parameter — it already has `this.startDate`
  }

  calculateBonus(): number {
    return Math.floor(this.salary * 0.1);
    // no longer needs a `salary` parameter either
  }

  printEmployeeInfo(): void {
    console.log(
      this.name,
      this.salary,
      this.calculateYearsInService(),
      this.calculateBonus(),
    );
  }
}

const employee1 = new Employee("Youssef", 12000, 2020);
const employee2 = new Employee("Omar", 15000, 2022);
const employee3 = new Employee("Ali", 9000, 2023);

employee1.printEmployeeInfo();
employee2.printEmployeeInfo();
employee3.printEmployeeInfo();
```

- Once a value lives **inside** the object, methods no longer need it passed in as a parameter — they reach it directly via `this`.
- `this` disambiguates between a property on the object (`this.salary`) and a same-named parameter passed into a method — without `this`, the language can't tell which `salary` you mean if both exist.
- End result compared to the starting point: what was 30–40 lines of loosely related variables and standalone functions collapses to under 10 clean lines per employee, fully self-contained and reusable.

### Why encapsulation helps (the "why", not just the "how")

1. **Hides complexity behind a simple interface.** The caller doesn't need to track a pile of raw variables and manually wire them into functions — they just call `employee.printEmployeeInfo()`. Compare to a car's dashboard: you don't need to understand the transmission or engine internals to drive — you interact with a small, well-designed interface (pedals, wheel, gear stick) that hides enormous internal complexity. A washing machine is the same idea: motor, water dispenser, drum — all wrapped behind a few buttons.
2. **Protects internal state from invalid or unsafe changes.** Marking `salary` as **`private`** means outside code _cannot_ reach in and directly reassign it, bypassing whatever safety rules the class expects. It's like a washing machine door locking mid-cycle — the manufacturer _encapsulated_ the interior specifically so users can't open it and flood the room mid-wash. If everything were `public`, any part of the program could mutate state in ways the object never expected, leading to bugs that are hard to trace.

## Part 2 — Abstraction, Inheritance & Polymorphism (the "Zoo" example)

### Abstraction: keep only what matters for this context

**Abstraction** = deliberately ignoring the properties of a real-world thing that are _irrelevant_ to the system you're building, and keeping only what matters for that context.

> Example given: a supermarket checkout/barcode system treats a bottle of milk, a bag of cheese, and a can of insect spray as the exact same kind of thing — an **Item** — because in that context, all that matters is `barcode`, `name`, and `price`. The system doesn't care that these are wildly different real-world objects; it abstracts away everything except what the checkout process actually needs.
>
> Same idea for an HR system modeling a person: it cares about qualifications, position, manager, direct reports — not their sprint velocity. The _same_ person modeled inside a game like FIFA would instead be abstracted down to attributes like speed, that a HR system would never track. **Any real-world thing has effectively infinite properties — abstraction is choosing the finite subset relevant to your system.**

### Building the `Animal` hierarchy — a first (naive) pass

Starting with two nearly-identical classes:

```ts
export class Cat {
  private name: string;
  private gender: "male" | "female";

  constructor(name: string, gender: "male" | "female") {
    this.name = name;
    this.gender = gender;
  }

  makeSound(): void {
    const noun = this.gender === "male" ? "Tomcat" : "Cat";
    console.log(`${noun} ${this.name} says: Meow`);
  }
}
```

```ts
export class Dog {
  private name: string;
  private gender: "male" | "female";

  constructor(name: string, gender: "male" | "female") {
    this.name = name;
    this.gender = gender;
  }

  makeSound(): void {
    const noun = this.gender === "male" ? "Male dog" : "Female dog";
    console.log(`${noun} ${this.name} says: Woof`);
  }
}
```

Notice `Cat` and `Dog` are almost identical — `name`, `gender`, a constructor, and a sound method that differs only in wording. Duplicating this structure for every new animal type doesn't scale — this is where **inheritance** comes in.

### Inheritance: pull the shared shape into a parent

```ts
export abstract class Animal {
  private name: string;
  private gender: "male" | "female";

  constructor(name: string, gender: "male" | "female") {
    this.name = name;
    this.gender = gender;
  }

  // Public getters — since subclasses can't reach a parent's `private` fields directly
  public getName(): string {
    return this.name;
  }

  public getGender(): "male" | "female" {
    return this.gender;
  }

  // Abstract method: declares the shape but no implementation —
  // every concrete subclass MUST provide its own.
  abstract makeSound(): void;
}
```

- **`abstract class`** means it **cannot be instantiated directly** — `new Animal(...)` is a compile error. It only exists to be extended; on its own, "an animal" (with no specific species) has no concrete meaning in this system.
- **`abstract makeSound(): void;`** declares a method with no body — it forces every subclass to implement it, guaranteeing a consistent interface across all animal types without dictating what the sound actually is.
- **Getters** (`getName()`, `getGender()`) are the standard pattern for letting subclasses (and outside code) read a `private` field they don't have direct access to — a subclass does **not** automatically inherit access to a parent's private fields, only its public/protected interface.

```ts
export class Cat extends Animal {
  makeSound(): void {
    const noun = this.getGender() === "male" ? "Tomcat" : "Cat";
    console.log(`${noun} ${this.getName()} says: Meow`);
  }
}

export class Dog extends Animal {
  makeSound(): void {
    const noun = this.getGender() === "male" ? "Male dog" : "Female dog";
    console.log(`${noun} ${this.getName()} says: Woof`);
  }
}

export class Bird extends Animal {
  makeSound(): void {
    const noun = this.getGender() === "male" ? "Male bird" : "Female bird";
    console.log(`${noun} ${this.getName()} says: Tweet`);
  }
}
```

Each subclass only needs to write the piece that's genuinely different (`makeSound`) — `name`, `gender`, and their getters/constructor plumbing are all inherited for free.

### The `Zoo` class — abstraction + polymorphism working together

```ts
export class Zoo {
  private name: string;
  private animals: Animal[] = []; // one array, not one per species!

  constructor(name: string) {
    this.name = name;
  }

  addAnimal(animal: Animal): void {
    this.animals.push(animal);
  }

  wakeAllAnimals(): void {
    for (let i = 0; i < this.animals.length; i++) {
      this.animals[i].makeSound();
    }
  }
}
```

```ts
const myZoo = new Zoo("Giza's Zoo");

myZoo.addAnimal(new Cat("Sayed", "male"));
myZoo.addAnimal(new Cat("Sayeda", "female"));
myZoo.addAnimal(new Dog("Rex", "male"));
myZoo.addAnimal(new Dog("Luna", "female"));
myZoo.addAnimal(new Bird("Faris", "male"));
myZoo.addAnimal(new Bird("Farida", "female"));

myZoo.wakeAllAnimals();
// Tomcat Sayed says: Meow
// Cat Sayeda says: Meow
// Male dog Rex says: Woof
// Female dog Luna says: Woof
// Male bird Faris says: Tweet
// Female bird Farida says: Tweet
```

**This is where all four pillars converge in one small example:**

- **Abstraction**: `Zoo` doesn't care _what kind_ of animal it's holding — cat, dog, bird are all abstracted down to "an `Animal`" for the purposes of storage and iteration. One `animals: Animal[]` array replaces what would otherwise be a separate array (and a separate `add`/`wake` function pair) per species.
- **Inheritance**: `Cat`, `Dog`, and `Bird` all reuse `Animal`'s `name`, `gender`, constructor, and getters — none of that is rewritten per species.
- **Polymorphism**: `wakeAllAnimals()` calls `.makeSound()` on every element without checking what type each one is — the _same_ line of code produces "Meow," "Woof," or "Tweet" depending on the actual runtime type of the object. Adding a brand-new species (e.g. a `Bear` extending `Animal`) requires **zero changes** to `Zoo` — just write the new class and call `addAnimal()`.
- **Encapsulation** (from Part 1) is implicitly present throughout too: `name`/`gender` stay `private`, reachable only via controlled getters.

### Generalizing further: one `addAnimal()` instead of one method per species

The naive version had `addCat()`, `addDog()`, `addBird()` as separate methods and even separate wake-up loops per species. Once every animal is treated through the shared `Animal` interface, all of that collapses into the single `addAnimal(animal: Animal)` / `wakeAllAnimals()` pair shown above — this consolidation _is_ the practical payoff of combining abstraction with polymorphism: code that used to grow with every new type now stays exactly the same size no matter how many species get added.

## Key takeaways (the four pillars, in one paragraph each)

- **Encapsulation** — bundle related data _and_ the behavior that operates on it into one unit (a class), and restrict direct outside access to internals (`private`) so the object can only be modified through a safe, intentional interface (public methods/getters). This hides complexity (like a car dashboard or washing machine's buttons hiding the machinery inside) and prevents invalid state changes from outside code.
- **Abstraction** — model a real-world thing using only the properties/behavior relevant to your system's context, discarding everything else. The same real entity (e.g. a person) gets abstracted completely differently depending on the system (HR software vs. a video game) — abstraction is a _choice_ about what to keep, not an absolute property of the thing itself.
- **Inheritance** — let a child class automatically receive a parent class's properties and methods, so shared structure is written once. An **abstract class** (or abstract method) declares a shape without a usable implementation, forcing every concrete subclass to supply its own version — guaranteeing a consistent interface without dictating the specifics.
- **Polymorphism** — write code that calls a method (e.g. `.makeSound()`) on an object without knowing (or caring) which concrete subclass it actually is; the correct, type-specific behavior runs automatically based on the object's real type at runtime. This is what lets collections of mixed subtypes be processed uniformly, and lets new subtypes be added later with zero changes to the code that consumes them.

None of these four are mandatory to "do OOP right," and OOP itself isn't mandatory — they're tools that solve specific, recognizable pain points (duplicated code, unsafe external mutation, type-specific branching that grows forever). Use whichever pillars actually solve a problem you have; skip the ones that don't.
