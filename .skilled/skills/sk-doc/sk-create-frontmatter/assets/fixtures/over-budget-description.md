---
title: Over-Budget Description Fixture
description: One 547-character skill description carrying every drop-list category and every keep-list token, used as the input to the trim scenario.
trigger_phrases:
  - "over budget description fixture"
  - "547 character description"
  - "description trim input"
  - "drop list category example"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Over-budget description fixture

The input document for `FMB-001`. The description below is the text to trim.

---

## 1. THE DESCRIPTION UNDER TEST

The subject is the `description` value in this block, 547 characters:

```yaml
name: sk-notebook
description: sk-notebook is a comprehensive, best-in-class notebook skill that captures, organizes, indexes, tags, archives, exports and syncs notes across Markdown, JSON, YAML, SQLite, Postgres and plain text, built on Node 20, Python 3.11, esbuild, vitest and ripgrep (the fast Rust grep), routing to two modes (sk-notebook-capture, sk-notebook-review) so teams can effortlessly unlock a single source of truth for everything they write, with 12 templates, 40 shortcuts and a delightful zero-config onboarding experience that just works right out of the box.
allowed-tools: [Read, Write, Edit]
version: 1.0.0.0
```

---

## 2. WHAT IT CONTAINS

Every drop-list category is present, so a trim that follows the list has somewhere to start:

| Category | Where it appears |
|---|---|
| Product enumeration | `captures, organizes, indexes, tags, archives, exports and syncs` |
| Stack list | `Markdown, JSON, YAML, SQLite, Postgres`, then `Node 20, Python 3.11, esbuild, vitest` |
| Marketing prose | `comprehensive, best-in-class`, `effortlessly unlock a single source of truth`, `delightful`, `just works right out of the box` |
| Parenthetical jargon | `(the fast Rust grep)` |

Every keep-list token is present too, so a correct trim can be told apart from a short one:

| Keep-list token | Value here |
|---|---|
| Skill-name token | `sk-notebook` |
| Primary verb | `capture` |
| Primary domain noun | `notes` |
| Mode suffixes | `sk-notebook-capture`, `sk-notebook-review` |
| Numeric specifics | `12 templates` |

---

## 3. THE REFERENCE TRIM

A trim that drops the first table and keeps the second lands at 110 characters:

```yaml
description: "sk-notebook: capture and review notes over 12 templates; routes to sk-notebook-capture and sk-notebook-review."
```

This is a reference, not the only correct answer. A different wording of the same surviving tokens is equally correct. A shorter one missing any row of the second table is not.
