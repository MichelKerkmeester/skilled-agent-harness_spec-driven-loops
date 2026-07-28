---
title: "Feature Specification: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Port the runtime-neutral goal core to Pi as a real .opencode/hooks/goal/pi/goal-context.ts file symlinked from .pi/extensions/, delivering operator-visible input-transform injection, session_start restore, and a turn-end verify step gated on phase 002's capability probe."
trigger_phrases:
  - "pi goal hooks"
  - "pi goal extension"
  - "pi input transform injection"
  - "pi session start restore"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-28T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec for the Pi goal extension"
    next_safe_action: "Await phase 002 capability matrix before adapter implementation"
    blockers:
      - "Depends on phase 002 confirming Pi's turn-end/agent-loop event."
    key_files:
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".pi/extensions/goal-context.ts"
      - ".opencode/hooks/goal/lib/goal-core.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Pi's types.d.ts exposes a usable turn-end/agent-loop event (resolved by phase 002)."
    answered_questions:
      - "Real file lives in .opencode/hooks/goal/pi/, symlinked from .pi/extensions/ — reverse of the general Pi pattern used elsewhere in this repo."
      - "Imports are written for the .pi/extensions/ base path per the proven symlink-resolution semantics."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi goal extension (input-transform injection, session_start restore, turn-end verify)

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
| **Branch** | `skilled/v4.0.0.0` (direct, per parent packet operator choice) |
| **Authority** | `cli-external-orchestration`, phase child of `032-goal-hooks-cross-runtime` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `004-cursor-goal-hooks` |
| **Successor** | `006-dispatch-shape-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The runtime-neutral goal core (phase 001) and the capability-probe matrix (phase 002) give cli-pi sessions everything needed to carry an operator-set goal across turns, but nothing in `.pi/extensions/` currently reads or renders it. A goal set for the work does not survive into a Pi session at all — the operator has to re-state intent every turn, unlike OpenCode's passive `mk-goal.js` injection.

### Purpose

Deliver a Pi extension that injects the shared active-goal brief through Pi's `input` transform (visibly, in chat, since Pi renders input-transforms unlike Devin/Cursor's invisible injection), restores state on `session_start`, and — only if phase 002 confirms a usable turn-end/agent-loop event — verifies goal progress at turn end. The real source file lives at `.opencode/hooks/goal/pi/goal-context.ts` (the canonical location), with a relative symlink from `.pi/extensions/goal-context.ts` back to it — the reverse of the general Pi pattern in this repo, where the real file usually lives under `.pi/extensions/` and the hooks tree holds the mirror symlink instead.

### User Story 1: Goal continuity in Pi sessions

As an operator running `cli-pi`, I need my active goal to be visibly re-injected every turn so a long Pi session does not drift off the stated objective, the same protection OpenCode sessions already have via `mk-goal.js`.

### User Story 2: Honest capability tier

As an operator, I need the Pi adapter to only claim verify/continue behavior if a real Pi event supports it, not simulate a capability Pi's typed event surface does not actually expose.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/hooks/goal/pi/goal-context.ts`: the real, canonical extension file, importing `.opencode/hooks/goal/lib/goal-core.cjs` (phase 001) for state read/write, block rendering, and the parameterized Role line ("Focused Pi execution agent…").
- A relative symlink `.pi/extensions/goal-context.ts` -> `../../.opencode/hooks/goal/pi/goal-context.ts`, with imports inside the file written against the `.pi/extensions/` base path per the proven symlink-resolution semantics (Pi's loader resolves relative imports against the symlink's directory, not its realpath).
- `input` transform: renders the `[active_goal]` brief into the prompt, operator-visible in the Pi chat transcript (a UX-relevant difference from Devin's `UserPromptSubmit` and Cursor's `sessionStart` injection, both invisible to the operator).
- `session_start`: restores active-goal state at the start of a new Pi session.
- Turn-end verify: implemented only if phase 002's capability matrix confirms Pi's `types.d.ts` exposes a usable turn-end/agent-loop event; otherwise this adapter ships injection + restore only, with the gap documented rather than simulated.
- Co-located `node --test` suite for the adapter's own logic (state read/render, symlink-relative import resolution).
- A live smoke proof via `pi --offline -p` (or `pi -p` if offline mode is unsuitable for this check) showing the goal brief actually reaching the model/chat transcript.

### Out of Scope

- Phase 001's goal core and shared state file implementation (consumed here, not built here).
- Phase 002's capability probes themselves (consumed as an input; this phase does not re-probe Pi's event surface).
- Devin (003) and Cursor (004) adapters.
- Any change to `mk-goal.js` or the OpenCode manage surface.
- Dispatch-shape coverage (006) and OpenCode plugin symlinks (007) — unrelated concerns in sibling phases.

### Surfaces Changed

| Surface | Change Type | Description |
|---------|-------------|-------------|
| `.opencode/hooks/goal/pi/goal-context.ts` (new) | Added | Real extension source: input-transform injection, session_start restore, gated turn-end verify. |
| `.pi/extensions/goal-context.ts` (new) | Added | Relative symlink back to the real file, per Pi's fixed auto-discovery directory. |
| `.opencode/hooks/goal/pi/*.test.cjs` (new) | Added | Co-located adapter test suite. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Real file lives at `.opencode/hooks/goal/pi/goal-context.ts`, symlinked from `.pi/extensions/goal-context.ts`. | `ls -la .pi/extensions/goal-context.ts` shows a symlink resolving to the real file; `git log --follow` on the real file shows its own history, not the symlink's. |
| REQ-002 | Imports inside the extension resolve correctly through the symlink. | A live Pi session loads the extension with zero import errors; imports are written relative to `.pi/extensions/` per the proven symlink-resolution semantics. |
| REQ-003 | Input-transform injection is operator-visible in the Pi chat transcript. | A live smoke test shows the rendered `[active_goal]` block appearing in the visible transcript, not only in the model-facing prompt. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `session_start` restores active-goal state. | A new Pi session started with an existing active-goal file re-renders the same goal without requiring the operator to re-set it. |
| REQ-005 | Turn-end verify is implemented only if phase 002 confirms a usable event. | If 002's matrix lists no usable Pi turn-end event, this adapter ships without a verify step and `implementation-summary.md` documents the fallback honestly; if 002 confirms an event, verify is implemented and tested. |
| REQ-006 | Adapter reuses phase 001's goal core rather than re-implementing state/render logic. | `goal-context.ts` imports `.opencode/hooks/goal/lib/goal-core.cjs`; no duplicated state-read/render/hardening logic in the Pi file. |
| REQ-007 | Live smoke proof of injection reaching the model. | `pi --offline -p` (or `pi -p`) run with an active goal set shows the goal brief present in the actual model-facing turn, not just unit-tested in isolation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.pi/extensions/goal-context.ts` symlink resolves to `.opencode/hooks/goal/pi/goal-context.ts` and a live Pi session loads it with zero errors.
- **SC-002**: A live smoke test shows the `[active_goal]` block visibly present in the Pi chat transcript after an `input` transform run.
- **SC-003**: A fresh Pi session with pre-existing active-goal state re-renders that goal on `session_start` without operator re-entry.
- **SC-004**: Turn-end verify is either implemented and tested (if 002 confirms a usable event) or explicitly and honestly absent with the fallback documented (if 002 finds none) — no simulated verify behavior either way.
- **SC-005**: Co-located `node --test` suite passes for the adapter's own logic.

### Acceptance Scenarios

- **Given** an active goal set via the shared state file, **When** a Pi turn runs through the `input` transform, **Then** the rendered `[active_goal]` block appears visibly in the chat transcript before the model responds.
- **Given** a Pi session restarts with existing active-goal state, **When** `session_start` fires, **Then** the goal is restored without the operator re-stating it.
- **Given** phase 002 confirms a usable turn-end event, **When** a turn completes, **Then** the adapter runs the ported heuristic verifier against the transcript.
- **Given** phase 002 finds no usable turn-end event, **When** the adapter ships, **Then** it carries injection + restore only, and this gap is stated plainly in `implementation-summary.md` rather than papered over.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 goal core (`lib/goal-core.cjs`) must exist and expose read/write/render primitives. | Cannot build this adapter before 001 lands. | Phase ordering enforced by the parent packet's phase map; this spec stays `Planned` until 001 ships. |
| Dependency | Phase 002's capability matrix must confirm or rule out a Pi turn-end event before verify is implemented. | Building verify against a guessed event risks a non-functional or silently-broken feature. | Turn-end verify explicitly gated on 002's output per REQ-005; no adapter verify code before 002 lands. |
| Risk | Symlink-resolution semantics (real file outside `.pi/extensions/`) is the reverse of the pattern used elsewhere in this repo for other Pi extensions, increasing chance of import-path mistakes. | Broken imports would silently disable goal injection for Pi sessions with no error surfaced to the operator. | Reuse the proven symlink-resolution precedent (`.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T042-T044) and its live behavioral-proof pattern before claiming completion. |
| Risk | `input`-transform visibility could surface the goal brief to contexts where the operator does not expect chat-visible text. | Unexpected transcript noise every turn. | Precedent: this repo already treats Pi's operator-visible injection as expected behavior for the Gate-3 question class; document the visibility property explicitly rather than trying to hide it. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality

- **NFR-Q01**: The Pi adapter must not duplicate any state/render/hardening logic already owned by phase 001's goal core.
- **NFR-Q02**: Documentation touched by this phase must pass `validate_document.py` with 0 issues.

### Reliability

- **NFR-R01**: If phase 002 rules out a turn-end event, the adapter must not silently claim verify support anywhere in its code, tests, or docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### No Usable Turn-End Event

- If phase 002 finds no usable turn-end/agent-loop event in Pi's `types.d.ts`, the fallback is injection-only: `input` transform + `session_start` restore, with no verify/continue step. This is stated as a real capability gap, not a deferred TODO, in both this spec and `implementation-summary.md`.

### Symlink Resolution Failure

- If a live Pi session fails to resolve the symlinked extension's imports, this is a P0 blocker — REQ-002 is not satisfied by unit tests alone; a live session load is required evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One new extension file + symlink + co-located tests, consuming an already-built shared core. |
| Risk | 10/25 | Reverse symlink direction vs. the repo's usual Pi pattern; operator-visible injection UX; gated verify. |
| Research | 4/20 | Symlink-resolution semantics already proven by a prior packet's Phase 9 probe; capability tier resolved by phase 002, not re-researched here. |
| **Total** | **22/70** | **Level 2 verification packet (parent packet's documentation-level choice)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether Pi's typed event surface offers a usable turn-end event for verify/continue (resolved by phase 002; this phase's REQ-005 branches on the answer).
- Whether the `input`-transform visibility of the goal brief needs any operator-facing formatting adjustment once seen live, versus reusing mk-goal's template verbatim.
<!-- /ANCHOR:questions -->
