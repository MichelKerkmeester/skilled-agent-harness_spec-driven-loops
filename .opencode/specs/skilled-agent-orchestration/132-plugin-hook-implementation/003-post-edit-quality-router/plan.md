---
title: "Implementation Plan: Unified Post-Edit Quality Router"
description: "Runtime-neutral post-edit-router.cjs core plus two thin adapters (OpenCode plugin, Claude .cjs hook) that path-dispatch five quality checkers warn-only and fail-open across both runtimes."
trigger_phrases:
  - "post-edit router plan"
  - "post-edit-router core"
  - "runtime-neutral core two adapters"
  - "callID filePath correlation"
  - "warn-only fail-open checker dispatch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/003-post-edit-quality-router"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 plan from research brief sheet-003"
    next_safe_action: "Build post-edit-router.cjs core and its resolveDispatch unit test before wiring adapters"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs"
      - ".opencode/plugins/mk-post-edit-quality.js"
      - ".opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh"
      - ".claude/settings.json"
      - ".opencode/plugins/tests/mk-post-edit-quality.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-post-edit-quality-router"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Shared deadline value (ms) and per-child timeout carve for the OpenCode after-hook"
      - "Surfacing buffer cap for chat.system.transform output"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Unified Post-Edit Quality Router

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs` core + Claude adapter), ESM (`.js` OpenCode plugin), Bash/shell checkers |
| **Framework** | OpenCode plugin API (`tool.execute.before`/`after`, `experimental.chat.system.transform`); Claude Code PostToolUse hooks |
| **Storage** | None. Bounded in-memory `Map` for callID correlation plus append-only `.opencode/logs/post-edit-quality.log` |
| **Testing** | `node:test`-style `.cjs` test in `.opencode/plugins/tests/` |

### Overview
Build one runtime-neutral `.cjs` core that path-dispatches five quality checkers, then attach two thin adapters over it: a new OpenCode plugin and a rewritten Claude `.cjs` hook. The core resolves three incompatible checker scope units (file, `--skill`, folder/dir), runs each checker under a shared deadline, and returns bounded findings that each adapter surfaces without ever blocking the edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral policy/logic core plus two thin runtime adapters. This mirrors the repo's `mk-deep-loop-guard` core with its `task-dispatch-guard.cjs` Claude twin and `mk-deep-loop-guard.js` OpenCode twin, and the cross-skill core precedent where the sk-code posttooluse hook already shares `dist-freshness.cjs`.

### Key Components
- **`post-edit-router.cjs` core**: `resolveDispatch(absFilePath, projectDir)` walks the dispatch table and returns an ordered list of `{label, checkerPath, args, surfaceRule}`. `runChecks(entries, deadlineMs)` spawns each checker with a per-child timeout carved from the shared budget, gates surfacing on that checker's own convention, and returns bounded structured findings. It writes no stdout/stderr and never throws.
- **Three-way scope resolver** (inside the core): derives FILE (comment-hygiene, validate_flowchart), SKILL (`--skill <name>` from `.opencode/skills/<skill>/`), and FOLDER/DIR (spec folder for placeholders, skill dir for links) from the edited path.
- **OpenCode adapter `mk-post-edit-quality.js`**: default-export-only ESM factory that imports the core with `createRequire`, correlates callID to filePath across before/after, buffers findings, and surfaces them next turn.
- **Claude adapter `claude-posttooluse.cjs`**: thin `.cjs` over the core; reads stdin JSON, takes `tool_input.file_path`, runs `runChecks`, prints a bounded advisory, always exits 0.

### Data Flow
OpenCode: `tool.execute.before` captures `{callID -> filePath}` for edit-family tools into a bounded Map. `tool.execute.after` looks up `input.callID` (the edit has landed on disk), confirms the file exists, calls `core.runChecks` under a self-imposed deadline, and pushes bounded findings into a pending buffer plus the append-only log. `experimental.chat.system.transform` drains the buffer into the next turn's system context. Claude: PostToolUse already has the file on disk and supplies `tool_input.file_path`, so the adapter calls the core directly and prints the advisory.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches path handling, env precedence (opt-in and kill-switch), and shared policy, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claude-posttooluse.sh:1-136` | Existing Python hook; already path-dispatches comment-hygiene + dist-staleness with a 9s budget + `remaining_timeout` carve at `:26-42` | Rewrite as `.cjs` over the shared core | `settings.json` command references the `.cjs`; hook prints advisory and exits 0 |
| `.claude/settings.json:112-123` | PostToolUse matcher `Write\|Edit` runs `python3 claude-posttooluse.sh`, timeout 10 | Update command `python3 …` to `node …` | `rg -n 'claude-posttooluse' .claude/settings.json` shows the `.cjs` |
| `.claude/settings.json:25-34` | Task PreToolUse wires the deep-loop `.cjs` hook | Not a consumer; precedent for a node hook command | Read confirms an existing node hook command shape |
| `mk-deep-loop-guard.js:52-92` | Thin ESM adapter over a `.cjs` core, default-export-only, throw-not-stdout | Not a consumer; pattern template | Mirror the default-export-only adapter shape |
| `task-dispatch-guard.cjs:1-79` | Claude `.cjs` twin over the same core, fail-open | Not a consumer; pattern template | Mirror the fail-open `.cjs` adapter shape |
| `dispatch-guard.cjs:463-549` | `resolveGuardPaths` + `evaluateDispatch` runtime-neutral pattern | Not a consumer; pattern template | Mirror the runtime-neutral resolve/evaluate split |
| `mk-dist-freshness-guard.js:30,151-157,172-181` | `MUTATING_TOOLS` set (`write\|edit\|patch\|multiedit\|apply_patch\|apply-patch`), `filePath = args.filePath\|\|args.file_path\|\|args.path`, `tool.execute.before` shape | Reuse the tool-set and arg-extraction; the router needs a before+after pair, not before-only | New plugin reuses `MUTATING_TOOLS` and the arg extraction |
| Five checker scripts (comment-hygiene, frontmatter-versions, validate_flowchart, check-placeholders spec, check-links) | Quality checkers with unchanged contracts | Unchanged; only a new caller is added | Canonical paths pinned in the table + asserted in the unit test |

Required inventories:
- Same-class producers (existing edit-family hooks that read tool args): `rg -n 'tool.execute.before|tool.execute.after' .opencode/plugins`.
- Consumers of the swapped command string: `rg -n 'claude-posttooluse' . --glob '*.json' --glob '*.md' --glob '*.sh'`.
- Canonical checker path axis: comment-hygiene = `sk-code/code-quality` (not the 3341-byte `system-spec-kit/scripts/rules` variant); placeholders = `spec/` (not `rules/`, which is sourced-only); links = `rules/`; frontmatter + flowchart canonical under `sk-doc` (the `scripts/` copies are symlinks).
- Algorithm invariant: `resolveDispatch` is deterministic and side-effect-free; it returns 0-1 entries for a typical edit and never runs a checker itself. Adversarial cases: a path under both a skill dir and a spec dir, a `.md` with box-drawing glyphs that is not a flowchart, and a checker path that does not exist.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create `scripts/lib/` under sk-code code-quality and stub `post-edit-router.cjs`
- [ ] Add the `.opencode/plugins/tests/mk-post-edit-quality.test.cjs` harness (empty cases first)
- [ ] Confirm canonical checker paths and their exit conventions from the verified sources

### Phase 2: Core Implementation
- [ ] Implement the dispatch table and the three-way scope resolver in `resolveDispatch`
- [ ] Implement `runChecks` with per-child timeouts, shared deadline, and fail-open handling
- [ ] Build the OpenCode adapter (before/after correlation + `chat.system.transform` surfacing)
- [ ] Build the Claude `.cjs` adapter and swap the `settings.json` command

### Phase 3: Verification
- [ ] Run the resolveDispatch table test and the before/after correlation test
- [ ] Exercise fail-open cases (missing checker, exit 2, spawn throw, deadline)
- [ ] Smoke-test the `.cjs` from Public root and the Barter symlink, then plan Python-hook removal
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveDispatch` table (5 classes + no-match), scope derivation, fail-open on missing/throwing checker | `node:test` `.cjs` |
| Integration | OpenCode before/after callID correlation (stash, retrieve, evict, unmatched no-op); deadline exhaustion skips later entries | `node:test` `.cjs` |
| Manual | Claude hook smoke from Public root and Barter symlink; verify advisory prints and exit 0 | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 callID before/after correlation pattern | Internal | Green | Without it the OpenCode after-hook cannot resolve the edited path |
| `dist-freshness.cjs` cross-skill core precedent | Internal | Green | Confirms the shared-core home and arg-extraction shape are supported |
| Five checker scripts and their canonical paths | Internal | Green | A moved or wrong-variant path breaks a dispatch row |
| Node runtime for the frontmatter checker | External | Yellow | Frontmatter exits 2 without node; treated as unavailable, fail-open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The `.cjs` Claude hook misbehaves, the OpenCode plugin drops silently, or the router surfaces noise.
- **Procedure**: Revert the `.claude/settings.json` command to `python3 …claude-posttooluse.sh` (the Python file is still on disk), and remove `.opencode/plugins/mk-post-edit-quality.js` (auto-load stops). The five checkers and their callers are untouched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Test harness ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | High | 5-8 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **8-13 hours (M leaning M-L)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Legacy `claude-posttooluse.sh` still on disk
- [ ] Kill-switch env documented for disabling the router
- [ ] Dual-workspace smoke evidence captured before Python-hook removal

### Rollback Procedure
1. Revert the `.claude/settings.json` command string to `python3 …claude-posttooluse.sh`.
2. Remove `.opencode/plugins/mk-post-edit-quality.js` so OpenCode stops auto-loading it.
3. Smoke the Python hook from Public root to confirm the old path prints and exits 0.
4. No stakeholder notification needed; the change is developer-only and warn-only.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The only persistent artifact is the append-only `.opencode/logs/post-edit-quality.log`, which can be deleted.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Core .cjs  │────►│  Adapters   │────►│   Verify    │
│  + table    │     │  OC + Claude│     │  + smoke    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Docs +   │
                    │  README   │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Core `post-edit-router.cjs` | None | resolveDispatch + runChecks | OpenCode adapter, Claude adapter |
| OpenCode adapter | Core | plugin + before/after correlation | Verify |
| Claude adapter | Core | `.cjs` hook + settings swap | Verify |
| Verify + docs | OpenCode adapter, Claude adapter | tests + README row + smoke | Python-hook removal |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Core `post-edit-router.cjs` + resolveDispatch table** - 3-5 hours - CRITICAL
2. **OpenCode before/after correlation adapter** - 2-3 hours - CRITICAL
3. **Verification (table + correlation + fail-open tests)** - 2-3 hours - CRITICAL

**Total Critical Path**: 7-11 hours

**Parallel Opportunities**:
- The Claude `.cjs` adapter and the OpenCode plugin can be built in parallel once the core is stable.
- The README row and the docs sync can proceed alongside verification.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core + table stable | resolveDispatch table test passes for 5 classes + no-match | Phase 2 start |
| M2 | Both adapters wired | Correlation test passes; Claude hook prints advisory + exit 0 | Phase 2 end |
| M3 | Verified + documented | Fail-open tests pass; README row added; dual-workspace smoke captured | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One shared core plus two thin adapters

**Status**: Proposed

**Context**: The dispatch decision is duplicated across the Claude Python hook and any OpenCode wiring, so the two runtimes can drift.

**Decision**: Put all policy in one runtime-neutral `post-edit-router.cjs` core and give each runtime a thin adapter over it, matching the `mk-deep-loop-guard` core plus `task-dispatch-guard.cjs` shape.

**Consequences**:
- One place to add or reorder checkers; both runtimes stay identical.
- The Claude hook must move from Python to `.cjs` to share the core, which touches one `settings.json` command string.

**Alternatives Rejected**:
- Duplicate the dispatch table in each runtime: rejected because it reintroduces the exact drift this phase removes.

See `decision-record.md` for the full ADR set (shared-core boundary and the warn-only/fail-open posture).

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

Execution discipline for this Level 3 phase. This plugin/hook pair ships a runtime-neutral core with thin per-runtime adapters (an OpenCode plugin and a Claude hook), so every rule below applies to both surfaces.

### Pre-Task Checklist

Before editing, confirm:
- The shared core and both adapter entrypoints have been read in full (READ FIRST).
- The change stays inside this plugin's own core, adapters, and tests; adjacent plugins are out of scope (SCOPE LOCK).
- The kill-switch env var and the fail-open contract are understood before any advise or deny path is touched.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Land the runtime-neutral core first, then the adapters, then the tests. |
| TASK-SCOPE | The OpenCode plugin never writes to stdout or stderr; no deny predicate is widened beyond its documented surface. |
| TASK-VERIFY | Every behavior change is covered by a unit test that runs green before completion is claimed. |

### Status Reporting Format

Report per component (core, adapter(s), tests) with the real test counts (N pass / N fail) and the kill-switch plus fail-open verification result. Distinguish confirmed (cited test output) from inferred.

### Blocked Task Protocol

If the core contract conflicts with an adapter surface, or a test cannot run, HALT and escalate with the conflicting facts and a one-sentence root cause rather than shipping a silent workaround. Preserve state and name the next safe action.
<!-- /ANCHOR:ai-protocol -->
