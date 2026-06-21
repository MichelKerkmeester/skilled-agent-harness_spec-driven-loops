---
title: "Implementation Plan: C2 Prod-Mode Recall Gate [template:level_2/plan.md]"
description: "Build a prod-mode completeRecall@3 instrument from a multi-target gold set, a PROMOTION and REGRESSION wrapper that reads only the prod column, a stored baseline, reusing the export already present on the unchanged dual-mode harness."
trigger_phrases:
  - "prod mode recall gate"
  - "complete recall at 3"
  - "spec corpus golden"
  - "run spec recall gate"
  - "retrieval regression gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/015-c2-prodmode-recall-gate"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase plan for C2 prod-mode recall gate scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: C2 Prod-Mode Recall Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` eval scripts |
| **Framework** | spec-kit eval harness (`run-eval-v2.mjs` dual-mode lenses) |
| **Storage** | The existing copy-DB the harness already builds, plus a stored JSON baseline file |
| **Testing** | Scratch profile runs through the gate plus a degraded-profile regression proof |

### Overview
This phase builds a prod-mode completeRecall@3 instrument around the dual-mode harness that already ships. It adds a multi-target `spec-corpus-golden.json`, a `run-spec-recall-gate.mjs` wrapper with a PROMOTION mode and a REGRESSION mode that read only the prod column, and a stored baseline file the gate compares against. The harness lenses stay unchanged and the gate consumes them through the export already present at `run-eval-v2.mjs:361`, so a Tier-C retrieval change can be promoted only on a measured prod-column rise and regressed when it falls.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate wrapper over an unchanged measurement harness: two net-new data and script files reusing the export already present at `run-eval-v2.mjs:361`. The gate reuses the prod lens, `meanCompleteRecallProfile` and the measurability classes, but owns copy-DB prep, ground-truth grouping and the retrieval loop itself (all unexported), so it is more than a thin wrapper. No ranking change and no new lens logic.

### Key Components
- **`spec-corpus-golden.json`**: multi-target gold set where every query carries a relevance set across the enumerated measurability classes, so completeRecall@3 has multiple targets to be incomplete about.
- **`run-spec-recall-gate.mjs`**: the gate wrapper with a PROMOTION mode and a REGRESSION mode, reading only the prod-lens completeRecall@3 column and emitting a real recall-verdict exit code.
- **`spec-recall-baseline.json`**: the stored prod-column completeRecall@3 baseline per class and overall, with a generated-at stamp and source DB path.
- **`run-eval-v2.mjs`**: the unchanged dual-mode harness; the gate reuses the prod lens and measurability classes through the export already present at line 361, with no harness change.

### Data Flow
The harness exports the prod lens, `meanCompleteRecallProfile` and the measurability classes at line 361 but not its copy-DB prep, ground-truth grouping or retrieval loop. The gate imports the three exported symbols, then owns copy-DB prep, gold-set ingestion into a `relevancesByQuery` map and the retrieval loop, reads only the prod completeRecall@3 column, compares it to the stored baseline, and returns a recall-verdict exit code distinct from the existing crash handler.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-eval-v2.mjs` lenses | Run the eval lens and the prod lens on one copy DB and report `evalVsProdDelta` at K of 3, 5, and 8 | no change, reuse the lenses verbatim through the existing export | grep shows the line-361 export unchanged and no edit to the lens bodies |
| `run-eval-v2.mjs` export surface | Already exports `buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS` at line 361 | verify the existing export covers `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES`, add no second export | the gate imports those three names and the harness gains no second `export {}` |
| Gold-set ingestion path | Harness sources ground truth from `GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES` via `dist/lib/eval/ground-truth-data.js` and groups it with `groupGroundTruth`; there is no external golden loader | define how `spec-corpus-golden.json` reaches the retrieval loop, either extend the harness ground-truth source or build a gate-side loader producing `relevancesByQuery` | the gate scores the multi-target gold set and no query is silently dropped |
| `spec-corpus-golden.json` | Single-target goldens that saturate | create a multi-target gold set, every query a relevance set of length 2 or more with a class tag | every query has a relevance set length of 2 or more and a class drawn from `MEASURABILITY_CLASSES` |
| `run-spec-recall-gate.mjs` | Does not exist | create the PROMOTION and REGRESSION gate reading only the prod completeRecall@3 column | a flipped lens input fails the unit assertion, a degraded prod profile exits non-zero |
| `spec-recall-baseline.json` | Does not exist | create the stored prod-column baseline with provenance | the baseline JSON parses and carries `prodMode` completeRecall@3 fields plus a generated-at stamp and source DB path |
| `process.exitCode = 1` (line 357) | Crash handler in the harness | leave unchanged, the gate emits a separate recall-verdict code | the gate exit code is distinct from the line 357 crash code |

Required inventories:
- Same-class producers: `rg -n 'completeRecall|evalVsProdDelta|MEASURABILITY_CLASSES' .opencode/skills/system-spec-kit/mcp_server/scripts/evals`.
- Consumers of changed symbols: `rg -n 'buildSearchLenses|meanCompleteRecallProfile|MEASURABILITY_CLASSES' .opencode/skills/system-spec-kit`.
- Matrix axes: PROMOTION mode, REGRESSION mode, missing baseline, empty relevance set, eval-lens input refused, degraded prod profile.
- Algorithm invariant: the verdict reads only the prod column, an empty relevance set is rejected at load, and the recall-verdict exit code is distinct from the crash code.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify the existing export at `run-eval-v2.mjs:361` covers `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES`, with no harness change and no second `export {}`
- [ ] Define the gold-set ingestion path, either extend the harness ground-truth source (`GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES`) or build a gate-side loader producing `relevancesByQuery`
- [ ] Enumerate the measurability classes the gold set must cover

### Phase 2: Core Implementation
- [ ] Author `spec-corpus-golden.json` with one relevance set per query across the measurability classes and no single-target query
- [ ] Build `run-spec-recall-gate.mjs` reading only the prod completeRecall@3 column, with PROMOTION mode and REGRESSION mode and a recall-verdict exit code
- [ ] Write the first `spec-recall-baseline.json` from a non-saturating prod run, with per-class and overall completeRecall@3 plus a generated-at stamp and source DB path
- [ ] Refuse an eval-lens input and reject a gold set carrying an empty relevance set at load

### Phase 3: Verification
- [ ] A degraded scratch prod profile fails REGRESSION mode with the recall-verdict exit code, not the crash code
- [ ] A measured prod completeRecall@3 rise passes PROMOTION mode and an unchanged profile does not
- [ ] The gold set has no single-target query and every query carries a class tag
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Verdict input is the prod profile, a flipped lens input fails, an empty relevance set is rejected at load | direct gate invocation |
| Integration | PROMOTION and REGRESSION modes over a scratch profile and a degraded profile on the copy DB | `run-spec-recall-gate.mjs` over the harness copy DB |
| Manual | Confirm the gold set is non-saturating and the first baseline reads from a non-saturating prod run | gold-set inspection plus the first baseline write |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `run-eval-v2.mjs` dual-mode harness and its lens contract | Internal | Green | The gate is a thin wrapper and breaks if the lens contract changes |
| The exported `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES` symbols (present at `run-eval-v2.mjs:361`) | Internal | Green | The export already ships, so the gate can reuse the lenses with no harness change |
| A non-saturating first prod run for the frozen baseline | Internal | Yellow | The baseline cannot freeze until a multi-target prod run measures clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate false-fires on a valid prod profile, or the lens export breaks the harness.
- **Procedure**: Remove the gate wrapper and the gold and baseline files. The harness needs no revert because the export was already present and reused, not added.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] First non-saturating prod run captured before the baseline freezes
- [ ] Eval-lens input refusal proven by a unit assertion
- [ ] Degraded-profile regression proof staged

### Rollback Procedure
1. Remove the `run-spec-recall-gate.mjs` wrapper
2. Remove `spec-corpus-golden.json` and `spec-recall-baseline.json`
3. Confirm `run-eval-v2.mjs` is untouched because the line-361 export was reused, not added
4. Re-run the harness to confirm it returns to its shipped state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds eval-only data and script files and reuses the existing harness export
<!-- /ANCHOR:enhanced-rollback -->

---
