---
title: sk-doc Command Known-Deviation Suppression List
description: The peer-specific deviation list for deterministic command-surface findings, with generic document validation kept outside the adapter boundary.
trigger_phrases:
  - "sk-doc command known deviations"
  - "command adapter suppression list"
  - "command conformance deviations"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# sk-doc Command Known-Deviation Suppression List

The `sk-doc-command` peer adapter starts with no suppressed S1 to S5 findings. A deviation belongs here only when a live command convention intentionally violates one command-surface rule and carries evidence narrow enough to avoid hiding other defects.

---

## 1. OVERVIEW

### Source Of Truth

The production adapter parses the fenced JSON block in Section 4. The prose and machine block must describe the same list.

### Initial State

No current command convention qualifies for suppression. The empty list is deliberate, not a placeholder.

---

## 2. OWNERSHIP BOUNDARY

This list may suppress only codes beginning with `CMD-S1-` through `CMD-S5-`. It cannot name or suppress generic command-Markdown findings from `validate_document.py`, document quality scores or behavioral benchmark results.

Generic document validation remains an independent gate. A generic warning is never converted into a command-surface deviation to make the deterministic axis pass.

---

## 3. ADMISSION RULE

A future entry must include:

- one or more exact command finding codes
- a narrow location prefix when the convention is not corpus-wide
- durable evidence that the behavior is intentional
- a recheck condition that tells maintainers when to remove the entry.

An entry cannot exempt an entire artifact from unrelated dimensions. The adapter suppresses only the matched code and location.

---

## 4. MACHINE-READABLE DEVIATION LIST

```json
{
  "authority": "sk-doc",
  "adapter": "sk-doc-command",
  "version": "1.0.0",
  "deviations": []
}
```

---

## 5. REFERENCES AND RELATED RESOURCES

- [sk-doc-command-adapter.md](./sk-doc-command-adapter.md), the S1 to S5 contract and finding map.
- [sk-doc-command.cjs](../../scripts/adapters/sk-doc-command.cjs), the suppression consumer.
- [sk-doc-known-deviations.md](./sk-doc-known-deviations.md), the reference adapter's separate deviation list.
