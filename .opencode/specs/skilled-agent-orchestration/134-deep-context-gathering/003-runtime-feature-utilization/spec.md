---
title: "Feature Specification: deep-loop-runtime utilization hardening"
description: "Cross-skill audit and targeted hardening: deep-improvement gains atomic state safety, deep-review gains loop-lock, and deep-context gains a code-enforced executor-audit env — eliminating the three identified runtime-feature gaps across the deep skill family."
trigger_phrases:
  - "deep-loop-runtime utilization"
  - "runtime feature audit"
  - "deep-improvement state safety"
  - "deep-review loop-lock"
  - "deep-context executor-audit"
  - "runtime hardening"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-deep-loop-runtime-utilization"
    last_updated_at: "2026-06-06T23:59:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 spec packet for completed cross-skill optimization"
    next_safe_action: "Memory save; no further work required — packet status Complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:21f084a2955d99a9dfb62e715e4564513164ec612ad6122518ce1ba3ac9e1663"
      session_id: "dlr-135-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "fanout-run.cjs is the real CLI-seat spawn-env site; multi-seat-dispatch.cjs is model-agnostic (no-spawn primitive)"
      - "deep-ai-council graph-replay prose-only is acceptable: single-process in-memory, no cross-session persistence"
      - "deep-context pid loop-lock advisory not hard-mutex is acceptable: host-driven discrete-call loop, not a long-running process"
      - "deep-research atomic-state/fallback-router prose-only is marginal gain: already strong, not worth the diff cost"
---
# Feature Specification: deep-loop-runtime utilization hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

A cross-skill audit of the deep skill family (`deep-research`, `deep-review`, `deep-context`, `deep-ai-council`, `deep-improvement`) against the `deep-loop-runtime` feature catalogue revealed three exploitable gaps: `deep-improvement` used hand-rolled, non-atomic JSONL writes with a silent-drop pattern; `deep-review` had no loop-lock, enabling a concurrent-run race; and `deep-context`'s executor-audit env was prose-only. Three targeted fixes closed these gaps. Five deliberate non-fixes (judged over-engineering after a cli-opencode architect consult and two independent confidence-gate audits) are recorded in `decision-record.md` as accepted ADRs.

**Key Decisions**: fanout-run.cjs (not multi-seat-dispatch.cjs) is the authoritative CLI-seat spawn-env site; loop-lock mirrors deep-research's step pattern verbatim; deep-improvement imports the runtime's own `repairJsonlTail` and `writeStateAtomic` with an inline fallback.

**Critical Dependencies**: deep-loop-runtime shared library paths (`jsonl-repair`, `atomic-state`); deep-review YAML auto/confirm assets.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep skill family wraps `deep-loop-runtime` but each skill adopted runtime features at different points in time, leaving three gaps:

1. **deep-improvement**: `reduce-state.cjs` used hand-rolled JSONL reads with no tail-repair, and wrote outputs with `fs.writeFileSync` (non-atomic, no temp-file pattern) — a silent-drop risk if the process is interrupted mid-write.
2. **deep-review**: The auto/confirm YAML workflows had no `step_acquire_lock`/`step_release_lock` pair or `lock_file` field, meaning two concurrent review runs on the same spec folder could race on the state JSONL and produce corrupted convergence state.
3. **deep-context**: The executor-audit env (the recursion-guard environment variable set by `buildExecutorDispatchEnv`) was wired only in prose/YAML `cli_contract` annotations. The actual CLI-seat spawn path in `fanout-run.cjs` did not call `buildExecutorDispatchEnv`, so the guard was not code-enforced.

### Purpose

Close all three gaps with minimal, targeted changes that reuse existing runtime primitives — and formally record the five deliberate non-fixes so the audit findings have a permanent decision trail.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deep-improvement/scripts/shared/reduce-state.cjs`: import `repairJsonlTail` + `writeStateAtomic` from the runtime (in-process tsx register + inline fallback); call them instead of the hand-rolled equivalents.
- `commands/deep/assets/deep_start-review-loop_{auto,confirm}.yaml`: add `step_acquire_lock`, `step_release_lock`, and `lock_file` fields, mirroring deep-research's loop-lock pattern.
- `deep-loop-runtime/scripts/fanout-run.cjs`: call `buildExecutorDispatchEnv` when spawning CLI seats so the recursion-guard env is set in code.
- `deep-loop-runtime/tests/unit/fanout-run.vitest.ts`: +4 tests asserting the env is set correctly on the spawn.
- `decision-record.md`: five non-fix ADRs (deep-ai-council graph-replay, deep-context pid loop-lock, deep-research atomic/fallback prose, fanout-run vs multi-seat-dispatch site choice, and the overall triage rationale).

### Out of Scope
- deep-ai-council graph-replay: single-process in-memory — code enforcement has marginal value (see ADR-001).
- deep-context pid loop-lock as hard-mutex: host-driven discrete-call loop, not a long-running daemon — advisory is sufficient (see ADR-002).
- deep-research atomic-state / fallback-router prose hardening: already the strongest skill; the diff cost is not justified by the marginal gain (see ADR-003).
- Any change to deep-loop-runtime's test suite structure or convergence math.
- New MCP tools.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs` | Modify | Import runtime `repairJsonlTail` + `writeStateAtomic`; call them; inline fallback |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Add `step_acquire_lock`, `step_release_lock`, `lock_file` |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Same loop-lock fields |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Call `buildExecutorDispatchEnv` on CLI-seat spawns |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | +4 tests: env set on spawn, inline fallback, no temp leak, repaired=true |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | deep-improvement JSONL tail-repair | `reduce-state.cjs` calls `repairJsonlTail` before reading; `source=runtime` in smoke output |
| REQ-002 | deep-improvement atomic writes | `reduce-state.cjs` calls `writeStateAtomic`; no temp files leaked; fixture smoke confirms |
| REQ-003 | deep-review loop-lock in auto YAML | `deep_start-review-loop_auto.yaml` has `step_acquire_lock`, `step_release_lock`, `lock_file` |
| REQ-004 | deep-review loop-lock in confirm YAML | `deep_start-review-loop_confirm.yaml` has the same fields |
| REQ-005 | fanout-run.cjs calls `buildExecutorDispatchEnv` | CLI-seat spawn-env includes the recursion-guard var; code-enforced not prose-only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | fanout-run vitest +4 tests | 4 new tests green; full suite 291/291 (or current count + 4) |
| REQ-007 | Non-fix ADRs documented | `decision-record.md` records all 5 deliberate non-fixes with rationale |
| REQ-008 | All runtime tests still pass | `node --check` on edited .cjs; council suite 23/23 unaffected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --check` passes on `reduce-state.cjs`, the two review YAMLs parse, and `fanout-run.cjs` passes `node --check`.
- **SC-002**: Fixture smoke for `reduce-state.cjs` outputs `repaired=true, source=runtime`, no temp files remain.
- **SC-003**: deep-loop-runtime test suite passes 291/291 (or current count + 4 new tests).
- **SC-004**: Council suite passes 23/23 (no regression from the fanout-run change).
- **SC-005**: `validate.sh --strict` on this packet exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inline fallback path diverges from runtime impl | Med — if runtime changes, fallback drifts | Fallback is tested independently; runtime import is the preferred path |
| Risk | Loop-lock fields break YAML parse on existing tooling | Med — review runs fail | Mirrored exactly from deep-research's working pattern |
| Risk | `buildExecutorDispatchEnv` import path changes | Low — fanout-run breaks | Import from the same `lib/` path other scripts use |
| Dependency | `deep-loop-runtime/lib/jsonl-repair` and `lib/atomic-state` | Blocks reduce-state import | Both libs exist and are already consumed by other runtime scripts |
| Dependency | deep-research's loop-lock YAML as a verified template | Blocks review YAML change | Template confirmed before change |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `repairJsonlTail` is O(tail-scan) — negligible cost on the small state files deep-improvement produces.

### Security
- **NFR-S01**: Atomic writes eliminate the window where a partially-written output file is visible to a concurrent reader.

### Reliability
- **NFR-R01**: Loop-lock prevents two concurrent review runs from racing on the same JSONL state.
- **NFR-R02**: JSONL tail-repair recovers from a mid-write interruption on the state log, preventing silent data loss.

---

## 8. EDGE CASES

### Data Boundaries
- Runtime import fails (tsx not available): inline fallback activates; `source=fallback` in output; behavior is identical.
- Concurrent deep-review runs: second run blocks on lock acquisition; no JSONL corruption.

### Error Scenarios
- Tail-repair finds no corruption: returns the original JSONL unmodified; `repaired=false` in output.
- `buildExecutorDispatchEnv` returns empty: spawn still proceeds; the env var is simply unset (the guard is an advisory, not a hard block at the spawn level).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | 3 targeted file edits + 4 tests + 5 ADRs |
| Risk | 10/25 | Shared runtime imports; cross-skill coordination |
| Research | 12/20 | Audit research + cli-opencode architect consult + 2 parallel confidence-gate audits |
| Multi-Agent | 6/15 | Two independent parallel opus audits; architect consult |
| Coordination | 10/15 | Cross-skill + deliberate non-fix triage |
| **Total** | **46/100** | **Level 3 (cross-skill audit + ADR discipline)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Inline fallback diverges from runtime over time | M | L | Fallback covered by tests; runtime is the preferred import path |
| R-002 | Loop-lock deadlock (reviewer forgets to release) | M | L | Step pattern mirrors deep-research; release step is last in both YAMLs |
| R-003 | fanout-run env change causes a no-spawn regression | M | L | 4 new tests gate the behavior; council 23/23 confirms no regression |

---

## 11. USER STORIES

### US-001: Safe deep-improvement concurrent runs (Priority: P0)

**As a** developer running deep-improvement while another session is active, **I want** atomic state writes, **so that** a mid-write interrupt does not silently corrupt or drop the improvement state.

**Acceptance Criteria**:
1. Given a deep-improvement reduce-state run, When the process writes, Then all outputs go through `writeStateAtomic` (temp-file + rename).

### US-002: Safe concurrent deep-review (Priority: P0)

**As a** developer running two review loops on the same spec folder, **I want** loop-lock to serialize access, **so that** the second run blocks rather than corrupting the shared convergence JSONL.

**Acceptance Criteria**:
1. Given a review loop holding the lock, When a second review loop starts, Then the second loop waits on `step_acquire_lock` before touching state.

### US-003: Code-enforced recursion guard on CLI seats (Priority: P1)

**As a** runtime maintainer, **I want** `buildExecutorDispatchEnv` called in `fanout-run.cjs`, **so that** the recursion-guard env is set regardless of whether the calling YAML contains a `cli_contract` annotation.

**Acceptance Criteria**:
1. Given `fanout-run.cjs` spawning a CLI seat, When the spawn env is captured, Then the recursion-guard variable is present.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

*(None — all questions resolved before implementation.)*
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md` (5 non-fix ADRs + site-choice ADR)
- **Implementation Summary**: `implementation-summary.md`
