---
title: "Viewport Emulation"
description: "bdg cdp Emulation.setDeviceMetricsOverride — emulate device sizes for responsive testing."
trigger_phrases:
  - "viewport emulation"
  - "device metrics override"
  - "mobile viewport testing cli"
version: 1.0.0.0
---

# Viewport Emulation

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg cdp Emulation.setDeviceMetricsOverride '{"width":375,"height":667,"deviceScaleFactor":2,"mobile":true}' 2>&1` switches the page to an emulated device viewport. Combine with screenshot capture for responsive validation.

---

## 2. HOW IT WORKS

The multi-viewport example script iterates desktop (1920x1080), laptop (1366x768), tablet (768x1024), and mobile (375x667, 414x896 with `mobile: true`) capturing per-viewport screenshots, metrics, and console logs. On the MCP path the equivalent tool is `resize_page`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `references/cdp_patterns.md` §4 | Reference | Layout and metrics patterns |
| `examples/multi-viewport-test.sh` | Script | Production multi-viewport workflow |
| `INSTALL-GUIDE.md` §10 | Guide | MCP `resize_page` equivalence |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `examples/README.md` §3.3 | Manual | Viewport matrix, outputs, and exit codes |

---

## 4. SOURCE METADATA

- Group: DOM and Screenshot
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `dom_and_screenshot/viewport_emulation.md`
Related references:
- [screenshot_capture.md](../dom_and_screenshot/screenshot_capture.md) — Screenshot Capture
- [multi_viewport_test.md](../automation_and_performance/multi_viewport_test.md) — Multi-Viewport Testing
