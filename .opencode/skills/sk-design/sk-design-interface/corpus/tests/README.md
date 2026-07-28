---
title: "Corpus Tests: Interface Relational Exemplar, Foundations Relationship Blueprint, And Motion Evidence Coverage"
description: "node:test suite for the interface corpus relational-exemplar adapter, the relocated foundations relationship-blueprint adapter, and the relocated motion evidence-gate adapter, plus their maintainer-only fixture atlases."
---

# Corpus Tests: Interface Relational Exemplar, Foundations Relationship Blueprint, And Motion Evidence Coverage

---

## 1. OVERVIEW

`corpus/tests/` owns the `node:test` coverage for three maintainer-facing adapters: `sk-design-interface/corpus/relational-exemplar.mjs`, which grounds a resolved brief in one mode-selected coherent anchor plus at most one bounded contrast or rejected default; `sk-design-interface/corpus/relationship-blueprint.mjs` (relocated from the retired `foundations` mode), which turns mode-owned, typed relationship decisions into a bounded compatibility graph; and `sk-design-interface/corpus/motion-evidence.mjs` (relocated from the retired `motion` mode), which runs the target-owned restraint gate before any corpus retrieval and, once gate-approved, retrieves one purpose/state temporal owner. Tests cover all three plans against a real fixture style corpus and each adapter's own falsification atlas.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `relational-exemplar.test.mjs` | Asserts `buildRelationalExemplar()`: a coherent anchor produces a source-aware handoff, an unsafe forced anchor fails closed to `anchor:null`, and the secondary reference stays bounded to a single contrast or rejected default. |
| `fixtures.mjs` | Maintainer-only fixture builders (`interfaceDecisionEvidence`, `positiveInterfaceFixture`, `noFitInterfaceFixture`, `rejectedDefaultInterfaceFixture`) that construct context plans against the shared corpus-context schema versions, for `relational-exemplar.test.mjs`. |
| `relationship-blueprint.schema.test.mjs` | Asserts `validateFoundationsRelationshipRequest()` accepts every typed compatibility relation (`works-with`, `conflicts-with`, `not-assessed`) and rejects untyped relations such as `average` or `interpolate`. |
| `relationship-blueprint.test.mjs` | Asserts `buildFoundationsRelationshipPlan()` end to end: hydrates one coherent anchor and up to three axis owners, emits no source token values, and produces the shared proof-handoff fields. |
| `fixtures-foundations.mjs` | Maintainer-only fixture builders (`foundationsRelationshipFixture`, `foundationsExplicitNoneFixture`, `foundationsNoFitFixture`, `foundationsRelationshipEvidence`) that construct context plans against the shared corpus-context schema versions, for the `relationship-blueprint.*.test.mjs` pair. Named distinctly from `fixtures.mjs` to avoid colliding with the relational-exemplar fixture module after relocation. |
| `motion-evidence.schema.test.mjs` | Asserts `validateMotionNegativeBaseline()` and `validateMotionEvidenceRequest()`: a `do-not-move` verdict returns an instant negative baseline with `queryIssued:false`, and the request schema enforces its closed polarity, temporal-evidence, purpose, and constraint fields. |
| `motion-evidence.test.mjs` | Asserts `buildMotionEvidencePlan()` end to end against a real fixture style corpus: gate-approved eligibility, hard-negative prohibitions, and incidental-vocabulary or purpose/state mismatches resolving to `no-corpus-temporal-authority` rather than a false match. |
| `fixtures-motion.mjs` | Maintainer-only fixture builders (`doNotMoveFixture`, `eligibleMotionFixture`, `hardNegativeMotionFixture`) that construct context plans against the shared corpus-context schema versions, for the `motion-evidence.*.test.mjs` pair. Named distinctly from `fixtures.mjs` to avoid colliding with the relational-exemplar fixture module after relocation. |

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/sk-design-interface/corpus/tests/*.test.mjs
```

## 4. RELATED

- [`../README.md`](../README.md) - relational-exemplar contract, positive/no-fit/rejected-default atlas, and the relationship-blueprint contract and closed relation vocabulary.
- [`../../SKILL.md`](../../SKILL.md) - design-interface mode.
- [`../../../shared/corpus-context/README.md`](../../../shared/corpus-context/README.md) - the neutral corpus-context plan these fixtures build against.
