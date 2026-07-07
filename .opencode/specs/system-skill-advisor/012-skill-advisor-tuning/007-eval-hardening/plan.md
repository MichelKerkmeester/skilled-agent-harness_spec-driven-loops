---
title: "Implementation Plan: Advisor Scorer Eval Hardening"
description: "Technical plan for the eval-hardening infrastructure: an empirical ambiguity slice, bucket/source_type enum enforcement plus named intent-bucket slices, a ratcheted accuracy baseline with an exact-match non-regression gate, and an honest independent holdout from three disjoint fixtures. Additive-first and corpus-neutral: no scoring input is touched."
trigger_phrases:
  - "advisor eval hardening plan"
  - "ratcheted baseline architecture"
  - "harness-regime capture"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/007-eval-hardening"
    last_updated_at: "2026-07-07T07:15:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Infrastructure implemented; all scorer gates green; corpus-neutral"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Implementation Plan: Advisor Scorer Eval Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The work is measurement infrastructure layered on top of the read-only scorer. Four artifacts are frozen from the current scorer state and then guarded. An ambiguity slice captures the lowest top-2-margin prompts. Named intent buckets slice the corpus (review, memory_save) and the shared executor-delegation fixture (delegation). A baseline records the top-1 count for every measure. Three vitest gates re-score live under a deterministic regime and hold each measure to the baseline. The scorer itself is never modified: `scoreAdvisorPrompt` is called read-only, the handler gains additive output plus enum-tightened input validation, and everything else is fixtures, generators, and tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `npm run typecheck` exits 0.
- `scorer-eval-baseline-ratchet.vitest.ts`, `holdout-independent.vitest.ts`, `ambiguity-slice.vitest.ts` green.
- `advisor-validate.vitest.ts` (extended) and `advisor-validate-shapes.vitest.ts` (reconciled) green.
- `python-ts-parity.vitest.ts` holds 105/101/4 byte-identical (corpus-neutral).
- `local-native-divergence-ratchet.vitest.ts` green with no ledger edit.
- Full advisor suite adds only new passing tests; the pre-existing failing set is unchanged.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Determinism comes from the filesystem projection: an empty `MK_SKILL_ADVISOR_DB_DIR` makes the SQLite loader return null, so the projection is built purely from committed graph metadata. Semantic embeddings are disabled and the native lane-ranking overrides are cleared. Under the vitest harness the semantic-shadow lane substitutes deterministic fixture vectors, so every existing scorer gate runs in that regime; the capture scripts set the same flag so the baseline is measured in the regime that re-scores it. Top-1 matching is alias-aware (superseded ids and folded deep-loop modes canonicalized on both sides), mirroring the validate handler. Delegation matching is strict, because its targets are top-level skill ids with no alias folding. Buckets are computed over the full corpus independent of any `skillSlug` scope, so their `minN` floors and counts stay stable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `handlers/advisor-validate.ts` (enum enforcement, delegation loader, `evaluateDelegationCases`, `bucketSlice`, `slices.buckets`).
- `schemas/advisor-tool-schemas.ts` (`bucketSliceSchema`, `slices.buckets`).
- `scripts/routing-accuracy/` (three generators + three frozen fixtures).
- `tests/parity/` and `tests/scorer/` (three new gates); `tests/handlers/` (two reconciled tests).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Additive handler + schema
Add the bucket-slice schema and the buckets output block; enum-enforce bucket/source_type on the corpus row schema (retaining passthrough); load the delegation fixture; compute the three buckets over the full corpus. Rebuild dist.

### Phase 2: Derive + freeze fixtures
Assemble the 78-row holdout (dedup + drop the training collision). Derive the ambiguity slice at the frozen `tau`. Capture the baseline with sha256 fixture pins under the deterministic harness regime.

### Phase 3: Gates
Author the ratchet, holdout, and ambiguity vitests; extend the validate handler test; reconcile the shapes test for the now-required enum fields.

### Phase 4: Verification
Confirm the gates exercise the scorer (mutation-prove the ratchet). Run the full suite; confirm 105/101/4 byte-identical and the pre-existing failing set unchanged.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Each gate re-scores live under the deterministic harness regime and holds its measure to the committed baseline.
- The ratchet is exact-match with directional failure messages (regression vs unrecaptured improvement), sha256 fixture pins, and retained hard floors.
- Mutation proof: perturbing the committed baseline fails the ratchet with the exact directional diff.
- Corpus-neutrality is proven by the unchanged `python-ts-parity` 105/101/4 and the unchanged divergence ratchet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `001-scorer-saturation-root-fix` (advisor scorer program umbrella).
- The shared executor-delegation fixture (`tests/parity/fixtures/executor-delegation-cases.json`), the harder-intent corpus, and the regression-case fixture supply the holdout and delegation-bucket labels.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the three fixtures, the three generators, and the three gates; revert the two additive handler/schema edits and the two test reconciliations. There is no data migration, schema-of-record change, or deployed-contract change; the scorer is untouched, so rollback restores the prior evaluation surface with zero routing impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on Phase 1 (the capture script imports the compiled scorer, so dist must rebuild first). Phase 3 depends on Phase 2 (the gates read the frozen fixtures and baseline). Phase 4 depends on all prior phases (it verifies the full chain).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Three fixtures, three generators, three gates, two additive source edits, two test reconciliations. Single session.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No database, embedding, or ledger state changes, so rollback is a pure file operation with no migration and no re-approval of divergences.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

The four artifacts form a strict chain: the compiled scorer (dist) is the input to the holdout, ambiguity, and baseline fixtures; the frozen fixtures are the input to the baseline sha256 pins; the baseline is the input to the three gates. No cycle exists; the scorer is a leaf input the packet never mutates.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Phase 1 lands and dist rebuilds before Phase 2 (the capture script imports the compiled scorer). Phase 2 freezes the holdout and ambiguity fixtures before the baseline is captured (the baseline pins their sha256). Phase 3 gates read the frozen baseline. Phase 4 verifies the whole chain.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

- M1: Handler + schema additive edits typecheck and build.
- M2: Three fixtures frozen and the baseline captured under the harness regime.
- M3: Three gates green; handler and shapes tests reconciled.
- M4: Full-suite corpus-neutrality confirmed (105/101/4; pre-existing failing set unchanged).
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the two target source files are git-clean before editing; HALT if a concurrent lane re-entered them.
- Confirm dist is rebuilt before the capture script runs (it imports the compiled scorer).
- Confirm the holdout and ambiguity fixtures are frozen before the baseline is captured (the baseline pins their sha256).

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Phases run in order: implementation before fixtures before gates before verification; the capture depends on a fresh dist. |
| TASK-SCOPE | Only the eval surface is touched; the scorer, the divergence ledger, the orchestrator fusion/delegation/graph-causal files, and the routing-accuracy README stay frozen. |

### Status Reporting Format
Report each gate as PASS/FAIL with the live-vs-baseline counts. Report corpus-neutrality as the parity 105/101/4 line plus the full-suite delta (new passing tests only; the pre-existing failing set unchanged).

### Blocked Task Protocol
If a target source file is dirty (a concurrent lane re-entered it), HALT and coordinate rather than staging over it. If a gate disagrees with the committed baseline, stop and diagnose the capture regime before re-capturing — a silent re-baseline would defeat the ratchet.
<!-- /ANCHOR:ai-execution -->
