---
title: Common Commands
description: "Common condition-waiting, validation, performance, security, debugging, and browser-verification commands for Webflow work."
trigger_phrases:
  - "webflow common commands"
  - "webflow devtools commands"
  - "browser verification commands"
  - "frontend validation snippets"
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# Common Commands

Common snippets and terminal commands for implementing, debugging, and verifying Webflow components.

---

## 1. OVERVIEW

### Purpose

Collects frequently used commands and snippets for condition waiting, validation, security, performance, and browser inspection.

### When to Use

- Looking up a common implementation snippet
- Running browser verification from the terminal
- Inspecting performance, events, or network behavior

---

## 2. COMMON COMMANDS

### Condition-Based Waiting

```javascript
// Wait for element
await wait_for_element('[selector]', 5000);

// Wait for library
await wait_for_library('LibraryName', 10000);

// Wait for image
await wait_for_image_load(imgElement);

// Wait for transition
await wait_for_transition_end(element, 'opacity');

// DOM ready
await dom_ready();
```

### Validation Patterns

```javascript
// Entry validation
if (!param || typeof param !== 'expected') {
  console.error('[Component] Invalid parameter');
  return null;
}

// Safe nested access
const value = obj?.nested?.property ?? 'default';

// Sanitize text
text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
```

### Performance Patterns

See: [performance_patterns.md](../../implementation/performance-patterns/overview-and-checklist.md)

> **Cross-stack motion.dev reference**: For deeper Motion API, performance, and decision guidance beyond this Webflow quick reference, see [`../../animation/quick-start.md`](../../animation/quick-start.md), [`../../animation/performance-and-pitfalls.md`](../../animation/performance-and-pitfalls.md), and [`../../animation/decision-matrix.md`](../../animation/decision-matrix.md).

```javascript
// ✅ Animate transform/opacity only (Motion.dev)
import { animate } from "motion"
animate('.el', { y: [100, 0], opacity: [0, 1] }, { easing: "ease-out" });

// ✅ Lazy load with IntersectionObserver
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
    }
  });
});

// ✅ Debounce user input
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
```

### Security Patterns

See: [security_patterns.md](../../implementation/security-patterns/overview-and-checklist.md)

```javascript
// ✅ Sanitize user input
function sanitize_html(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ✅ Use textContent instead of innerHTML
element.textContent = user_input;

// ✅ Validate input format
const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email_regex.test(email)) throw new Error('Invalid email');
```

### Performance Debugging

See: [debugging_workflows.md](../../debugging/debugging-workflows/systematic-four-phases.md)

```markdown
Chrome DevTools → Performance tab
1. Record (circle icon)
2. Perform interaction
3. Stop after 3-5 seconds
4. Analyze flame graph (Yellow=JS, Purple=Render, Green=Paint)
5. Bottom-Up view: Find expensive functions
6. Fix bottlenecks (batch DOM reads/writes, optimize algorithms)

Memory leaks:
1. Memory tab → Take snapshot
2. Perform action (e.g., open/close modal 10x)
3. Take second snapshot
4. Comparison view → Sort by Size Delta
5. Look for Detached DOM nodes
```

### DevTools Commands

```javascript
// Find elements
$$('[selector]');

// Get event listeners
getEventListeners(element);

// Monitor events
monitorEvents(element, 'click');

// Copy to clipboard
copy(object);

// Print call stack
console.trace();

// Pause execution
debugger;
```

### Browser Verification (CLI Alternative)

**Automated browser testing via mcp-chrome-devtools skill:**

```bash
# Console error checking
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")'
bdg stop 2>&1

# Multi-viewport screenshots
bdg https://example.com 2>&1
bdg screenshot desktop.png 2>&1  # Default: ~1920x1080

# Mobile viewport (requires Emulation.setDeviceMetricsOverride first)
bdg cdp Emulation.setDeviceMetricsOverride '{"width":375,"height":667,"deviceScaleFactor":2,"mobile":true}' 2>&1
bdg screenshot mobile.png 2>&1
bdg stop 2>&1

# DOM inspection
bdg https://example.com 2>&1
bdg dom query ".header-nav" 2>&1
bdg js "document.title" 2>&1
bdg stop 2>&1

# Network monitoring
bdg https://example.com 2>&1
bdg network cookies 2>&1
bdg har export network-trace.har 2>&1
bdg stop 2>&1

# Performance metrics
bdg https://example.com 2>&1
bdg cdp Performance.getMetrics 2>&1
bdg stop 2>&1
```

**Installation:**
```bash
npm install -g browser-debugger-cli@alpha
```

**See:** [`.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md`](../../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md) for complete CLI workflows.

---
