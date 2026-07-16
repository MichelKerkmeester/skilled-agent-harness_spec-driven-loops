---
title: "Implementation Plan: Phase 18: Persisted-Wait Crash Resume"
description: "Plan for the shipped wait-checkpoint schema and startup resume-waiting classifier branch."
trigger_phrases:
  - "persisted-wait crash-resume"
  - "resume-waiting classifier"
  - "wait-checkpoint schema"
  - "nextRunAt crash recovery"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/018-persisted-wait-crash-resume"
    last_updated_at: "2026-07-01T21:54:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped persisted-wait crash-resume content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed wait-resume crash recovery"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:018a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e1d"
      session_id: "scaffold-content-remediation-018"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Missing wait-checkpoint fields are treated as null/not waiting with no operator prompt"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: Persisted-Wait Crash Resume

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | CommonJS fanout runner plus YAML persisted-state schema |
| **Framework** | Crash-resume classifier for scheduled wait state |
| **Storage** | Nullable persisted wait-checkpoint fields `nextRunAt` and `remainingDelayMs` |
| **Testing** | Spec acceptance requires future `nextRunAt` wait resume, no dispatch during remaining delay, legacy missing-field null migration, and ordering invariant; no dedicated test file is named in spec.md |

### Overview
This phase shipped persisted wait crash-resume behavior in `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` and schema fields in `.opencode/commands/deep/assets/deep_research_auto.yaml`. The runner writes wait checkpoints before scheduled waits and evaluates `resume-waiting` first on startup so a crash during wait resumes the remaining delay instead of dispatching immediately.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: killed mid-wait and killed mid-dispatch states collapsed into the same immediate-dispatch path.
- [x] Success criteria measurable: future `nextRunAt` waits remaining delay with no dispatch; legacy missing fields read as null/not waiting.
- [x] Dependencies identified: startup classifier entry point and nullable state schema extension are available.

### Definition of Done
- [x] Nullable `nextRunAt` and `remainingDelayMs` schema fields added.
- [x] Wait checkpoint persisted at explicit pre-dispatch wait boundary.
- [x] `resume-waiting` classifier branch evaluated first on startup.
- [x] Legacy state files missing checkpoint fields read as null/not waiting with no prompt or error.
- [x] Per-lineage restart and socket-based wait-resume remain out of scope.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Nullable wait checkpoint plus first-priority startup classifier branch.

### Key Components
- **`nextRunAt`**: Persisted timestamp for the next scheduled dispatch boundary.
- **`remainingDelayMs`**: Persisted remaining delay hint for crash-resume handling.
- **Pre-dispatch wait checkpoint**: State write that records the wait before the process sleeps.
- **`resume-waiting` classifier**: Startup branch evaluated before dispatch logic to honor future wait checkpoints.
- **Legacy null migration**: Missing fields are treated as null and therefore not waiting.

### Data Flow
Before a scheduled wait, `fanout-run.cjs` writes `nextRunAt` and `remainingDelayMs` into persisted state. On startup, the classifier checks for `resume-waiting` first; if `nextRunAt` is in the future, the runner waits the remaining delay and avoids dispatch during that window. If fields are missing or null, startup proceeds as not waiting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Runs fanout loop and startup classifier | Add wait checkpoint and first-priority `resume-waiting` branch | Spec acceptance covers future wait resume and no duplicate dispatch |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Persisted state schema | Add nullable checkpoint fields | Legacy missing fields load as null |
| Per-lineage restart/socket wait resume | Future crash-resume designs | Unchanged/out of scope | Spec explicitly excludes both |

Required inventories:
- Same-class producers: inspect startup classifier ordering and wait boundary before adding checkpoint logic.
- Consumers of changed symbols: state readers must tolerate absent/null checkpoint fields.
- Matrix axes: future `nextRunAt`, past `nextRunAt`, missing fields, null fields, crash at 20s of 60s wait, and classifier branch ordering.
- Algorithm invariant: `resume-waiting` must run before any dispatch decision so future wait checkpoints cannot trigger duplicate immediate dispatch.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is `fanout-run.cjs` and `deep_research_auto.yaml`.
- [x] Identify startup classifier entry point and pre-dispatch wait boundary.
- [x] Decide missing checkpoint fields are null/not waiting with no operator prompt.

### Phase 2: Core Implementation
- [x] Add nullable `nextRunAt` and `remainingDelayMs` persisted-state schema fields.
- [x] Persist wait checkpoint before scheduled pre-dispatch waits.
- [x] Add `resume-waiting` classifier branch and evaluate it before any dispatch logic.
- [x] Treat legacy missing checkpoint fields as null/not waiting on load.

### Phase 3: Verification
- [x] Verify state with `nextRunAt` 30 seconds in the future waits remaining delay and does not dispatch during that window.
- [x] Verify crash during a 60-second wait at the 20-second mark resumes with remaining delay.
- [x] Verify legacy state without checkpoint fields loads as null/not waiting without prompting or throwing.
- [x] Verify classifier ordering puts `resume-waiting` before dispatch logic.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration/clock | Future `nextRunAt` waits remaining delay and does not dispatch | Mocked clock/state fixture; no dedicated test file named |
| Crash-resume | Crash at 20 seconds of a 60-second wait resumes with non-zero remaining delay | Mocked clock integration fixture |
| Legacy migration | State missing `nextRunAt`/`remainingDelayMs` reads as null and not waiting | Unit fixture |
| Ordering invariant | `resume-waiting` classifier evaluated before dispatch logic | Classifier ordering test/review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Startup classifier entry point | Internal | Available | Required to insert first-priority `resume-waiting` branch |
| Nullable persisted state schema | Internal | Available | Required to extend state without breaking existing readers |
| Per-lineage state isolation | Future design | Deferred | Needed only for full per-lineage restart, out of scope here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Startup dispatches despite a future wait checkpoint, legacy state fails to load, or wait checkpoints cause incorrect delays.
- **Procedure**: Revert `resume-waiting` classifier and checkpoint writes in `fanout-run.cjs` and remove nullable schema fields; startup returns to previous immediate-dispatch behavior until ordering and migration are corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
