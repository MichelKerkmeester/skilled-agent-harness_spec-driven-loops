---
title: Source Conventions — How Pi Remote Code Reads
description: Entry point for the conventions that make this source legible — the comment grammar and its banners, the Do not edit guardrail notes, and when a folder owes a CODE.md. Routes to the three detailed contracts in this folder.
trigger_phrases:
  - "comment convention mobile cli"
  - "module banner section divider"
  - "do not edit guardrail note"
  - "when does a folder need code.md"
  - "source conventions pi remote"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Source Conventions — How Pi Remote Code Reads

Three contracts decide what a reader sees before they reach any logic. Each is enforced by a gate.

---

## 1. OVERVIEW

### Core Principle

These contracts decide what a reader sees before they read any logic. The durable WHY is the whole
point: a comment that restates the code is noise, and a comment that records the constraint behind a
value is the only place that reasoning survives.

### When to Use

- Writing or editing any comment, banner or section divider
- Touching something marked frozen, or adding a new fence
- Adding a folder, or asking whether one owes documentation

### Key Sources

- `app-mobile/src/app.css` and any component's scoped `<style>` — where purpose comments live
- `assets/guardrail-audit-checklist.md`
- The repository-wide comment-hygiene gate, which blocks ephemeral artifact pointers at commit time

---

## 2. PICK BY WHAT YOU ARE DOING

| You are… | Read |
|---|---|
| Writing or editing any comment, banner or section divider | [`comment-grammar.md`](comment-grammar.md) |
| Touching something marked frozen, or adding a new fence | [`editability-guardrails.md`](editability-guardrails.md) |
| Adding a folder, or asking whether one owes documentation | [`folder-docs.md`](folder-docs.md) |

---

## 3. THE CONVENTIONS IN ONE PARAGRAPH EACH

### Comment grammar

A `MODULE:` banner names the file's job; numbered box-drawing sections split it; one-line purpose
comments say *why* a value or rule exists, never what the next line obviously does. **The durable
WHY is the whole point.** A comment that restates the code is noise; a comment that records the
constraint behind a value is the only place that reasoning survives.

### Editability guardrails

`Do not edit — <why>` marks a line whose value or wiring is load-bearing, with the reason inline so
the fence can be evaluated rather than merely obeyed. The architectural claim behind them is worth
knowing: a presentation edit cannot reach logic or the security boundary, which is what makes a
designer-facing retint safe in the first place.

### Folder documentation

A folder owes a `CODE.md` once it holds three or more direct source files or child source folders;
below that a `README.md` alone is enough. The scan runs both directions — a missing doc fails, and
so does a doc for a folder that no longer qualifies, so the set cannot rot into decoration.

---

## 4. THE HARD RULE

**Never write an ephemeral artifact pointer into a code comment.** No spec paths, no packet or phase
numbers, no `REQ-`/`CHK-`/task/ADR ids. Those identifiers are meaningful for weeks and confusing
forever after, and a repository-wide gate blocks them at commit time. Write the durable reason
instead: not *which ticket asked for this*, but *what breaks if it changes*.

---

## 5. RELATED REFERENCES

- [`../design-system/css-class-naming-bem.md`](../design-system/css-class-naming-bem.md) — the class grammar these purpose comments annotate.
- [`../design-system/scoped-style-ownership.md`](../design-system/scoped-style-ownership.md) — where an owned CSS rule lives, which a folder's `CODE.md` records.
- [`../verification/verification.md`](../verification/verification.md) — the proof that an intended change preserved every frozen value.
- [`../standards/code-standards.md`](../standards/code-standards.md) — the broader rules a change must hold.
