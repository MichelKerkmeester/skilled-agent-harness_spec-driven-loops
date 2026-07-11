---
title: "Implementation Plan: Completion Evidence Sentinel"
description: "Build one runtime-neutral completion-evidence core plus two thin runtime adapters (Claude Stop extension, OpenCode session.idle plugin) that advise when a completion claim outruns recorded evidence, without executing anything."
trigger_phrases:
  - "completion evidence sentinel plan"
  - "completion sentinel core plus adapters"
  - "stop hook completion backstop plan"
  - "session idle completion plugin"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/004-completion-evidence-sentinel"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 plan for the completion-evidence sentinel"
    next_safe_action: "Scaffold completion-evidence-sentinel.cjs and its unit test in mcp_server"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts"
      - ".opencode/plugins/mk-completion-sentinel.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-completion-evidence-sentinel"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Completion Evidence Sentinel

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
| **Language/Stack** | Node.js CommonJS core (`.cjs`), TypeScript Claude hook, ES module OpenCode plugin |
| **Framework** | system-spec-kit MCP hooks and the OpenCode plugin runtime |
| **Storage** | Shared state dir for dedup fingerprints and a bounded advisory log |
| **Testing** | Vitest for the core unit test in `mcp_server/tests` |

### Overview
Build one runtime-neutral policy core that gates on a completion claim plus a resolved spec folder, evaluates recorded evidence via `check-completion.sh --json` (checklist folders) or an `implementation-summary.md` stat (Level 1), and returns a transport-free decision. Two thin adapters carry that decision into their runtimes: the Claude adapter extends the existing `Stop` owner after its atomic state write, and the OpenCode adapter is a new `session.idle` plugin that resolves the last message and packet via `ctx.client` first. The core executes nothing and never blocks.
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
- [ ] Core unit test passing (fixture A advises, fixture B is ok, no-claim is a no-op)
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral policy/logic core plus two thin runtime adapters. This mirrors the repo's proven shape: the `mk-deep-loop-guard` core `dispatch-guard.cjs` with a Claude twin `task-dispatch-guard.cjs` and an OpenCode plugin `mk-deep-loop-guard.js`. The core owns parsing and policy and returns a transport-free decision; each adapter surfaces it in its own protocol and owns the log append.

### Key Components
- **`completion-evidence-sentinel.cjs`**: The core. Exposes `detectCompletionClaim`, `evaluateCompletionEvidence`, path resolution, dedup, and a bounded-log append, and never writes stdout or stderr.
- **`session-stop.ts` extension**: The Claude adapter. After the single atomic state write it requires the core and calls `evaluateCompletionEvidence` with the already-resolved `lastSpecFolder` and `last_assistant_message`.
- **`mk-completion-sentinel.js`**: The OpenCode adapter. On `session.idle` it resolves the last assistant text and packet via `ctx.client`, then delegates to the core.

### Data Flow
An assistant turn ends. The adapter hands the last message text plus the resolved spec folder to the core. The core gates on a completion claim plus a resolved folder, reads recorded evidence (never executes), dedups by packet plus message fingerprint, and returns `ok` or `advise` with a detail. The adapter appends any advisory to the bounded shared log and surfaces it in its runtime.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared policy and a hook that owns persistence, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `session-stop.ts` (Claude Stop owner) | Owns the single atomic state write plus `autosaveState.lastSpecFolder` and `input.last_assistant_message` | update: insert the sentinel call after the atomic write | `session-stop.ts:559-605`; rebuild `mcp_server/dist` |
| `completion-evidence-sentinel.cjs` (new core) | Does not exist yet | create | `completion-evidence-sentinel.vitest.ts` unit test |
| `mk-completion-sentinel.js` (new OpenCode plugin) | Does not exist yet | create | plugin loads with a single default export; `session.idle` smoke |
| `check-completion.sh` | Produces the status enum via `--json` | not a consumer; invoked read-only via `spawnSync` | `check-completion.sh:278-282`, `:290-320`, `:217-225` |
| `COMPLETION_CLAIM_PATTERN` (`quality-loop.ts:13`) | Owns the completion-claim regex | reused unchanged; no second regex | `quality-loop.ts:13` |
| `.claude/settings.json` Stop wiring | Wires the single Stop hook (async, timeout 10) | unchanged; no second hook added | `.claude/settings.json:87-99` |
| `.opencode/plugins/README.md` | Lists the loaded plugins | update: register `mk-completion-sentinel` | grep the plugin name in the README |

Required inventories:
- Same-class producers: `rg -n 'COMPLETION_CLAIM_PATTERN|detectCompletionClaim' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'evaluateCompletionEvidence|completion-evidence-sentinel' . --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: runtime (Claude Stop, OpenCode session.idle) times folder level (has checklist, Level 1 no checklist) times claim (present, absent).
- Algorithm invariant: the core reads recorded artifacts only and never executes a test, build, or `validate.sh`; every error path resolves to `ok`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the `COMPLETION_CLAIM_PATTERN` source at `quality-loop.ts:13` and the `check-completion.sh --json` status enum
- [ ] Confirm the Claude Stop insertion point at `session-stop.ts:559-605` (after the single atomic state write)
- [ ] Confirm `session.idle` shape and `ctx.client` usage from `mk-goal.js:2868`

### Phase 2: Core Implementation
- [ ] Build `completion-evidence-sentinel.cjs`: claim gate, checklist evaluation, Level 1 fallback, dedup, bounded log
- [ ] Extend `session-stop.ts` after the atomic write, then rebuild `mcp_server/dist`
- [ ] Add `mk-completion-sentinel.js` on `session.idle` with `ctx.client` resolution

### Phase 3: Verification
- [ ] Core unit test green (fixture A advises, fixture B is ok, no-claim is a no-op)
- [ ] Dist freshness and `validate.sh` staleness backstop pass after the rebuild
- [ ] `plugins/README.md` and docs updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core policy in isolation: claim gate, evidence evaluation, Level 1 fallback, no-test guarantee | Vitest |
| Integration | Claude Stop return object exposes the advisory; OpenCode plugin loads and no-ops on unresolved input | Vitest and manual smoke |
| Manual | `session.idle` advisory append to the bounded log without stdout or stderr | OpenCode session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude `Stop` owner `session-stop.ts` | Internal | Green | No Claude adapter; core and OpenCode adapter still shippable |
| `check-completion.sh --json` | Internal | Green | Checklist evaluation degrades to fail-open `ok` |
| `COMPLETION_CLAIM_PATTERN` (`quality-loop.ts:13`) | Internal | Green | No claim gate; must reuse, not re-mint |
| OpenCode `ctx.client` last-message resolution | Internal | Yellow | OpenCode adapter no-ops; Claude half unaffected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The Stop hook regresses, the dist-freshness guard trips, or the advisory floods the log.
- **Procedure**: Revert the `session-stop.ts` insert and rebuild dist; delete `mk-completion-sentinel.js` and its README entry; the core `.cjs` and its test are inert when no adapter calls them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1 (Confirm) ────┘
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
| Setup | Low | Source confirmation, under 1 hour |
| Core Implementation | Med | ~150 LOC core, ~15 LOC Claude insert plus build, ~60 LOC OpenCode plugin |
| Verification | Low | Core unit test plus dist checks, 1-2 hours |
| **Total** | Med | Effort class M, lifted from S by the session.idle resolution work |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Core unit test green before either adapter is wired
- [ ] Dist rebuilt and freshness guard passing
- [ ] Advisory log path bounded and rotating

### Rollback Procedure
1. Revert the `session-stop.ts` sentinel insert
2. Rebuild `mcp_server/dist` so the compiled Stop hook matches source
3. Remove `mk-completion-sentinel.js` and its `plugins/README.md` entry
4. Confirm the dist-freshness guard and `validate.sh` staleness backstop pass

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete the sentinel state dir and its bounded log; both are advisory scratch
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│    Core     │────►│   Verify    │
│  confirm    │     │  .cjs core  │     │  unit test  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ Adapters  │
                    │ Stop+idle │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Core `.cjs` | Setup confirmation | Transport-free decision | Adapters, Test |
| Claude adapter | Core | Stop advisory plus return field | Test |
| OpenCode adapter | Core | Idle advisory to bounded log | Test |
| Core unit test | Core | No-test guarantee proof | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Core `.cjs`** - claim gate, evidence evaluation, dedup, bounded log - CRITICAL
2. **Core unit test** - proves policy and the no-test guarantee - CRITICAL
3. **Claude Stop adapter plus dist rebuild** - build-now half - CRITICAL

**Total Critical Path**: Core, then its unit test, then the Claude adapter with a dist rebuild.

**Parallel Opportunities**:
- The OpenCode adapter can be built after the core, in parallel with the Claude adapter.
- The `plugins/README.md` update runs alongside the OpenCode adapter.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core plus unit test | Fixture A advises, fixture B is ok, no-claim is a no-op | Phase 2 start |
| M2 | Claude Stop adapter | Advisory surfaced, dist rebuilt, no block decision | Phase 2 mid |
| M3 | OpenCode adapter | Plugin loads, resolves via `ctx.client`, no-ops when unresolved | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Shared runtime-neutral core plus two thin adapters

**Status**: Proposed

**Context**: The sentinel must run on two runtimes with different event shapes. A single core keeps one definition of the policy and one bounded-log path.

**Decision**: Put all policy in `completion-evidence-sentinel.cjs` and keep both adapters thin, mirroring `dispatch-guard.cjs` plus its twins.

**Consequences**:
- One place owns claim detection, evidence evaluation, dedup, and the log.
- The OpenCode adapter must resolve the last message and packet itself, since `session.idle` carries neither.

**Alternatives Rejected**:
- Two independent hook implementations: drift between two definitions of "completion claim" and two log paths.

See `decision-record.md` for the full ADRs.


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
