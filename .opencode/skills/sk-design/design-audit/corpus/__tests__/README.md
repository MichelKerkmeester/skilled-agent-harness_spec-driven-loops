---
title: "Corpus Tests: Audit Comparison Lane Coverage"
description: "node:test suite for the audit corpus comparison-lane adapter and its maintainer-only fixture atlas."
---

# Corpus Tests: Audit Comparison Lane Coverage

---

## 1. OVERVIEW

`corpus/__tests__/` owns the `node:test` coverage for `design-audit/corpus/comparison-lane.mjs`, the maintainer-facing adapter that turns zero to two mode-selected corpus references into closed, non-authoritative comparison rows. Tests build a real fixture style corpus, run the styles engine build, and assert the comparison lane against drift, unavailable, and forged-evidence cases.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `comparison-lane.test.mjs` | Asserts `buildAuditComparisonLane()` and `validateAuditComparisonRequest()`: intended-anchor drift stays labelled context, a comparison-unavailable result is accepted evidence, references stay bounded to two, forged or free-text claims are rejected, and stale or missing retrieval manifests degrade to comparison-unavailable instead of throwing. |
| `fixtures.mjs` | Maintainer-only fixture builders (`auditComparisonEvidence`, `auditComparisonAttestation`, `intendedAnchorDriftFixture`, `comparisonUnavailableFixture`) that construct context plans and evidence records against the shared corpus-context schema versions. |

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/design-audit/corpus/__tests__/*.test.mjs
```

## 4. RELATED

- [`../README.md`](../README.md) - comparison-lane contract and falsification atlas.
- [`../../SKILL.md`](../../SKILL.md) - design-audit mode.
- [`../../../shared/corpus-context/README.md`](../../../shared/corpus-context/README.md) - the neutral corpus-context plan these fixtures build against.
