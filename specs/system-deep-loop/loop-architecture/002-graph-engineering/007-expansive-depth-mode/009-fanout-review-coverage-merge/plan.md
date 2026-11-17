---
title: "Implementation Plan: Carry the review coverage surfaces through the fan-out merge (D12)"
description: "Extend mergeReviewRegistries in fanout-merge.cjs so the merged review registry carries the six coverage surfaces, each under a stated rule: union for positive coverage, strongest restriction for traceability status, per-lineage keeping for pivot state, and deterministic ordering throughout."
trigger_phrases:
  - "fanout review coverage merge plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Carry the review coverage surfaces through the fan-out merge (D12)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS Node script (`fanout-merge.cjs`) |
| **Framework** | system-deep-loop fan-out: `fanout-run.cjs` runs lineages, `fanout-merge.cjs` joins their registries |
| **Storage** | Per-lineage review registries (JSON) and the merged registry |
| **Testing** | Vitest, run from `.skilled/skills/system-deep-loop/runtime` with `npm test -- <file>` |

### Overview
One function changes: `mergeReviewRegistries` gains a merge step per coverage surface and returns six more fields. Each rule follows a precedent already in the file or the reducer, so no new policy is invented. New unit cases pin each rule, and the existing merge suites prove findings, verdict and search debt did not move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `mergeReviewRegistries` still spans `fanout-merge.cjs:869-997` and returns no coverage surface
- [ ] The REQ-004 suites pass on the unchanged tree (baseline captured)
- [ ] Every reader of the merged review registry is listed (grep for `mergedRegistry` and the merged registry file name)

### Definition of Done
- [ ] Every P0 requirement in `spec.md` is met
- [ ] `npm test -- tests/unit/fanout-merge.vitest.ts tests/fanout-review-focus.vitest.ts` passes with the new cases
- [ ] The REQ-004 suites pass, and the delta against the baseline is only the new cases
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-field merge reducers inside one join function.

### Key Components
- **`mergeReviewRegistries`** (`fanout-merge.cjs:869`): the only component that changes. Without the new steps the six surfaces never leave the lineage registries.

Merge rules, one per surface:

| Surface | Subkeys (from the reducer builders) | Rule | Precedent |
|---------|-------------------------------------|------|-----------|
| `dimensionCoverage` | flat map, dimension name to boolean (`reduce-state.cjs:1223`) | Union: a dimension is `true` when any lineage covered it; keys are the union of lineage keys, sorted | Positive coverage evidence accumulates, as the reducer's own OR over iteration records does |
| `traceability` | `results[]` (`protocolId`, `status`, `applicable`, `gateClass`, evidence), `summary` (`required`, `executed`, `pass`, `partial`, `fail`, `blocked`, `notApplicable`, `gatingFailures`), `unfinishedCoreProtocols` (`reduce-state.cjs:1592-1633`, :1945) | `results`: per `protocolId`, strongest restriction, `fail` over `blocked` over `partial` over `pass` over `notApplicable`; an undecided status (`pending`, `deferred`, `skipped`) never overwrites a decided one. `summary`: recomputed from the merged `results` with the reducer's formula. `unfinishedCoreProtocols`: sorted union of the lineage lists | The verdict merge's strongest-restriction policy (playbook DLR-028) and `buildTraceabilityRollup` |
| `searchCoverage` | `requiredBugClasses`, `covered`, `ruledOut`, `deferred`, `blocked`, `graphCoverageMode` (`reduce-state.cjs:1775-1782`) | Each list a deduped, sorted union; `graphCoverageMode` kept when every lineage agrees, else `null` | The search-debt merge's dedupe and sort (`fanout-merge.cjs:945-955`) |
| `candidateCoverage` | `covered`, `ruledOut`, `deferred`, `blocked`, `byBugClass` entries with `covered`, `ruledOut`, `deferred`, `blocked`, `iterations` (`reduce-state.cjs:1765-1771`, :1743) | Each bucket a sorted union; per `byBugClass` entry, OR each flag, union `iterations`, and add a sorted `lineages` list so iteration numbers stay attributable | Same dedupe and sort precedent |
| `divergence` | `started`, `completed`, `failed`, `overrides`, `saturatedDirections`, `remainingFrontier`, `currentFocus` (`reduce-state.cjs:1404-1443`) | Not merged into one object. Returned whole as `divergenceByLineage`, keyed by lineage label, because pivot state is lineage-local and a merged `currentFocus` would be invented | Lineage labels already key `lineageExecutors` |
| `ruledOutCandidates` | entries with `iteration`, `id`, `dimension`, `targetRefs`, `bugClass`, `disposition`, `rationale`, `evidenceRefs`, `reason` (`reduce-state.cjs:1812-1837`) | Concatenate with a `lineage` field, dedupe on lineage plus `id`, sort by lineage then `id` | Same dedupe and sort precedent |

### Data Flow
`fanout-run.cjs` finishes each lineage, `fanout-merge.cjs:1533` calls `mergeReviewRegistries` with every lineage that has a registry, and the result is written as the merged registry. After this slice the six surfaces flow through that same call.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the REQ-004 baseline and lists the merged registry's readers. Implementation adds the six merge steps to `mergeReviewRegistries` in `fanout-merge.cjs`. Verification runs the per-surface cases, the order-swap determinism case and the REQ-004 suites. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Proving tests from parent `research.md` §20 Slice I: `fanout-review-focus.vitest.ts` plus a merged-coverage case. This plan adds one unit case per surface rule in `tests/unit/fanout-merge.vitest.ts`, an order-swap case for REQ-005 and a missing-fields case for REQ-006. The four existing `fanout-merge*` suites guard the unchanged output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No slice must land first, and no operator decision is needed. Slice K (`../011-review-frontier-mode/`) depends on this slice for its merge-time coverage guard and its `frontier_scope` partition check.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a REQ-004 suite or a reader of the merged registry fails on the new fields. Revert the slice's commit; the change is additive and no stored format depends on it.
<!-- /ANCHOR:rollback -->

---
