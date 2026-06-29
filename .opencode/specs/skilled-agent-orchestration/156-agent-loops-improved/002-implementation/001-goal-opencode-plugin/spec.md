---
title: "Feature Specification: /goal OpenCode Plugin"
description: "An OpenCode plugin + /goal command mirroring Claude Code's /goal: set a session completion condition that persists and is injected into every turn until met."
trigger_phrases:
  - "goal opencode plugin"
  - "slash goal command"
  - "session goal injection"
  - "thread goals opencode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase spec; 10-iteration design research pending in research/"
    next_safe_action: "Run the 10-iter deep-research design pass, then decompose into build sub-phases"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: /goal OpenCode Plugin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | `002-deep-loop-runtime` |
| **Handoff Criteria** | A 10-iteration design research pass produces a concrete plugin/command/state design + chosen autonomy tier |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the loop-systems implementation — a net-new capability, sequenced first because it carries the highest design uncertainty. Its design is produced by a dedicated **10-iteration deep-research run** (cli-codex gpt-5.5 xhigh fast) whose artifacts land in this folder's `research/`.

**Scope Boundary**: this phase delivers the *design* (research + recommended architecture). The actual `mk-goal.js` / `goal.md` build is decomposed into child sub-phases after the research lands.

**Dependencies**: none (independent of the 40 loop recommendations).

**Deliverables**: `research/research.md` recommending plugin files, state model, injection mechanism, lifecycle, and a chosen autonomy tier.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode has no goal/completion-condition system. Claude Code (v2.1.139) ships `/goal <condition>`, which sets a session-level completion condition the agent works toward autonomously until met; Codex has an equivalent `thread_goals` store. Long OpenCode sessions drift from their objective with no persistent, re-injected anchor.

### Purpose
Build a `/goal` command + an auto-loaded `mk-goal.js` plugin that sets a goal, persists it, injects it into every turn's system context until met, and supports show/clear/complete — bringing Claude-Code-parity goal anchoring to OpenCode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design (this phase) via the 10-iter research, then a plugin + command implementation in follow-up sub-phases.
- Plugin injects the active goal via `experimental.chat.system.transform` (the pattern used by `mk-spec-memory.js`); lifecycle/tracking via the `event` hook (`session.idle` is the autonomy seam).
- A `/goal` command (thin-router, like `/memory:learn`): `set <objective> | show | clear | complete | pause`.

### Out of Scope
- The plugin build itself (separate child sub-phases after the research).
- Claude's status-line overlay (OpenCode can't render it; substitute = system-context injection + a status tool).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../001-goal-opencode-plugin/research/` | Create | 10-iteration design research output |
| `.opencode/plugins/mk-goal.js` | Create (later sub-phase) | Auto-loaded plugin: inject + lifecycle + tools |
| `.opencode/commands/goal.md` | Create (later sub-phase) | The `/goal` command |
| goal state store (flat JSON, porting Codex `thread_goals`) | Create (later sub-phase) | Per-session goal persistence |

**Reference evidence (not our code):** Claude Code v2.1.139 `/goal`; Codex `~/.codex/goals_1.sqlite` (`thread_goals` schema); `.opencode/plugins/mk-spec-memory.js` (injection pattern); `.opencode/commands/memory/learn.md` (command pattern); `.opencode/specs/z_future/openhuman/external` (`thread_goals`/`ThreadGoalChip` reference).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a plugin/command/state design via ≥10 proper research iterations | `research/research.md` recommends files, state model, injection hook, lifecycle |
| REQ-002 | Choose an autonomy tier with rationale | Design names passive / active-continuation / +supervisor and recommends one with guardrails |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Validate the design against the live OpenCode plugin API | Design cites the actual hooks (`experimental.chat.system.transform`, `event`) + state-store options |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` present with a concrete, buildable `/goal` design.
- **SC-002**: Build sub-phases identified (plugin, command, state, optional supervisor).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `experimental.chat.*` hooks are experimental | Injection API may change on OpenCode upgrade | Probe on upgrade (per plugins README ritual) |
| Risk | Active-continuation autonomy loop | Runaway turns | Loop caps + kill switch + status gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved by the 10-iter research: (1) autonomy tier; (2) scope/keying (per-session vs global); (3) state store (flat JSON vs sqlite vs spec-kit memory); (4) budget governance (token/time caps); (5) completion detection (self-report vs shell gate vs supervisor); (6) status set; (7) surfacing substitute; (8) command style (root vs namespace); (9) reuse vs standalone.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-004
REQ-005
**Given**
**Given**
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-state-store/ | Per-session JSON goal state: atomic writes, hex(sessionID) keying, fail-closed | Complete |
| 2 | 002-injection-plugin/ | Inject the active goal into each turn via experimental.chat.system.transform (sanitized + fenced) | Complete |
| 3 | 003-goal-command/ | Root /goal command + mk_goal/mk_goal_status tools (set/show/clear/complete/pause) | Complete |
| 4 | 004-lifecycle-tracking/ | event() lifecycle: restore, usage accounting, budget_limited, blocked-by-prompt | Complete |
| 5 | 005-completion-supervisor/ | Verifier (met/not_met/blocked) gating goal completion | Complete |
| 6 | 006-active-continuation/ | Guarded session.idle continuation (default-off, caps + kill-switch) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-state-store | 002-injection-plugin | State helpers persist + read a per-session goal | Plugin state unit test passes |
| 002-injection-plugin | 003-goal-command | Active goal renders into the turn's system context | Injection preview + tool-path test pass |
| 003-goal-command | 004-lifecycle-tracking | /goal verbs route through the mk_goal tools | Tool-path test + state persistence |
| 004-lifecycle-tracking | 005-completion-supervisor | Lifecycle events update usage + status | Lifecycle unit test passes |
| 005-completion-supervisor | 006-active-continuation | Verifier returns met/not_met/blocked | Supervisor unit test passes |
<!-- /ANCHOR:phase-map -->
