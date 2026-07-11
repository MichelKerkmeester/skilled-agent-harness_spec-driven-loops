---
title: "Feature Specification: Incremental Code-Graph Freshness Guard"
description: "The structural code graph goes soft-stale (or sits empty) after source edits, so detect_changes, blast_radius, and code_graph_context return a false-safe blocked payload until an operator manually re-runs a scan. This phase adds a post-edit guard that self-heals an established graph back to fresh without blocking the edit or cold-starting the daemon."
trigger_phrases:
  - "code graph freshness guard"
  - "incremental scan guard"
  - "warm-only code graph refresh"
  - "post-edit graph self-heal"
  - "code-graph-freshness-guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/002-code-graph-freshness-guard"
    last_updated_at: "2026-07-11T06:21:17.310Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 planning docs from research sheet-002 (build-now verdict)"
    next_safe_action: "Await plan approval, then implement freshness-core.cjs plus the two thin adapters"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"
      - ".opencode/plugins/mk-code-graph-freshness.js"
      - ".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-code-graph-freshness-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Incremental Code-Graph Freshness Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

DO NOT use Level 3 if:
- Simple feature (use Level 1)
- Only verification needed (use Level 2)
- Governance approval workflow required (use Level 3+)
- Compliance checkpoints needed (use Level 3+)
- Multi-agent parallel execution coordination (use Level 3+)
-->

---

## EXECUTIVE SUMMARY

The code graph is the structural search backend for `detect_changes`, `blast_radius`, and `code_graph_context`. When it goes soft-stale after edits (or, as on this repo right now, sits empty), those tools return a false-safe `blocked` payload and every structural read has to wait for an operator to re-run a scan by hand. This phase ships the maintain half of that story: a post-edit guard that debounces an edit burst and, only when a graph is already established and the daemon is warm, fire-and-forget dispatches a warm-only incremental `code_graph_scan {incremental:true}` so the graph self-heals from soft-stale back to fresh. It composes with the SessionStart establishment path (which owns first-time scope), never blocks an edit, and never cold-starts the daemon.

**Key Decisions**: Runtime-neutral policy core plus two thin runtime adapters (clone of the `mk-deep-loop-guard` core plus `task-dispatch-guard.cjs` shape); advisory fail-open posture with a warm-only never-cold-start invariant and a default-off bootstrap opt-in.

**Critical Dependencies**: The code-index dual-stack CLI `--warm-only` refusal path (`code-index-cli.js:996`) that provably throws instead of spawning the launcher; the existing `.code-graph-owner.json` heartbeat and `.code-graph-readiness.json` markers as cheap probes.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-cli-dispatch-audit-trail |
| **Successor** | 003-post-edit-quality-router |
| **Handoff Criteria** | freshness-core unit assertions (scan / defer-cold / defer-empty) pass, plugin-folder-purity and command-tree parity stay green, and the Claude hook is co-resident (not replacing) sk-code's PostToolUse hook |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After a source edit, the structural code graph drifts soft-stale, and `detect_changes` / `blast_radius` / `code_graph_context` fall back to a false-safe `blocked` payload until an operator manually re-runs `code_graph_scan`. On this repo the graph is currently empty (`.code-graph-readiness.json` reports `graphFreshness=empty`), so those reads are blocked by default. There is a SessionStart path that establishes a graph, but nothing keeps it fresh between establishment and the next manual scan.

### Purpose
A source edit on an already-established, warm graph triggers an automatic warm-only incremental rescan, so the graph self-heals back to fresh without an operator re-running the scan, without blocking the edit, and without cold-starting the daemon.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral policy core (`freshness-core.cjs`) exposing `evaluateEdit()`, `drainPending()`, `sweepStaleFreshnessState()`, `probeDaemonWarm()`, and `appendFreshnessLog()`.
- An OpenCode plugin adapter hooking `tool.execute.after` plus `event` (session lifecycle) with a long-lived in-memory debounce timer.
- A Claude PostToolUse (`Write|Edit`) hook adapter, added as a second co-resident command alongside sk-code's existing hook.
- The debounce decision (quiet window plus max-wait cap plus next-edit-after-settle), the in-scope source filter, the empty gate, the warm probe, and the concurrency lock.
- A default-off bootstrap opt-in (`MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP=1`) documented but not enabled.

### Out of Scope
- Initial scope-establishing scans on an empty graph - that stays SessionStart / operator territory, gated behind the bootstrap opt-in.
- Any change to the code graph schema, the daemon, or the `code_graph_scan` tool contract - this phase only calls the existing CLI.
- Cold-starting the daemon - the guard is warm-only by construction and never invokes `mk-code-index-launcher.cjs`.
- Per-call scope flags - passing them risks a narrowing fingerprint and is deliberately avoided (see Risk R-001).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs` | Create | Runtime-neutral policy core: `evaluateEdit()`, `drainPending()`, `sweepStaleFreshnessState()`, `probeDaemonWarm()`, `appendFreshnessLog()`. Output-free, never dispatches. |
| `.opencode/plugins/mk-code-graph-freshness.js` | Create | OpenCode adapter: default-export-only factory hooking `tool.execute.after` and `event`, owning detached spawn and the in-memory debounce timer. |
| `.opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs` | Create | Claude PostToolUse adapter: short-lived stdin reader, owns detached spawn, always `process.exit(0)`. |
| `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.vitest.ts` | Create | Core unit tests pinning the scan / defer-cold / defer-empty guarantees plus debounce, scope-filter, and drain cases. |
| `.claude/settings.json` | Modify | Append a second command inside the existing PostToolUse `Write|Edit` hooks array (co-resident with sk-code's hook, do not replace). |
| `.opencode/plugins/README.md` | Modify | Register the new plugin in the plugin catalog and note its default-export-only, fail-open posture. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Never cold-start the daemon. The guard dispatches only when the warm probe passes (`now - Date.parse(lastHeartbeatIso) < ttlMs`) and relies on the CLI `--warm-only` refusal as a backstop. | Unit test flips the owner heartbeat to `now - 90000ms` and asserts `decision==='defer-cold'` with no dispatch. Every scan dispatch carries `--warm-only` and `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME=1`. Grep confirms no code path invokes `mk-code-index-launcher.cjs`. |
| REQ-002 | Never block an edit. Every adapter hook is wrapped in try/catch and fails open; the scan is spawned detached and unref'd with `stdio:'ignore'`; the Claude adapter always exits 0; the core never throws into the tool path. | Adapter smoke test proves `tool.execute.after` returns without awaiting the scan; an injected core error leaves the hook returning normally. The Claude adapter's `main().catch(() => process.exit(0))` is present. |
| REQ-003 | Defer on an empty graph by default. When `.code-graph-readiness.json` reports `graphFreshness==='empty'`, the decision is `defer-empty` unless `MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP=1`. | Unit test with empty readiness asserts `decision==='defer-empty'` and no dispatch; with the bootstrap env set it proceeds past the empty gate. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Debounce an edit burst. The core appends the file path to a capped pending set in an atomic hex(sessionID)-keyed state file and computes `shouldScan = pending != empty AND (now - priorLastEditAt >= quietMs OR now - firstPendingAt >= maxWaitMs)`. | Unit tests cover: quiet-window elapsed fires scan; max-wait cap fires during a sustained burst; empty pending set never fires. |
| REQ-005 | Filter to in-scope source only. Only an indexable source extension not under an excluded dir proceeds; the filter errs toward include; out-of-scope input returns `{decision:'skip', reason:'out-of-scope'}`. | Unit test: `src/foo.ts` is in scope; under default env `.opencode/skills/x/SKILL.md` returns skip out-of-scope. |
| REQ-006 | Shared output-free core plus two thin adapters. The core returns a decision plus `warnings`/`audits` arrays, never writes stdout/stderr, and never spawns. Adapters own the detached spawn and `appendFreshnessLog`. | Grep of `freshness-core.cjs` finds no `process.stdout`/`process.stderr` writes and no `child_process` spawn. Adapters carry the spawn and log-append calls. |
| REQ-007 | Guard against a concurrent in-flight scan. A fresh `.scan.lock` mtime yields `{decision:'defer-inflight'}`; the adapter clears the lock on child exit. | Unit test with a fresh `.scan.lock` asserts `decision==='defer-inflight'`; adapter clears the lock in the child `exit` handler. |
| REQ-008 | Co-resident Claude wiring. `.claude/settings.json` adds a second command inside the existing PostToolUse `Write|Edit` array without replacing sk-code's `claude-posttooluse.sh`; both run order-independently and each fails open. | `.claude/settings.json` parses as valid JSON, both commands are present in the same block, and command-tree parity stays green. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A soft-stale established graph returns to fresh within one debounce window after an in-scope edit burst, with no operator action and no blocked edit.
- **SC-002**: Zero cold starts. No code path invokes `mk-code-index-launcher.cjs`, and every dispatch carries `--warm-only` plus the PROMPT_TIME env, so a stale-heartbeat race is caught by the CLI's own exit-75 refusal.
- **SC-003**: The three load-bearing unit assertions (scan / defer-cold / defer-empty) pass, and `opencode-plugins-folder-purity` plus command-tree parity stay green.
- **SC-004**: On this repo under default env, edits under `.opencode/skills` classify as out-of-scope skips; the guard adds no noise where it cannot help (honest scope caveat, not a defect).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | code-index CLI `--warm-only` refusal (`code-index-cli.js:996`) | Without it the warm-race backstop is gone | Belt-and-suspenders: cheap heartbeat probe first, CLI exit-75 refusal second; never call the launcher directly |
| Dependency | `.code-graph-owner.json` heartbeat + `.code-graph-readiness.json` markers | Missing/malformed markers must not crash the hook | Treat unreadable markers as not-ready/cold and defer (fail-safe) |
| Risk | Per-call scope flags narrow the fingerprint -> cannot incrementally shrink -> block/thrash | High | Pass NO per-call scope flags; inherit process env so the auto-scan fingerprint matches whatever established the graph |
| Risk | Stateless Claude hook trailing edge never fires from edit-only triggers | Medium | Combine max-wait cap + next-edit-after-settle + SessionStart drain; accept bounded final-set precision on the Claude side |
| Risk | Plugin purity: a named export silently drops the whole plugin file | Medium | Default-export-only; hang the test surface on the default fn as `__test`; keep the folder-purity vitest green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `evaluateEdit` hot path does only cheap synchronous file reads (readiness marker, owner heartbeat, one atomic hex-keyed state file) and returns well within the tool's own latency. No network call and no process spawn happen on the decision path; the spawn is detached and off the critical path.

### Security
- **NFR-S01**: The core never executes anything. Adapters spawn only the fixed `.opencode/bin/code-index.cjs` binary with a fixed argument vector; no edited file path is ever interpolated into a shell command.

### Reliability
- **NFR-R01**: The guard fails open on every internal error and never throws into the tool path. The worst realistic failure is a single unnecessary incremental scan against the warm daemon, which is content-hash bounded and single-writer-safe (the scan is the daemon's own writer path).

---

## 8. EDGE CASES

### Data Boundaries
- Empty pending set: no scan is dispatched; the decision short-circuits before the warm probe.
- Oversized burst: the pending set is capped, and the max-wait cap guarantees a scan fires during a sustained burst rather than waiting forever for quiet.

### Error Scenarios
- Missing or malformed `.code-graph-readiness.json` / `.code-graph-owner.json`: treated as not-ready / cold, so the decision defers (fail-safe), never dispatches.
- Heartbeat goes stale between the probe and the dispatch: the CLI `--warm-only` refusal (exit 75) is the backstop, so no launcher is spawned.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 4 new + 2 edits, LOC ~460-560, Systems: 2 runtimes (OpenCode + Claude) |
| Risk | 8/25 | Auth: N, API: N, Breaking: N (additive, fail-open, no schema change) |
| Research | 6/20 | Pattern proven; ~70% clones dispatch-guard.cjs; the new work is the debounce function and two file probes |
| Multi-Agent | 3/15 | Workstreams: core then two adapters, mostly sequential |
| Coordination | 8/15 | Dependencies: composes with SessionStart establishment; co-resident with sk-code's PostToolUse hook |
| **Total** | **37/100** | **Level 3 by phased-decomposition context and P1 build-now verdict, not by raw LOC** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Per-call scope flags narrow the fingerprint, causing a cannot-incrementally-shrink block/thrash | H | L | Pass no per-call scope flags; inherit process env (readiness_and_scope_fingerprint.md:104) |
| R-002 | Warm probe race: heartbeat goes stale between probe and dispatch | L | M | CLI `--warm-only` exit-75 refusal backstop; never invoke the launcher |
| R-003 | Plugin purity violation: a named export drops the whole plugin file silently | H | L | Default-export-only; test surface on the default fn `__test`; folder-purity vitest gate |
| R-004 | Stateless Claude hook trailing edge never fires from edit-only triggers | M | M | Max-wait cap + next-edit-after-settle + SessionStart drain; bounded final-set precision accepted |
| R-005 | Stray stdout/stderr corrupts the TUI | M | L | Core is output-free; adapters use `stdio:'ignore'`; append-only log plus bounded system-context only |

---

## 11. USER STORIES

### US-001: Graph self-heals after a maintainer's edits (Priority: P1)

**As a** maintainer editing indexed source, **I want** the structural graph to refresh itself after my edit burst, **so that** `detect_changes` and `blast_radius` stay answerable without me re-running a scan.

**Acceptance Criteria**:
1. Given an established non-empty graph and a warm daemon, When I edit `src/foo.ts` and the debounce window elapses, Then an incremental warm-only scan dispatches and the graph returns to fresh.
2. Given a rapid burst of saves, When the max-wait cap is reached before any quiet window, Then exactly one scan fires and the pending set is drained.

### US-002: Never wake a cold daemon (Priority: P1)

**As an** operator on a cold session, **I want** the guard to never wake the daemon, **so that** an edit cannot cause a surprise multi-second cold-start.

**Acceptance Criteria**:
1. Given the daemon heartbeat is stale, When an in-scope edit lands, Then the decision is `defer-cold` and no scan dispatches.
2. Given the heartbeat passes the probe but goes stale before dispatch, When the CLI runs with `--warm-only`, Then it refuses with exit 75 rather than spawning the launcher.

### US-003: Scope establishment stays the operator's decision (Priority: P1)

**As an** operator on an empty-graph repo, **I want** initial scope establishment to stay my decision, **so that** the guard never bootstraps an unscoped first scan.

**Acceptance Criteria**:
1. Given readiness `graphFreshness` is empty and no bootstrap opt-in, When an in-scope edit lands, Then the decision is `defer-empty`.

### US-004: Out-of-scope edits are quietly skipped (Priority: P2)

**As a** developer on this framework repo, **I want** skill, agent, and spec edits (out of the default index scope) to be quietly skipped, **so that** the guard adds no noise where it cannot help.

**Acceptance Criteria**:
1. Given the default env excludes `.opencode/skills`, When I edit `.opencode/skills/x/SKILL.md`, Then the decision is `skip` (out-of-scope) and nothing dispatches.

---

## 12. OPEN QUESTIONS

- Should the OpenCode `quietMs` / `maxWaitMs` and the owner-heartbeat `ttlMs` be env-tunable, or fixed constants cloned from the dispatch-guard defaults for the first cut?
- What retention window should `sweepStaleFreshnessState()` use for the hex-keyed state dir and the append-only log before the first release?
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
