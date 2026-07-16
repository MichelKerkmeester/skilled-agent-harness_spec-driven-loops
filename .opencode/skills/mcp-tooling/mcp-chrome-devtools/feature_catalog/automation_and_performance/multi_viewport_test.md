---
title: "Multi-Viewport Testing"
description: "examples/multi-viewport-test.sh — desktop/laptop/tablet/mobile rendering with per-viewport captures."
trigger_phrases:
  - "multi viewport test"
  - "responsive design validation cli"
  - "cross device screenshots"
version: 1.0.0.0
---

# Multi-Viewport Testing

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`./multi-viewport-test.sh [url] [selector] [trigger-class]` tests page rendering across desktop (1920x1080), laptop (1366x768), tablet (768x1024), mobile (375x667), and mobile large (414x896), capturing per-viewport screenshots, metrics, and console logs. Exit `0` when no viewport has console errors.

---

## 2. HOW IT WORKS

Viewports are driven by `bdg cdp Emulation.setDeviceMetricsOverride` with `mobile: true` for phone sizes, and the `VIEWPORTS` array is extendable in the script. Pairs with ImageMagick `compare` for visual-diff workflows across environments.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `examples/multi-viewport-test.sh` | Script | The viewport matrix workflow |
| `references/cdp_patterns.md` §4 | Reference | Device metrics override pattern |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `examples/README.md` §3.3, §4 | Manual | Viewport list, outputs, visual-diff workflow |

---

## 4. SOURCE METADATA

- Group: Automation and Performance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `automation_and_performance/multi_viewport_test.md`
Related references:
- [viewport_emulation.md](../dom_and_screenshot/viewport_emulation.md) — Viewport Emulation
- [screenshot_capture.md](../dom_and_screenshot/screenshot_capture.md) — Screenshot Capture
