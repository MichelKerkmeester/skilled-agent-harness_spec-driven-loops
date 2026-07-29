---
title: "Feature Specification: Devin goal hooks (UserPromptSubmit inject, SessionStart restore, Stop verify/continue)"
description: "Devin goal hooks: UserPromptSubmit injection, SessionStart restore, Stop verify/continue"
trigger_phrases:
  - "devin goal hooks"
  - "devin goal hook adapters"
  - "devin userpromptsubmit goal inject"
  - "devin stop hook goal verify"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec for Devin goal hook adapters"
    next_safe_action: "Implement after phase 002 fixes the Stop-hook parity tier"
    blockers:
      - "Phase 002 capability-probe matrix must land before adapter code starts."
    key_files:
      - ".opencode/hooks/goal/devin/"
      - ".devin/hooks.v1.json"
      - ".opencode/hooks/goal/lib/goal-core.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Devin's Stop hook can block/continue per the phase 002 probe (undetermined)."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Devin goal hooks (UserPromptSubmit inject, SessionStart restore, Stop verify/continue)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` (direct, per operator choice) |
| **Authority** | `cli-external-orchestration` (Devin adapter surface); depends on `.opencode/hooks/goal/lib/goal-core.cjs` from phase 001 |
| **Depends On** | Phase 001 (`001-goal-core-and-state/`) for the shared goal core; Phase 002 (`002-capability-probes/`) for the Devin Stop-hook capability tier |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `002-capability-probes` |
| **Successor** | `004-cursor-goal-hooks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Devin sessions on this repo have no way to carry an operator-set goal across turns. OpenCode sessions get a passive `[active_goal]` brief injected every turn via `mk-goal.js`; Devin sessions today have nothing, even though recon (packet 032 parent spec, Key recon facts) confirms Devin's `UserPromptSubmit` and `SessionStart` hooks are both live and already wired for other concerns in this repo.

### Purpose

Port the runtime-neutral goal core (built in phase 001) to Devin via three hook adapters — `UserPromptSubmit` injection, `SessionStart` restore, and a `Stop`-hook verify step whose continuation behavior is honestly scoped to whatever phase 002's live capability probe actually confirms about Devin's `Stop` hook schema.

### User Story

As an operator running a Devin session against this repo, I need an active goal set for the work to keep appearing in context every turn, the same way it does in an OpenCode session, so Devin does not drift off the stated objective across a long session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/hooks/goal/devin/` adapters built on `.opencode/hooks/goal/lib/goal-core.cjs` (phase 001 deliverable): one adapter per wired hook.
- `UserPromptSubmit` adapter: reads the shared `active-goal.json` state and injects the rendered goal brief as `additionalContext` on every user turn.
- `SessionStart` adapter: restores the active goal state at the start of a new Devin session (no re-set required if a goal is already active).
- `Stop` adapter: verify-and-continue, per phase 002's fixed tier (`002-capability-probes/capability-matrix.md`) — Devin's `Stop` hook `decision:"block"`+`reason` is CONFIRMED live to force continuation, mirroring Claude's contract.
- Registration of all three adapters in `.devin/hooks.v1.json`.
- Co-located `node --test` adapter test suite.
- A live smoke proof: the goal brief text actually reaching the model in a real `devin -p` session, same evidentiary bar as the Gate-3 proof precedent in this repo (see `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T044 for the precedent pattern).

### Out of Scope

- Any change to `mk-goal.js`, the OpenCode per-session goal state, or the `/goal:goal-opencode` command contract.
- Cursor or Pi adapters (phases 004/005).
- The `DISPATCH_SHAPES` dispatch-hook coverage work (phase 006).
- Deciding the Stop-hook capability tier itself — that determination belongs to phase 002; this phase only consumes the resulting matrix.

### Surfaces Changed

| Surface | Change Type | Description |
|---------|-------------|-------------|
| `.opencode/hooks/goal/devin/` (new) | Added | Three adapters: UserPromptSubmit inject, SessionStart restore, Stop verify(+continue). |
| `.devin/hooks.v1.json` | Modified | Registers the three new adapters against their respective hook events. |
| Co-located `node --test` suite | Added | Adapter-level regression tests, mirroring the pattern in sibling runtime adapter concerns. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `UserPromptSubmit` injects the active goal brief. | A Devin session with an active goal set receives the rendered `[active_goal]` block as `additionalContext` on every user turn; confirmed live via `devin -p`. |
| REQ-002 | `SessionStart` restores the active goal state. | A new Devin session, started while a goal is already active in the shared state file, surfaces that goal without requiring it to be re-set. |
| REQ-003 | The `Stop` hook's parity tier honestly matches phase 002's probe result. | If phase 002 confirms Devin's `Stop` hook can force continuation, the adapter implements verify-and-continue; if not, it ships verify-only and the packet docs state this plainly rather than claiming unverified parity. |
| REQ-004 | All three adapters are registered in `.devin/hooks.v1.json`. | `.devin/hooks.v1.json` lists the three new adapters against `UserPromptSubmit`, `SessionStart`, and `Stop` with correct paths; a live Devin session confirms all three fire. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Adapters depend only on the phase 001 goal core, not on `mk-goal.js` internals. | `rg -n "mk-goal" .opencode/hooks/goal/devin` returns zero hits; adapters import only `.opencode/hooks/goal/lib/goal-core.cjs`. |
| REQ-006 | Co-located adapter test suite passes. | `node --test` on the Devin adapter test files exits 0 with no skipped assertions relevant to the shipped scope. |
| REQ-007 | A live smoke proof records the goal text actually reaching the model. | A commit-pinned transcript or command log shows the injected `[active_goal]` content present in a real `devin -p` response, same evidentiary bar as the Gate-3 proof precedent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `UserPromptSubmit` injection is verified live in a real Devin session.
- **SC-002**: `SessionStart` restore is verified live in a real Devin session.
- **SC-003**: `Stop` verify (and continue, only if phase 002 confirms Devin supports it) is tested and its actual tier is stated honestly in `implementation-summary.md`.
- **SC-004**: The adapter test suite is green.
- **SC-005**: `.devin/hooks.v1.json` registration is confirmed correct via a live session (all three hooks fire, no misconfigured path).

### Acceptance Scenarios

- **Given** an active goal in the shared state file, **When** a Devin session submits a user prompt, **Then** the rendered goal brief appears in that turn's `additionalContext`.
- **Given** an active goal already set, **When** a new Devin session starts, **Then** `SessionStart` restores visibility of that goal without a manual re-set.
- **Given** phase 002 confirms Devin's `Stop` hook cannot force continuation, **When** the `Stop` adapter ships, **Then** it performs verify-only and the packet's completion docs state the tier plainly rather than overclaiming continuation support.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 (`.opencode/hooks/goal/lib/goal-core.cjs`) must exist and be stable. | Adapters cannot be authored against a moving core API. | Sequenced strictly after phase 001 lands. |
| Dependency | Phase 002 capability-probe matrix. | Without a confirmed Stop-hook capability tier, this phase cannot honestly scope REQ-003/SC-003. | Phase 003 stays `Planned` and does not start adapter code until phase 002 ships. |
| Risk | Devin's `Stop` hook schema may not support forcing continuation at all. | The verify-and-continue upgrade may be unavailable; shipping verify-only is an accepted, honestly-documented fallback rather than a blocker. | REQ-003 explicitly permits the verify-only outcome. |
| Risk | Live wiring change to `.devin/hooks.v1.json` affects every concurrent Devin session against this repo. | A misconfigured registration could silently break other Devin hooks already wired there. | Additive-only edit (new entries, no existing entries touched); live smoke test before claiming completion. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Adapter failures must fail open — a goal-hook error must never block a Devin turn or session start.

### Portability

- **NFR-P01**: Adapters read/write only the shared `.opencode/skills/.goal-state/active-goal.json` file; no Devin-only state file is introduced.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions

- No active goal set: `UserPromptSubmit` and `SessionStart` adapters no-op silently (no empty `[active_goal]` block injected).
- Goal completed/paused mid-session: the `Stop` adapter's verify step must reflect the current goal status, not a stale cached read.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three adapters + one config registration, built on an already-shared core. |
| Risk | 10/25 | Live hook wiring for a shared, concurrently-used runtime config. |
| Research | 6/20 | Capability tier resolved upstream by phase 002; this phase mostly implements against a known answer. |
| **Total** | **24/70** | **Level 2 verification packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- ~~Whether Devin's `Stop` hook supports a blocking/continue decision~~ — RESOLVED by phase 002's live probe: **CONFIRMED**. A `Stop` hook returning `{"decision":"block","reason":"..."}` forces genuine continuation (live transcript evidence: `/Users/michelkerkmeester/.local/share/devin/cli/transcripts/caring-diver.json`, the block reason was injected as a synthetic `user` turn and the agent produced a new turn in response; `stop_hook_active` flips `false`→`true` across the two Stop firings, mirroring Claude Code's Stop contract). REQ-003 ships verify-and-continue — see `002-capability-probes/capability-matrix.md`.
<!-- /ANCHOR:questions -->
