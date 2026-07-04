---
title: "Implementation Plan: Novel Freshness Decay Auto-Refresh Queue [template:level_2/plan.md]"
description: "A report-only detector reads the shipped FSRS retrievability number and queues a doc decayed below the COLD to DORMANT edge as a maintenance candidate. It registers with fixClass none and emits a finding, never a body refresh."
trigger_phrases:
  - "freshness decay queue"
  - "fsrs retrievability"
  - "auto-refresh queue"
  - "staleness maintenance queue"
  - "report-only freshness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/004-novel-research/024-novel-freshness-decay-queue"
    last_updated_at: "2026-06-27T17:15:39.015Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added benchmark and flag-off proof to plan sections 4 and 5"
    next_safe_action: "Hold for implementation, no detector code lands yet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Novel Freshness Decay Auto-Refresh Queue

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
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
| **Language/Stack** | TypeScript on Node, run through the spec-kit script runner |
| **Framework** | None, one detector class registered in the shared detector registry |
| **Storage** | A new report-only `refresh_queue` table mirrored on the `learned_feedback_audit` governance, it writes no memory body |
| **Testing** | vitest for the shipped-number read and the queue-row emit, a decayed-fixture memory for the report path |

### Overview
The detector is one new class at `scripts/detectors/freshness-decay.ts` registered with `fixClass: none` in the shared `detector-registry.ts`. It reads the SHIPPED per-memory `retrievability` from `computeMemoryState` (`tier-classifier.ts:325-328`) and owns no decay math of its own. Any memory below the configured COLD to DORMANT staleness threshold (`tier-classifier.ts:39-41`) emits one report-only row into the new `refresh_queue` table, which mirrors the `learned_feedback_audit` governance in `learned-feedback.ts`. The rows surface through the B1 sweep report behind a default-off flag and never trigger a body refresh.
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
One report-only detector over the shipped FSRS retrievability number, no new decay math and no new store beyond the report-only queue table.

### Key Components
- **freshness-decay.ts**: The detector class. It reads the shipped per-memory retrievability, compares it to the configured COLD to DORMANT threshold and emits a queue row for any decayed memory. It registers one entry with `fixClass: none` so the frozen safe allow-list never contains it and no `fix()` runs.
- **refresh-queue.ts**: The new report-only table and accessor mirrored on the `learned_feedback_audit` governance in `learned-feedback.ts`: age eligibility, shadow period, TTL expiry and no auto-apply.
- **detector-registry.ts entry**: One registered entry gated behind a default-off flag, matching the B3 feedback-edge precedent so the legacy corpus never gains a new always-on signal.

### Data Flow
The detector iterates the corpus memories, reads `computeMemoryState` read-only for the shipped retrievability per memory and folds any sub-threshold value into a `refresh_queue` row tagged with the memory id and the decayed tier. The rows route through the same B1 sweep report channel and the description.json governance block. No scoring path writes a memory body or a vector row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `detector-registry.ts` | Owns the detector set and the frozen `fixClass` allow-list | Modify, add one `none`-class entry | grep the new entry and its `fixClass: none` after build |
| `computeMemoryState` (`tier-classifier.ts:325-328`) | Owns the shipped per-memory retrievability and tier state | Not a consumer, read-only input | grep the read stays a read and no decay value is recomputed in the detector |
| `composite-scoring.ts:299,357` | Owns the live power-law formula and the `calculateRetrievabilityScore` consumer | Not a consumer, unchanged | grep the formula at `composite-scoring.ts:357` is untouched after build |
| `refresh-queue.ts` | New report-only table mirrored on `learned_feedback_audit` | Create | grep the age gate and TTL fields match `learned-feedback.ts` |
| `dq-sweep` B1 report | Owns the report-mode fan-out | Modify, fold in the detector behind a default-off flag | grep the flag gate, confirm the detector is skipped when the flag is unset |

Required inventories:
- Same-class producers: `rg -n 'fixClass|detector-registry' .opencode/skills/system-spec-kit/scripts/detectors`.
- Consumers of changed symbols: the detector adds no new public symbol. It registers one entry and reads `computeMemoryState` read-only.
- Matrix axes: above-threshold versus below-threshold memory, pinned versus decaying memory and flag-on versus flag-off are the axes the fixtures must cover.
- Algorithm invariant: the detector emits queue rows only, a sweep run with it enabled leaves the git working tree clean and a memory at or above the COLD edge is never queued.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 026-shared-safe-fix-engine has landed the engine, the registry and the frozen safe allow-list
- [ ] Confirm 011-scheduled-dq-sweep has landed the report-mode fan-out the queue rows surface through
- [ ] Confirm `computeMemoryState` is callable read-only as the retrievability input (`tier-classifier.ts:325-328`)
- [ ] Stand up a fixture corpus with a pinned memory, a fresh memory and a memory decayed below the COLD edge

### Phase 2: Core Implementation
- [ ] Build `freshness-decay.ts` to read the shipped retrievability and own no decay math (REQ-001)
- [ ] Build the threshold compare keyed on the COLD to DORMANT boundary and emit one report-only `refresh_queue` row per sub-threshold memory (REQ-003)
- [ ] Build `refresh-queue.ts` mirrored on the `learned_feedback_audit` age eligibility and TTL governance (REQ-004)
- [ ] Register the detector in `detector-registry.ts` with `fixClass: none` so no apply path exists (REQ-002)
- [ ] Fold the detector into the B1 report behind a default-off flag (REQ-005, REQ-006)

### Phase 3: Verification
- [ ] The detector output for a fixture memory equals the value `computeMemoryState` returns, byte for byte
- [ ] An apply run over a decayed fixture produces an empty diff and the git working tree stays clean (REQ-002)
- [ ] A sub-threshold fixture emits one `refresh_queue` row and zero body writes (REQ-003)
- [ ] Edge cases handled (pinned memory at retrievability 1.0 never queued, no last_reviewed clamps to fresh, already-queued doc deduped by TTL, accessor unavailable emits zero rows, missing queue table aborts before emit)
- [ ] Documentation updated (spec/plan/tasks/checklist)

### Benchmark
This is a write-time detector phase, so the metric is NOT recall. The queue emits findings not vector rows, so it does not route through the 015-prodmode-recall-gate prod-mode completeRecall@3 instrument that reuses `buildSearchLenses`, `meanCompleteRecallProfile` and `MEASURABILITY_CLASSES` (`run-eval-v2.mjs:361`). The detector-class metric is a planted-decay catch-rate and a swap-precision on a fixture corpus plus a first-run-finds-at-least-one-real-defect floor on the live corpus.

- **Metric**: planted-decay catch-rate (planted sub-threshold docs queued over planted sub-threshold docs total), swap-precision (pinned or fresh fixture docs left unqueued over pinned or fresh docs total) and the first flag-on live count of genuinely decayed docs surfaced.
- **PASS thresholds**: catch-rate equals 1.0 so every planted sub-threshold doc is queued, swap-precision equals 1.0 so zero pinned or fresh docs are queued and the first flag-on live report surfaces at least one genuinely decayed doc.
- **REGRESS thresholds**: any planted sub-threshold doc missed pushes catch-rate below 1.0, any pinned or fresh doc queued pushes precision below 1.0 or any body write or non-empty git diff on an apply run.
- **Reproduce**: `(cd .opencode/skills/system-spec-kit/mcp_server && vitest run tests/freshness-decay.vitest.ts)` for the catch-rate and precision assertions, then a flag-on report sweep over the fixture corpus with `SPECKIT_FRESHNESS_DECAY_QUEUE=true` for the live floor.
- **DEFAULT-SAFETY**: the detector is default OFF behind `SPECKIT_FRESHNESS_DECAY_QUEUE`. Keep-off rationale: the legacy corpus must never gain a new always-on signal on docs that decay by design, matching the B3 feedback-edge precedent. No-regress: with the flag unset the detector emits zero rows and the sweep output stays byte-identical to the pre-detector baseline, proven the way `flag-ceiling.vitest.ts` exercises `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS`. Runtime reversibility: `SPECKIT_FRESHNESS_DECAY_QUEUE=false` lands the detector dark with no corpus rollback because it writes no body.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The shipped-number read, the threshold compare and the safe skip of pinned or fresh memories | vitest |
| Integration | The report path against a decayed-fixture corpus through the B1 report-mode fan-out | fixture corpus, the B1 report-mode fan-out |
| Manual | A flag-on report run on the live corpus to confirm a genuinely decayed doc surfaces as a candidate | local shell |
| Benchmark | Planted-decay catch-rate equals 1.0 and swap-precision equals 1.0 on the fixture corpus, the first flag-on live run surfaces at least one genuinely decayed doc and an apply run yields a clean git diff | `mcp_server/tests/freshness-decay.vitest.ts` asserting catch-rate, precision and the empty diff, plus a flag-on report sweep |
| Flag-off proof | With `SPECKIT_FRESHNESS_DECAY_QUEUE` unset the detector emits zero rows and the sweep output is byte-identical to the pre-detector baseline, reversible via `SPECKIT_FRESHNESS_DECAY_QUEUE=false` | `mcp_server/tests/freshness-decay.vitest.ts` mirroring the `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS` default-off pattern in `flag-ceiling.vitest.ts`, plus a diff of the returned sets |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026-shared-safe-fix-engine | Internal | Red | No registry or `fixClass` allow-list of its own, the detector cannot be registered |
| 011-scheduled-dq-sweep | Internal | Red | No report-mode fan-out of its own, the queued rows have nothing to surface through |
| Shipped FSRS retrievability (`tier-classifier.ts:325`) | Internal | Green | The queue input is gone, the detector cannot read a decay value and emits nothing |
| `learned_feedback_audit` governance (`learned-feedback.ts`) | Internal | Green | The governance shape to mirror is gone, the queue loses its age and TTL parity source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The first flag-on run queues docs that decay by design and floods the maintenance report, or the queue row count climbs past the COLD to DORMANT band.
- **Procedure**: Unset the default-off flag so the detector lands dark again and the shipped tiers are unchanged. The detector writes no body, so no corpus rollback is needed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Fixture) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 026 engine, 011 sweep, shipped retrievability | Core, Fixture |
| Fixture | Setup | Verify |
| Core | Setup | Verify |
| Verify | Core, Fixture | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-7 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **7-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Staleness threshold agreed at the COLD to DORMANT edge before the flag is enabled
- [ ] The detector registered with `fixClass: none` confirmed, no apply path exists
- [ ] The default-off flag confirmed to skip the detector when unset

### Rollback Procedure
1. Unset the default-off flag so the detector skips on the next sweep run
2. Revert the registry entry and the `freshness-decay.ts` file via git if the detector is removed
3. Run a flag-off report pass to confirm the shipped tiers and existing gates are unchanged
4. No stakeholder notification needed, the detector is internal report-only infra

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The detector writes no memory body and no vector row, so there is nothing to reverse.
<!-- /ANCHOR:enhanced-rollback -->
