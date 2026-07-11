---
title: Formatting
description: "JavaScript naming conventions (snake_case), file structure (IIFE wrapper, file header banner, numbered sections), formatting (2-space indent, K&R braces, single quotes, trailing commas), function-purpose comments, JSDoc usage, and debug logging — for the Webflow stack." — Formatting.
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# Formatting

## 4. FORMATTING

### Indentation

**2 spaces, no tabs:**

```javascript
// Correct
function example() {
  if (condition) {
    do_something();
  }
}

// Incorrect (tabs or 4 spaces)
function example() {
    if (condition) {
        do_something();
    }
}
```

### Brackets and Braces

**Same-line opening brace (K&R style):**

```javascript
// Correct
function example() {
  if (condition) {
    return true;
  }
}

// Incorrect (Allman style)
function example()
{
  if (condition)
  {
    return true;
  }
}
```

**Single-statement if blocks still use braces:**

```javascript
// Correct
if (condition) {
  return early;
}

// Avoid (no braces)
if (condition) return early;
```

### Semicolons

**Always use semicolons:**

```javascript
// Correct
const value = 42;
do_something();
return result;

// Incorrect (ASI-dependent)
const value = 42
do_something()
return result
```

### Quotes

**Single quotes for strings, template literals for interpolation:**

```javascript
// Correct
const message = 'Hello world';
const greeting = `Hello, ${user_name}!`;
const html = `<div class="container">${content}</div>`;

// Incorrect (double quotes for simple strings)
const message = "Hello world";
```

**Exception:** JSON and HTML attributes use double quotes where required.

### Trailing Commas

**Use trailing commas in multi-line structures:**

```javascript
// Correct
const config = {
  name: 'component',
  delay: 50,
  enabled: true,  // trailing comma
};

const items = [
  'first',
  'second',
  'third',  // trailing comma
];

// Incorrect (no trailing comma)
const config = {
  name: 'component',
  delay: 50,
  enabled: true
};
```

**Benefits:**
- Cleaner git diffs (adding item doesn't modify previous line)
- Easier reordering
- Consistent structure

### Line Length

**Generally under 120 characters:**

```javascript
// Correct - break long lines
const result = some_function(
  first_argument,
  second_argument,
  third_argument
);

// Correct - chain on new lines
const processed = items
  .filter(is_valid)
  .map(transform_item)
  .sort(compare_items);

// Avoid - single long line
const result = some_function(first_argument, second_argument, third_argument, fourth_argument);
```

### Whitespace

**Consistent spacing around operators and keywords:**

```javascript
// Correct
const sum = a + b;
if (condition) { }
for (const item of items) { }
function example(param) { }

// Incorrect
const sum = a+b;
if(condition){ }
for(const item of items){ }
function example (param) { }
```

---

