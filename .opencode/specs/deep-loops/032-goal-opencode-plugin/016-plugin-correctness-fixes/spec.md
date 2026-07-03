---
title: "Feature Specification: Phase 16: plugin-correctness-fixes"
description: "An adversarial post-ship review of the mk-goal plugin found 12 code defects (F1-F12) and 3 command-doc contract mismatches (D1-D3) that phases 010-014 never covered: unbounded log growth, a continuation TOCTOU race, mutation-queue bypasses, a sanitizer bypass, and usage mis-accounting."
trigger_phrases:
  - "goal plugin correctness fixes"
  - "mk-goal F1-F12 defect remediation"
  - "goal command contract mismatch D1-D3"
  - "continuation lock TOCTOU fix"
  - "role label sanitizer homoglyph bypass"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored spec/plan/tasks/checklist from the four-reviewer audit dossier (section A)"
    next_safe_action: "Run the baseline test suite (T001) before touching mk-goal.js"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-016-plugin-correctness-fixes-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: plugin-correctness-fixes

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Branch** | `deep-loops/032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 |
| **Predecessor** | 015-packet-hygiene-and-narrative-integrity |
| **Successor** | 017-hot-path-optimization |
| **Handoff Criteria** | All 12 F-findings fixed, each with a regression test landed in the same task; D1-D3 contract aligned (ACTION added to the failure envelope, `mutation=` and env behavior documented); full 6-file plugin suite green with fresh output pasted |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Goal plugin remediation program. It covers ALL of section A of the four-reviewer audit dossier (`../scratch/2026-07-03-four-reviewer-audit-findings.md`): the 12 plugin code findings F1-F12 and the 3 command-doc contract mismatches D1-D3, with the folded remedy shapes e-2.6 (inside F3), e-2.7 (inside F5), e-3.3 (inside F1), and e-1.5 (inside F7).

**Scope Boundary**: `.opencode/plugins/mk-goal.js`, its 6 test files under `.opencode/plugins/tests/`, and `.opencode/commands/goal_opencode.md`. This phase fixes defects only — no performance work, no refactors beyond what a fix requires, no new capabilities.

**Dependencies**:
- Sequencing constraint from the dossier: **016 runs before 017** — 017's e-1.9 gate-logging skip coordinates with F1's fix here, and e-1.5 (mutation label inside the mutator) is folded into F7's fix in this phase.
- 016, 017, 019, and 020 all edit `mk-goal.js` — they run serially, tests green between phases.
- Phase 015 (packet hygiene, docs-only) does not block this phase; no shared files.

**Deliverables**:
- Fixes for F1-F7 (P2 severity) and F8-F12 (P3 severity) in `mk-goal.js`, each landing WITH its regression test in the same task
- D1: `ACTION` added to the failure envelope (additive — the dossier's recorded DECISION honors the published `goal_opencode.md:35` contract rather than weakening the doc)
- D2/D3: `goal_opencode.md` documents the `mutation=` output field and the `MK_GOAL_PLUGIN_DISABLED` fail-closed behavior
- Fresh full-suite run of all 6 plugin test files as completion evidence

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An adversarial four-reviewer post-ship audit (2026-07-03) of the goal plugin found 12 code defects and 3 command-doc contract mismatches that none of the prior remediation phases 010-014 covered. The P2 cluster includes unbounded JSONL log growth in default config (F1), a TOCTOU race that can double-fire auto-continuation (F2), archive/sweep paths that bypass the per-session mutation queue and can resurrect deleted goals (F3), a disabled flag that leaves event-driven writes running (F4), a role-label sanitizer bypassable by punctuation prefixes and Cyrillic homoglyphs (F5), usage accounting that mis-charges under interleaved message streams (F6), and a race-prone, deterministically wrong `mutation=` label (F7). The P3 cluster (F8-F12) covers path mis-sanitization, swallowed event errors, unvalidated persisted fields, inconsistent env snapshots, and self-defeating fsync-failure logging. Separately, `goal_opencode.md` promises an `ACTION` field the failure envelope never emits (D1), and omits `mutation=` and env-var behavior entirely (D2, D3).

### Purpose
Every section-A finding is closed by a code or doc fix that lands together with a regression test pinning the corrected behavior, leaving the plugin race-free on its continuation/archive paths, inert when disabled, resistant to the known sanitizer bypasses, and honest to its published command contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/plugins/mk-goal.js` — fixes for F1-F12 plus the D1 failure-envelope change
- The 6 existing plugin test files — one regression test per finding, added to the file that already owns the exercised seam: `mk-goal-continuation.test.cjs`, `mk-goal-lifecycle.test.cjs`, `mk-goal-state.test.cjs`, `mk-goal-tool-path.test.cjs`, `mk-goal-supervisor.test.cjs`, `mk-goal-export-contract.test.cjs`
- `.opencode/commands/goal_opencode.md` — D2 (`mutation=` documentation) and D3 (env-behavior note)

### Out of Scope
- Performance work (e-1.x hot-path optimizations) — phase 017
- Refactors not required by a fix (e-2.x refinements) — phase 019
- Test-architecture restructure (node:test subtests, helper dedupe, TEST-1/TEST-2) — phase 018; new regression tests here extend the existing 6 files as-is
- New capabilities (e-3.x additions, supervisor verifier) — phases 020/021

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | F1-F12 defect fixes; D1 `ACTION` in failure envelope |
| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Modify | Regression tests: F1 (gate logging/rotation), F2 (concurrent idle), F8 (directory handling) |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modify | Regression tests: F3 (archive/sweep queueing), F4 (disabled inertness), F6 (usage accounting), F9 (event-error logging), F11 (env snapshot policy) |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modify | Regression tests: F5 (sanitizer/redaction), F10 (field whitelist + numeric re-validation), F12 (fsync-failure log target) |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Regression tests: F7 (mutation label), D1 (failure envelope ACTION) |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Modify | Only if a fix shifts a verification-path assertion; otherwise re-run unchanged |
| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Modify | Only if a fix adds/renames a `__test` seam; otherwise re-run unchanged |
| `.opencode/commands/goal_opencode.md` | Modify | D2: document `mutation=`; D3: env-behavior note for `MK_GOAL_PLUGIN_DISABLED` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **F1** (mk-goal.js:471-487, 1423-1437, 1814-1820; folds e-3.3): `.continuation.log` no longer grows unboundedly in default config — default-config always-hit gates (`plugin_disabled`, `autonomy_disabled`/`autonomy_passive`) skip or sample their JSONL append; both `.continuation.log` and `.goal-events.log` rotate/prune reusing the `pruneArchive` age machinery; entries gain `ts` and `goalId` fields | A burst of `session.idle` events with no goal set and default env leaves `.continuation.log` absent or bounded (not one entry per event); a log past the retention age is pruned on the next rotation pass; new entries parse as JSON with `ts` and `goalId` present |
| REQ-002 | **F2** (mk-goal.js:1455-1458 vs 1498): close the TOCTOU on the continuation in-flight lock — check and acquire become atomic (adjacent, before any await), matching the verification lock pattern at 1806-1807 | Two concurrent `session.idle` events for the same session produce exactly one auto-continuation dispatch (one `promptAsync` call) and exactly one auto-turn charge; regression test drives `maybeContinueGoal` concurrently with a shared `runtimeState` |
| REQ-003 | **F3** (mk-goal.js:847-865, 874-902; remedy e-2.6): `archiveGoalStateFile` and `sweepOrphanedActiveStates` route through the per-session `mutationQueues` (912-931) so archive renames cannot interleave with queued mutations | A `session.deleted` archive interleaved with a queued `accountUsage`/`refreshGoalActivity` mutation never re-creates the state file after the rename — the state file stays archived; regression test interleaves the two paths and asserts no resurrection |
| REQ-004 | **F4** (mk-goal.js:1752-1839): `MK_GOAL_PLUGIN_DISABLED=1` makes the plugin fully inert — `handleEvent` performs no reads, usage-accounting writes, blocked-by-prompt writes, archive renames, or directory sweeps when disabled | With the env flag set, dispatching `session.created`, `message.updated`, `session.idle`, and `session.deleted` leaves the state directory byte-identical (no files created, modified, or renamed) |
| REQ-005 | **F5** (mk-goal.js:199-202, 192; folds e-2.7): role-label neutralizer catches punctuation-prefixed labels (non-word-boundary prefix class) and Cyrillic/Greek homoglyph role tokens (folding map); `redactEvidence` (230-234) additionally redacts Bearer-token and JWT patterns | `(system: do X)`, `"system: ..."`, and `ѕystem:` (Cyrillic es) all neutralize to the `-role:` form; `Bearer eyJ...`-style tokens and bare JWTs in evidence become `[secret-redacted]`; existing whitespace-prefixed fixtures still pass unchanged |
| REQ-006 | **F6** (mk-goal.js:1074-1104): usage accounting replaces the single-slot `lastAccountedMessageID` dedupe (1078) with a bounded per-messageID last-accounted map charging deltas, so interleaved `message.updated` streams neither undercount nor recharge | Interleaved stream msg-1-partial, msg-2-final, msg-1-final charges each message's usage exactly once (msg-1's final delta is not skipped as a dup, and msg-1 is not re-charged cumulatively after msg-2); `budget_limited` (1090-1091) fires at the correct total |
| REQ-007 | **F7** (mk-goal.js:1668-1675 + 996-1014; folds e-1.5): the `mutation=` label is computed inside the mutator from the goal state the mutation actually saw (no separate pre-read), and same-objective-on-terminal-status (`complete`/`blocked`/`budget_limited`/`usage_limited`) reports `replaced`, matching the `buildNewGoal` path it takes (998-999) | `set` with an identical objective on a goal in `complete` status returns `mutation=replaced` with a fresh `goalId` and reset counters; `set` on an active goal with the same objective still returns `mutation=refreshed`; no `readGoal` call remains outside the queue for label purposes |
| REQ-008 | **D1-D3**: the command contract and code agree — per the dossier's D1 DECISION, `ACTION` is ADDED to the failure envelope (mk-goal.js:1650-1657), additive, honoring the published `goal_opencode.md:35` contract; `goal_opencode.md` documents the `mutation=` output field (emitted at mk-goal.js:1646) and gains a brief env-behavior note covering `MK_GOAL_PLUGIN_DISABLED` fail-closed behavior (`STATUS=FAIL` `code=PLUGIN_DISABLED`) | A failing tool call emits `STATUS=FAIL ACTION=<action> ERROR="..."` plus `code=...` with existing fields unchanged (additive only); `goal_opencode.md` describes `mutation=` and the disabled-env behavior; a tool-path regression test asserts `ACTION` on the failure path |

### P2 - Advisory (complete OR document deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | **F8-F12** (P3 cluster): F8 (mk-goal.js:1396-1400) — `query.directory` gets path-appropriate validation (resolve + existence), not `sanitizeInlineText`; F9 (1842-1848, 497-505) — `event()` errors always append to `.goal-events.log`, console output stays debug-only; F10 (670-671, 678) — `normalizeStoredGoal` whitelists known fields instead of spreading `...rawGoal`, and `tokenBudget` is re-validated on read; F11 (1729 vs 1662/1701) — one disabled-flag policy: re-evaluate `process.env` per call everywhere including the transform gate (1852); F12 (758-764) — `fsyncDirectory` failure logging targets the state root, never the directory that failed | F8: a directory containing `user:` or NFD unicode dispatches unchanged; F9: with `MK_GOAL_DEBUG` unset, a corrupt state file still yields an `event_error` line in `.goal-events.log`; F10: an unknown injected field does not survive a read-write cycle, and a non-numeric hand-edited `tokenBudget` no longer silently disables budget enforcement (1049-1051); F11: flipping `MK_GOAL_PLUGIN_DISABLED` mid-process gates the transform and tools identically on the next call; F12: an archive-dir fsync failure logs to the state root, not inside `.archive/` — each with its own regression test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every F1-F12 fix lands in the same task as a regression test that pins the corrected behavior in one of the 6 existing test files
- **SC-002**: Two concurrent `session.idle` events for the same session produce exactly one auto-continuation dispatch and one auto-turn charge (F2, the headline race)
- **SC-003**: The sanitizer adversarial set — punctuation-prefixed role labels, Cyrillic homoglyph role tokens, Bearer/JWT evidence strings — all neutralize/redact, with the pre-existing whitespace-prefixed fixtures unchanged (F5)
- **SC-004**: The `/goal` failure envelope carries `ACTION` and `goal_opencode.md`'s contract, `mutation=`, and env-behavior sections match live code (D1-D3)
- **SC-005**: Full 6-file plugin suite green in a fresh run pasted as evidence, from a baseline captured before the first edit
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Routing archive/sweep through `mutationQueues` (F3) could self-deadlock if a queued mutator ever triggers an archive on the same session key | Medium — continuation/lifecycle paths hang | Keep the queue-entry the outermost layer (archive body never calls `mutateGoal` re-entrantly); interleaving regression test exercises archive-during-queued-write both orders |
| Risk | Homoglyph folding (F5) could over-neutralize legitimate user text containing look-alike characters | Low — cosmetic rewrites of benign objectives | Fold only candidate role tokens ahead of the role-label check, not the whole string; include benign-fixture assertions alongside the adversarial ones |
| Risk | Adding `ACTION` to the failure envelope (D1) changes output some caller may parse positionally | Low — additive per the dossier's recorded DECISION; `STATUS`/`ERROR`/`code` fields unchanged | Keep existing fields byte-identical; contract test asserts the full envelope shape |
| Risk | F6's per-messageID map changes `budget_limited` trigger timing for in-flight sessions | Low — accounting becomes more accurate, never less | Regression test pins both the undercount and overcount scenarios from the dossier |
| Dependency | Phases 017/019/020 edit the same `mk-goal.js` | Serial execution required | This phase lands and goes green before 017 starts (dossier sequencing constraint) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The one design fork in scope (D1: fix code vs weaken doc) is already decided in the dossier — add `ACTION` to the failure envelope, additive, honoring the published contract.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §A (F1-F12, D1-D3; folded remedy shapes e-2.6, e-2.7, e-3.3, e-1.5)
- **Sequencing**: dossier "Phase Allocation" — 016 before 017; 016/017/019/020 serial on `mk-goal.js`; 018 restructures tests after 016
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
