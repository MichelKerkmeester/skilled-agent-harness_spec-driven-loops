---
title: "Feature Specification: Unified Post-Edit Quality Router"
description: "One deadline-bounded, warn-only router that on each Write/Edit maps the edited path to the right quality checker(s) and surfaces violations as advisories, sharing a single runtime-neutral core across Claude and OpenCode."
trigger_phrases:
  - "post-edit quality router"
  - "post-edit-router core"
  - "warn-only edit hook"
  - "quality checker dispatch table"
  - "comment hygiene frontmatter placeholders"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/003-post-edit-quality-router"
    last_updated_at: "2026-07-11T06:21:17.441Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 planning docs from research brief sheet-003"
    next_safe_action: "Implement shared post-edit-router.cjs core plus its resolveDispatch unit test"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs"
      - ".opencode/plugins/mk-post-edit-quality.js"
      - ".opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-post-edit-quality-router"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What shared deadline (ms) should the OpenCode after-hook self-impose, and how is each per-child timeout carved from it?"
      - "Should wikilinks stay default-OFF (SPECKIT_VALIDATE_LINKS) or gain a changed-file-only mode later?"
    answered_questions: []
---
# Feature Specification: Unified Post-Edit Quality Router

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Today's per-checker wiring runs quality checks one hook at a time, and the Claude and OpenCode runtimes each carry their own copy of the dispatch logic. This phase consolidates roughly five checkers (comment-hygiene, frontmatter-versions, flowchart, placeholders, wikilinks) behind a single path-dispatch table driven by one runtime-neutral core, so both runtimes surface the same advisories from the same policy. The router is warn-only and fail-open: it never blocks an edit and never crashes a session.

**Key Decisions**: A shared `.cjs` policy core plus two thin runtime adapters (the `mk-deep-loop-guard` shape). Warn-only and fail-open posture with no reject/enforce mode in v1.

**Critical Dependencies**: The OpenCode `tool.execute.before`/`after` callID-correlation pattern proven in phase 001. The five existing checker scripts, whose contracts stay unchanged.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `scaffold/003-post-edit-quality-router` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-code-graph-freshness-guard |
| **Successor** | 004-completion-evidence-sentinel |
| **Handoff Criteria** | Shared core, both adapters, settings.json swap, README row, and the resolveDispatch + correlation tests are planned as unchecked tasks; implementation begins after this L3 plan is approved. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each quality checker is wired independently into the post-edit path, and the Claude hook (a Python script named `claude-posttooluse.sh`) and any OpenCode wiring duplicate the "which checker runs for this path" decision. There is no single place that maps an edited file to the correct checker(s), so adding or reordering checks means touching two runtimes, and the two can silently drift.

### Purpose
Ship one deadline-bounded, warn-only router that, on every Write/Edit, maps the edited path to the right checker(s) through a single shared core and surfaces any violations as advisories on both Claude and OpenCode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral `.cjs` policy core exposing `resolveDispatch(absFilePath, projectDir)` and `runChecks(entries, deadlineMs)`.
- A three-way scope resolver that derives FILE, SKILL (`--skill <name>`), and FOLDER/DIR arguments from the edited path.
- A five-row dispatch table wiring comment-hygiene, validate_flowchart, frontmatter-versions, placeholders, and wikilinks with their per-checker surface rules.
- An OpenCode plugin adapter using `tool.execute.before` (capture callID to filePath), `tool.execute.after` (run checks), and `experimental.chat.system.transform` (surface next turn).
- A Claude adapter that rewrites the existing Python hook as a thin `.cjs` over the same core, plus the one-line `.claude/settings.json` command swap.
- A `.opencode/plugins/README.md` row documenting the new plugin, and the first table-driven `resolveDispatch` unit test plus the before/after correlation test.

### Out of Scope
- Any reject/enforce/blocking mode. Deferred to a later env-gated escalation because v1 is observe-only.
- Changing any of the five checker scripts' own contracts. The router only adds a new caller.
- Deleting the legacy Python `claude-posttooluse.sh`. Kept on disk until the `.cjs` smoke-passes in both workspaces; removal is a follow-up task.
- Adding new quality checkers beyond the five named. The table is intentionally narrow.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs` | Create | Shared runtime-neutral core: `resolveDispatch` + `runChecks`, dispatch table, three-way scope resolver. Writes no stdout/stderr, never throws. |
| `.opencode/plugins/mk-post-edit-quality.js` | Create | OpenCode default-export-only ESM adapter: before/after callID correlation, self-bounded deadline, `chat.system.transform` surfacing. |
| `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs` | Create | Claude thin `.cjs` adapter over the shared core, mirroring `task-dispatch-guard.cjs`; prints bounded advisory, always exits 0. |
| `.claude/settings.json` | Modify | Swap the PostToolUse `Write|Edit` command from `python3 …claude-posttooluse.sh` to `node …claude-posttooluse.cjs` (lines 112-123); keep timeout and the 9s budget carve. |
| `.opencode/plugins/README.md` | Modify | Add one entrypoint-table row for `mk-post-edit-quality.js`. |
| `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` | Delete (deferred) | Legacy Python hook. Kept on disk until the `.cjs` smoke-passes from Public root and the Barter symlink, then removed. |
| `.opencode/plugins/tests/mk-post-edit-quality.test.cjs` | Create | Table-driven `resolveDispatch` unit + fail-open cases + the before/after callID correlation test. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared runtime-neutral core `post-edit-router.cjs` exposes `resolveDispatch(absFilePath, projectDir)` returning an ordered list of `{label, checkerPath, args, surfaceRule}`, and `runChecks(entries, deadlineMs)` returning bounded structured findings. The core writes no stdout/stderr and never throws. | Unit test drives `resolveDispatch` over the five table classes plus a no-match path; a checker whose spawn throws resolves to `[]` with no exception. |
| REQ-002 | The three-way scope resolver derives the correct scope unit per checker: FILE for comment-hygiene and validate_flowchart, SKILL (`--skill <name>` from `.opencode/skills/<skill>/`) for frontmatter-versions, FOLDER/DIR for placeholders (spec folder) and wikilinks (skill dir). | Table test maps each sample path to the expected checker plus its derived scope argument, using the canonical checker paths named in this spec. |
| REQ-003 | Fail-open posture. Any checker error, missing binary, or exit not in `{0,1}` resolves to no finding. The Claude adapter always exits 0; the OpenCode after-hook returns void. | Fault-injection test with a missing checker path and an exit-2 checker yields empty findings and non-blocking tool completion. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | OpenCode adapter correlates callID to filePath. `tool.execute.before` stashes `{callID -> filePath}` for edit-family tools in a bounded Map (cap ~1000, evict on read). `tool.execute.after` looks up the callID, confirms the file exists, runs checks, and buffers findings. `experimental.chat.system.transform` surfaces bounded pending findings on the next turn. | Correlation test: before stashes, after retrieves and evicts, and an after with no matching callID is a no-op. |
| REQ-005 | Claude adapter rewrite. Replace the Python `claude-posttooluse.sh` with a `.cjs` adapter over the shared core, update `.claude/settings.json` command `python3 …` to `node …`, keep the 9s budget plus `remaining_timeout` carve, and preserve comment-hygiene and dist-staleness coverage. | `settings.json` PostToolUse command references the `.cjs`; the hook prints a bounded advisory and exits 0. |
| REQ-006 | The dispatch table is narrow and near-mutually-exclusive so a typical edit fires 0-1 checkers. Checkers run in priority order, and remaining checkers are skipped once the deadline is exhausted. | `resolveDispatch` returns at most one entry for each representative edit in the test matrix; a deadline-exhaustion test skips later entries. |
| REQ-007 | Deferred removal of the legacy Python hook. Keep `claude-posttooluse.sh` on disk until the `.cjs` smoke-passes from both the Public root and the Barter symlinked workspace, then remove it. | The removal task stays blocked and unchecked until dual-workspace smoke evidence is recorded. |
| REQ-008 | Documentation wiring. Add one row to `.opencode/plugins/README.md` describing the new plugin, and keep the plugin default-export-only. | README lists `mk-post-edit-quality.js`; a grep confirms a single default export and no stray named exports. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One path-dispatch table behind one shared `.cjs` core drives all five checkers (comment-hygiene, frontmatter-versions, flowchart, placeholders, wikilinks) on both Claude and OpenCode, replacing per-runtime dispatch duplication.
- **SC-002**: A typical single-file edit fires 0-1 checkers and never blocks or delays tool completion beyond the self-imposed deadline.
- **SC-003**: Every failure path (missing checker, exit 2, spawn throw, deadline exhaustion) produces no finding and no crash, proven by fault-injection tests.
- **SC-004**: The Claude and OpenCode adapters run byte-identical policy from the one `.cjs` core, with zero dispatch-table duplication across runtimes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode `tool.execute.before`/`after` callID correlation (phase 001 pattern) | After-hook cannot read the path without it | Reuse the phase 001 before/after correlation; stash callID to filePath in `before`, look up in `after`. |
| Dependency | The five checker scripts (comment-hygiene, frontmatter-versions, validate_flowchart, check-placeholders, check-links) | Router is a caller; broken checker paths break dispatch | Pin canonical paths in the table and assert them in the unit test. |
| Risk | `tool.execute.after` carries no file path | High | Correlate via callID captured in `before`; the file is on disk only in `after`. |
| Risk | `validate_flowchart.sh` always prints verbose output and exits 0 even with warnings | Medium | Surface only on exit==1, and gate on an is-this-a-flowchart heuristic before running it. |
| Risk | `settings.json` command swap (python3 to node) is the sole old-contract touchpoint | Low | Keep the Python hook on disk until the `.cjs` smoke-passes in both workspaces. |
| Risk | OpenCode default-export-only: a stray named export silently drops the whole plugin file | High | Attach any test surface as a property on the default function; add a README warning row. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The Claude hook completes inside the existing 9s budget with the `remaining_timeout` carve. The OpenCode after-hook self-bounds to its own deadline and never blocks tool completion.

### Security
- **NFR-S01**: The core spawns checkers with per-child timeouts, writes no stdout/stderr, and never throws. Any exit not in `{0,1}` is treated as unavailable and produces no finding.

### Reliability
- **NFR-R01**: Fail-open on every path. A missing checker, a missing node binary (frontmatter exits 2), a spawn error, or an exhausted deadline yields zero findings and zero crashes, and the edit always lands.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: A repo-root path with no table match (for example `README.md`) makes `resolveDispatch` return `[]`, so no checker runs.
- Maximum length: An edit under a skill dir that could match both the skill-doc and spec-doc rules fires only the highest-priority match, because the table is near-mutually-exclusive and capped at 0-1 checkers per edit.

### Error Scenarios
- External service failure: A missing checker binary or missing node (frontmatter exit 2) is treated as unavailable, so no finding surfaces.
- Network timeout: A slow checker is bounded by its per-child timeout and the shared deadline; remaining checkers are skipped once the deadline is exhausted.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 7, LOC: ~400-600, Systems: shared core + 2 runtime adapters |
| Risk | 14/25 | Auth: N, API: N, Breaking: N (one settings.json command string); path handling + env precedence + shared policy |
| Research | 10/20 | Precedented by mk-deep-loop-guard core and dist-freshness before-hook; three incompatible checker scope units need resolving |
| Multi-Agent | 3/15 | Single workstream |
| Coordination | 7/15 | Depends on phase 001 correlation pattern; dual-workspace smoke gate |
| **Total** | **50/100** | **Level 3 (selected for ADR documentation of the shared-core boundary, not raw LOC)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `tool.execute.after` carries no file path; the router cannot know what was edited | H | H | Correlate via callID captured in `tool.execute.before`; bounded Map with eviction on read. |
| R-002 | `validate_flowchart.sh` always prints emoji output and exits 0 even with warnings, spewing noise on every `.md` edit | M | H | Gate on an is-this-a-flowchart heuristic first, then surface only on exit==1. |
| R-003 | Wrong checker variant or path (canonical comment-hygiene is under sk-code/code-quality, placeholders under spec/, links under rules/, frontmatter and flowchart under sk-doc) | M | M | Pin canonical paths in the dispatch table and assert them in the unit test. |
| R-004 | `check-frontmatter-versions.sh` is node-backed, heaviest, and exits 2 without node | M | M | Treat exit 2 as unavailable, dedupe per-skill-per-session, keep warn-only. |
| R-005 | Cost fan-out: the OpenCode after-hook has no host timeout wrapper like Claude's settings `timeout` | M | M | Self-bound with an internal deadline plus per-child timeouts; skip remaining checkers after the deadline. |
| R-006 | The `settings.json` command swap (python3 to node) is the sole old-contract touchpoint | L | L | Keep the Python hook on disk until the `.cjs` smoke-passes in both workspaces. |
| R-007 | OpenCode treats every export as a plugin; a stray named export silently drops the whole file | H | L | Keep the only export the default; hang any test surface off the default function as a property. |

---

## 11. USER STORIES

### US-001: Advisory violations on source edits (Priority: P1)

**As a** contributor editing a source file, **I want** post-edit quality violations surfaced as advisories, **so that** I catch comment-hygiene issues without a blocking gate.

**Acceptance Criteria**:
1. Given I edit `src/foo.ts`, When the edit lands, Then the router runs comment-hygiene on that file and surfaces a finding only if the checker exits 1 with stdout.
2. Given the comment-hygiene checker is missing or exits 2, When the edit lands, Then no finding surfaces and the edit completes normally.

---

### US-002: One shared policy across runtimes (Priority: P1)

**As a** maintainer, **I want** one shared policy core, **so that** Claude and OpenCode never drift on which checker runs for a given path.

**Acceptance Criteria**:
1. Given the same edited path, When both the Claude adapter and the OpenCode adapter call `resolveDispatch`, Then they receive the identical ordered list of checker entries.
2. Given a new dispatch rule is added, When it is added to the core table, Then both runtimes pick it up without any per-runtime edit.

---

### US-003: Checks never block completion (Priority: P2)

**As an** OpenCode user, **I want** the after-edit checks to never block tool completion, **so that** a slow or missing checker cannot stall my session.

**Acceptance Criteria**:
1. Given a checker that runs longer than the shared deadline, When the deadline is exhausted, Then remaining checkers are skipped and the tool completes.
2. Given a checker that throws on spawn, When the after-hook runs, Then it returns void with no finding and no error surfaced to the session.

---

## 12. OPEN QUESTIONS

- What exact shared deadline (ms) should the OpenCode after-hook self-impose, and how is each per-child timeout carved from it?
- Should the wikilinks checker stay default-OFF (SPECKIT_VALIDATE_LINKS) or gain a lighter changed-file-only mode in a later phase?
- Where should the surfacing buffer cap (max findings per turn) sit so `chat.system.transform` output stays bounded?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
