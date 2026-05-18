---
title: "Implementation Plan: Rename system_skill_advisor MCP server to mk_skill_advisor"
description: "Atomic rename plan for the Skill Advisor MCP server id, launcher, runtime configs, and live namespace consumers."
trigger_phrases:
  - "013/009/015 plan"
  - "mk_skill_advisor rename plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/015-mcp-server-rename-mk-skill-advisor"
    last_updated_at: "2026-05-14T20:45:00Z"
    last_updated_by: "codex"
    recent_action: "Rename plan executed"
    next_safe_action: "Commit scoped rename"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rename system_skill_advisor MCP server to mk_skill_advisor

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript launcher, JSON/TOML/YAML/Markdown config |
| **Framework** | MCP stdio server via `@modelcontextprotocol/sdk` |
| **Storage** | Package-local launcher state JSON and advisor SQLite graph DB |
| **Testing** | `npm run typecheck`, `npx tsc --noEmit`, launcher smoke, `opencode mcp list`, strict spec validation |

### Overview

This plan applies the same runtime-identity rename pattern used by `mk_code_index`. The work is intentionally atomic: launcher filename/state, MCP server registration, four runtime configs, and live namespace consumers move together so no runtime surface points at a half-renamed advisor.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered by operator as new packet 015.
- [x] Branch confirmed as `main`.
- [x] Required `mk_code_index` rename precedent reviewed from local history.
- [x] Dirty worktree inspected before edits.

### Definition of Done

- [x] Launcher and runtime configs use `mk_skill_advisor`.
- [x] Live namespace references use `mcp__mk_skill_advisor__*`.
- [x] Advisor and spec-kit MCP typechecks pass.
- [x] Launcher smoke and MCP list verification complete.
- [x] Packet 015 strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Runtime identity rename with filesystem identity preservation.

### Key Components

- **Runtime configs**: Register `mk_skill_advisor` and point to `.opencode/bin/mk-skill-advisor-launcher.cjs`.
- **Launcher**: Owns process bootstrap, lockdir, state file, and child process launch.
- **Advisor server**: Registers the MCP server name and exposes stable `advisor_*` plus `skill_graph_*` tool ids.
- **Consumers**: Commands, YAML probes, bridges, install docs, catalogs, and playbooks use the new MCP namespace.

### Data Flow

Runtime config launches the mk-prefixed launcher. The launcher resolves the unchanged `system-skill-advisor` package, starts the unchanged advisor server entrypoint, and the server registers as `mk_skill_advisor` while exposing the same eight tool ids.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime configs | MCP server discovery | Rename keys, launcher paths, and notes | `rg -n 'system_skill_advisor|skill-advisor-launcher'` on config files |
| Launcher | Bootstrap and state file identity | Rename file, log prefix, lockdir, state file, command payload | Launcher smoke and git diff |
| Advisor server | MCP registration and logs | Rename server registration; align log prefix where launcher identity is named | Typecheck and smoke |
| Consumer docs/commands | Allowed tool namespaces and operator docs | Replace live old namespace and server-id mentions | Final grep outside specs/changelog |
| Parent 013/009 metadata | Resume routing | Add child 015 and active pointer | JSON inspection and strict validation |

Required inventories:

- Same-class producers: `rg -n 'system_skill_advisor|skill-advisor-launcher|mcp__system_skill_advisor__' .opencode --glob '!**/specs/**' --glob '!**/dist/**' --glob '!**/node_modules/**' --glob '!**/changelog/**'`.
- Consumers of changed namespace: `rg -n 'mcp__system_skill_advisor__' .opencode --glob '!**/specs/**' --glob '!**/dist/**' --glob '!**/node_modules/**' --glob '!**/changelog/**'`.
- Matrix axes: runtime config file, launcher identity, server registration, live consumer docs, parent continuity.
- Algorithm invariant: only the server namespace changes; tool ids and folder identity stay stable.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm branch and recent commits.
- [x] Scaffold packet 015 as Level 3.
- [x] Capture baseline grep references.

### Phase 2: Core Implementation

- [x] Rename launcher and state file.
- [x] Rename advisor MCP server registration.
- [x] Rename four runtime config blocks.
- [x] Sweep live namespace and server-id consumers.

### Phase 3: Verification

- [x] Run advisor package typecheck.
- [x] Run spec-kit MCP typecheck.
- [x] Run launcher smoke.
- [x] Run `opencode mcp list`.
- [x] Run final greps and strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | Advisor MCP package | `npm run typecheck` |
| Typecheck | Spec-kit MCP bridge consumers | `npx tsc --noEmit` |
| Smoke | Launcher can start and initialize DB/scan | `timeout 8 node .opencode/bin/mk-skill-advisor-launcher.cjs` |
| Runtime | OpenCode sees mk server id | `opencode mcp list` |
| Static | Old namespace removed from live surfaces | `rg` exclusions for specs/changelog/dist/node_modules |
| Spec | Packet docs valid | `validate.sh <packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor package dependencies | Internal npm | Available | Typecheck or launcher bootstrap may fail. |
| OpenCode CLI | Local runtime | Available | MCP list may show stale sessions if runtime cache has not reloaded. |
| Parent spec metadata | Documentation | Stale | Resume routing would miss 014/015 without refresh. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typechecks fail due to rename, launcher cannot start, or runtime config cannot load the new id.
- **Procedure**: Revert the single commit, restoring `system_skill_advisor` configs, old launcher filename, old launcher state path, and old live namespace references.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core Rename) -> Phase 3 (Verify) -> Commit
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Rename |
| Core Rename | Setup | Verify |
| Verify | Core Rename | Commit |
| Commit | Verify | Delivery |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 15-30 minutes |
| Core Implementation | Medium | 45-90 minutes |
| Verification | Medium | 20-40 minutes |
| **Total** | | **80-160 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Git diff scoped to whitelist plus parent continuity.
- [x] Old namespace grep is clean outside historical docs.
- [x] Launcher smoke captures mk-prefixed output.

### Rollback Procedure

1. Revert the commit.
2. Restart or reconnect MCP runtime sessions.
3. Verify `system_skill_advisor` is back only if rollback is required.
4. Re-run typechecks and launcher smoke against restored state.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A; launcher state JSON rename is the only persisted identity file.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Runtime Configs
      |
      v
mk-skill-advisor-launcher.cjs
      |
      v
advisor-server.ts registers mk_skill_advisor
      |
      v
Live consumers use mcp__mk_skill_advisor__*
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Launcher rename | Existing launcher source | New binary and state identity | Runtime config updates |
| Runtime configs | New launcher path | MCP registration | MCP list verification |
| Consumer sweep | New server id | Updated allowed-tool namespace | Final grep |
| Parent continuity | Packet scaffold | Active-child routing | Strict validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Launcher rename** - CRITICAL
2. **Runtime config rename** - CRITICAL
3. **Consumer namespace sweep** - CRITICAL
4. **Verification and commit** - CRITICAL

**Total Critical Path**: one atomic implementation pass plus verification.

**Parallel Opportunities**:

- Documentation updates and source/config rename can be reviewed independently before staging.
- Grep inventories can run alongside doc authoring before final edits.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1: Packet scaffolded | Level 3 files exist under `015-mcp-server-rename-mk-skill-advisor`. |
| M2: Runtime identity renamed | Config and source greps show `mk_skill_advisor`. |
| M3: Live consumers cut over | Old namespace grep returns zero live hits. |
| M4: Verification complete | Required commands recorded in `implementation-summary.md`. |
<!-- /ANCHOR:milestones -->
