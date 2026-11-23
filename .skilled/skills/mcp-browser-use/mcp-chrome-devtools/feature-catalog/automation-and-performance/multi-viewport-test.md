---
title: "Multi-Viewport Testing"
description: "examples/multi-viewport-test.sh — desktop/laptop/tablet/mobile rendering with per-viewport captures."
trigger_phrases:
  - "multi viewport test"
  - "responsive design validation cli"
  - "cross device screenshots"
version: 1.0.1.0
---

# Multi-Viewport Testing

---

## 1. OVERVIEW

`./multi-viewport-test.sh [url] [selector] [trigger-class]` tests page rendering across desktop (1920x1080), laptop (1366x768), tablet (768x1024), mobile (375x667), and mobile large (414x896), capturing per-viewport screenshots, metrics and console logs. A missing selector exits `1`. Each viewport is set with `bdg cdp Emulation.setDeviceMetricsOverride --params '<json>'`, and a console error read from `bdg console --list --json` fails that viewport (see `examples/README.md` §3.3).

---

## 2. HOW IT WORKS

Viewports are driven by `bdg cdp Emulation.setDeviceMetricsOverride` with `mobile: true` for phone sizes, and the `VIEWPORTS` array is extendable in the script. Pairs with ImageMagick `compare` for visual-diff workflows across environments.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `examples/multi-viewport-test.sh` | Script | The viewport matrix workflow |
| `references/cdp-patterns.md` §4 | Reference | Device metrics override pattern |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `examples/README.md` §3.3, §4 | Manual playbook | Viewport list, outputs, visual-diff workflow |

---

## 4. SOURCE METADATA

- Group: Automation and Performance
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `automation-and-performance/multi-viewport-test.md`
Related references:
- [viewport-emulation.md](../../feature-catalog/dom-and-screenshot/viewport-emulation.md) — Viewport Emulation
- [screenshot-capture.md](../../feature-catalog/dom-and-screenshot/screenshot-capture.md) — Screenshot Capture
