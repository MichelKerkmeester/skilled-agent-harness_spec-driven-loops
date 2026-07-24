---
title: "Corpus Tests: Interface Relational Exemplar Coverage"
description: "node:test suite for the interface corpus relational-exemplar adapter and its maintainer-only fixture atlas."
---

# Corpus Tests: Interface Relational Exemplar Coverage

---

## 1. OVERVIEW

`corpus/tests/` owns the `node:test` coverage for `design-interface/corpus/relational-exemplar.mjs`, the maintainer-facing adapter that grounds a resolved brief in one mode-selected coherent anchor plus at most one bounded contrast or rejected default. Tests cover the plan against a real fixture style corpus and the positive, no-fit, and rejected-default falsification atlas.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `relational-exemplar.test.mjs` | Asserts `buildRelationalExemplar()`: a coherent anchor produces a source-aware handoff, an unsafe forced anchor fails closed to `anchor:null`, and the secondary reference stays bounded to a single contrast or rejected default. |
| `fixtures.mjs` | Maintainer-only fixture builders (`interfaceDecisionEvidence`, `positiveInterfaceFixture`, `noFitInterfaceFixture`, `rejectedDefaultInterfaceFixture`) that construct context plans against the shared corpus-context schema versions. |

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/design-interface/corpus/tests/*.test.mjs
```

## 4. RELATED

- [`../README.md`](../README.md) - relational-exemplar contract and positive/no-fit/rejected-default atlas.
- [`../../SKILL.md`](../../SKILL.md) - design-interface mode.
- [`../../../shared/corpus-context/README.md`](../../../shared/corpus-context/README.md) - the neutral corpus-context plan these fixtures build against.
