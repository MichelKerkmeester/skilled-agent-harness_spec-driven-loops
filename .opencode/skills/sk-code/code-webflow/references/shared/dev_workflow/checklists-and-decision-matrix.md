---
title: Debugging/Verification Checklists, Decision Matrix & Related
description: "DevTools, logging, testing, automation patterns, error handling, and browser compatibility for Webflow stack — applies to all languages." — Debugging/Verification Checklists, Decision Matrix & Related.
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# Debugging/Verification Checklists, Decision Matrix & Related

## 10. DEBUGGING CHECKLIST

```markdown
□ PHASE 1: ROOT CAUSE INVESTIGATION
  □ Read error messages completely
  □ Check DevTools Console
  □ Reproduce consistently
  □ Check recent changes (git log)
  □ Gather evidence with logging

□ PHASE 2: PATTERN ANALYSIS
  □ Find working examples
  □ Compare against references
  □ Identify differences
  □ Understand dependencies

□ PHASE 3: HYPOTHESIS & TESTING
  □ Form single hypothesis
  □ Test minimally (one change)
  □ Verify before continuing
  □ Ask if unsure

□ PHASE 4: IMPLEMENTATION
  □ Document the fix
  □ Implement single fix
  □ Verify in browser
  □ If 3+ fixes failed → question approach
```

---

## 11. VERIFICATION CHECKLIST

```markdown
□ BROWSER TESTING
  □ Chrome (via Chrome DevTools MCP automated testing)
  □ Desktop viewport (1920px)
  □ Mobile emulation (375px)

□ VIEWPORT TESTING
  □ Mobile (375px)
  □ Tablet (991px)
  □ Desktop (1920px)
  □ Transitions smooth

□ FUNCTIONALITY
  □ Clicked interactive elements
  □ Watched full animation
  □ Tested form submissions
  □ Tested media playback

□ CONSOLE/ERRORS
  □ No console errors
  □ No console warnings
  □ No failed network requests
```

---

## 12. DECISION MATRIX

| Scenario                | Workflow                | Key Action                        |
| ----------------------- | ----------------------- | --------------------------------- |
| Element not ready       | condition-based-waiting | waitForElement                    |
| Form validation         | defense-in-depth        | Multi-layer validation            |
| After JS change         | cdn-versioning          | Run version updater               |
| Animation needed        | animation-workflows     | CSS vs Motion.dev decision tree   |
| Webflow collection list | webflow-patterns        | Event delegation, async rendering |
| Console error           | systematic-debugging    | Phase 1: Investigation            |
| Deep stack error        | root-cause-tracing      | Use debugger, trace back          |
| Ready to claim done     | verification            | Test in browser first             |
| Layout bug              | systematic-debugging    | Inspect element, computed styles  |
| Animation issue         | animation-workflows     | Motion.dev loading, layout jumps  |
| Webflow ID duplication  | webflow-patterns        | Use classes, event delegation     |
| Click not working       | systematic-debugging    | Check event listeners             |

---

## 13. QUICK COMMAND REFERENCE

### DevTools Console Commands

```javascript
// Find all elements matching selector
$$('[data-*]');

// Get computed style
getComputedStyle(element);

// Monitor all events on element
monitorEvents(element);
monitorEvents(element, 'click'); // Specific event

// Stop monitoring
unmonitorEvents(element);

// Copy to clipboard
copy(object);

// Clear console
clear();
```

### Performance Monitoring

```javascript
// Mark timing points
performance.mark('start');
// ... operation ...
performance.mark('end');

// Measure duration
performance.measure('operation', 'start', 'end');

// Get all measures
performance.getEntriesByType('measure');
```

### Network Debugging

```javascript
// Check if online
if (navigator.onLine) {
  // Network available
}

// Listen for online/offline
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

---

## RELATED RESOURCES

### Per-Language Style Guides
- [JavaScript Style Guide](../../javascript/style_guide/overview-naming-and-structure.md)
- [CSS Style Guide](../../css/style_guide.md)

### Shared Rules
- [Cross-Language Rules](../cross_language_rules.md)
- [Enforcement Guide](../enforcement.md)

### Implementation Workflows
- [implementation/](../implementation) — Implementation workflows directory
- [debugging/](../debugging) — Debugging workflows directory
- [verification/](../verification) — Verification workflows directory
- [deployment/](../deployment) — Deployment workflows directory

### Related Skills
- `mcp-chrome-devtools` — Chrome DevTools reference and CLI-based browser automation via browser-debugger-cli (bdg)

### External Resources
- [MDN Web Docs](https://developer.mozilla.org) — JavaScript, CSS, and browser API documentation
- [Can I Use](https://caniuse.com) — Browser compatibility tables
- [Chrome DevTools Docs](https://developer.chrome.com/docs/devtools/) — Official DevTools documentation
