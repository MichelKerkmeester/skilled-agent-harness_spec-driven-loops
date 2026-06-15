---
title: "Implementation Plan: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch"
description: "Add a requested-vs-actual model diff to the deep-loop executor audit so a silent substitution or a provenance-losing crash emits a loud dispatch failure instead of shipping a lying artifact. Reuses the existing emitDispatchFailure seam and adds a fallback-router guard, proven by a new vitest."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/008-fail-loud-provenance"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-fail-loud-provenance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), deep-loop-runtime skill |
| **Framework** | None; plain TS modules under `lib/deep-loop/` |
| **Storage** | JSONL state log (provenance + dispatch events appended per iteration) |
| **Testing** | vitest (`tests/unit/*.vitest.ts`, run via the skill's `vitest.config.ts`) |

### Overview
This phase implements recommendation B1 (= P2): make executor provenance fail loud. `executor-audit.ts` already records the actual model via `buildExecutorAuditRecord` (~line 485) and already escalates crashes (SIGTERM to SIGKILL, emitting a `crash` dispatch failure). The work is the missing comparison: diff the recorded actual model against the caller-approved model and, on mismatch, emit a `model_mismatch` dispatch failure through the existing `emitDispatchFailure` seam instead of recording a substituted model silently. A guard in `fallback-router.ts` ensures the router never routes to an unapproved model while keeping the configured separate-quota-pool fallback. A new vitest proves both the loud-on-mismatch and pass-on-match paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md `problem` + `scope` anchors filled)
- [ ] Success criteria measurable (SC-001/SC-002 assertable by the new vitest)
- [ ] Dependencies identified (no structural blocker; pairs with 003 measurement)

### Definition of Done
- [ ] Requested-vs-actual diff emits a loud `model_mismatch` dispatch failure; matching pair passes (REQ-001/REQ-002)
- [ ] New vitest passes and existing `executor-audit.vitest.ts` / `fallback-router.vitest.ts` stay green
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` passes; spec/plan/tasks/checklist synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard-at-the-seam: add a single comparison at the existing provenance-recording point and route failures through the existing typed dispatch-failure channel. No new subsystem, no new logging mechanism.

### Key Components
- **`executor-audit.ts`**: owns `buildExecutorAuditRecord` (records the actual model) and `emitDispatchFailure` (writes typed `dispatch_failure` JSONL events). The mismatch comparison lives here; `model_mismatch` joins the `DispatchFailureReason` union.
- **`fallback-router.ts`**: owns `resolveFallback`, which today returns `fail-fast` or a route to a configured `fallback_target`. The guard keeps it from ever returning an unapproved-model route.
- **`executor-provenance-mismatch.vitest.ts`** (new): drives both modules to assert loud-on-mismatch and pass-on-match.

### Data Flow
Per iteration, the executor config carries the requested/approved model. When provenance is recorded, the actual model (`executor.model`) is compared to the approved model. On match, the audit record is written as today. On mismatch, `emitDispatchFailure(..., 'model_mismatch', ...)` appends a `dispatch_failure` event and no success record is written. A crash short-circuits earlier to the existing `crash` dispatch failure, so provenance loss is already visible.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-audit.ts` `buildExecutorAuditRecord` (~485) | Producer: records the actual model into provenance | update: add requested-vs-actual comparison before/at recording | new vitest asserts mismatch emits `model_mismatch`; match writes record |
| `executor-audit.ts` `DispatchFailureReason` union | Policy: typed set of dispatch failure reasons | update: add `model_mismatch` member | `rg -n 'model_mismatch' executor-audit.ts` shows it in the union and at the emit site |
| `executor-audit.ts` `emitDispatchFailure` | Producer: writes typed `dispatch_failure` JSONL events | unchanged signature; reused with the new reason | grep confirms the mismatch path calls the existing function, no new logger |
| `executor-audit.ts` crash path (~615-751) | Producer: emits `crash` dispatch failure on SIGTERM/SIGKILL/non-zero exit | unchanged; confirmed still loud | `rg -n "'crash'" executor-audit.ts`; vitest or grep confirms no silent return |
| `fallback-router.ts` `resolveFallback` | Policy: routes quota-pool exhaustion to a configured `fallback_target` or `fail-fast` | update: never route to an unapproved model; keep configured-target fallback | `fallback-router.vitest.ts` stays green; new vitest asserts no unapproved route |
| `dispatch_failure` JSONL consumers (state-log readers, `post-dispatch-validate.ts`) | Consumer: read `dispatch_failure.reason` | not a consumer change; `model_mismatch` is additive to an existing event shape | `rg -n 'dispatch_failure' . --glob '*.ts'` confirms readers tolerate a new reason value |

Required inventories:
- Same-class producers: `rg -n "emitDispatchFailure|DispatchFailureReason|buildExecutorAuditRecord" .opencode/skills/deep-loop-runtime/lib/deep-loop/`.
- Consumers of changed symbols: `rg -n "dispatch_failure|model_mismatch|resolveFallback" .opencode/skills/deep-loop-runtime --glob '*.ts'`.
- Matrix axes: (1) model match vs mismatch, (2) native vs non-native executor kind, (3) approved configured fallback vs unapproved substitution, (4) crash vs clean exit. Required rows: mismatch-loud, match-pass, native-skip, approved-fallback-pass, unapproved-fallback-fail-fast.
- Algorithm invariant: the recorded provenance model MUST equal the caller-approved model (including an approved `fallback_target`); any other recorded value is a fail-loud condition. Adversarial cases: missing actual model, native-kind skip, case/whitespace-different model IDs, approved cross-pool fallback.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Ordered steps; each names the file it touches and how it is verified. Steps 2-4 are the core; step 1 is a read-only baseline.

### Phase 1: Baseline and seam confirmation
- [ ] Run the existing suite green as a baseline: `tests/unit/executor-audit.vitest.ts`, `tests/unit/fallback-router.vitest.ts`, `tests/unit/dispatch-failure.vitest.ts` (verify: all pass before any edit).
- [ ] Confirm the exact recording point in `lib/deep-loop/executor-audit.ts` (`buildExecutorAuditRecord`, ~485) and the `DispatchFailureReason` union and `emitDispatchFailure` signature (verify: `rg -n 'buildExecutorAuditRecord|DispatchFailureReason|emitDispatchFailure'`).
- [ ] Confirm `lib/deep-loop/fallback-router.ts` `resolveFallback` only branches on quota-pool, not model approval (verify: read + `rg -n 'fail-fast|fallback_target'`).

### Phase 2: Core implementation
- [ ] Add `model_mismatch` to the `DispatchFailureReason` union in `lib/deep-loop/executor-audit.ts` (verify: `tsc`/vitest type check; `rg -n 'model_mismatch'`).
- [ ] Add the requested-vs-actual comparison at the provenance-recording point in `lib/deep-loop/executor-audit.ts`: compare the recorded actual model to the caller-approved model (normalized), skip on native kind, and on mismatch call `emitDispatchFailure(..., 'model_mismatch', ...)` instead of writing a success record (verify: new vitest mismatch case fails loud).
- [ ] Add the guard in `lib/deep-loop/fallback-router.ts` so `resolveFallback` never returns a route to a model the caller did not approve while preserving the configured `fallback_target` route (verify: new vitest unapproved-substitution case returns `fail-fast`; `fallback-router.vitest.ts` stays green).

### Phase 3: Verification
- [ ] Create `tests/unit/executor-provenance-mismatch.vitest.ts` covering: mismatch-loud, match-pass, native-skip, approved-fallback-pass, unapproved-substitution-fail-fast (verify: `npx vitest run tests/unit/executor-provenance-mismatch.vitest.ts`).
- [ ] Mutation check: temporarily revert the comparison and confirm the mismatch test goes RED, then restore (verify: test bites, not vacuous green).
- [ ] Run the full skill suite and `validate.sh --strict`; sync spec/plan/tasks/checklist (verify: green suite + clean validator).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildExecutorAuditRecord` mismatch/match, native skip, `resolveFallback` approved vs unapproved | vitest (`executor-provenance-mismatch.vitest.ts`) |
| Regression | Existing audit, fallback-router, and dispatch-failure suites stay green | vitest (`executor-audit.vitest.ts`, `fallback-router.vitest.ts`, `dispatch-failure.vitest.ts`) |
| Mutation | Revert the comparison and confirm the mismatch test goes RED | vitest (manual mutation, then restore) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-loop-runtime` `executor-audit.ts` seam (existing) | Internal | Green | None; the recording point and `emitDispatchFailure` channel already exist. |
| `deep-loop-runtime` vitest harness + `vitest.config.ts` | Internal | Green | None; suite already runs standalone. |
| Phase 003 behavioral measurement (`fable_metrics.py`) | Internal | Yellow (separate phase) | None structurally; 008 ships first. 003 later re-measures to confirm no behavioral regression. This phase has no structural dependency on earlier phases. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new comparison produces false-loud failures on legitimate runs (a valid configured fallback or native run is flagged), or the new vitest is flaky.
- **Procedure**: `git revert` the commit touching `executor-audit.ts` and `fallback-router.ts`; the change is additive (a new reason member plus a comparison) with no migration, so reverting restores the prior silent-substitution behavior cleanly. Delete the new vitest if reverting the whole change.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Core |
| Core | Baseline | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline | Low | 0.5-1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **3.5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline suite captured green before the edit (`executor-audit`, `fallback-router`, `dispatch-failure` vitests)
- [ ] Change is additive (new reason member + comparison) with no data migration
- [ ] Mutation check recorded (comparison reverted shows RED, then restored)

### Rollback Procedure
1. Identify the commit touching `executor-audit.ts` and `fallback-router.ts`.
2. `git revert` that commit; the additive change reverts cleanly with no migration.
3. Re-run the skill vitest suite to confirm the prior baseline is restored.
4. No user-facing surface; no external stakeholder notification needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; only a new typed reason value is added to in-flight JSONL events, and readers already tolerate unknown reasons.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

