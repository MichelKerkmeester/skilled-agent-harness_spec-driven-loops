---
title: "Certificate Binding Core"
description: "Shared exact-equality compare loop for re-deriving a certificate's emitted semantic fields from verified material and rejecting the first mismatch."
---

# Certificate Binding Core

---

## 1. OVERVIEW

A certificate emitter binds a body's semantic fields to the verified typed payload it was built from. Each emitter owns its own per-kind field-to-material mapping (irreducibly local domain knowledge), but the act of comparing an emitted value against a re-derived one for exact equality is identical everywhere. This module holds only that shared compare loop: callers supply their own `{field, emitted, rederived}` list as data and raise their own typed rejection on the returned mismatch.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `certificate-binding-core.ts` | `firstBoundFieldMismatch`: canonical-byte exact-equality compare over a caller-supplied field list |
| `index.ts` | Public API surface |

## 3. CONSUMERS

`deep-improvement-common-certificates` (offline semantic body-field re-derivation). Other certificate emitters (`deep-ai-council-certificates`, `deep-alignment-certificates`, `deep-review-certificates`) are candidates to adopt the same compare loop for their own local binding checks; none are wired to it yet.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-certificates.vitest.ts`

## 5. RELATED

- [`runtime/lib/README.md`](../README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
