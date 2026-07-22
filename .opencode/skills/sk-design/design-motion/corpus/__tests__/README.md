---
title: "Corpus Tests: Motion Evidence Gate Coverage"
description: "node:test suite for the motion corpus evidence-gate adapter and its maintainer-only fixture atlas."
---

# Corpus Tests: Motion Evidence Gate Coverage

---

## 1. OVERVIEW

`corpus/__tests__/` owns the `node:test` coverage for `design-motion/corpus/motion-evidence.mjs`, the maintainer-facing adapter that runs the target-owned restraint gate before any corpus retrieval and, once gate-approved, retrieves one purpose/state temporal owner under closed eligibility rules.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `motion-evidence.schema.test.mjs` | Asserts `validateMotionNegativeBaseline()` and `validateMotionEvidenceRequest()`: a `do-not-move` verdict returns an instant negative baseline with `queryIssued:false`, and the request schema enforces its closed polarity, temporal-evidence, purpose, and constraint fields. |
| `motion-evidence.test.mjs` | Asserts `buildMotionEvidencePlan()` end to end against a real fixture style corpus: gate-approved eligibility, hard-negative prohibitions, and incidental-vocabulary or purpose/state mismatches resolving to `no-corpus-temporal-authority` rather than a false match. |
| `fixtures.mjs` | Maintainer-only fixture builders (`doNotMoveFixture`, `eligibleMotionFixture`, `hardNegativeMotionFixture`) that construct context plans against the shared corpus-context schema versions. |

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/design-motion/corpus/__tests__/*.test.mjs
```

## 4. RELATED

- [`../README.md`](../README.md) - motion-evidence contract and restraint-gate atlas.
- [`../../SKILL.md`](../../SKILL.md) - design-motion mode.
- [`../../../shared/corpus-context/README.md`](../../../shared/corpus-context/README.md) - the neutral corpus-context plan these fixtures build against.
