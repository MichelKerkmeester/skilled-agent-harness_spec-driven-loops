---
title: "Implementation Plan: Cross-runtime goal hook capability probes"
description: "Run three live, per-runtime capability probes (Pi event list, Devin Stop-hook blocking, Cursor preToolUse refresh) and record a capability matrix that fixes the honest parity tier for the devin/cursor/pi goal-hook adapters"
trigger_phrases:
  - "capability probe plan"
  - "devin stop hook probe"
  - "pi event list probe"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 1 planning docs for phase 002 capability probes"
    next_safe_action: "Run the three live capability probes and record the matrix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-002-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Devin's Stop hook supports a blocking/continue decision (resolved by this phase)."
      - "Whether Pi's typed event surface offers a usable turn-end event (resolved by this phase)."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cross-runtime goal hook capability probes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | N/A — this phase reads runtime artifacts and exercises live hook sessions, it does not ship code |
| **Runtimes probed** | Devin (`.devin/hooks.v1.json` `Stop` hook), Cursor (`.cursor/hooks.json` `preToolUse`), Pi (installed `types.d.ts`) |
| **Evidence discipline** | Every probe result must cite what was actually run or read (session transcript, command, or file:line) — no inference from schema similarity alone |

### Overview

Three independent probes, run in any order since none depends on another's outcome: read Pi's installed `types.d.ts` for a usable turn-end/agent-loop event; exercise a live Devin session with a `Stop` hook returning `decision:"block"` to see whether continuation is actually forced; exercise a live Cursor session with a `preToolUse` hook attempting an `agent_message` refresh to see whether it is actually delivered. Each result is written into the capability matrix in `spec.md`, fixing phases 003/004/005's honest parity tier before any adapter code exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Parent packet `032-goal-hooks-cross-runtime/spec.md` phase map confirms this phase precedes 003/004/005
- [ ] Live access confirmed (or its absence recorded) for Devin and Cursor probe sessions
- [ ] Pi's installed `types.d.ts` location located on disk

### Definition of Done

- [ ] All three probes run/read and results recorded with evidence
- [ ] Capability matrix in `spec.md` fully populated (no `TBD` cells)
- [ ] Phases 003/004/005 spec scope sections updated to reference the fixed tiers
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Probe-first verification — no code is built against an assumed capability; each capability claim is tested against the real artifact before it is relied upon by a later phase.

### Key Components

- **Probe (a) — Pi event surface**: direct read of Pi's installed `types.d.ts` event-type declarations, searching for a turn-end or agent-loop-boundary event usable as a verify/continue trigger.
- **Probe (b) — Devin Stop-hook blocking**: a live Devin session with a test `Stop` hook returning `decision:"block"`, observing whether Devin actually forces continuation (mirroring Claude's contract) or ignores the field.
- **Probe (c) — Cursor preToolUse refresh**: a live Cursor session with a test `preToolUse` hook attempting to deliver an `agent_message` refresh, observing whether the message actually reaches the model (distinct from the already-confirmed one-shot `sessionStart` and the already-confirmed non-delivery of prompt-submit).
- **Capability matrix**: the single artifact all three probes write into, embedded in `spec.md` rather than a separate file, since it is small and directly gates the next three phases' scope.

### Data Flow

1. Run probe (a): read `types.d.ts`, record candidate event name (or "none found") with file:line.
2. Run probe (b): dispatch a live Devin session with the test `Stop` hook, observe actual continuation behavior, record result.
3. Run probe (c): dispatch a live Cursor session with the test `preToolUse` hook, observe actual delivery, record result.
4. Populate the capability matrix in `spec.md` from the three results.
5. Update phases 003/004/005 scope sections to reference the fixed tiers instead of open questions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm live session access (or document its absence) for a Devin probe session and a Cursor probe session
- [ ] Locate Pi's installed `types.d.ts` on disk and confirm it is readable

### Phase 2: Core Implementation

- [ ] Run probe (a): read Pi's `types.d.ts` event-type list; identify a candidate turn-end/agent-loop event or record none found
- [ ] Run probe (b): dispatch a live Devin session with a test `Stop` hook returning `decision:"block"`; observe and record actual continuation behavior
- [ ] Run probe (c): dispatch a live Cursor session with a test `preToolUse` hook attempting an `agent_message` refresh; observe and record actual delivery

### Phase 3: Verification

- [ ] Populate the capability matrix in `spec.md` with all three results, each cited by evidence
- [ ] Update phases 003/004/005 spec.md scope sections to reference the fixed tiers
- [ ] Run `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static read | Pi `types.d.ts` event-type declarations | Direct file read |
| Live session | Devin `Stop` hook block/continue behavior | Live `devin -p` session with a test hook |
| Live session | Cursor `preToolUse` `agent_message` delivery | Live `cursor-agent` session with a test hook |
| Documentation | Capability matrix and phases 003/004/005 scope updates | `validate_document.py` / `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Live Devin session access | External | Unconfirmed | Probe (b) cannot run; default Devin's verify/continue tier to "unsupported" until confirmed |
| Live Cursor session access | External | Unconfirmed | Probe (c) cannot run; default Cursor's cadence tier to the already-confirmed `sessionStart`-once baseline only |
| Pi installed `types.d.ts` on disk | Internal | Unconfirmed | Probe (a) cannot run; default Pi's verify/continue tier to "unsupported" until confirmed |
| Phase 001 (goal core + shared state) | Internal | Planned, shares vocabulary only | None — this phase does not import 001's code |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A probe cannot be run live (no access) or returns an ambiguous result that cannot be resolved without further operator input.
- **Procedure**: Record the blocker explicitly in `implementation-summary.md` Known Limitations; default the affected runtime's tier to the conservative "injection-only, no verify/continue" outcome rather than guessing; do not mark this phase complete until the operator either supplies access or accepts the conservative default for that runtime.
- **Data impact**: None — this phase reads/observes only, no state or files are mutated by the probes themselves.
<!-- /ANCHOR:rollback -->
