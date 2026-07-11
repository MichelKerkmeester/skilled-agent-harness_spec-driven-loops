---
title: Focus Management - Accessibility Patterns
description: Focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs.
trigger_phrases:
  - "webflow focus management"
  - "focus trap modal"
  - "focus restoration pattern"
  - "focusable selector accessibility"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Focus Management - Accessibility Patterns

Focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs.

---

## 1. OVERVIEW

### Purpose

Provides systematic patterns for implementing keyboard accessibility in modal dialogs and interactive components, ensuring WCAG 2.1 compliance for focus management.

### When to Use

Apply these patterns when:
- Building modal dialogs or overlays
- Implementing dropdown menus or popovers
- Creating any component that traps user focus
- Handling focus styling for mixed input devices (keyboard, mouse, touch)

### Core Principle

**Focus must be trapped within modals, saved on open, and restored on close.** Users navigating with keyboards must never lose context or get trapped outside visible UI.

### Key Sources

| Source File                           | Lines        | Pattern                         |
| ------------------------------------- | ------------ | ------------------------------- |
| `modal/modal_cookie_consent.js`       | 706-761      | Focus trap + FOCUSABLE_SELECTOR |
| `modal/modal_welcome.js`              | 430-442, 485 | Focus save/restore              |
| `form/form_submission.js`             | 15, 223-268  | Focus trap with cleanup         |
| `contact/input_focus_handler.js`      | 1-79         | Touch/keyboard detection        |
| `video/video_background_hls_hover.js` | 27-42        | Touch device detection          |

---

## 2. FOCUSABLE_SELECTOR CONSTANT

### The Canonical Selector

The `FOCUSABLE_SELECTOR` constant defines all interactive elements that can receive keyboard focus.

**Source:** `src/javascript/modal/modal_cookie_consent.js:707`

```javascript
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
```

### Selector Breakdown

| Selector                                     | Purpose                   | Exclusions                     |
| -------------------------------------------- | ------------------------- | ------------------------------ |
| `a[href]`                                    | Links with destinations   | Anchor-only links without href |
| `button:not([disabled])`                     | Enabled buttons           | Disabled buttons               |
| `input:not([disabled]):not([type="hidden"])` | Visible, enabled inputs   | Hidden inputs, disabled inputs |
| `textarea:not([disabled])`                   | Enabled textareas         | Disabled textareas             |
| `select:not([disabled])`                     | Enabled dropdowns         | Disabled selects               |
| `[tabindex]:not([tabindex="-1"])`            | Custom focusable elements | Programmatically unfocusable   |

### Variant with Modal-Specific Elements

**Source:** `src/javascript/form/form_submission.js:15`

```javascript
const FOCUSABLE_SELECTOR = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [data-modal-close], .modal--close-button';
```

**Additional elements:**
- `[data-modal-close]` - Close trigger elements
- `.modal--close-button` - Webflow modal close buttons

### Get Focusable Elements Function

**Source:** `src/javascript/modal/modal_cookie_consent.js:709-718`

```javascript
function get_focusable(container) {
  if (!container) return [];
  const nodes = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  return nodes.filter((el) =>
    el instanceof HTMLElement &&
    el.tabIndex !== -1 &&
    el.getAttribute('aria-hidden') !== 'true' &&
    el.offsetParent !== null
  );
}
```

**Filter criteria:**
1. `el instanceof HTMLElement` - Must be HTML element
2. `el.tabIndex !== -1` - Not programmatically removed from tab order
3. `el.getAttribute('aria-hidden') !== 'true'` - Not hidden from assistive tech
4. `el.offsetParent !== null` - Element is visible (not display:none or hidden ancestor)

---

## 3. FOCUS TRAP IMPLEMENTATION

### Pattern Overview

Focus traps intercept Tab key navigation to keep focus within a container (modal, dialog, dropdown). When reaching the last focusable element, Tab wraps to the first; Shift+Tab from first wraps to last.

### Basic Focus Trap

**Source:** `src/javascript/form/form_submission.js:223-268`

```javascript
function create_focus_trap(container) {
  if (!container) {
    console.warn('create_focus_trap: container is required');
    return () => {};
  }

  const had_tabindex = container.hasAttribute('tabindex');
  if (!had_tabindex) {
    container.setAttribute('tabindex', '-1');
  }

  const get_focusable = () => {
    const nodes = to_array(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((node) => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.tabIndex === -1) return false;
      if (node.getAttribute('aria-hidden') === 'true') return false;
      if (node.hasAttribute('disabled')) return false;
      if (node.offsetParent === null) return false;
      return true;
    });
    return nodes.length ? nodes : [container];
  };

  const keydown_handler = (event) => {
    if (event.key !== 'Tab') return;
    const focusable = get_focusable();
    if (!focusable.length) return;

    const active = document.activeElement;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (!container.contains(active) || active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      }
    } else if (!container.contains(active) || active === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  document.addEventListener('keydown', keydown_handler, true);

  return () => {
    document.removeEventListener('keydown', keydown_handler, true);
    if (!had_tabindex && container.getAttribute('tabindex') === '-1') {
      container.removeAttribute('tabindex');
    }
  };
}
```

**Key implementation details:**
1. **Container tabindex** - Add `tabindex="-1"` if missing (allows focus() call)
2. **Capture phase** - Use `true` for event capture to intercept before other handlers
3. **preventScroll** - Avoid jarring scroll jumps when focusing
4. **Cleanup function** - Returns function to remove listener and restore tabindex

### Advanced Focus Trap with State Management

**Source:** `src/javascript/modal/modal_cookie_consent.js:720-761`

```javascript
function ensure_focus_trap(group, getContainerFn) {
  function keydown_handler(event) {
    if (event.key !== 'Tab') return;
    const container = typeof getContainerFn === 'function' ? getContainerFn() : null;
    if (!container || !is_visible(container)) return;
    const focusable = get_focusable(container);
    if (!focusable.length) return;

    const active = document.activeElement;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (!container.contains(active) || active === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (!container.contains(active) || active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return {
    attach() {
      if (state.focus_traps[group]) return;
      document.addEventListener('keydown', keydown_handler, true);
      state.focus_traps[group] = { keydown_handler };
      state.cleanups.push(() => {
        try { document.removeEventListener('keydown', keydown_handler, true); } catch (_) {}
      });
    },
    detach() {
      const trap = state.focus_traps[group];
      if (!trap) return;
      try { document.removeEventListener('keydown', trap.keydown_handler, true); } catch (_) {}
      state.focus_traps[group] = null;
    },
  };
}
```

**Advanced features:**
1. **Group-based traps** - Multiple independent focus traps by group name
2. **Dynamic container** - `getContainerFn` allows container to change/animate
3. **Visibility check** - Only trap when container is visible
4. **Attach/detach API** - Explicit control over trap lifecycle
5. **Cleanup registration** - Auto-cleanup on module teardown

### Focus Trap Validation Checklist

```markdown
FOCUS TRAP VALIDATION:
[ ] Tab from last element wraps to first
[ ] Shift+Tab from first element wraps to last
[ ] Tab outside container moves focus inside
[ ] Disabled/hidden elements are skipped
[ ] Focus visible indicator shows on all elements
[ ] Cleanup function removes event listener
[ ] Container receives tabindex="-1" if needed
```

---
