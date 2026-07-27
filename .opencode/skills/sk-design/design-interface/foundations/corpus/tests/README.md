---
title: "Corpus Tests: Foundations Relationship Blueprint Coverage"
description: "node:test suite for the foundations corpus relationship-blueprint adapter and its maintainer-only fixture atlas."
---

# Corpus Tests: Foundations Relationship Blueprint Coverage

---

## 1. OVERVIEW

`corpus/tests/` owns the `node:test` coverage for `design-foundations/corpus/relationship-blueprint.mjs`, the maintainer-facing adapter that turns mode-owned, typed relationship decisions into a bounded compatibility graph. Tests cover the closed relation vocabulary directly and the full plan against a real fixture style corpus.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `relationship-blueprint.schema.test.mjs` | Asserts `validateFoundationsRelationshipRequest()` accepts every typed compatibility relation (`works-with`, `conflicts-with`, `not-assessed`) and rejects untyped relations such as `average` or `interpolate`. |
| `relationship-blueprint.test.mjs` | Asserts `buildFoundationsRelationshipPlan()` end to end: hydrates one coherent anchor and up to three axis owners, emits no source token values, and produces the shared proof-handoff fields. |
| `fixtures.mjs` | Maintainer-only fixture builders (`foundationsRelationshipFixture`, `foundationsExplicitNoneFixture`, `foundationsNoFitFixture`, `foundationsRelationshipEvidence`) that construct context plans against the shared corpus-context schema versions. |

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/design-foundations/corpus/tests/*.test.mjs
```

## 4. RELATED

- [`../README.md`](../README.md) - relationship-blueprint contract and closed relation vocabulary.
- [`../../SKILL.md`](../../SKILL.md) - design-foundations mode.
- [`../../../shared/corpus-context/README.md`](../../../shared/corpus-context/README.md) - the neutral corpus-context plan these fixtures build against.
