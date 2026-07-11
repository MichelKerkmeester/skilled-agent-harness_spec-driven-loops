---
title: "Feature Specification: Phase 20: capability-additions"
description: "The goal plugin lacks small operator-facing capabilities from the 2026-07-03 four-reviewer audit backlog (e-3): archived goals are invisible, no health introspection, pause is one-way, tokenBudget is not routed from the command surface, autonomy caps are hardcoded, usage_limited is permanent until manual intervention, and provider-limit detection is brittle."
trigger_phrases:
  - "goal plugin capability additions"
  - "goal history resume doctor budget"
  - "phase 020 capability additions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/020-capability-additions"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored spec from the four-reviewer audit dossier (e-3 backlog)"
    next_safe_action: "Wait for phases 016-019 to land, then start Phase 1 baseline"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal_opencode.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "e-3.8: retry-after recovery timer-based or lazily evaluated on next session.idle?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 20: capability-additions

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `system-deep-loop/032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 |
| **Predecessor** | 019-code-refinements |
| **Successor** | 021-completion-verifier-wiring |
| **Handoff Criteria** | All seven e-3 capability items shipped with tests green, the e-3.10 deferral recorded, and every touched doc surface (goal_plugin.md, ENV_REFERENCE.md, both feature catalogs, both playbooks, goal_opencode.md) synchronized with the new verbs/envs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the goal-plugin review remediation program, covering the additions backlog (§e-3) of the four-reviewer audit dossier (`../scratch/2026-07-03-four-reviewer-audit-findings.md`): e-3.2, e-3.4, e-3.5, e-3.6, e-3.7, e-3.8, e-3.9, plus a documented deferral of e-3.10. Item e-3.3 (log rotation + timestamps) is NOT here — it is folded into F1's fix in phase 016; e-3.1 (completion verifier) is design-gated in phase 021.

**Scope Boundary**: New operator-facing capabilities in `mk-goal.js` and `goal_opencode.md`, their tests, and the synchronized documentation surfaces. No changes to the completion-verifier path (phase 021), no correctness fixes (phase 016), no hot-path optimization (phase 017).

**Dependencies**:
- Phases 016, 017, and 019 must land first: 016+017+019+020 all edit `mk-goal.js` and MUST run serially with tests green between phases (dossier sequencing constraint).
- Phase 018's test restructure should land first so new regression tests are authored in the restructured `node:test` subtest style once.

**Deliverables**:
- `history`, `resume`, and a doctor/health verb on the goal command surface
- `--budget N` routing from `goal_opencode.md` to the existing `tokenBudget` tool argument
- Env-configurable autonomy caps with remaining-budget surfacing in status output
- `usage_limited` auto-recovery from the 429 retry-after payload
- Broader provider-limit detection
- A recorded deferral of multi-goal/goal-queue support (e-3.10)
- Synchronized updates across all six documentation surfaces

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The goal plugin works but is operationally opaque and one-way in places: archived goals in `<stateDir>/.archive/` (`mk-goal.js:635,828`) are invisible to operators; there is no health/doctor introspection despite the dir-walk machinery already existing (`mk-goal.js:874-902`); `pause` is one-way from the command surface (`goal_opencode.md` routes no resume, `GOAL_ACTIONS` at `mk-goal.js:71` has none); the tool accepts `tokenBudget` (`mk-goal.js:1862`) but `goal_opencode.md` never routes it; autonomy caps `DEFAULT_MAX_AUTO_TURNS`/`DEFAULT_MAX_WALL_MS` are hardcoded (`mk-goal.js:30,32`) while char caps have env overrides (`mk-goal.js:99-102`); `usage_limited` suppression is permanent until manual intervention even though the 429 payload carries retry-after (`mk-goal.js:1131,1354-1369`); and provider-limit detection only matches `name==='APIError' && data.statusCode===429` strict-number (`mk-goal.js:1131`).

### Purpose
Operators can inspect goal history and plugin health, resume paused goals, set token budgets from the command line, and tune autonomy caps via env — and the plugin recovers from provider usage limits on its own — with every new verb and env documented across all six doc surfaces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- e-3.2: `/goal history` — read-side listing of archived goal records from `<stateDir>/.archive/`
- e-3.4: doctor/health verb — state-file count, archive count, log sizes, last-sweep time, orphan candidates
- e-3.5: `resume` verb — new action that re-activates a paused goal and clears `continuationSuppressed`
- e-3.6: `set <objective> --budget N` routing in `goal_opencode.md` to the existing `tokenBudget` argument
- e-3.7: env overrides for autonomy caps + remaining-budget surfacing in status output
- e-3.8: `usage_limited` auto-recovery scheduled from the 429 retry-after payload (Medium effort)
- e-3.9: broader provider-limit detection (string codes, other error classes, quota-message patterns)
- e-3.10: a recorded DEFERRAL (documentation only, REQ-009 — no multi-goal code)
- Synchronized doc updates for every new verb/env across all six surfaces (REQ-007)
- `node:test` regression coverage for each new capability

### Out of Scope
- e-3.1 completion-verifier wiring — design-gated in phase 021
- e-3.3 log rotation/timestamps — folded into F1's fix in phase 016
- Multi-goal/goal-queue implementation — explicitly deferred (REQ-009)
- Any correctness fix (F1-F12, D1-D3) or hot-path optimization (e-1.x) — owned by phases 016/017
- Refactoring beyond what the new verbs require — phase 019 owns refinements

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | New actions (`history`, `resume`, doctor/health), env-configurable caps, broadened limit detection, retry-after recovery |
| `.opencode/commands/goal_opencode.md` | Modify | Route new verbs and `--budget N`; document new outputs |
| `.opencode/plugins/tests/` (mk-goal test files) | Modify/Create | Regression coverage for each new verb/env/detection path |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Modify | Document new verbs, envs, status fields |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Add new `MK_GOAL_*` vars (currently exactly 10) |
| `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md` | Modify | Catalog sync |
| `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md` | Modify | Catalog sync |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` | Modify | Playbook sync |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modify | Playbook sync |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | e-3.2: `/goal history` lists archived goals from `.archive/` | A `history` action (added to `GOAL_ACTIONS`, `mk-goal.js:71`, routed in `goal_opencode.md`) reads records from `<stateDir>/.archive/` read-only and prints them in the terse envelope; an empty archive yields `STATUS=OK` with an empty listing; no state file is created or mutated by the call |
| REQ-002 | e-3.4: doctor/health verb reports plugin operational state | Output includes at minimum: active state-file count, archive-file count, `.continuation.log` and `.goal-events.log` sizes, last-sweep time, and orphan-candidate count (reusing the dir-walk at `mk-goal.js:874-902`); the verb is read-only |
| REQ-003 | e-3.5: `resume` verb re-activates a paused goal | `resume` sets status `active` via `markGoalStatus` and clears `continuationSuppressed`/`continuationSuppressedReason`; after resume, auto-continuation is eligible again; `pause` -> `resume` -> status round-trip is covered by a test |
| REQ-004 | e-3.6: `--budget N` routed from the command surface | `goal_opencode.md` parses `set <objective> --budget N` and passes `tokenBudget: N` to `mk_goal` (arg already accepted, `mk-goal.js:1862`); non-positive or non-numeric `N` produces a `STATUS=FAIL` envelope; the set budget appears in status output |
| REQ-005 | e-3.7: env-configurable autonomy caps + status surfacing | `MK_GOAL_MAX_AUTO_TURNS` and `MK_GOAL_MAX_WALL_MS` override `DEFAULT_MAX_AUTO_TURNS`/`DEFAULT_MAX_WALL_MS` (`mk-goal.js:30,32`) following the existing char-cap env pattern (`mk-goal.js:99-102`); status output surfaces remaining auto-turns and remaining wall-clock budget |
| REQ-006 | e-3.9: broader provider-limit detection | Detection at `mk-goal.js:1131` also accepts string status codes (e.g., `"429"`), non-`APIError` error classes carrying a 429, and quota-message patterns; existing strict-match behavior still detected; covered by table-driven tests |
| REQ-007 | Doc sync for every new verb/env (dossier scope note) | Each new verb/env/status field added by this phase appears in ALL six surfaces: `goal_plugin.md`, `ENV_REFERENCE.md`, both feature catalogs, both manual-testing playbooks — plus `goal_opencode.md` itself; verified by grep for each new verb/env name across all surfaces (all were audited accurate 2026-07-03; they must stay accurate) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | e-3.8: `usage_limited` auto-recovery from retry-after (Medium) | When the 429 payload carries retry-after, the plugin records a recovery deadline alongside the `usage_limited` suppression (`mk-goal.js:1354-1369`); once the deadline passes, continuation eligibility is restored without manual `clear`/`set`; a test simulates 429-with-retry-after and verifies un-suppression after the deadline |
| REQ-009 | e-3.10: multi-goal/goal-queue DEFERRED | This spec records the deferral with rationale; no multi-goal code ships in this phase. Rationale: design decision, not a gap — every reader of the state file assumes a single goal object (`readGoal`/`normalizeStoredGoal`, injection, continuation, verification, usage accounting); introducing a queue is a Medium/Large re-design of the state schema and all consumers, out of proportion to this additions phase. Pickup requires its own design phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `history`, `resume`, doctor/health, and `--budget N` all work end-to-end from `/goal` with `STATUS=OK` envelopes and regression tests green
- **SC-002**: Autonomy caps are tunable via `MK_GOAL_MAX_AUTO_TURNS`/`MK_GOAL_MAX_WALL_MS` and status output shows remaining budget
- **SC-003**: A simulated provider 429 with retry-after suppresses and then auto-restores continuation without operator action
- **SC-004**: Grep for every new verb/env name hits in all six doc surfaces; `ENV_REFERENCE.md`'s `MK_GOAL_*` inventory count matches the code
- **SC-005**: Full mk-goal test suite green after the phase (baseline captured before edits, delta reported)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 016/017/019 land first (serial `mk-goal.js` edits, dossier sequencing constraint) | High - merge conflicts and re-testing churn if run in parallel | Do not start until predecessor phases' tests are green; capture a fresh baseline at Phase 1 |
| Dependency | Phase 018 test restructure | Low - new tests written in the old monolithic style would need re-conversion | Author new coverage as `node:test` subtests per 018's conventions |
| Risk | New verbs widen the command surface without doc sync, invalidating the 2026-07-03 doc audit's ACCURATE verdict | Medium | REQ-007 is a P0 blocker; grep-verified before completion claim |
| Risk | Retry-after auto-recovery (e-3.8) reintroduces continuation against a still-limited provider | Medium | Conservative deadline handling (missing/invalid retry-after keeps suppression); test covers malformed payloads |
| Risk | `resume` colliding with terminal statuses (`complete`, `budget_limited`) | Low | Define `resume` as valid only from `paused`/`usage_limited`; reject others with `STATUS=FAIL` (coordinates with e-2.4's status-transition map from phase 019) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- e-3.8 recovery mechanism: timer-based un-suppression vs lazily evaluating the recorded deadline on the next `session.idle`/`message.updated` event. Lazy evaluation is the working assumption (no timers anywhere else in the plugin; event-driven design), to be confirmed at implementation.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §B e-3.2, e-3.4, e-3.5, e-3.6, e-3.7, e-3.8, e-3.9, e-3.10 + the §B doc-sync NOTE
- **Not here**: e-3.1 -> `../021-completion-verifier-wiring/spec.md`; e-3.3 -> phase 016 (folded into F1)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
