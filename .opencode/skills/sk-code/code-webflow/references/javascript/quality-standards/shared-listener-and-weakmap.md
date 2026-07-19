---
title: Shared Document Listener & WeakMap/WeakSet Caching
description: "Shared document listener and WeakMap or WeakSet caching patterns for efficient Webflow JavaScript components."
trigger_phrases:
  - "shared document listener"
  - "weakmap webflow caching"
  - "weakset processed elements"
  - "javascript event delegation webflow"
importance_tier: normal
contextType: implementation
version: 3.5.0.7
---

# Shared Document Listener & WeakMap/WeakSet Caching

Efficient event delegation and element-state caching patterns for Webflow JavaScript.

---

## 1. OVERVIEW

### Purpose

Shows how shared listeners and weak collections reduce duplicate handlers and avoid retaining removed DOM elements.

### When to Use

- Handling events for dynamic element collections
- Associating metadata or processing state with DOM elements
- Preventing duplicate element initialization

---

## 2. SHARED DOCUMENT LISTENER PATTERN

Single document-level listener for all instances improves performance over per-element listeners.

### The Pattern (Event Delegation)

```javascript
/* ─────────────────────────────────────────────────────────────
   SHARED LISTENER - Single document handler for all instances
──────────────────────────────────────────────────────────────── */
const SELECTOR = '[data-component]';
let listener_attached = false;

function handle_document_click(e) {
  // Find the component element (or null if click outside)
  const target = e.target.closest(SELECTOR);
  if (!target) return;

  // Route to appropriate handler based on data attributes
  const action = target.dataset.action;
  if (action === 'toggle') toggle_item(target);
  if (action === 'expand') expand_item(target);
  if (action === 'close') close_item(target);
}

function init_shared_listener() {
  // Guard: Only attach once
  if (listener_attached) return;
  listener_attached = true;

  document.addEventListener('click', handle_document_click);
}

function cleanup_shared_listener() {
  if (!listener_attached) return;
  document.removeEventListener('click', handle_document_click);
  listener_attached = false;
}
```

### Performance Benefits

| Approach                   | Listeners | Memory      | Dynamic Elements |
| -------------------------- | --------- | ----------- | ---------------- |
| Per-element listeners      | N         | O(N)        | Must rebind      |
| **Shared document listener** | 1         | O(1)        | Auto-handled     |

### When to Use Each Approach

```
Need to handle clicks on .item elements?
├─> Elements are static (known at init time)?
│   └─> Per-element OK for small sets (<10 elements)
└─> Elements are dynamic (added/removed)?
    └─> USE SHARED DOCUMENT LISTENER
```

### Action Routing Pattern

```javascript
// Map actions to handlers for clean routing
const ACTIONS = {
  toggle: (el) => el.classList.toggle('active'),
  expand: (el) => el.setAttribute('aria-expanded', 'true'),
  collapse: (el) => el.setAttribute('aria-expanded', 'false'),
  remove: (el) => el.remove(),
};

function handle_action(e) {
  const trigger = e.target.closest('[data-action]');
  if (!trigger) return;

  const action = trigger.dataset.action;
  const target_id = trigger.dataset.target;
  const target = target_id
    ? document.getElementById(target_id)
    : trigger;

  if (ACTIONS[action] && target) {
    ACTIONS[action](target);
  }
}
```

### Multiple Event Types

```javascript
// Single attachment point for multiple events
const EVENTS = ['click', 'keydown', 'focusin', 'focusout'];
let events_attached = false;

function attach_events() {
  if (events_attached) return;
  events_attached = true;

  EVENTS.forEach((type) => {
    document.addEventListener(type, route_event, { passive: true });
  });
}

function route_event(e) {
  const target = e.target.closest(SELECTOR);
  if (!target) return;

  switch (e.type) {
    case 'click': handle_click(target, e); break;
    case 'keydown': handle_keydown(target, e); break;
    case 'focusin': handle_focus(target, true); break;
    case 'focusout': handle_focus(target, false); break;
  }
}
```

---

## 3. WEAKMAP/WEAKSET CACHING PATTERNS

WeakMap and WeakSet allow caching data against DOM elements without preventing garbage collection.

### WeakMap for Element Metadata

```javascript
/* ─────────────────────────────────────────────────────────────
   WEAKMAP CACHING - Associate data with elements safely
──────────────────────────────────────────────────────────────── */
const element_cache = new WeakMap();

function get_element_data(el) {
  if (!element_cache.has(el)) {
    // Compute and cache on first access
    element_cache.set(el, {
      id: generate_id('el'),
      bounds: el.getBoundingClientRect(),
      initialized: false,
    });
  }
  return element_cache.get(el);
}

function init_element(el) {
  const data = get_element_data(el);
  if (data.initialized) return; // Already done

  data.initialized = true;
  setup_element(el, data);
}
```

### Why WeakMap Over Regular Map

| Feature               | Map                        | WeakMap                    |
| --------------------- | -------------------------- | -------------------------- |
| Key types             | Any                        | Objects only               |
| Key enumerable        | Yes (`.keys()`, `.size`)   | No                         |
| Prevents GC           | **Yes** (memory leak risk) | **No** (auto-cleanup)      |
| Use for DOM elements  | Risky                      | **Safe**                   |

```javascript
// ❌ WRONG: Regular Map holds references
const cache = new Map();
cache.set(element, data);
// If element removed from DOM, cache still holds reference = LEAK

// ✅ CORRECT: WeakMap allows garbage collection
const cache = new WeakMap();
cache.set(element, data);
// If element removed from DOM, entry is auto-cleaned
```

### Instance Binding Guard Pattern

```javascript
/* ─────────────────────────────────────────────────────────────
   BINDING GUARD - Prevent double-initialization of elements
──────────────────────────────────────────────────────────────── */
const BOUND_KEY = '__componentBound';

function bind_element(el) {
  // Guard: Already bound?
  if (el[BOUND_KEY]) return false;
  el[BOUND_KEY] = true;

  // Perform one-time setup
  setup_handlers(el);
  return true;
}

function unbind_element(el) {
  if (!el[BOUND_KEY]) return;
  el[BOUND_KEY] = false;
  teardown_handlers(el);
}

// Usage in init
function init_all() {
  document.querySelectorAll(SELECTOR).forEach((el) => {
    bind_element(el); // Safe to call multiple times
  });
}
```

### WeakSet for Processed Elements

```javascript
// Track which elements have been processed
const processed = new WeakSet();

function process_element(el) {
  if (processed.has(el)) return; // Skip if already done
  processed.add(el);

  // One-time processing
  el.classList.add('processed');
  attach_behavior(el);
}

// Safe to call on same elements repeatedly
document.querySelectorAll('.item').forEach(process_element);
```

### Combined Pattern: WeakMap + Binding Guard

```javascript
/* ─────────────────────────────────────────────────────────────
   COMPLETE CACHING PATTERN - WeakMap + binding guard
──────────────────────────────────────────────────────────────── */
const instances = new WeakMap();
const BOUND_FLAG = '__accordionBound';

function create_instance(el) {
  return {
    id: generate_id('accordion'),
    expanded: false,
    panel: el.querySelector('.panel'),
    trigger: el.querySelector('.trigger'),
  };
}

function init_accordion(el) {
  // Binding guard
  if (el[BOUND_FLAG]) return instances.get(el);
  el[BOUND_FLAG] = true;

  // Create and cache instance
  const instance = create_instance(el);
  instances.set(el, instance);

  // Setup
  instance.trigger?.addEventListener('click', () => toggle(el));

  return instance;
}

function toggle(el) {
  const instance = instances.get(el);
  if (!instance) return;

  instance.expanded = !instance.expanded;
  instance.panel?.classList.toggle('open', instance.expanded);
}

function cleanup_accordion(el) {
  if (!el[BOUND_FLAG]) return;
  el[BOUND_FLAG] = false;
  // WeakMap entry auto-cleans when el is garbage collected
}
```

### Observer with WeakMap State

```javascript
// Store observer state per element
const observer_state = new WeakMap();

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const state = observer_state.get(entry.target) || { seen: false };

    if (entry.isIntersecting && !state.seen) {
      state.seen = true;
      observer_state.set(entry.target, state);
      animate_in(entry.target);
    }
  });
});

function observe_element(el) {
  observer_state.set(el, { seen: false });
  io.observe(el);
}
```

---
