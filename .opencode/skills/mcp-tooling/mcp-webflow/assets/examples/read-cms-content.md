---
title: "Example: read CMS content and page metadata"
description: "Read-only Webflow session: discover tools, list CMS items, read page metadata via `get_page_metadata`. No confirmation gates needed."
trigger_phrases:
  - "webflow read example"
  - "webflow cms read"
  - "webflow read-only session"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Example: read CMS content and page metadata - Worked Example

Read-only Webflow session: discover tools, list CMS items, read page metadata (`get_page_metadata`) — no confirmation gates needed.

---

## 1. OVERVIEW

### Purpose

Show the read-only execution path: discovery-first, RO classification, ungated reads with evidence.

### Usage

Use as the template for any read-only Webflow request. Discovery must run per session; scope check only.

### Provenance and postconditions

- **Actions exercised:** `list_collection_items` and `get_page_metadata` (both class RO).
- **Expected postcondition:** CMS items and page metadata are read with zero write calls; no Webflow state changed; evidence captured redacted.
- **Read-back:** re-run `list_collection_items` and compare item count/IDs with the first read (must be unchanged), and confirm the transcript contains no DW/DS/PB/DP call.

---

## 2. EXAMPLE SESSION

**Prompt**: "list the CMS collection items in the test site and read the 'About' page metadata."

**Correct flow**:

1. `list_tools()` filtered to `webflow.webflow.*`.
2. Classify: RO — no confirmation gate.
3. Call the read actions; capture output (redacted) as evidence.
4. On 429: honor `Retry-After`.

---

## 3. RELATED RESOURCES

- [`../../references/action-reference.md`](../../references/action-reference.md) — RO actions
- [`../../SKILL.md`](../../SKILL.md) — class gates
