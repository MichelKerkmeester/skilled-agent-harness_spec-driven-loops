---
title: "Implementation Plan: Devin goal hooks"
description: "Build the three Devin goal-hook adapters on top of the phase 001 goal core, at whatever Stop-hook parity tier phase 002's live probe confirms, then verify with adapter tests and a live smoke proof."
trigger_phrases:
  - "devin goal hooks plan"
  - "devin goal adapter implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-29T06:45:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented, tested, and live-verified all three Devin adapters"
    next_safe_action: "Hand parity findings to phases 004/005 (Cursor, Pi)"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/devin/"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin's Stop hook parity tier: verify-and-continue shipped, mechanism confirmed, live evidence-source gap documented."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin goal hooks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | spec-kit standard implementation (spec -> plan -> tasks -> checklist -> implementation-summary) |
| **Authority** | `cli-external-orchestration` |
| **Depends On** | Phase 001 goal core (`goal-core.cjs`); Phase 002 capability-probe matrix (Stop-hook parity tier) |
| **Verification** | Co-located `node --test` adapter suite; live `devin -p` smoke proof |

### Overview

Build three Devin hook adapters — `UserPromptSubmit`, `SessionStart`, `Stop` — under `.opencode/hooks/goal/devin/`, each a thin wrapper around the phase 001 goal core. Register them in `.devin/hooks.v1.json`. The `Stop` adapter's continuation behavior is fixed by whatever phase 002's live probe determines about Devin's `Stop` hook schema; this plan does not assume an answer before that lands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 001 goal core merged and stable (`.opencode/hooks/goal/lib/goal-core.cjs` exists with a documented render/read/write API). [evidence: `node -e "require('./goal-core.cjs')"` exports confirmed]
- [x] Phase 002 capability-probe matrix confirms Devin's `Stop` hook parity tier. [evidence: `002-capability-probes/capability-matrix.md`]
- [x] Operator confirmed direct-branch workspace (`skilled/v4.0.0.0`, no worktree). [evidence: task brief]

### Definition of Done

- [x] Three adapters implemented and registered in `.devin/hooks.v1.json`. [evidence: additive-only diff, `python3 -c "import json;json.load(open('.devin/hooks.v1.json'))"` valid]
- [x] Co-located adapter test suite green. [evidence: `node --test goal-devin.test.mjs` 21/21 pass]
- [x] Live smoke proof recorded (goal brief text confirmed reaching the model in a real `devin -p` session). [evidence: transcripts `rainbow-poppyseed.json`, `desert-throne.json`]
- [x] `Stop` hook's actual parity tier documented honestly in `implementation-summary.md`. [evidence: implementation-summary.md Known Limitations]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin per-hook adapters, one file per Devin hook event, each importing the shared `goal-core.cjs` for state read/write and brief rendering rather than reimplementing any of that logic locally — matching the pattern already established by sibling runtime adapter concerns in `.opencode/hooks/`.

### Key Components

- **`.opencode/hooks/goal/devin/user-prompt-submit.cjs`**: reads `active-goal.json`, renders the goal brief via the core's render function, returns it as `additionalContext`.
- **`.opencode/hooks/goal/devin/session-start.cjs`**: reads `active-goal.json` at session start, surfaces the active goal (if any) without requiring a re-set.
- **`.opencode/hooks/goal/devin/stop.cjs`**: runs the core's heuristic verifier against the current turn; if phase 002 confirms Devin's `Stop` schema supports a blocking decision (mirroring Claude's `decision:"block"`), also returns a continuation instruction — otherwise verify-only.
- **`.devin/hooks.v1.json`**: registration entries for all three adapters.

### Control Flow

Phase 001 core lands -> phase 002 probe fixes the Stop-hook tier -> author the three adapters against the phase 001 core API -> register in `.devin/hooks.v1.json` -> co-located tests -> live `devin -p` smoke proof -> document the actual (not assumed) parity tier.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm phase 001 goal-core API surface (state read/write, brief render, hardening, heuristic verifier).
- [ ] Read phase 002's capability-probe matrix result for Devin's `Stop` hook.
- [ ] Scaffold `.opencode/hooks/goal/devin/` with the three adapter stubs.

### Phase 2: Implementation

- [ ] Implement `user-prompt-submit.cjs` (inject goal brief as `additionalContext`).
- [ ] Implement `session-start.cjs` (restore active goal state).
- [ ] Implement `stop.cjs` at the tier fixed by phase 002 (verify-only, or verify-and-continue).
- [ ] Register all three adapters in `.devin/hooks.v1.json`.

### Phase 3: Verification

- [ ] Write co-located `node --test` adapter tests (inject content, restore behavior, verify/continue logic).
- [ ] Run a live `devin -p` smoke session and record the goal brief text actually reaching the model.
- [ ] Document the shipped `Stop` hook parity tier honestly in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or Evidence |
|-----------|-------|-------------------|
| Unit | Three Devin adapters | `node --test` |
| Live smoke | Real Devin session, goal injection + restore | `devin -p` transcript/log, commit-pinned |
| Static | No `mk-goal.js` internals imported | `rg -n "mk-goal" .opencode/hooks/goal/devin` (expect 0 hits) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 001 goal core (`goal-core.cjs`) | Internal | Not yet built | No adapter can be authored. |
| Phase 002 capability-probe matrix | Internal | Not yet built | `Stop` hook parity tier cannot be fixed honestly; adapter would have to guess. |
| `.devin/hooks.v1.json` | External config | Existing, live | Cannot register adapters without editing this shared config. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live smoke test shows the injected goal brief not reaching the model, or an adapter error blocks a real Devin turn/session start.
- **Procedure**: Revert the `.devin/hooks.v1.json` registration entries for the three new adapters (additive-only edit, so removal is a clean revert) and delete `.opencode/hooks/goal/devin/`; no other runtime or concern is touched by this phase.
- **Data impact**: None. The shared `active-goal.json` state file is read-mostly from this phase's adapters; no schema change to that file is introduced here.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001, Phase 002 | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Notes |
|-------|------------|-------|
| Setup | Low | Reads two already-landed upstream artifacts. |
| Implementation | Medium | Three small adapter files + one config registration. |
| Verification | Medium | Adapter tests are mechanical; the live smoke proof is the higher-effort step. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Remediation Controls

- [ ] `.devin/hooks.v1.json` edit stays additive-only (no existing entries touched).
- [ ] Live smoke test run before any completion claim.

### Rollback Procedure

1. Remove the three new entries from `.devin/hooks.v1.json`.
2. Delete `.opencode/hooks/goal/devin/`.
3. Re-run the existing `.devin/hooks.v1.json` config against any other live Devin hook to confirm no collateral change.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; no state schema is introduced by this phase.
<!-- /ANCHOR:enhanced-rollback -->
