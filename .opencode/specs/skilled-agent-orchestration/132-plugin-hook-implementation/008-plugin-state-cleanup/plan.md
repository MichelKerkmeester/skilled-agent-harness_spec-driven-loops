---
title: "Implementation Plan: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)"
description: "Mirror the proven sweepStaleGateStates / maintainWarningLogPath idiom into the two unbounded state dirs: add a throttled sweep to the sentinel core invoked from both adapters, and add a pre-append size cap plus single-backup rotation to the telemetry writer with its write path reconciled."
trigger_phrases:
  - "sentinel sweep implementation plan"
  - "telemetry jsonl rotation plan"
  - "sweepStaleSentinelState"
  - "state dir cleanup approach"
  - "singular plural telemetry path"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/008-plugin-state-cleanup"
    last_updated_at: "2026-07-11T11:22:33.213Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs scoping both state-cleanup gaps"
    next_safe_action: "Implement sweepStaleSentinelState + telemetry rotation per plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/plugins/mk-completion-sentinel.js"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs"
      - ".opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-plugin-state-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Confirm the telemetry cap default (1 MiB) and dedup retention default (30 days) match operator expectations for signal retention versus disk footprint."
      - "Confirm whether the singular .opencode/skill/ path was ever a real write target in any environment before reconciling telemetryFilePath to the plural .opencode/skills/ live dir."
    answered_questions: []
---
# Implementation Plan: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Node.js (CommonJS `.cjs` core + ESM `.js` OpenCode plugin) and TypeScript (observability script) |
| **Framework** | OpenCode plugin host + Claude Code Stop hook |
| **Storage** | JSON dedup store (`advisory-dedup.json`) + JSONL telemetry (`compliance.jsonl`) on the filesystem |
| **Testing** | Vitest (`mcp_server/tests`) + node:test (`.opencode/plugins/tests`, matching `mk-spec-gate.test.cjs`) |

### Overview
Mirror the proven `sweepStaleGateStates` / `maintainWarningLogPath` idiom (`spec-gate-core.mjs:162-323`) into the two unbounded state dirs. Add `sweepStaleSentinelState(stateDir, runtimeState)` to the sentinel core and invoke it from the OpenCode plugin on `session.created` and from the Claude Stop adapter, both throttled and best-effort. Add a pre-append size cap plus single-backup rotation to `appendJsonl` in `smart-router-telemetry.ts` and reconcile its write path from singular `.opencode/skill` to the plural `.opencode/skills` live dir so writes and rotation act in one place.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (both gaps in spec.md)
- [ ] Success criteria measurable (SC-001..SC-003)
- [ ] Dependencies identified (spec-gate idiom, completion-state.cjs)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-006)
- [ ] Tests passing (sweep, adapter invocation, telemetry rotation, path reconcile)
- [ ] Docs updated (spec/plan/tasks/checklist synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral core + thin transport adapters - the same shape `spec-gate` and `deep-loop` dispatch-guard already use. Policy and persistence live in the `.cjs` core; each adapter only maps its runtime's event shape onto the core.

### Key Components
- **completion-evidence-sentinel.cjs** (core): owns dedup persistence (`readDedupStore`/`writeDedupStoreAtomic`/`applyDedup` at :243-288) and path resolution (`resolveSentinelPaths` at :136-143); gains a throttled `sweepStaleSentinelState`, exported for adapters.
- **mk-completion-sentinel.js** (OpenCode adapter): default-export-only; gains a `runtimeState` closure and a `session.created` sweep branch in the existing `event` handler (which today handles only `session.idle`).
- **completion-evidence-stop.cjs** (Claude adapter): gains a best-effort sweep call around `main()`'s Stop processing.
- **smart-router-telemetry.ts** (observability): `appendJsonl` (:179-191) gains a pre-append cap + rotate; `telemetryFilePath` (:160-177) and `locateRepoRoot` (:144-158) get the singular->plural path fix.

### Data Flow
A session-lifecycle event triggers a throttled sweep of `.completion-sentinel-state` (prune dedup entries past retention, remove stale `*.tmp`, age-prune `<log>.1`). Each telemetry write does a size check, an optional rotate-to-`.1`, then the append.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Sentinel core dedup + paths (`readDedupStore`/`writeDedupStoreAtomic`/`applyDedup`, `resolveSentinelPaths`, `positiveIntFromEnv`) | Owns dedup persistence + path resolution + env parsing | update: add `sweepStaleSentinelState`, reuse the atomic-write and `positiveIntFromEnv` helpers, export the sweep | `rg -n 'sweepStaleSentinelState|advisory-dedup' completion-evidence-sentinel.cjs`; new vitest |
| `appendAdvisoryLog` rotated backup `<logPath>.1` (:300-319) | Already size-caps + single-backup-rotates the active advisory log | update: age-prune the `.1` backup inside the sweep only; leave the append-time cap untouched | grep :300-319; test asserts a stale `.1` is removed past retention |
| OpenCode plugin `mk-completion-sentinel.js` `event` handler | Fires on `session.idle` only today | update: add a `session.created` branch that calls the sweep, throttled via a `runtimeState` closure (mirror `mk-spec-gate.js:163,174-175`) | `rg -n 'session.created|runtimeState' mk-completion-sentinel.js`; new plugin test |
| Claude Stop adapter `completion-evidence-stop.cjs` `main()` | Approves/advises on Stop | update: add a best-effort try/catch sweep call before `approve()` | grep; extend `hook-completion-evidence-stop.vitest.ts` |
| Telemetry `appendJsonl` (:179-191) + `telemetryFilePath` (:160-177) + `locateRepoRoot` (:144-158) | Append-only writer + path resolver targeting singular `.opencode/skill` | update: add cap+rotate before append; fix marker + default `skill`->`skills` | `rg -n "'skill'" smart-router-telemetry.ts` returns 0 after fix; rotation vitest |
| Telemetry readers: `readSmartRouterComplianceJsonl` (:381-397) + analyze/measurement scripts and their vitests | Read `compliance.jsonl` via `telemetryFilePath`/explicit path | not a consumer of the rotation logic; verify the reader still resolves the same (now plural) path and rotation does not orphan it | `rg -n 'telemetryFilePath|compliance.jsonl' scripts tests`; existing `smart-router-analyze.vitest.ts` still green |

Required inventories:
- Same-class producers: `rg -n 'sweepStale|maintainWarningLogPath|pruneGateArchive' .opencode/skills/system-spec-kit/runtime/lib/spec-gate .opencode/skills/system-deep-loop/runtime/lib/deep-loop`.
- Consumers of changed symbols: `rg -n 'sweepStaleSentinelState|appendJsonl|telemetryFilePath' .opencode --glob '*.ts' --glob '*.js' --glob '*.cjs'`.
- Matrix axes: sentinel = {store: empty | fresh-only | stale+fresh | corrupt} x {`.tmp`: none | stale | fresh} x {`<log>.1`: none | stale}; telemetry = {size: under-cap | at-cap | over-cap} x {rotation: succeeds | fails} x {path: default-plural | env-override}.
- Algorithm invariant: prune drops an entry iff `now - Date.parse(advisedAt) > retentionMs`; rotation preserves the single latest `.1` and never drops the incoming record; every step fails open per entry.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the exemplar idiom: `sweepStaleGateStates` (`spec-gate-core.mjs:269-323`), `maintainWarningLogPath` (:162-185), and throttle wiring in `mk-spec-gate.js:163,170-175`.
- [ ] Add env constants to the sentinel core: `MK_COMPLETION_SENTINEL_RETENTION_DAYS` (default 30), `MK_COMPLETION_SENTINEL_SWEEP_INTERVAL_MS` (default 3600000).
- [ ] Add `SPECKIT_SMART_ROUTER_TELEMETRY_MAX_BYTES` (default 1048576) to the telemetry script.

### Phase 2: Core Implementation
- [ ] GAP 1 core: implement `sweepStaleSentinelState(stateDir, runtimeState)` - read `advisory-dedup.json`, drop entries whose `advisedAt` is older than the retention window, atomically rewrite via the existing `writeDedupStoreAtomic`; remove stray `*.tmp` files past retention; age-prune `<log>.1`; throttle via `runtimeState.lastSentinelSweepAtMs` + the interval env; export it.
- [ ] GAP 1 adapters: invoke the sweep from the OpenCode plugin `event` on `session.created` (add a `runtimeState = { lastSentinelSweepAtMs: 0 }` closure, resolve `stateDir` via the core, wrap in try/catch) and from the Claude Stop adapter (best-effort call before `approve()`).
- [ ] GAP 2: add the pre-append cap + single-backup rotation to `appendJsonl` (statSync size vs the cap; on exceed, copy/rename to `.1` then append to a fresh file; a rotation error still appends); reconcile singular->plural in `locateRepoRoot` and `telemetryFilePath`.

### Phase 3: Verification
- [ ] Manual testing complete (inspect `.completion-sentinel-state` and `.smart-router-telemetry` stay bounded after runs).
- [ ] Edge cases handled (corrupt store no-op, rotation-failure still appends, throttle short-circuit, kill-switch full no-op).
- [ ] Documentation updated (spec/plan/tasks/checklist synchronized).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `sweepStaleSentinelState` (prune/`.tmp`/`.1`/throttle), `appendJsonl` rotation, `telemetryFilePath` path | Vitest (`mcp_server/tests`) |
| Integration | `session.created` -> sweep (plugin); Stop -> best-effort sweep (Claude adapter) | Vitest hook test + node:test plugin test |
| Manual | `.completion-sentinel-state` + `.smart-router-telemetry` bounded after real runs | Browser (n/a) / shell `ls`/`stat` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec-gate-core.mjs` sweep/rotate idiom | Internal | Green | Reference only; no runtime coupling |
| `completion-state.cjs` / `check-completion.sh` | Internal | Green | Unchanged; sweep does not touch checklist evaluation |
| Vitest harness (`mcp_server/tests`) | Internal | Green | Existing suites are extended, not created from scratch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any fail-open regression (a sweep or rotation error reaching the observed turn/session) or unexpected loss of recent signal.
- **Procedure**: `git revert` this phase's commit; state dirs are additive with no schema migration, so removing the new `.1`/pruned entries needs no reversal step.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ─────────────────────┐
                           ├──► Core: GAP1 sweep + GAP2 rotate ──► Verify
Env constants ─────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core: GAP1 core sweep | Setup | GAP1 adapters, Verify |
| Core: GAP1 adapters | GAP1 core sweep | Verify |
| Core: GAP2 telemetry | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~0.5 hour |
| Core Implementation | Med | ~4-6 hours |
| Verification | Med | ~2-3 hours |
| **Total** | | **~6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration required (state dirs are additive runtime state)
- [ ] Kill-switch available (`MK_COMPLETION_SENTINEL_DISABLED=1`)
- [ ] New env defaults confirmed safe (retention 30d / interval ~1h / cap 1 MiB)

### Rollback Procedure
1. Set `MK_COMPLETION_SENTINEL_DISABLED=1` to immediately no-op the sentinel sweep.
2. `git revert` this phase's commit.
3. Re-run the changed Vitest suites + the plugin test to confirm the revert is clean.
4. No stakeholder notification needed - the change is advisory/observe-only.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - `.completion-sentinel-state` and `.smart-router-telemetry` are gitignored runtime state; pruned entries and rotated `.1` files are not tracked, so there is nothing to migrate back.

### Design Choices Resolved
- **Sweep signature `sweepStaleSentinelState(stateDir, runtimeState)`** (not `(projectDir, runtimeState)`): chosen so the two sweeps read identically to `sweepStaleGateStates(stateDir, runtimeState)`; each adapter already resolves `stateDir` via `resolveSentinelPaths(projectDir).stateDir`, exactly as `mk-spec-gate.js` passes its resolved `stateDir`.
- **Telemetry path singular -> plural**: the only live data dir is `.opencode/skills/.smart-router-telemetry/compliance.jsonl` (72 KiB). The code's `.opencode/skill` marker (`locateRepoRoot` :148) never matches, so `locateRepoRoot` falls through to `startDir` and the default path (:176) points at a singular dir that does not exist in the repo. Fixing both literals to `.opencode/skills` anchors `locateRepoRoot` on the real repo marker and lands writes + rotation on the one real path; env overrides (`SPECKIT_SMART_ROUTER_TELEMETRY_PATH`/`_DIR`) still take precedence.
- **Log-backup handling**: age-prune only the rotated `<log>.1` inside the sweep and leave the append-time cap in `appendAdvisoryLog` untouched, so the active-log rotation logic is not duplicated.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
