---
title: Focus Restoration, Touch Detection, Anti-Patterns & Checklist
description: Focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs. — Focus Restoration, Touch Detection, Anti-Patterns & Checklist.
trigger_phrases:
  - "focus restoration touch"
  - "anti patterns checklist"
  - "focus restoration patterns"
  - "webflow focus restoration"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Focus Restoration, Touch Detection, Anti-Patterns & Checklist

Focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs. — Focus Restoration, Touch Detection, Anti-Patterns & Checklist.

---

## 1. OVERVIEW

### Purpose

Focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs. — Focus Restoration, Touch Detection, Anti-Patterns & Checklist.

### When to Use

Use this reference when implementing or troubleshooting focus restoration, touch detection, anti-patterns & checklist.

---

## 2. FOCUS RESTORATION

### Save Focus on Modal Open

**Source:** `src/javascript/modal/modal_welcome.js:485`

```javascript
state.last_focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
```

**Pattern:**
1. Save `document.activeElement` before showing modal
2. Type-check ensures it's a focusable HTMLElement
3. Store in state for later restoration

### Restore Focus on Modal Close

**Source:** `src/javascript/modal/modal_welcome.js:430-442`

```javascript
const restore_focus = () => {
  // ACCESSIBILITY: Return focus to pre-open element
  const focus_target = state.last_focus;
  state.last_focus = null;
  if (!focus_target) return;
  try {
    if (document.contains(focus_target)) {
      focus_target.focus({ preventScroll: true });
    }
  } catch {
    /* Element may have been removed */
  }
};
```

**Defensive checks:**
1. **Null check** - Element might not have been captured
2. **DOM containment** - Element may have been removed during modal lifecycle
3. **Try-catch** - Focus can fail on detached or unusual elements
4. **preventScroll** - Avoid layout shift when restoring focus

### Complete Save/Restore Pattern

```javascript
// STATE: Track previous focus
const modal_state = {
  last_focus: null,
  is_open: false
};

function open_modal(container) {
  // 1. Save current focus BEFORE any DOM changes
  modal_state.last_focus = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;

  // 2. Show modal
  container.style.display = 'block';
  container.setAttribute('aria-hidden', 'false');
  modal_state.is_open = true;

  // 3. Move focus to modal (first focusable or container itself)
  const first_focusable = container.querySelector(FOCUSABLE_SELECTOR);
  if (first_focusable) {
    first_focusable.focus({ preventScroll: true });
  } else {
    container.focus({ preventScroll: true });
  }
}

function close_modal(container) {
  if (!modal_state.is_open) return;

  // 1. Hide modal
  container.style.display = 'none';
  container.setAttribute('aria-hidden', 'true');
  modal_state.is_open = false;

  // 2. Restore focus
  const focus_target = modal_state.last_focus;
  modal_state.last_focus = null;

  if (focus_target && document.contains(focus_target)) {
    try {
      focus_target.focus({ preventScroll: true });
    } catch {
      // Element may reject focus
    }
  }
}
```

### Focus Restoration Validation Checklist

```markdown
FOCUS RESTORATION VALIDATION:
[ ] Focus saved before modal opens
[ ] Focus saved only if element is HTMLElement
[ ] Focus restored after modal closes
[ ] DOM containment checked before restore
[ ] Try-catch wraps focus() call
[ ] preventScroll used to avoid layout shift
[ ] Saved reference cleared after restore (prevent memory leak)
```

---

## 3. TOUCH DETECTION

### Purpose

Detect input method (keyboard, mouse, touch) to apply appropriate focus styling. Keyboard users need visible focus indicators; mouse/touch users often find them distracting.

### Keyboard Navigation Detection

**Source:** `src/javascript/contact/input_focus_handler.js:1-79`

```javascript
(() => {
  function initFocusHandler() {
    /* 1. STATE MANAGEMENT */
    let usingKeyboard = false;

    /* 2. KEYBOARD DETECTION */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        usingKeyboard = true;
        document.body.classList.add("using-keyboard");
      }
    });

    /* 3. MOUSE/TOUCH DETECTION */
    document.addEventListener("mousedown", () => {
      usingKeyboard = false;
      document.body.classList.remove("using-keyboard");
    });

    document.addEventListener(
      "touchstart",
      () => {
        usingKeyboard = false;
        document.body.classList.remove("using-keyboard");
      },
      { passive: true }
    );
  }

  /* 4. INITIALIZE */
  const INIT_FLAG = '__focusHandlerCdnInit';

  const start = () => {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    if (document.readyState !== 'loading') {
      setTimeout(initFocusHandler, 0);
      return;
    }

    document.addEventListener(
      'DOMContentLoaded',
      () => setTimeout(initFocusHandler, 0),
      { once: true }
    );
  };

  if (window.Webflow?.push) {
    window.Webflow.push(start);
  } else {
    start();
  }
})();
```

**CSS usage:**

```css
/* Hide focus ring for mouse/touch users */
:focus {
  outline: none;
}

/* Show focus ring only for keyboard users */
.using-keyboard :focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Media Query-Based Detection

**Source:** `src/javascript/form/form_submission.js:284-294`

```javascript
function has_fine_pointer() {
  try {
    // Check if primary pointing device is precise (mouse/trackpad)
    // Returns false for touch-only devices
    return window.matchMedia('(pointer: fine)').matches;
  } catch {
    // Fallback: assume fine pointer if detection fails (desktop default)
    return true;
  }
}
```

**Source:** `src/javascript/molecules/link_grid.js:11-14`

```javascript
function isDesktopDevice() {
  // Check if device has precise pointer and hover capability
  return window.matchMedia("(pointer: fine) and (hover: hover)").matches;
}
```

### Comprehensive Touch Detection

**Source:** `src/javascript/video/video_background_hls_hover.js:27-42`

```javascript
let _mobile_detection_cached = false;
let _is_touch_like = false;

function compute_mobile_detection() {
  if (_mobile_detection_cached) return;
  _mobile_detection_cached = true;

  const prefers_coarse_pointer = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
  const prefers_pointer_coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const has_touch_points = typeof navigator !== 'undefined' && Number.isFinite(navigator.maxTouchPoints) && navigator.maxTouchPoints > 0;
  _is_touch_like = prefers_coarse_pointer || prefers_pointer_coarse || has_touch_points;
}
```

**Detection methods combined:**
1. `(hover: none)` - Device cannot hover (touch screens)
2. `(pointer: coarse)` - Imprecise pointing device (finger vs mouse)
3. `navigator.maxTouchPoints > 0` - Device supports touch events

### Touch Detection Decision Tree

```
Detect Input Method
├─ Tab key pressed
│  └─ Add .using-keyboard class
│     └─ Show focus indicators
├─ Mouse/touch event
│  └─ Remove .using-keyboard class
│     └─ Hide focus indicators
└─ Initial device check
   ├─ (pointer: fine) AND (hover: hover)
   │  └─ Desktop with mouse
   ├─ (pointer: coarse) OR (hover: none)
   │  └─ Touch device
   └─ navigator.maxTouchPoints > 0
      └─ Touch-capable device
```

### Touch Detection Patterns Summary

| Method         | Media Query                | Use Case                 |
| -------------- | -------------------------- | ------------------------ |
| Fine pointer   | `(pointer: fine)`          | Mouse/trackpad precision |
| Coarse pointer | `(pointer: coarse)`        | Touch/stylus             |
| Hover capable  | `(hover: hover)`           | Can hover elements       |
| No hover       | `(hover: none)`            | Touch-only               |
| Touch points   | `navigator.maxTouchPoints` | Touch hardware present   |

---

## 4. ANTI-PATTERNS

### Focus Trap Anti-Patterns

**Never:**
- Use `tabindex` on non-interactive elements (creates keyboard traps)
- Forget to remove event listeners (memory leak)
- Skip visibility checks (traps focus in hidden content)
- Use `tabindex > 0` (breaks natural tab order)

```javascript
// BAD: Positive tabindex disrupts natural order
<button tabindex="5">First</button>
<button tabindex="1">Second</button>

// GOOD: Natural order or tabindex="0"
<button>First</button>
<button>Second</button>
```

### Focus Restoration Anti-Patterns

**Never:**
- Forget to check `document.contains()` before focusing
- Store focus reference without instanceof check
- Skip try-catch around focus() calls
- Leave stale focus references (memory leak)

```javascript
// BAD: No defensive checks
function restore_focus() {
  saved_focus.focus();  // Crashes if element removed!
}

// GOOD: Full defensive pattern
function restore_focus() {
  const target = saved_focus;
  saved_focus = null;  // Clear reference
  if (target && document.contains(target)) {
    try {
      target.focus({ preventScroll: true });
    } catch {}
  }
}
```

### Touch Detection Anti-Patterns

**Never:**
- Detect touch once and cache forever (devices can change)
- Remove focus styles entirely (breaks accessibility)
- Use touch detection to disable keyboard navigation
- Assume touch = mobile (desktop touchscreens exist)

```javascript
// BAD: Removes focus styling entirely
:focus { outline: none; }  // WCAG violation!

// GOOD: Hide for mouse, show for keyboard
.using-keyboard :focus { outline: 2px solid blue; }
```

---

## 5. INTEGRATION CHECKLIST

### Before Modal Implementation

```markdown
FOCUS MANAGEMENT CHECKLIST:
[ ] FOCUSABLE_SELECTOR constant defined
[ ] get_focusable() filters hidden/disabled elements
[ ] Focus trap intercepts Tab and Shift+Tab
[ ] Focus saved before modal opens
[ ] Focus moves to first focusable on open
[ ] Focus restored after modal closes
[ ] Cleanup function removes event listeners
[ ] Touch detection initializes on page load
[ ] .using-keyboard class toggles focus styles
```

### WCAG 2.1 Compliance

| Criterion              | Requirement                           | Implementation                          |
| ---------------------- | ------------------------------------- | --------------------------------------- |
| 2.1.1 Keyboard         | All functionality keyboard accessible | Focus trap + tab navigation             |
| 2.1.2 No Keyboard Trap | Users can tab away from any component | Trap only when modal open               |
| 2.4.3 Focus Order      | Logical, meaningful sequence          | Natural DOM order, no positive tabindex |
| 2.4.7 Focus Visible    | Focus indicator visible               | .using-keyboard styles                  |

---

## 6. RELATED RESOURCES

### Reference Files

- [`../../css/quality_standards/patterns_and_naming_enforcement.md`](../../css/quality_standards/patterns_and_naming_enforcement.md) - CSS quality patterns relevant to focus styling (custom property prefixes, attribute selector i flag, BEM)
- [webflow_patterns.md](../webflow_patterns/overview_limits_and_collection_lists.md) - Modal component patterns
- [animation_workflows.md](../animation_workflows/overview_decision_tree_and_css.md) - Focus during transitions
- [security_patterns.md](../security_patterns/overview_and_checklist.md) - Input validation for forms

### Source Files

- `src/javascript/modal/modal_cookie_consent.js` - Complete focus trap implementation
- `src/javascript/modal/modal_welcome.js` - Focus save/restore pattern
- `src/javascript/form/form_submission.js` - Form modal focus management
- `src/javascript/contact/input_focus_handler.js` - Touch/keyboard detection

### External Resources

- [WCAG 2.1 Focus Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html) - W3C focus visibility requirements
- [MDN: Using tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) - Tabindex best practices
