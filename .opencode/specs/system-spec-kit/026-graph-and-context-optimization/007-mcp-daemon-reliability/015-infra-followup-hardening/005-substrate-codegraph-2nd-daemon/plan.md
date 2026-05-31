---
title: "Implementation Plan: Wire a second live code-graph daemon into the substrate stress harness"
description: "Probe-first, then add short per-daemon socket dirs + a dedicated mk-code-index connection + routing; verify the vitest is green by default 3x with no graph-metadata mass-write."
trigger_phrases:
  - "substrate code-graph 2nd daemon plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/005-substrate-codegraph-2nd-daemon"
    last_updated_at: "2026-05-31T05:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003656"
      session_id: "036-005-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wire a second live code-graph daemon into the substrate stress harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM harness (.mjs) + Vitest (TS), MCP stdio clients |
| **Framework** | @modelcontextprotocol/sdk StdioClientTransport |
| **Storage** | Code-graph SQLite (read via the daemon; never written by the test) |
| **Testing** | `npm run stress:substrate` (real daemons) + a standalone connect probe + a stash-baseline comparison + graph-metadata dirty count |

### Overview
De-risk first with a standalone probe (does a dedicated mk-code-index daemon connect + answer code_graph_context with a valid short socket dir?). Then add a `shortSocketDir(slug)` helper, give both spawned daemons their own short pre-created socket dir, add the second `connectSharedClient`, route `mk_code_index` in `selectClientForServer`, register it under `clients`/`toolNameSets`, and sync the vitest comments. Verify green-by-default 3x and prove the change converts a red-at-HEAD test to green via a stash comparison.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline captured: at HEAD (change stashed) the suite is RED (`1 failed | 2 passed`, the runner-harness file)
- [x] Standalone probe: dedicated mk-code-index daemon connects + code_graph_context returns content (isError=false, 1895 chars)
- [x] Daemon stderr root-caused: sun_path EINVAL on the in-database socket path; allowlist = cwd / os.tmpdir() / /tmp

### Definition of Done
- [x] 403/404/407 execute → PASS; 410 PASS; 0 runner-FAIL
- [x] `npm run stress:substrate` green 3x consecutive with NO external env
- [x] 0 graph-metadata files dirtied; comment-hygiene clean; assertions byte-unchanged
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror the existing single-daemon connection path for a second daemon; centralize the sun_path mitigation in one `shortSocketDir(slug)` helper used by both daemons.

### Key Components
- **shortSocketDir(slug)**: returns + creates `os.tmpdir()/spk-substrate-<slug>` (short, allowed, pre-existing so listen() succeeds).
- **memory daemon env**: gains `SPECKIT_IPC_SOCKET_DIR: shortSocketDir('mem')`.
- **code-index connection**: dedicated child, `shortSocketDir('cg')`, bridge disabled, maintainer mode off.
- **selectClientForServer / clients / toolNameSets**: gain the `mk_code_index` route + registration.

### Data Flow
main() connects memory + code-index (each on its own short socket) → scenarios 403/404/407 resolve their `mcp__mk_code_index__*` calls to the code-index client → execute against the populated graph → PASS rows in the TSV.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| run-substrate-stress-harness.mjs constants | stderr-log paths | add code-index log + shortSocketDir helper | node --check |
| run-substrate-stress-harness.mjs main() | connects 1 daemon | short socket dir for mem + add cg daemon | TSV 403/404/407 PASS, 0 runner-FAIL |
| selectClientForServer | routes only mk_spec_memory | route mk_code_index too | scenarios resolve a client (not null) |
| substrate-runner-harness.vitest.ts | green-comments stale | sync description + 2 comments | vitest still green; comments accurate |
| mk-code-index-launcher.cjs / code-graph.sqlite | the 2nd daemon + data | unchanged (spawned / read) | probe confirmed connect + query |

Required inventories:
- The runner is the single substrate daemon-wiring site; selectClientForServer the only routing site. Both spawned daemons now route through the one shortSocketDir helper.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Baseline (stash) shows RED; standalone probe green; read launcher socket allowlist + daemon stderr

### Phase 2: Core Implementation
- [x] Add shortSocketDir helper + code-index stderr-log constant; import os
- [x] Short socket dir for memory daemon; add code-index connectSharedClient; register clients/toolNameSets
- [x] Extend selectClientForServer; sync vitest description + 2 comments

### Phase 3: Verification
- [x] node --check; npm run stress:substrate green 3x (no env); stash-compare proves HEAD was red; graph-metadata dirty 0; hygiene 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Probe | dedicated code-graph daemon connect + 1 call | standalone .mjs using the MCP SDK |
| Integration | full substrate run, 4 scenarios | run-substrate-stress-harness.mjs + TSV parse |
| Test | the promoted vitest suite | `npm run stress:substrate` (real daemons), 3x |
| Regression proof | red-at-HEAD vs green-with-change | git stash compare |
| Hazard | no graph-metadata mass-write | git status dirty count before/after |
| Hygiene | no ephemeral-pointer comments | ephemeral-pointer-audit.mjs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mk-code-index-launcher.cjs | Internal | Green | The 2nd daemon |
| populated code-graph.sqlite | Internal | Green (70278 nodes) | Data the scenarios query |
| @modelcontextprotocol/sdk | Vendored | Green | Transport/client |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the 2nd daemon proves flaky in CI or the suite regresses.
- **Procedure**: revert the harness `main()` + `selectClientForServer` + `shortSocketDir` changes and the vitest comment sync. Scenarios return to SKIP; no data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + probe) ──► Phase 2 (Socket dirs + wire + route + comments) ──► Phase 3 (Verify: 3x green + stash-compare + hazard)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup (probe green) | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | baseline + probe + launcher/allowlist read |
| Core Implementation | Medium | ~20 lines of harness + 3 comment edits |
| Verification | Medium | 3x vitest + stash-compare + hazard check |
| **Total** | | **~1 focused pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Probe confirmed connect + query before any harness edit
- [x] Stash comparison confirms the change is what turns the suite green
- [x] 0 graph-metadata dirtied across all runs

### Rollback Procedure
1. `git revert` the 005 commit (or remove the 2nd-daemon block + shortSocketDir + selectClientForServer branch).
2. Re-run `npm run stress:substrate` to confirm behavior (reverts to red-at-HEAD on deep paths).

### Data Reversal
- **Has data migrations?** No (code-graph DB is read-only via the daemon).
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
