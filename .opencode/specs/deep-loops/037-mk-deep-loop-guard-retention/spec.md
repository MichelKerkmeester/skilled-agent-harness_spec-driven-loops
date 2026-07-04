---
title: "Feature Specification: mk-deep-loop-guard-retention"
description: "mk-deep-loop-guard's .loop-guard-state directory had no cleanup logic at all -- per-session state files and guard-warnings.log grew unbounded. Add a sweep/archive/prune retention system mirroring the mk-goal.js pattern (2-day active retention, 90-day archive retention, hourly throttled sweep on session.created)."
trigger_phrases:
  - "mk-deep-loop-guard retention"
  - "loop-guard state cleanup"
  - "loop-guard sweep archive prune"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/037-mk-deep-loop-guard-retention"
    last_updated_at: "2026-07-04T20:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Landed retention sweep/archive/prune with mutation-proved test"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-mk-deep-loop-guard-retention-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mk-deep-loop-guard-retention

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
| **Priority** | P3 |
| **Status** | Complete |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | none (standalone top-level packet) |
| **Predecessor** | none |
| **Successor** | none |
| **Handoff Criteria** | Sweep/archive/prune lands, mutation-proved regression test passes, full plugin suite green, retention env vars documented in ENV_REFERENCE.md, the feature catalog, and the manual testing playbook |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a standalone, operator-directed hardening packet: while investigating whether `mk-goal.js`'s active-state retention could be reduced (a prior, separate change), the operator asked whether `mk-deep-loop-guard`'s own state directory (`.opencode/skills/.loop-guard-state`) had equivalent cleanup logic. Direct inspection confirmed it had none at all -- no `session.deleted`/`session.idle` handler, no age check, no size cap -- and the operator asked to "add that like goal," i.e. mirror the `mk-goal.js` sweep/archive/prune architecture.

This packet is placed as a new top-level `deep-loops/` entry rather than nested under an existing packet: the natural candidate (the packet governing GPT/OpenCode deep-loop hardening) was mid-restructure by a concurrent session at the time of writing (folder renames and renumbering in flight, uncommitted), and `mk-deep-loop-guard` is not goal-plugin functionality, so it does not belong under the goal-plugin packet either.

**Scope Boundary**: `.opencode/plugins/mk-deep-loop-guard.js` and its test file only, plus doc sync (`ENV_REFERENCE.md`, the plugin's own feature-catalog entry and manual-testing-playbook entry). No change to the plugin's two existing detection checks (mode-mismatch, loop-repeat).

**Dependencies**: none.

**Deliverables**:
- `sweepStaleLoopGuardStates` / `ensureLoopGuardArchiveDir` / `pruneLoopGuardArchive` mirroring `mk-goal.js`'s sweep/archive/prune functions
- A new `event` hook triggering the sweep on `session.created`, throttled to once per sweep interval
- Whole-file rotation for `guard-warnings.log` (deleted if dormant past the archive-retention window, mirroring `pruneJsonlLog`)
- Three new env vars, defaulted and documented consistently across code and docs
- A mutation-proved regression test for the sweep/archive/prune behavior

**Changelog**: none required (standalone packet, not part of an existing changelog series).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mk-deep-loop-guard.js` persists a per-session JSON state file (`recordLoopDispatch`/`writeLoopStateAtomic`) and appends to `guard-warnings.log` on every warning, but registers only a `tool.execute.before` hook -- no lifecycle event handler exists to ever clear, archive, or age out either. Live inspection confirmed 26 accumulating session-state files (oldest from 2026-07-02) and no size/age cap on the log. Left unaddressed, both grow without bound for the life of the repository.

### Purpose
`.loop-guard-state` gains the same three-tier retention discipline as `.goal-state`: stale per-session state is archived, archived state is eventually pruned, and the warning log rotates when dormant -- all age-based, throttled, and fail-open, with no change to the plugin's actual detection behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sweep: on `session.created`, scan top-level `.json` state files; any untouched past `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` (default 2 days) moves to `.loop-guard-state/.archive/`
- Prune: files in `.archive/` untouched past `MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` (default 90 days) are deleted; called from within the same throttled sweep pass, no separate timer
- Sweep throttle: `MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` (default 1 hour), tracked in an in-memory per-plugin-instance `runtimeState`
- `guard-warnings.log` whole-file rotation: deleted before the next append if its own mtime exceeds the archive-retention window
- Doc sync: `ENV_REFERENCE.md` gains a new "DEEP-LOOP GUARD PLUGIN" section covering all 5 of this plugin's env vars (the 3 new retention vars plus the 2 pre-existing `REJECT`/`REJECT_LOOP` vars, which had never been documented there); the feature catalog and manual testing playbook entries gain a retention section/step

### Out of Scope
- Any change to the mode-mismatch or loop-repeat detection checks themselves
- A per-session mutation queue: unlike `mk-goal.js`, this plugin's I/O is fully synchronous with no `await` before any state-file touch, so Node's single-threaded execution already makes a sweep pass atomic with respect to concurrent dispatch writes -- no queue is needed (see plan.md for the full argument)
- Backdating or migrating the live `.loop-guard-state` directory's existing 26 files manually (unlike the earlier `.goal-state` migration, no explicit operator request was made for this directory; the automatic sweep will reconcile it on the next `session.created`)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-deep-loop-guard.js` | Modify | Add sweep/archive/prune functions, the `event` hook, retention env vars and constants, warn-log rotation |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Modify | Add sweep/archive/prune regression coverage, mutation-proved |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | New "DEEP-LOOP GUARD PLUGIN" section, all 5 env vars |
| `.opencode/skills/deep-loop-runtime/feature_catalog/03--validation/mk-deep-loop-guard.md` | Modify | New retention subsection, version bump |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/03--validation/mk-deep-loop-guard.md` | Modify | New retention test step and failure mode, version bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A per-session loop-guard state file untouched past the active-retention window is archived on the next `session.created` event | Regression test: a backdated fixture file is moved into `.archive/` after firing `event({ event: { type: 'session.created' } })`; a recently-touched sibling file is left in place. Mutation-proved: disabling the sweep call makes the test fail |
| REQ-002 | The sweep is throttled and does not run on every `session.created` | A second `session.created` fired immediately on the same plugin instance does not re-sweep a newly-backdated file |
| REQ-003 | An archived file past the archive-retention window is pruned (deleted) | A fresh plugin instance's first sweep pass deletes a pre-backdated archived file |
| REQ-004 | Only `session.created` triggers the sweep | Firing a different event type (`session.idle`) on a fresh plugin instance does not archive a backdated file |
| REQ-005 | All 5 of this plugin's env vars (3 new, 2 pre-existing) are documented in `ENV_REFERENCE.md` with matching defaults | Grep confirms all 5 variable names and defaults appear in the new section |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full plugin suite green before and after (110/110); the existing mode-mismatch/loop-repeat test coverage is unaffected
- **SC-002**: The new sweep/archive/prune test is mutation-proved (fails when the sweep call is disabled, passes when restored)
- **SC-003**: Comment hygiene and alignment drift clean on the modified plugin file
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A sweep bug could archive a state file mid-use, disrupting loop-repeat counting for an active session | Low-medium | Fail-open on every operation (try/catch per entry); a session whose file gets archived simply starts a fresh count on its next dispatch rather than erroring |
| Risk | Adding a new `event` hook could regress plugin load if the OpenCode host is strict about hook shape | Low | Mirrors the exact registration pattern already used successfully by `mk-goal.js`'s `event` hook in the same repo |
| Dependency | Concurrent session mid-restructuring the natural sibling packet (`deep-loops/031-...`) | N/A | This packet placed as a new top-level entry instead, avoiding the volatile folder entirely |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator's instruction ("add that like goal") settled the design direction; the concurrency-safety argument (no queue needed) is documented in plan.md.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Pattern mirrored from**: `.opencode/plugins/mk-goal.js` (`sweepOrphanedActiveStates`, `archiveGoalStateFile`, `pruneArchive`, `pruneJsonlLog`)
- **Related packet**: `deep-loops/032-goal-opencode-plugin/024-retention-tightening` (the sibling change to `mk-goal.js`'s own retention default, done immediately prior in the same session)
<!-- /ANCHOR:cross-refs -->
