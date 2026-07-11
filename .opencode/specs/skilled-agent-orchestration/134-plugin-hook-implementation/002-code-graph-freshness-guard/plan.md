---
title: "Implementation Plan: Incremental Code-Graph Freshness Guard"
description: "Implements a post-edit code-graph freshness guard as a runtime-neutral policy core plus two thin runtime adapters (OpenCode plugin and Claude PostToolUse hook). The core computes a transport-free debounce/warm/empty decision; the adapters own the detached warm-only scan dispatch and the append-only log."
trigger_phrases:
  - "code graph freshness plan"
  - "freshness core architecture"
  - "warm-only scan dispatch"
  - "thin runtime adapters"
  - "code-graph-freshness-guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/002-code-graph-freshness-guard"
    last_updated_at: "2026-07-11T06:21:17.310Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Level 3 plan and core-plus-adapters architecture"
    next_safe_action: "Await approval, then build the state-dir scaffolding and the evaluateEdit decision function"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"
      - ".opencode/plugins/mk-code-graph-freshness.js"
      - ".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-code-graph-freshness-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Incremental Code-Graph Freshness Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | Node.js CommonJS (`.cjs` core, `.js` OpenCode plugin), TypeScript for the vitest suite |
| **Framework** | OpenCode plugin API (`tool.execute.after`, `event`) and Claude Code hooks (PostToolUse `Write|Edit`) |
| **Storage** | Filesystem only: atomic hex(sessionID)-keyed JSON under `.opencode/skills/.code-graph-freshness-state` plus one append-only log; reads `.code-graph-readiness.json` and `.code-graph-owner.json` |
| **Testing** | vitest (core unit + adapter smoke), `opencode-plugins-folder-purity` gate, command-tree parity |

### Overview
Build a runtime-neutral policy core (`freshness-core.cjs`) that returns a transport-free decision from cheap file probes and an atomic debounce state, then wrap it in two thin runtime adapters that own the detached warm-only scan spawn and the log append. This mirrors the proven `mk-deep-loop-guard.js` core plus `task-dispatch-guard.cjs` shape, so ~70% of the core is a direct clone of `dispatch-guard.cjs`'s atomic state, sweep/retention, and append-log machinery. The genuinely new work is the debounce decision function and the two cheap file probes (heartbeat, readiness).
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
Runtime-neutral policy/logic core plus two thin runtime adapters. The core (`freshness-core.cjs`) is pure decision logic: it reads probes and state, returns a decision plus `warnings`/`audits` arrays, and never writes stdout/stderr and never spawns. Each adapter is a thin transport shell that normalizes its runtime's edit event, calls the core, appends the log, and (only on a `scan` decision) performs the detached spawn. This is the same boundary the repo already ships for `mk-deep-loop-guard` (core in `runtime/lib/deep-loop/dispatch-guard.cjs`, adapters in `plugins/mk-deep-loop-guard.js` and `runtime/hooks/claude/task-dispatch-guard.cjs`).

### Key Components
- **`freshness-core.cjs`**: `evaluateEdit({filePath,sessionID,now,projectDir,env})` returns the decision in a fixed gate order (paths -> in-scope filter -> empty gate -> debounce -> warm probe -> concurrency -> scan). Also exports `drainPending()`, `sweepStaleFreshnessState()`, `probeDaemonWarm()`, `appendFreshnessLog()`.
- **`mk-code-graph-freshness.js`**: OpenCode default-export-only factory. `tool.execute.after(input,output)` normalizes the tool name and file path, calls the core, appends warnings/audits, and on `scan` spawns detached and unref'd; a long-lived in-memory `setTimeout(quietMs)` arms/resets to drain on burst settle. `event` handles `session.created` (sweep + drain) and `server.instance.disposed` (clear timers).
- **`code-graph-freshness.cjs`**: Claude short-lived hook. Reads stdin JSON, gates `tool_name in {Write,Edit}`, calls the core, appends the log, spawns detached on `scan`, and always `process.exit(0)`.

### Data Flow
An edit lands -> the adapter normalizes the tool name and extracts the file path -> `core.evaluateEdit` reads the readiness marker, owner heartbeat, and the hex-keyed debounce state, then returns a decision -> the adapter appends the decision to the append-only log -> on `scan` the adapter spawns `.opencode/bin/code-index.cjs code_graph_scan --json '{"incremental":true}' --warm-only` detached, and clears `.scan.lock` on child exit. The OpenCode timer additionally calls `drainPending()` when a burst settles; SessionStart drains any pending set left by a crashed prior process.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase adds a new surface rather than fixing a bug, but it touches env precedence (scope fingerprint), path handling (edited file paths and state dir), and a shared runtime location, so the surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/code-graph/freshness-core.cjs` (new) | Policy core owning the decision | create | vitest core suite: `freshness-core.vitest.ts` |
| `plugins/mk-code-graph-freshness.js` (new) | OpenCode transport adapter | create | adapter smoke test + `opencode-plugins-folder-purity.vitest.ts:12-31` |
| `runtime/hooks/claude/code-graph-freshness.cjs` (new) | Claude transport adapter | create | adapter smoke test; manual PostToolUse dry run |
| `.claude/settings.json:112-123` (existing PostToolUse `Write|Edit`) | Hosts sk-code's `claude-posttooluse.sh` | update (append second command, do not replace) | `node -e 'JSON.parse(...)'` parse + command-tree parity |
| `.opencode/bin/code-index.cjs:33-66` (`--warm-only` detection) | CLI that refuses to cold-start | unchanged (consumer of its exit-75 contract) | `code-index-cli.js:996` proves warm-only throws before `spawnLauncher` |
| `.code-graph-readiness.json` / `.code-graph-owner.json` | Freshness + heartbeat markers | unchanged (read-only probes) | read them in the core; treat unreadable as not-ready/cold |
| `.opencode/plugins/README.md:26-28` | Plugin catalog + default-export-only rule | update (register plugin) | grep README for the new plugin entry |

Required inventories:
- Same-class producers: `rg -n 'tool.execute.after' .opencode/plugins` (confirm the adapter shape matches `mk-dist-freshness-guard.js` and `mk-deep-loop-guard.js`).
- Consumers of changed symbols: `rg -n 'claude-posttooluse|PostToolUse' .claude/settings.json` (confirm the append is additive, not a replace).
- Matrix axes for `evaluateEdit`: scope (in / out) x graphFreshness (empty / non-empty) x heartbeat (warm / cold) x debounce (elapsed / pending) x lock (fresh / stale). The three pinned rows are scan, defer-cold, defer-empty.
- Algorithm invariant: the guard NEVER spawns `mk-code-index-launcher.cjs`; every dispatch carries `--warm-only` + `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME=1`. Adversarial cases: stale-heartbeat race, malformed markers, per-call scope flag narrowing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create the `runtime/lib/code-graph/` and `runtime/hooks/claude/` tree under `system-code-graph` (greenfield; keep skill-local, do not co-locate with legacy spec-kit hooks)
- [ ] Establish the state dir and log path constants: `.opencode/skills/.code-graph-freshness-state` (sibling to `.loop-guard-state`)
- [ ] Port the atomic hex-keyed state write, sweep/retention, and append-log scaffolding from `dispatch-guard.cjs`

### Phase 2: Core Implementation
- [ ] Implement `evaluateEdit()` in the fixed gate order (paths -> in-scope filter -> empty gate -> debounce -> warm probe -> concurrency -> scan)
- [ ] Implement `drainPending()`, `sweepStaleFreshnessState()`, `probeDaemonWarm()`, and `appendFreshnessLog()`
- [ ] Build both adapters (OpenCode plugin + Claude hook) and wire `.claude/settings.json` plus the README entry

### Phase 3: Verification
- [ ] Manual testing complete (dry-run each adapter on an in-scope and an out-of-scope edit)
- [ ] Edge cases handled (missing markers, oversized burst, stale-heartbeat race)
- [ ] Documentation updated (spec/plan/tasks/checklist/decision-record)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `evaluateEdit` gates: debounce thresholds, empty-gate, warm-gate, scope-filter, drain | vitest |
| Integration | Adapter smoke (OpenCode `tool.execute.after` returns non-blocking; Claude hook exits 0), plugin-folder-purity, command-tree parity | vitest |
| Manual | PostToolUse dry run on an in-scope edit (`src/foo.ts`) and an out-of-scope edit (`.opencode/skills/x/SKILL.md`) | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| code-index CLI `--warm-only` refusal (`code-index-cli.js:996`) | Internal | Green | Without it the warm-race backstop is gone; guard still fails safe on the heartbeat probe |
| `.code-graph-owner.json` heartbeat + `.code-graph-readiness.json` markers | Internal | Green (readiness currently `empty`) | Missing markers force defer; guard cannot self-heal until SessionStart establishes a graph |
| `dispatch-guard.cjs` atomic-state + sweep + append-log machinery | Internal | Green | Clone target; if its API shifts, re-derive the ported helpers |
| SessionStart establishment path | Internal | Green | Provides the initial non-empty graph the maintain-half composes with |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard causes unexpected TUI output, blocks edits, or dispatches scans that thrash the fingerprint.
- **Procedure**: Delete the three new files (`freshness-core.cjs`, `mk-code-graph-freshness.js`, `code-graph-freshness.cjs`) and the vitest, revert the appended `.claude/settings.json` command and the `plugins/README.md` entry. No schema change and no data migration means nothing else needs reversing; the state dir under `.opencode/skills/.code-graph-freshness-state` can be removed safely.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Adapters) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Adapters |
| Core | Setup | Adapters, Verify |
| Adapters | Setup, Core | Verify |
| Verify | Core, Adapters | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | State dir, paths, ported scaffolding |
| Core Implementation | Med | ~250-350 LOC, ~70% cloned from dispatch-guard.cjs; new work is the debounce function + two probes |
| Adapters + Wiring | Med | OpenCode ~120 LOC, Claude ~90 LOC, settings.json 1 line, README 1 entry |
| Verification | Low | Core unit + adapter smoke + folder-purity + parity |
| **Total** | Med (M) | **~460-560 LOC across three files plus two small edits** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `opencode-plugins-folder-purity` green (default-export-only confirmed)
- [ ] `MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP` documented and left unset (default-off)
- [ ] Append-only log path and state dir confirmed under `.opencode/skills/.code-graph-freshness-state`

### Rollback Procedure
1. Remove the appended command from the `.claude/settings.json` PostToolUse `Write|Edit` array (disables the Claude adapter)
2. Delete `mk-code-graph-freshness.js` (disables the OpenCode adapter)
3. Delete `freshness-core.cjs`, the vitest, and revert the `plugins/README.md` entry
4. Remove the `.opencode/skills/.code-graph-freshness-state` dir (state only, no canonical data)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the guard writes only ephemeral debounce state and an append-only log; nothing touches the code graph DB except the daemon's own scan writer path
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │  Core logic │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ Adapters  │
                    │ OC + CC   │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| State scaffolding (ported) | None | Atomic state, sweep, append-log | Core |
| `freshness-core.cjs` | State scaffolding | `evaluateEdit` decision + exports | Adapters, Tests |
| OpenCode adapter | Core | `tool.execute.after` + timer + `event` | Verify |
| Claude adapter + settings.json | Core | PostToolUse co-resident hook | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup: state dir + ported atomic/sweep/log scaffolding** - foundation - CRITICAL
2. **Core: `evaluateEdit` gate chain + drain/probe/log exports** - the load-bearing logic - CRITICAL
3. **Adapters + `.claude/settings.json` wiring + vitest** - the transport and the proof - CRITICAL

**Total Critical Path**: Setup -> Core -> Adapters/Tests (sequential; the two adapters can be written in parallel once the core lands).

**Parallel Opportunities**:
- The OpenCode adapter and the Claude adapter can be built simultaneously once `freshness-core.cjs` exports are stable.
- The vitest suite can be authored against the core's decision contract while the adapters are wired.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core lands | `evaluateEdit` returns correct decisions for the five gate axes | Phase 2 |
| M2 | Adapters wired | OpenCode + Claude adapters call the core, spawn detached, never block | Phase 2 |
| M3 | Guarantees pinned | scan / defer-cold / defer-empty unit assertions pass; folder-purity + parity green | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Shared output-free core plus two thin runtime adapters

**Status**: Proposed

**Context**: Two runtimes (OpenCode and Claude) must react to the same post-edit signal with identical policy, and the repo already ships this exact split for `mk-deep-loop-guard`.

**Decision**: Put all decision logic in `freshness-core.cjs` (output-free, never dispatches) and keep each adapter a thin transport that owns only the spawn and the log append.

**Consequences**:
- One place to test the debounce/warm/empty policy; adapters stay trivial and each fails open independently.
- Slightly more indirection than a single per-runtime hook, mitigated by cloning the proven dispatch-guard boundary.

**Alternatives Rejected**:
- Two independent hooks with duplicated logic: rejected because the policy would drift between runtimes and double the test surface.

> Full ADRs, alternatives tables, and Five Checks live in `decision-record.md`.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
