---
title: "Screenshot Capture"
description: "bdg dom screenshot <path> — write a PNG of the current page."
trigger_phrases:
  - "bdg screenshot"
  - "capture page screenshot cli"
  - "screenshot without puppeteer"
version: 1.0.0.0
---

# Screenshot Capture

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg dom screenshot /tmp/test.png 2>&1` writes a PNG of the current page (verify with the PNG magic bytes `89 50 4e 47`). The CDP alternative `Page.captureScreenshot` returns base64 and supports viewport clips and scale.

---

## 2. HOW IT WORKS

The performance target is capture in under 2 seconds. The graceful-degradation pattern tries the helper first and falls back to `bdg cdp Page.captureScreenshot | jq -r '.result.data' | base64 -d` when the helper fails. On the MCP path the equivalent is `take_screenshot`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Helper command list (`bdg dom screenshot`) |
| `references/cdp_patterns.md` §5 | Reference | Full screenshot workflow with fallback |
| `INSTALL_GUIDE.md` §6 | Guide | Screenshot usage patterns and MCP equivalent |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/dom_and_screenshot/screenshot_capture.md` | Manual | BDG-010 scenario contract (critical path) |

---

## 4. SOURCE METADATA

- Group: DOM and Screenshot
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `dom_and_screenshot/screenshot_capture.md`
Related references:
- [viewport_emulation.md](../dom_and_screenshot/viewport_emulation.md) — Viewport Emulation
- [multi_viewport_test.md](../automation_and_performance/multi_viewport_test.md) — Multi-Viewport Testing
