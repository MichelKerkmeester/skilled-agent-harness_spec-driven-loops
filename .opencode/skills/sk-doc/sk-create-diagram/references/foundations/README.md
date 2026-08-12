---
title: "references/foundations: Core Design and Setup Docs"
description: "Index of the always/conditionally-loaded foundation docs: design tokens, onboarding, and the import/export dial contract."
importance_tier: normal
trigger_phrases:
  - "diagram foundations index"
  - "style guide onboarding output spec"
contextType: general
version: 1.0.0.0
---

# references/foundations

The shared foundation docs every diagram build touches, directly or via one conditional load.

---

## 1. OVERVIEW

`style-guide.md` loads on every request (`ALWAYS`); `onboarding.md` and `output-spec.md` load conditionally, only when a customize or import/export request is detected.

---

## 2. FILES

| File | Purpose |
|---|---|
| `style-guide.md` | The single source of truth for colors, typography, spacing, and the 4px grid every diagram type draws against. |
| `onboarding.md` | The agent-mediated brand/skin extraction flow — no network-fetch tool ships in the packet, so this is guidance, not a script. |
| `output-spec.md` | The four import/export dials (format, size, detail, audience), the degrade ladder, and the fidelity-ledger contract. |

---

## 3. RELATED

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Resource Loading Levels — when each file loads. |
| [`../types/`](../types/) | Per-type conventions that draw against `style-guide.md`'s tokens. |
