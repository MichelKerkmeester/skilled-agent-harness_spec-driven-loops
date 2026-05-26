---
title: "Implementation Plan: Full MCP extraction of skill graph library and lifecycle"
description: "Atomic D2a plan for moving skill graph code and startup lifecycle into system_skill_advisor."
trigger_phrases:
  - "013/009/011 plan"
  - "advisor lifecycle transfer"
  - "skill graph clean cut"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction"
    last_updated_at: "2026-05-14T17:45:00Z"
    last_updated_by: "codex"
    recent_action: "D2a implementation and targeted verification complete"
    next_safe_action: "Dispatch D2b (hooks + tests + schemas verification)"
    blockers: []
    completion_pct: 60
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Full MCP extraction of skill graph library and lifecycle

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js MCP servers |
| **Servers** | `system_skill_advisor`, `spec_kit_memory` |
| **Storage** | Advisor package-local SQLite `skill-graph.sqlite` |
| **Testing** | TypeScript, Vitest, grep gates, MCP startup smokes, strict spec validation |

### Overview

D2a performs the clean cut in one commit. The skill graph library moves physically to the advisor package, advisor startup adopts DB init plus scan plus watcher daemon, and memory startup drops every skill graph lifecycle hook.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 answered: Option B, new packet `013/009/011`.
- [x] Council artifact read and promoted to `research/multi-ai-council-deliberation.md`.
- [x] Code-graph extraction precedent and packet 008 handler move pattern reviewed.
- [x] Existing dirty worktree classified; unrelated sibling sessions ignored.

### Definition of Done
- [x] Three skill graph library files moved with `git mv`.
- [x] Advisor imports rewired to package-local skill graph library.
- [x] Advisor startup owns DB init, startup scan, watcher daemon, generation publication, and shutdown close.
- [x] Memory startup has no skill graph init, watcher, scan, generation publication, or DB close.
- [x] Targeted typechecks, targeted Vitest, and MCP startup smokes captured.
- [ ] Strict packet validation passes after doc authoring.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Standalone MCP ownership with sibling-package consumption only where explicitly allowed. D2a removes advisor's dependency on the private spec-kit skill graph library and keeps public tool ids stable.

### Key Components
- **Advisor server**: Owns MCP tool listing, dispatch, caller context, DB init, startup scan, watcher daemon, generation publication, and shutdown.
- **Advisor `lib/skill-graph/`**: Owns SQLite schema, indexing, embeddings, stats, row mapping, and graph queries.
- **Memory context server**: Keeps memory DB startup and file watcher only; it no longer starts or closes skill graph state.

### Data Flow

`advisor-server.ts` initializes `skill-graph.sqlite`, scans `.opencode/skills`, publishes generation metadata, and starts the daemon watcher. `skill_graph_*` tools then read or write through package-local `lib/skill-graph/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Advisor handlers | MCP `skill_graph_*` tool implementations | Rewire to package-local DB/query imports | Targeted Vitest 6/6 passed. |
| Advisor server | MCP entrypoint | Add init, scan, daemon watcher, generation publication, shutdown close | Advisor smoke logs startup scan and daemon active. |
| Memory context server | Former lifecycle owner | Remove skill graph init, watcher, scan, generation publication, DB close | Memory typecheck pass and smoke starts without skill graph init. |
| Spec-kit lib folder | Former DB/query home | Physical `git mv` to advisor | Grep gate and missing old dir. |
| Orphan handler dir | Empty old handler path | Delete | Missing old dir. |

Required inventories:
- Same-class producers: `rg -n "initSkillGraphDb|startupSkillGraphScan|publishSkillGraphGeneration|skillGraphWatcher"`.
- Consumers of moved symbols: `rg -n "system-spec-kit.*lib/skill-graph" .opencode/skills/system-skill-advisor/mcp_server`.
- Matrix axes: advisor startup, memory startup, moved handlers, old paths, packet validation.
- Algorithm invariant: exactly one MCP server writes the advisor skill graph DB.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 3 packet.
- [x] Promote D1 council artifact into `research/`.
- [x] Read required code and precedent docs.

### Phase 2: Implementation
- [x] Move `lib/skill-graph/` from spec-kit to advisor.
- [x] Rewire moved library imports for advisor-local DB filename, integrity helper, and markdown parsing.
- [x] Rewire advisor handlers, tools, auth guard, rebuild path, daemon watcher, and semantic lane imports.
- [x] Move lifecycle ownership into `advisor-server.ts`.
- [x] Remove lifecycle ownership from `context-server.ts`.
- [x] Delete old empty handler directory.

### Phase 3: Verification
- [x] Run advisor typecheck.
- [x] Run memory typecheck.
- [x] Run targeted advisor skill graph Vitest.
- [x] Build both MCP server dist outputs for smoke.
- [x] Run advisor MCP startup smoke.
- [x] Run memory MCP startup smoke.
- [ ] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:critical-path -->
## Critical Path

1. Move the library with history intact.
2. Rewire advisor imports to package-local paths.
3. Adopt lifecycle in advisor startup.
4. Remove memory lifecycle ownership.
5. Verify import, startup, and packet gates before commit.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## Milestones

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M1 Packet scaffold | Complete | Packet docs and research artifact exist. |
| M2 Atomic transfer | Complete | Library moved and lifecycle transferred. |
| M3 Targeted verification | Complete | Typecheck, targeted Vitest, build, and smokes pass/start. |
| M4 Commit | Pending | Final staging and commit after strict validation. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Advisor and memory TypeScript | `npm run typecheck`, `npx tsc --noEmit` |
| Unit | Advisor skill graph dispatch, listing, DB indexing | Vitest targeted files |
| Integration | MCP startup lifecycle | `timeout 5 node ...advisor-server.js`, `timeout 5 node ...context-server.js` |
| Structural | Import and orphan checks | `rg`, `ls` |
| Documentation | Packet contract | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| D1 council verdict | Internal | Available | Locks clean cut and risk mitigations. |
| Packet 008 handler move | Internal | Shipped | Provides advisor handler layout. |
| Existing advisor daemon watcher | Internal | Available | Avoids cloning watcher logic into server entrypoint. |
| Spec-kit `chokidar` install | Internal runtime dependency | Available | Advisor loads watch factory explicitly until package install is split. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor startup fails before MCP connect, memory server fails to start, or grep shows memory still owns lifecycle.
- **Procedure**: Revert the single D2a commit. This restores the old library path and memory-owned lifecycle together, avoiding a partial rollback window.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Council artifact + required reads
  -> source move
  -> advisor lifecycle adoption
  -> memory lifecycle removal
  -> targeted verification
  -> strict packet validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 and required reads | Source move |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 45 minutes |
| Core Implementation | High | 2 hours |
| Verification | Medium | 1 hour |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Single commit boundary planned.
- [x] No proxy window introduced.
- [x] Old memory writer removed in same changeset as advisor writer adoption.

### Rollback Procedure
1. Revert the D2a commit.
2. Rebuild advisor and memory MCP server dist outputs.
3. Run advisor and memory startup smokes.
4. Re-dispatch D2a only after root cause is fixed.

### Data Reversal
- **Has data migrations?** No schema migration.
- **Reversal procedure**: Revert code ownership. Existing SQLite files remain compatible.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
system_skill_advisor/advisor-server.ts
  -> lib/skill-graph/skill-graph-db.ts
  -> lib/daemon/lifecycle.ts
  -> lib/freshness/generation.ts

spec_kit_memory/context-server.ts
  -> memory vector/index lifecycle only
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:adr-refs -->
## L3: ADR REFERENCES

- ADR-001 through ADR-007 map council Q1-Q7.
- ADR-008 records R1-R8 mitigation.
<!-- /ANCHOR:adr-refs -->
