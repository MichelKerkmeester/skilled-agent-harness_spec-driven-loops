---
title: "Example: read CMS content and page metadata"
description: "Read-only Webflow session: discover tools, list CMS items, read page metadata. No confirmation gates needed."
trigger_phrases:
  - "webflow read example"
  - "webflow cms read"
  - "webflow read-only session"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Example: read CMS content and page metadata - Worked Example

Read-only Webflow session: discover tools, list CMS items, read page metadata — no confirmation gates needed.

---

## 1. OVERVIEW

### Purpose

Show the read-only execution path: discovery-first, RO classification, ungated reads with evidence.

### Usage

Use as the template for any read-only Webflow request. Discovery must run per session; scope check only.

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
