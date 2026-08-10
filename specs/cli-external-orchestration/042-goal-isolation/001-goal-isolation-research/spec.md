---
title: "Research Phase: Cross-Runtime Goal Isolation"
description: "Three forced-depth system-deep-loop iterations that establish the current goal-state ownership model, native session identity contracts, and an implementation-ready isolation architecture."
status: "complete"
trigger_phrases:
  - "goal isolation research"
  - "multiple active goals"
  - "pi goal session identity"
  - "cross-runtime goal hooks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/001-goal-isolation-research"
    last_updated_at: "2026-08-10T12:35:00Z"
    last_updated_by: "codex"
    recent_action: "Completed and reconciled all three forced-depth research iterations"
    next_safe_action: "Begin Phase 2 with failing session-isolation tests"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
      - "research/iterations/iteration-001.md"
      - "research/iterations/iteration-002.md"
      - "research/iterations/iteration-003.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-isolation-research-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The runtime-neutral active-goal.json singleton causes cross-session replacement and injection."
      - "Pi lifecycle and registered-command contexts expose ctx.sessionManager.getSessionId()."
      - "Cursor hooks expose session_id, but the current shell-style management prompt does not."
      - "Devin goal adapters were deliberately decommissioned and should not be restored."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-10 |
| **Branch** | Current working branch |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | `002-session-scoped-core` |
| **Handoff Criteria** | Three iterations and final synthesis resolve the isolation contract, runtime identity matrix, migration policy, and objective proof plan. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase investigates why concurrent goals leak between AI sessions and turns repository evidence into a build contract. It uses `/deep:research:auto` through `system-deep-loop`, with `--max-iterations=3` and `--stop-policy=max-iterations`, so convergence telemetry cannot terminate the run before all three requested passes complete.

**Scope Boundary**: research artifacts and bounded workflow-owned updates to this phase packet only. No goal runtime implementation belongs in Phase 1.

**Dependencies**:
- Current tracked goal core, CLI, plugins, adapters, registrations, prompts, and tests.
- Historical packets `032-goal-hooks-cross-runtime` and `034-goal-hook-playbooks-and-validation` as claims to verify against current source.

**Deliverables**:
- Three cited iteration reports and their JSONL deltas.
- A final `research/research.md` synthesis.
- An implementation-ready recommendation for phases 2 through 5.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Pi and Cursor currently share one repository-level `active-goal.json`. A second session replaces the first session's record, so unrelated agents can receive, mutate, verify, pause, complete, or clear another session's objective. OpenCode already uses a separate per-session store, while current and historical runtime-support claims disagree about Devin.

### Purpose

Establish the verified ownership model, native identity inputs, safe migration behavior, and test invariants needed to support one active goal per session across concurrent runtimes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Inventory every current goal state producer, consumer, adapter, management surface, and runtime registration.
- Verify native session identity availability and lifecycle semantics for OpenCode, Pi, Cursor, Devin, Claude, and Codex.
- Compare storage and management designs, including missing identity, resume, fork, legacy singleton, and cross-runtime collision behavior.
- Produce a requirement-to-test matrix and phase-specific implementation recommendations.

### Out of Scope

- Editing goal runtime code or re-enabling the Pi goal extension.
- Supporting multiple simultaneously selected goals inside one session.
- Auto-assigning the legacy singleton to any live session.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create/Update | Workflow-owned config, strategy, state, three iterations, dashboard, registry, and synthesis. |
| `spec.md` | Bounded Update | Workflow-owned research context and generated findings fence only. |
| `../spec.md` and phase docs | Update after synthesis | Reconcile the phase map and implementation contracts with verified findings. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run exactly three deep-research iterations through the command-owned `system-deep-loop` workflow. | Iteration files `001` through `003` and corresponding valid state/delta records exist; config records `maxIterations: 3` and max-iterations stop policy. |
| REQ-002 | Separate confirmed current behavior from historical claims. | Every load-bearing finding cites current file, command, test, or primary runtime source evidence. |
| REQ-003 | Resolve the session-identity and management problem across runtimes. | Synthesis states which native id each retained runtime exposes, where management gets it, and what happens when it is unavailable. |
| REQ-004 | Produce a safe state and migration contract. | Synthesis specifies the scope key, opaque filename rule, legacy quarantine behavior, and resume/fork semantics. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Resolve Devin support truth. | Synthesis recommends restore or removal based on tracked source, registration, and current runtime capability. |
| REQ-006 | Define objective proof for implementation. | Final research includes a two-session/cross-runtime action matrix, negative controls, regression controls, and final gate. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three valid iteration artifacts exist and no early-convergence stop occurred.
- **SC-002**: The synthesis answers every P0 research question with citations and distinguishes confirmed facts from recommendations.
- **SC-003**: Phase 2 can begin without inventing session identity, state layout, migration behavior, or acceptance tests.
- **SC-004**: Strict validation passes for this child phase after workflow artifacts and metadata are reconciled.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Historical packets overstate current runtime support | A design may target missing adapters. | Treat historical completion as a hypothesis and verify tracked source plus registration. |
| Risk | Injection and management expose different identity surfaces | A scoped reader could be paired with an ambiguous writer. | Require an end-to-end set-then-inject binding for every retained runtime. |
| Risk | Three iterations repeat the same inventory | Forced depth adds volume without insight. | Assign one focus per iteration: ownership inventory, native identity/management, architecture and proof. |
| Dependency | Deep-loop command workflow and leaf route | Missing route proof invalidates the requested method. | Verify command-owned state fields and iteration route-proof fields before accepting output. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Resolved decisions:

- Pi lifecycle and registered-command handlers expose `ctx.sessionManager.getSessionId()`, so Pi can bind both injection and native management without a user-entered id.
- Cursor hook payloads expose `session_id` (and the maintained shared normalizer accepts `conversation_id`), but the current shell-style management prompt cannot prove the same binding and remains unsupported until it can.
- The retained custom runtime set is Pi plus Cursor's hook-only tier; Devin remains decommissioned, OpenCode stays an unchanged regression control, and Claude Code/Codex have no dedicated runtime-neutral adapter.
- Atomic replacement remains the baseline. Add a queue, lock, or revision check only if the same-scope concurrency negative control reproduces lost updates.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## Research Context

Deep-research completed. The canonical findings live in `research/research.md`; the generated fence below captures the key synthesized results.
<!-- /ANCHOR:research-context -->

---

<!-- BEGIN GENERATED: deep-research/spec-findings -->
## Generated Research Findings

### Architecture Decision
- **Scope key**: `{workspace, runtime, sessionId}` with one shared resolver used by all goal paths.
- **Opaque filename rule**: `<runtime>-<sha256(sessionId)>.json` under the workspace-resolved state root.
- **SessionId source**: Pi `ctx.sessionManager.getSessionId()` and Cursor hook `session_id`; missing identity never selects or mutates a goal.

### Current State (confirmed)
- One shared `active-goal.json` singleton at `~/.config/opencode/active-goal.json` serves all runtimes via the cross-runtime goal port. `setGoal()` in `goal-core.cjs` has no session-scoping key — any runtime's `set` overwrites the goal for all others.
- OpenCode (`mk-goal` plugin): already uses per-session files keyed by hex session ID — the pattern to replicate.
- Pi (`goal-context.ts`): input, session-start, and turn-end handlers currently ignore the stable id available from `ctx.sessionManager.getSessionId()` and write back to the shared singleton.
- Cursor: Goal management menu reads/writes the shared singleton without session awareness.
- Devin adapter: Decommissioned via commit `cac19bbfa5e`. Should NOT be restored.
- Claude Code: Symlinks to mk-goal plugin (no dedicated adapter).
- Codex: No goal adapter registered.

### Pi Cross-Session Overwrite Reproduction
1. Session A sets goal → writes `active-goal.json` with `sessionId: "A"`.
2. Session B sets goal → overwrites same file with `sessionId: "B"`.
3. Session A's `recordTurn()` reads the goal — finds `sessionId: "B"` — increments `turnsUsed` on Session B's goal (goal-core.cjs:604-623, goal-context.ts:92).
4. Session A receives injection, mutation, verification, pause, and completion for another session's objective.

### Migration Strategy (4 phases)
1. **Detect & Quarantine**: On startup, detect existing legacy singleton; move to `~/.config/opencode/goals/_legacy/active-goal.json` with timestamp.
2. **Per-Session Write**: `setGoal()` writes to `~/.config/opencode/goals/<runtime>-<sha256(sid)>.json`.
3. **Adapter Threading**: Thread scope through Pi lifecycle plus a native registered management command, and through Cursor's hook payload. OpenCode remains unchanged.
4. **Resume/Fork Semantics**: The same native id resumes the same goal; a new/forked id starts unbound unless a separate explicit clone action is implemented. No `"default"` fallback.

### Verification Plan
- **Stage 1 — Positive Matrix**: Pi A/B, Cursor A/B hook reads, and same-id/different-runtime rows verify each scope reads only its own goal.
- **Stage 2 — Negative Controls**: Legacy absent, legacy quarantined, missing sessionId, invalid session file, concurrent writer.
- **Stage 3 — Regression Controls**: All 7 original tests from `032-goal-hooks-cross-runtime` pass against per-session storage.
- **Stage 4 — Final Gate**: 7-point checklist (isolation, resume, fork, backward compatibility, migration, concurrency, regression).

### Key Risks
- Pi identity is available in lifecycle and registered-command contexts; the current goal adapter and prompt simply do not use it.
- Concurrency: Atomic file replacement is sufficient for single-session writes; a file lock is optional (and adds complexity).
- Implementation footprint: ~200-300 LOC, bounded to `resolveStateDir` choke point + 3 adapter threadings.

_Generated: 2026-08-10 | Source: research/research.md | Iterations: 3 | Stop reason: maxIterationsReached_
<!-- END GENERATED: deep-research/spec-findings -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Next phase**: `../002-session-scoped-core/spec.md`
- **Prior architecture**: `../../032-goal-hooks-cross-runtime/spec.md`
- **Prior validation**: `../../034-goal-hook-playbooks-and-validation/spec.md`
