---
title: "Implementation Plan: Phase 24: typed-command-ambiguity"
description: "Record which typed-command seed held a skill down, skip that pair in the ambiguity cluster, and carry the field to every place ambiguity is re-derived."
trigger_phrases:
  - "typed command ambiguity plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 24: typed-command-ambiguity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor scorer, renderer, hook fallback) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest in the advisor runtime, the Python twin's test script, live probes |

### Overview
The seed bound already knows which target it lowered and under which seed. Fusion records that seed on the target's recommendation, the ambiguity cluster skips a member held below the cluster's top, and the renderer and CLI fallback carry the field so they reach the same answer. A test in `typed-command-routing.vitest.ts` fails first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The live flag reproduced: `ambiguous: true` on the typed `/deep:research :auto` prompt
- [x] Cause located: both the 0.05 score margin and the 0.05 confidence margin hold for the pair

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] The advisor suite and the Python twin show no new failure
- [ ] `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer: the bound that sets the order also marks what it held.

### Key Components
- **`boundGraphSupportBySeed`** in `fusion.ts`: reports the seed whose ceiling lowered each target.
- **`ambiguousCluster`** in `ambiguity.ts`: leaves out a member held below the top.
- **`toScoredRecommendation`** in `render.ts` and the hook's CLI fallback mapper: carry the field.

### Data Flow
Lanes, then the seed bound, which now names the holding seed, then ranking, then the ambiguity cluster, then the result and the brief.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Seed bound | Caps a held target below its seed | Update: record the seed | Typed-command test |
| Ambiguity cluster | Flags skills within 0.05 | Update: skip the held pair | Typed-command test, control pinned |
| Brief renderer | Re-derives ambiguity from recommendations | Update: carry the field | Render-level check |
| Hook CLI fallback | Maps CLI JSON to recommendations | Update: carry the field | Advisor suite |
| Scores and order | Rank skills | Unchanged | Five probes keep their top skill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup reproduces the flag, Implementation records and skips the held pair with a failing-first test, and Verification reruns the suites, probes and validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Held pair not ambiguous; plain-word control unchanged | vitest `typed-command-routing.vitest.ts` |
| Integration | Whole advisor suite and the Python twin | vitest, Python test script |
| Manual | The typed prompt and the five phase 22 probes, live | `skill-advisor.cjs advisor_recommend` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The advisor runtime build | Internal | Green | Live probes read stale code |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a prompt that was ambiguous on its own evidence stops being flagged, or a probe changes its top skill.
- **Procedure**: revert the phase commit; the field is optional, so older payloads keep working either way.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The live probe | Implementation |
| Implementation | The reproduced flag | Verification |
| Verification | The change and the rebuilt runtime | Close |
<!-- /ANCHOR:phase-deps -->
