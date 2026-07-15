---
title: "Implementation Plan: Retrieval Floor Experiment [template:level_2/plan.md]"
description: "Run a measurement-only floor sweep on the C2 prod-mode harness through a default-off env override, read only the prod-lens completeRecall@3 column per setting and report a signal-or-noise verdict against the stored C2 baseline. The on-disk default stays 3."
trigger_phrases:
  - "retrieval floor experiment"
  - "raise the retrieval floor"
  - "default min results"
  - "truncation law measurement"
  - "tail signal or noise"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment"
    last_updated_at: "2026-07-04T17:12:04.022Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase plan for retrieval floor experiment scaffold"
    next_safe_action: "Hold for 015-c2 recall gate before this phase runs"
    blockers:
      - "Depends on 015-prodmode-recall-gate which must ship the prod-mode completeRecall@3 instrument first"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Retrieval Floor Experiment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, the affected surfaces and the verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` eval driver plus a TypeScript truncation module |
| **Framework** | spec-kit eval harness prod lens (`run-eval-v2.mjs`) consumed through the C2 export |
| **Storage** | The existing copy-DB the C2 harness already builds, plus one written report file |
| **Testing** | A floor sweep on a fixed copy DB plus a no-flag diff proof that the on-disk default stays 3 |

### Overview
This phase runs a measurement-only floor sweep on the C2 prod-mode harness. It adds a `run-floor-experiment.mjs` driver that raises the never-cut-below-3 minimum and widens the token budget through an env-gated default-off `SPECKIT_FLOOR_OVERRIDE` read inside `confidence-truncation.ts`, reads only the prod-lens completeRecall@3 column per swept setting and reports the recall delta against the stored C2 baseline. The driver returns one verdict, signal or noise, and the on-disk default at `confidence-truncation.ts:35` stays `DEFAULT_MIN_RESULTS = 3` after the run.
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
A thin measurement driver over the unchanged C2 prod-mode harness, plus one env-gated read on the live floor seam and one written report. No ranking change and no default change on disk.

### Key Components
- **`run-floor-experiment.mjs`**: the sweep driver that sets the floor override per setting, runs the C2 prod lens over the existing copy DB, reads only the prod completeRecall@3 column and records the per-setting delta against the C2 baseline.
- **`confidence-truncation.ts`**: gains a default-off `SPECKIT_FLOOR_OVERRIDE` env read for `DEFAULT_MIN_RESULTS` and the token budget so the minimum guarantee can move for the experiment without changing the on-disk default of 3.
- **`floor-experiment-report.md`**: the measured per-setting recall deltas and the one signal-or-noise verdict against a pre-stated threshold.
- **`run-eval-v2.mjs`**: the unchanged dual-mode harness, consumed through the C2 export for the prod lens and the measurability classes.

### Data Flow
The C2 harness builds the copy DB and runs the prod lens over it. For each floor setting in the sweep the driver sets the env override, runs the prod lens over the same copy DB, reads only the prod completeRecall@3 column and records the delta against the stored C2 baseline. After the sweep the driver writes the report with the pre-stated threshold, the per-setting deltas and the verdict. The env override is never persisted, so the on-disk default stays 3.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses or shared policy. This phase reads env precedence and touches the live floor seam behind a flag, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS` | The on-disk never-cut-below-3 minimum literal of 3, a floor not a cap | leave the literal at 3, add a default-off `SPECKIT_FLOOR_OVERRIDE` env read above it | a diff shows the literal 3 unchanged and a no-flag run uses the 3-result minimum |
| `confidence-truncation.ts` token budget | The prod token budget applied at truncation, the real prod-limiting stage | add a default-off `SPECKIT_FLOOR_OVERRIDE` env read for the budget | a no-flag run uses the shipped budget |
| `hybrid-search.ts:2065` `minResultsGuaranteed` | Surfaces the floor guarantee as `DEFAULT_MIN_RESULTS` at the prod seam | not a consumer change, reads the same constant | grep shows no edit to the guarantee line |
| `run-eval-v2.mjs` prod lens via the C2 export | The prod-lens completeRecall@3 profile | not a consumer change, reuse through the C2 export | the driver imports the prod lens and class symbols and duplicates no lens or floor logic |
| `run-floor-experiment.mjs` | Does not exist | create the sweep driver reading only the prod column and refusing an eval-lens input | an eval-lens input fails the driver assertion and an unmoved floor fails closed |
| `floor-experiment-report.md` | Does not exist | create the report with the pre-stated threshold, the per-setting deltas and the verdict | the report states the threshold before the numbers and the verdict follows the measured delta |

Required inventories:
- Same-class producers: `rg -n 'DEFAULT_MIN_RESULTS|minResultsGuaranteed|tokenBudget' .opencode/skills/system-spec-kit/mcp_server/lib/search`.
- Consumers of changed symbols: `rg -n 'DEFAULT_MIN_RESULTS|minResultsGuaranteed' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.mjs'`.
- Matrix axes: floor settings 3, 5, 8 and 10, prod lens only, no-flag default run, missing C2 baseline, env override unread by the truncation seam.
- Algorithm invariant: the verdict reads only the prod column, the env override is default-off so the on-disk default stays 3 and an unmoved floor fails closed rather than reporting a flat no-signal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the C2 prod lens and the measurability classes are reachable through the C2 export without touching the lens bodies
- [ ] Confirm the C2 baseline file is present and records the prod-column completeRecall@3 to compare against
- [ ] Fix the floor settings to sweep above 3 and the matching token budget per setting

### Phase 2: Core Implementation
- [ ] Add the default-off `SPECKIT_FLOOR_OVERRIDE` env read for `DEFAULT_MIN_RESULTS` and the token budget in `confidence-truncation.ts` so the on-disk default stays 3
- [ ] Build `run-floor-experiment.mjs` to set the override per setting, run the C2 prod lens and read only the prod completeRecall@3 column
- [ ] Refuse an eval-lens input and fail closed when the env override is set but the floor did not move
- [ ] Write `floor-experiment-report.md` with the pre-stated threshold, the per-setting prod-column deltas against the C2 baseline and the one signal-or-noise verdict

### Phase 3: Verification
- [ ] A no-flag run uses the 3-floor and a diff shows the literal 3 at `confidence-truncation.ts:35` unchanged
- [ ] The driver refuses an eval-lens input and fails closed on an unmoved floor
- [ ] The report states the threshold before the numbers and names the Tier-C items to re-evaluate on signal or records the 3-floor confirmation on noise
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The verdict input is the prod profile, an eval-lens input is refused and an unmoved floor fails closed | direct driver invocation |
| Integration | The floor sweep over settings 5, 8 and 10 on the C2 copy DB with the per-setting prod-column delta | `run-floor-experiment.mjs` over the C2 harness copy DB |
| Manual | Confirm the on-disk default stays 3 by diff and the report threshold is fixed before the numbers | diff plus report inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015-prodmode-recall-gate prod-mode completeRecall@3 instrument | Internal | Red | No prod-mode column exists to read without C2, so this phase is hard-blocked until C2 lands |
| `run-eval-v2.mjs` dual-mode harness and its prod lens contract | Internal | Yellow | The driver reads the prod lens through the C2 export and breaks if the lens contract changes |
| The stored C2 baseline for the prod-column completeRecall@3 | Internal | Yellow | The per-setting delta cannot be computed without the stored baseline |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The env override leaks into the on-disk default, or the driver reads the wrong lens.
- **Procedure**: Remove the `run-floor-experiment.mjs` driver and the report, then revert the default-off `SPECKIT_FLOOR_OVERRIDE` env read so `confidence-truncation.ts` returns to its shipped state with the 3-result minimum.
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
- [ ] No-flag default run proven to use the 3-floor before the sweep
- [ ] Eval-lens input refusal proven by a unit assertion
- [ ] Unmoved-floor fail-closed path staged

### Rollback Procedure
1. Remove the `run-floor-experiment.mjs` driver
2. Remove `floor-experiment-report.md`
3. Revert the default-off env read on `confidence-truncation.ts`
4. Re-run a no-flag prod lens to confirm the 3-floor is restored

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds one eval-only driver and one report and a default-off env read
<!-- /ANCHOR:enhanced-rollback -->

---
