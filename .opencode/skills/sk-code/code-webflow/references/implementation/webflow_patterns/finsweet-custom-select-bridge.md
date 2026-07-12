---
title: Finsweet Custom Select Bridge Pattern & Related
description: Complete platform constraints and collection list patterns for Webflow development. — Finsweet Custom Select Bridge Pattern & Related.
importance_tier: normal
contextType: implementation
version: 3.5.0.14
---

# Finsweet Custom Select Bridge Pattern & Related

## 8. FINSWEET CUSTOM SELECT BRIDGE PATTERN

### Problem: Custom Select + Native Form Submission

**Issue:** Custom select UI components (styled dropdowns) don't integrate with native form submission or Finsweet's list-sort library.

**Why this happens:**
- Custom selects use `<div>` elements for styling flexibility
- Native `<select>` elements are required for form submission
- Finsweet list-sort only detects changes on native `<select>` elements
- Two separate DOM structures need to stay synchronized

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CUSTOM SELECT BRIDGE PATTERN                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐         ┌─────────────────────┐                   │
│  │   Custom Select     │   sync  │   Hidden Native     │                   │
│  │   (Visible UI)      │ ──────► │   <select>          │                   │
│  │                     │         │   (Form/FS Target)  │                   │
│  └─────────────────────┘         └─────────────────────┘                   │
│           │                                │                                │
│           ▼                                ▼                                │
│  ┌─────────────────────┐         ┌─────────────────────┐                   │
│  │  User Interaction   │         │  Finsweet/Form      │                   │
│  │  - Click options    │         │  - list-sort        │                   │
│  │  - Keyboard nav     │         │  - Form submission  │                   │
│  │  - Visual feedback  │         │  - Native events    │                   │
│  └─────────────────────┘         └─────────────────────┘                   │
│                                                                             │
│  FLOW:                                                                      │
│  1. User clicks custom option                                               │
│  2. CustomSelect updates visible input                                      │
│  3. Bridge listens for 'change' event on custom input                       │
│  4. Bridge syncs value to hidden native <select>                            │
│  5. Bridge dispatches 'change' event on native select                       │
│  6. Finsweet/Form receives native change event                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Pattern

**File structure (load order matters):**
1. `input_select.js` - Base CustomSelect implementation
2. `input_select_fs_bridge.js` - Finsweet bridge (loads AFTER)

#### Step 1: Hidden Native Select Creation

Create a visually hidden but accessible native `<select>` that mirrors custom options.

```javascript
// [SOURCE: src/javascript/form/input_select_fs_bridge.js:26-73]

// Configuration
const FS_ATTR = 'fs-list-element';
const FS_VALUE = 'sort-trigger';
const HIDDEN_CLASS = 'fs-sort-select--hidden';

function create_hidden_select(custom_select_instance) {
  const container = custom_select_instance.container;
  const options = custom_select_instance.options;
  const placeholder = custom_select_instance.placeholder;

  const native_select = document.createElement('select');
  native_select.className = HIDDEN_CLASS;
  native_select.setAttribute(FS_ATTR, FS_VALUE);

  // Hide visually but keep accessible to Finsweet
  // Uses screen-reader-only pattern (not display:none)
  native_select.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    pointer-events: none;
  `;

  const placeholder_opt = document.createElement('option');
  placeholder_opt.value = '';
  placeholder_opt.textContent = placeholder;
  placeholder_opt.disabled = true;
  placeholder_opt.selected = true;
  native_select.appendChild(placeholder_opt);

  options.forEach((custom_opt) => {
    const native_opt = document.createElement('option');
    native_opt.value = custom_opt.dataset.value || '';
    native_opt.textContent = custom_opt.textContent.trim();
    native_select.appendChild(native_opt);
  });

  container.appendChild(native_select);

  // Remove attribute from wrapper so Finsweet only sees the native select
  container.removeAttribute(FS_ATTR);

  return native_select;
}
```

**Key implementation details:**
- Uses screen-reader-only CSS pattern (not `display: none`)
- `display: none` prevents Finsweet from detecting the element
- Moves `fs-list-element` attribute from wrapper to native select
- Mirrors all options including placeholder

#### Step 2: Sync Helper

Synchronize selection from custom select to hidden native select.

```javascript
// [SOURCE: src/javascript/form/input_select_fs_bridge.js:79-83]

function sync_to_native(native_select, value) {
  native_select.value = value;
  native_select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

**Critical:** Must dispatch a `change` event after setting value. Finsweet listens for native events, not just value changes.

#### Step 3: Bridge Initialization

Connect the bridge after CustomSelect instances are ready.

```javascript
// [SOURCE: src/javascript/form/input_select_fs_bridge.js:89-137]

const INIT_FLAG = '__finsweetSelectBridgeInit';

function init_finsweet_bridge() {
  const sort_triggers = document.querySelectorAll(
    `[data-select="wrapper"][${FS_ATTR}="${FS_VALUE}"]`
  );

  if (sort_triggers.length === 0) return;

  sort_triggers.forEach((container) => {
    const instance = container._customSelect;
    if (!instance) {
      console.warn('FinsweetBridge: CustomSelect instance not found', container);
      return;
    }

    const native_select = create_hidden_select(instance);

    instance._fs_native_select = native_select;

    instance.input.addEventListener('change', () => {
      const value = instance.input.dataset.value || '';
      sync_to_native(native_select, value);
    });
  });

  console.log(`FinsweetBridge: Connected ${sort_triggers.length} sort trigger(s)`);
}

const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  // Delay to ensure CustomSelect has initialized first
  setTimeout(init_finsweet_bridge, 100);
};

// WEBFLOW: Use Webflow.push for proper timing with Webflow interactions
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
```

**Load order dependency:** Bridge must load AFTER `input_select.js` because it accesses `container._customSelect` instance.

### Webflow Attribute Configuration

| Element | Attribute | Value | Purpose |
|---------|-----------|-------|---------|
| Custom select wrapper | `data-select` | `wrapper` | CustomSelect targets this |
| Custom select wrapper | `fs-list-element` | `sort-trigger` | Bridge detects this |
| Hidden native select | `fs-list-element` | `sort-trigger` | Finsweet targets this |
| Custom options | `data-value` | `{sort-value}` | Value synced to native |

**Attribute migration:** Bridge moves `fs-list-element` from wrapper to hidden native select, so Finsweet only sees one target.

### DOM Structure

**Before bridge initialization:**
```html
<div data-select="wrapper" fs-list-element="sort-trigger">
  <div data-select="trigger">
    <input data-select="input" placeholder="Sort by..." readonly>
  </div>
  <div data-select="dropdown">
    <div data-select="option" data-value="date-asc">Date (Oldest)</div>
    <div data-select="option" data-value="date-desc">Date (Newest)</div>
    <div data-select="option" data-value="name-asc">Name (A-Z)</div>
  </div>
</div>
```

**After bridge initialization:**
```html
<div data-select="wrapper" data-select-initialized="true">
  <!-- fs-list-element removed from wrapper -->
  <div data-select="trigger">
    <input data-select="input" placeholder="Sort by..." readonly>
  </div>
  <div data-select="dropdown">
    <div data-select="option" data-value="date-asc">Date (Oldest)</div>
    <div data-select="option" data-value="date-desc">Date (Newest)</div>
    <div data-select="option" data-value="name-asc">Name (A-Z)</div>
  </div>
  <!-- Hidden native select created by bridge -->
  <select class="fs-sort-select--hidden" fs-list-element="sort-trigger">
    <option value="" disabled selected>Sort by...</option>
    <option value="date-asc">Date (Oldest)</option>
    <option value="date-desc">Date (Newest)</option>
    <option value="name-asc">Name (A-Z)</option>
  </select>
</div>
```

### When to Use This Pattern

| Scenario | Use Bridge? | Rationale |
|----------|-------------|-----------|
| Custom select + Finsweet list-sort | Yes | Finsweet requires native select |
| Custom select + Form submission | Maybe | Use if backend expects native select |
| Custom select + Validation only | No | CustomSelect handles validation |
| Native select + Custom styling | No | Style native select with CSS |

### Anti-Patterns to Avoid

**Do NOT use `display: none` for hidden select:**
```javascript
// ❌ WRONG: Finsweet cannot detect display:none elements
native_select.style.display = 'none';

// ✅ CORRECT: Screen-reader-only pattern
native_select.style.cssText = `
  position: absolute;
  width: 1px;
  height: 1px;
  clip: rect(0, 0, 0, 0);
  ...
`;
```

**Do NOT sync on every input event:**
```javascript
// ❌ WRONG: Fires too frequently, includes partial values
instance.input.addEventListener('input', () => {
  sync_to_native(native_select, instance.input.value);
});

// ✅ CORRECT: Only sync on final selection (change event)
instance.input.addEventListener('change', () => {
  sync_to_native(native_select, instance.input.dataset.value);
});
```

**Do NOT forget to dispatch native event:**
```javascript
// ❌ WRONG: Value changes but Finsweet doesn't detect it
native_select.value = value;

// ✅ CORRECT: Dispatch change event for Finsweet
native_select.value = value;
native_select.dispatchEvent(new Event('change', { bubbles: true }));
```

### Debugging the Bridge

**Check if bridge initialized:**
```javascript
console.log(window.__finsweetSelectBridgeInit);

document.querySelectorAll('.fs-sort-select--hidden').forEach(sel => {
  console.log('Hidden select:', sel.value, sel.options.length);
});
```

**Verify sync is working:**
```javascript
document.querySelectorAll('.fs-sort-select--hidden').forEach(sel => {
  sel.addEventListener('change', (e) => {
    console.log('Native select changed:', e.target.value);
  });
});
```

**Common issues:**

| Symptom | Cause | Fix |
|---------|-------|-----|
| Bridge not initializing | Script load order | Load bridge AFTER input_select.js |
| Finsweet not sorting | Hidden select not found | Check fs-list-element attribute |
| Values not syncing | Missing change listener | Verify event listener on custom input |
| Double sorting | Attribute on both elements | Bridge should remove attr from wrapper |

---

## 9. RELATED RESOURCES

### Reference Files
- [`../../css/patterns/tokens_state_machine_and_triggers.md`](../../css/patterns/tokens_state_machine_and_triggers.md) — CSS-specific Webflow patterns (token system, state machines, BEM hover/focus, form validation, accessibility, mobile)
- [implementation_workflows.md](../implementation_workflows/condition-based-waiting.md) - Condition-based waiting patterns complement async rendering solutions
- [code_quality_standards.md](../../javascript/quality_standards/init_dom_error_and_async.md) - CDN-safe initialization pattern for Webflow platform
- [`../../css/quality_standards/patterns_and_naming_enforcement.md`](../../css/quality_standards/patterns_and_naming_enforcement.md) - CSS quality patterns for Webflow Designer styling layer + 4 CSS enforcement subsections
- [performance_patterns.md](../performance_patterns/overview-and-checklist.md) - Performance optimization for collection lists with many items

### Source Files (Evidence)
- `src/javascript/form/input_select.js` - Base CustomSelect implementation with ARIA support
- `src/javascript/form/input_select_fs_bridge.js` - Finsweet bridge pattern implementation

### Related Skills
- `mcp-chrome-devtools` - CLI debugging tools for ID duplication detection and collection list inspection

### External Documentation
- [Finsweet CMS Sort](https://finsweet.com/attributes/cms-sort) - Official Finsweet list-sort documentation
