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
    packet_pointer: "deep-loops/032-goal-opencode-plugin"
    last_updated_at: "2026-06-30T16:30:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Landed all 5 remediation phases (010-014); audit-driven work complete"
    next_safe_action: "No further action required; phase 009 remains owned by a separate session"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal.md"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
      - ".opencode/skills/system-spec-kit/references/hooks/goal_plugin.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 95
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
| **Level** | phase parent |
| **Priority** | P1 |
| **Status** | In Progress (phases 001-008, 010-014 complete; phase 009 owned by a separate session, in progress) |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet under deep-loops) |
| **Phase** | N/A |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Design research and implementation sub-phases (001-008, 010-014; phase 009 tracked separately) are complete and independently validated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This packet owns the OpenCode session-goal capability. It combines the dedicated design research with six implementation sub-phases for state, injection, command routing, lifecycle tracking, completion supervision and guarded continuation.

**Scope Boundary**: this packet covers the `/goal` OpenCode plugin and command only. Loop-runtime and workflow improvements live in the separate loop-system packet.

**Dependencies**: none at runtime beyond the OpenCode plugin and command surfaces.

**Deliverables**: `research/research.md`, `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal.md` and the plugin unit test suite.
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
- Design via the 10-iteration research plus the shipped plugin and command implementation sub-phases.
- Plugin injects the active goal via `experimental.chat.system.transform` (the pattern used by `mk-spec-memory.js`); lifecycle/tracking via the `event` hook (`session.idle` is the autonomy seam).
- A `/goal` command (thin-router, like `/memory:learn`): `set <objective> | show | clear | complete | pause`.

### Out of Scope
- Claude's status-line overlay (OpenCode can't render it; substitute = system-context injection + a status tool).
- Unrelated loop-runtime, workflow, Spec Kit, advisor, UX and testing improvements.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | 10-iteration design research output |
| `.opencode/plugins/mk-goal.js` | Create | Auto-loaded plugin: inject + lifecycle + tools |
| `.opencode/commands/goal.md` | Create | The `/goal` command |
| `.opencode/skills/.goal-state/` | Create | Per-session goal persistence |

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
## 7. RESOLVED QUESTIONS

Resolved by the 10-iteration research: (1) autonomy tier; (2) scope/keying (per-session vs global); (3) state store (flat JSON vs sqlite vs spec-kit memory); (4) budget governance (token/time caps); (5) completion detection (self-report vs shell gate vs supervisor); (6) status set; (7) surfacing substitute; (8) command style (root vs namespace); (9) reuse vs standalone.
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

| 7 | 007-sk-prompt-goal-enhancement/ | Transform raw `/goal set` input into a deterministic sk-prompt-style `goalPrompt` under 4000 chars | Complete |
| 8 | 008-system-spec-kit-integration/ | Integrate `mk-goal` into system-spec-kit routing, references, catalog assets, manual playbook, and env docs | Complete |
| 9 | 009-speckit-command-goal-prompt-offer/ | [Phase 9 scope] | Pending |
| 10 | 010-security-and-correctness-fixes/ | Fix 5 confirmed P1 security/correctness defects (DR-001 injection clamp, DR-003 stale-verifier race, DR-004-P1 RICCE metadata, DR-005 sanitizer hardening, DR-006 secret redaction) in mk-goal.js | Complete |
| 11 | 011-command-surface-normalization/ | Normalize the twice-renamed /goal command filename to its final evidence-backed name and sweep all referencing surfaces (specs, catalogs, playbooks, env docs); resolve DR-004-P2/DR-010-P1/P2 | Complete |
| 12 | 012-regression-test-backfill/ | Backfill regression tests pinning phases 010/011 fixes plus research's untested code paths (transform hook, event branches, autonomy smoke, export contract, tool-registration) | Complete |
| 13 | 013-design-fidelity-and-polish/ | Wire a real usage_limited detector (operator chose wire over collapse); fix packet-wide fingerprint placeholders, phase 006 completion overclaim, fsync error logging, store-health status field | Complete |
| 14 | 014-goal-state-cleanup-and-archive/ | Archive-then-prune goal state on session.deleted plus a throttled orphan sweep on session.created, so .goal-state/ stops growing unboundedly | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-state-store | 002-injection-plugin | State helpers persist + read a per-session goal | Plugin state unit test passes |
| 002-injection-plugin | 003-goal-command | Active goal renders into the turn's system context | Injection preview + tool-path test pass |
| 003-goal-command | 004-lifecycle-tracking | /goal verbs route through the mk_goal tools | Tool-path test + state persistence |
| 004-lifecycle-tracking | 005-completion-supervisor | Lifecycle events update usage + status | Lifecycle unit test passes |
| 005-completion-supervisor | 006-active-continuation | Verifier returns met/not_met/blocked | Supervisor unit test passes |
| 006-active-continuation | 007-sk-prompt-goal-enhancement | Existing continuation behavior remains green before prompt generation changes | Continuation test passes |
| 007-sk-prompt-goal-enhancement | Complete | `goalPrompt` stored, injected and capped under 4000 chars with prompt metadata | State/tool-path tests plus strict parent validation pass |
| 007-sk-prompt-goal-enhancement | 008-system-spec-kit-integration | `goalPrompt` behavior is already implemented before system-spec-kit docs are updated | Goal plugin tests stay green |
| 008-system-spec-kit-integration | Complete | `mk-goal` is discoverable from system-spec-kit references and does not masquerade as a daemon bridge | Docs checks plus strict parent validation pass |
| 008-system-spec-kit-integration | 009-speckit-command-goal-prompt-offer | [Criteria TBD] | [Verification TBD] |
| 009-speckit-command-goal-prompt-offer | 010-security-and-correctness-fixes | N/A — phase 010 is independent of phase 009 (separate in-flight session); no handoff dependency, phase 010 can proceed without phase 009 completing | N/A |
| 010-security-and-correctness-fixes | 011-command-surface-normalization | All 5 phase-010 fixes land with the existing 6-file test suite passing | Fresh `node` execution evidence (not cited) in phase 010's implementation-summary.md |
| 011-command-surface-normalization | 012-regression-test-backfill | Command filename normalized to its final form; zero stale references to retired filenames outside historical changelogs/research archives | Repo-wide grep for retired filenames returns zero hits outside historical docs |
| 012-regression-test-backfill | 013-design-fidelity-and-polish | Regression suite (existing + backfilled) passes fresh, with at least one new test proven capable of failing against pre-fix behavior | Full suite run plus T014 revert-and-fail spot-check evidence in phase 012's implementation-summary.md |
| 013-design-fidelity-and-polish | 014-goal-state-cleanup-and-archive | N/A — phase 014 is independent of phase 013; no handoff dependency, either order works | N/A |
<!-- /ANCHOR:phase-map -->
