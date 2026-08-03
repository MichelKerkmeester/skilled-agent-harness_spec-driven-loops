---
title: "Example: draft-safe page settings update"
description: "Draft-write session: update page settings without publishing. No confirmation gate; scope check only."
trigger_phrases:
  - "webflow draft example"
  - "webflow page settings"
  - "webflow draft write"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Example: draft-safe page settings update - Worked Example

Draft-write Webflow session: update page settings without flipping publishing status.

---

## 1. OVERVIEW

### Purpose

Show the DW path: draft-scoped writes pass with a scope check; publish-status changes must not sneak through.

### Usage

Use for any draft-scoped content write. Review the payload before sending; never flip publishing status without the PB gate.

---

## 2. EXAMPLE SESSION

**Prompt**: "update the 'About' page title in the test site (draft)."

**Correct flow**:

1. Discover + classify: `update_page_settings` — DW (publish-status change would be PB).
2. Capture the before-state.
3. Send the draft payload; confirm no status flip.
4. Capture the after-state as evidence.

---

## 3. RELATED RESOURCES

- [`../../references/action-reference.md`](../../references/action-reference.md) — pages group
- [`../../feature-catalog/content/site-pages-scripts.md`](../../feature-catalog/content/site-pages-scripts.md)
