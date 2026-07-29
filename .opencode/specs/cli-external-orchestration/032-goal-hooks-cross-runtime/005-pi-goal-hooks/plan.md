---
title: "Implementation Plan: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Build .opencode/hooks/goal/pi/goal-context.ts against phase 001's goal core, symlink it from .pi/extensions/, wire input-transform injection and session_start restore, gate turn-end verify on phase 002's capability matrix, then prove it live."
trigger_phrases:
  - "pi goal extension plan"
  - "pi goal symlink plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-29T04:40:00Z"
    last_updated_by: "claude"
    recent_action: "Executed the plan and live-verified all three phases"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".opencode/hooks/goal/lib/goal-core.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Symlink direction: real file in .opencode/hooks/goal/pi/, symlink in .pi/extensions/ — reverse of the general Pi pattern used elsewhere in this repo."
      - "Phase 002 confirmed turn_end/agent_end/agent_settled; all void-returning, no forced continuation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi goal extension (input-transform injection, session_start restore, turn-end verify)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | Standard spec-kit plan -> implement, phase child of `032-goal-hooks-cross-runtime` |
| **Authority** | `cli-external-orchestration` |
| **Depends On** | Phase 001 (`.opencode/hooks/goal/lib/goal-core.cjs`), Phase 002 (capability matrix) |
| **Verification** | Co-located `node --test` suite; live `pi --offline -p` (or `pi -p`) smoke proof |

### Overview

Author the real extension file at its canonical location, symlink it into Pi's fixed auto-discovery directory, write imports for the symlink base path per the proven precedent, wire the three lifecycle points (`input`, `session_start`, gated turn-end), and prove injection reaches the model live before claiming completion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 001 goal core merged and its read/write/render API confirmed stable.
- [x] Phase 002 capability matrix published with a definitive answer on Pi's turn-end event.
- [x] Prior symlink-resolution precedent re-confirmed applicable (`.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T042-T044).

### Definition of Done

- [x] `.opencode/hooks/goal/pi/goal-context.ts` authored, importing phase 001's goal core.
- [x] `.pi/extensions/goal-context.ts` symlink created and resolves in a live Pi session with zero import errors.
- [x] `input` transform injects the goal brief, visibly present in the chat transcript (live-verified).
- [x] `session_start` restore verified with pre-existing state.
- [x] Turn-end verify implemented and tested (event confirmed; observe-only, no forced continuation).
- [x] Co-located `node --test` suite passes.
- [x] `validate.sh --strict` on this folder returns Errors: 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reverse-symlink extension: canonical source lives in the unified hooks tree (`.opencode/hooks/goal/pi/`), a relative symlink in `.pi/extensions/` satisfies Pi's fixed auto-discovery directory requirement. This is the opposite direction from the general Pi-extension pattern already proven in this repo (real file usually under `.pi/extensions/`, hooks tree holds the mirror) — chosen here because the goal concern's canonical home is the shared `.opencode/hooks/goal/` tree alongside its other runtime adapters (003 Devin, 004 Cursor), not `.pi/extensions/` specifically.

### Key Components

- **`goal-context.ts`**: the extension entry point; imports `.opencode/hooks/goal/lib/goal-core.cjs` for state read/write and block rendering.
- **`input` transform handler**: renders the `[active_goal]` block into the outgoing prompt; Pi displays input-transform output visibly in chat (unlike Devin/Cursor's invisible injection surfaces).
- **`session_start` handler**: reads shared active-goal state and restores it for the new session.
- **Turn-end verify handler (conditional)**: only authored if phase 002's matrix confirms a usable event; wraps the ported heuristic verifier from phase 001.

### Control Flow

Confirm phase 001 API + phase 002 matrix -> author `goal-context.ts` at its canonical path -> write imports for the `.pi/extensions/` base per proven symlink semantics -> create the relative symlink -> wire `input`/`session_start`/[conditional turn-end] -> co-located unit tests -> live `pi` smoke proof -> validate docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm phase 001's `goal-core.cjs` API surface (read/write/render/hardening/verifier exports).
- [x] Confirm phase 002's capability-matrix verdict on Pi's turn-end/agent-loop event.
- [x] Re-confirm the symlink-resolution precedent still holds for this repo's current Pi version.

### Phase 2: Implementation

- [x] Author `.opencode/hooks/goal/pi/goal-context.ts`: import goal core, implement `input` transform injection with the parameterized "Focused Pi execution agent…" Role line.
- [x] Implement `session_start` restore handler.
- [x] 002 confirmed a usable event (`turn_end`); implemented the gated turn-end verify handler, observe-only per its `void` return type.
- [x] Create the relative symlink `.pi/extensions/goal-context.ts` -> the real file.

### Phase 3: Verification

- [x] Co-located `node --test` suite: state read/render, symlink-relative import resolution, factory export shape, fail-open contract (13 tests).
- [x] Live smoke proof: `pi --offline -p` with an active goal set, confirming the brief appears in the visible transcript.
- [x] Live `session_start` restore check with pre-existing state.
- [x] `validate.sh --strict` on this phase folder: Errors 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or Evidence |
|-----------|-------|-------------------|
| Unit | `goal-context.ts` state/render/import logic | `node --test` |
| Live smoke | Injection reaching the model, transcript visibility | `pi --offline -p` (or `pi -p`) |
| Live smoke | `session_start` restore | Fresh Pi session with pre-set active-goal state |
| Static | Symlink resolution | `ls -la .pi/extensions/goal-context.ts`; live session load with zero import errors |
| Documentation | This phase's spec/plan/tasks/checklist/implementation-summary | `validate_document.py` via `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 001 goal core | Internal (sibling phase) | Planned | Cannot implement without the shared state/render API. |
| Phase 002 capability matrix | Internal (sibling phase) | Planned | Cannot honestly scope turn-end verify without it. |
| Pi CLI (`cli-pi`) availability for live smoke proof | External CLI | Available | Cannot produce the live injection/restore evidence this spec requires. |
| Prior symlink-resolution precedent (`033-hook-runtime-relocation-review` Phase 9) | Internal (sibling packet) | Complete | Would need to re-derive symlink-import semantics from scratch. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live smoke proof fails to show the goal brief reaching the model, or the symlink fails to resolve in a live Pi session.
- **Procedure**: Remove the `.pi/extensions/goal-context.ts` symlink to disable the extension immediately (Pi auto-discovers only from that directory); the real file under `.opencode/hooks/goal/pi/` can be fixed in place without affecting any other runtime's adapters.
- **Data impact**: None — the extension only reads the shared active-goal state file; it does not write schema changes to it beyond what phase 001's core already defines.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Sibling phases 001, 002 | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Parent packet phase-map completion for 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Notes |
|-------|------------|-------|
| Setup | Low | Reading two sibling phases' outputs, no new research. |
| Implementation | Medium | One new file + symlink, reusing an already-built core; turn-end handler size depends entirely on 002's verdict. |
| Verification | Low-Medium | Unit tests are small; the live smoke proof is the higher-effort, higher-value check. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Remediation Controls

- [ ] Work stays isolated to `.opencode/hooks/goal/pi/` and the single `.pi/extensions/goal-context.ts` symlink — no other extension or plugin touched.
- [ ] Symlink target verified resolving before any live smoke claim.

### Rollback Procedure

1. Remove the symlink to disable the extension without touching any other Pi extension.
2. Fix the real file in place under `.opencode/hooks/goal/pi/`.
3. Re-create the symlink and re-run the live smoke proof before re-enabling.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable — no schema changes to the shared active-goal state file beyond phase 001's existing contract.
<!-- /ANCHOR:enhanced-rollback -->
