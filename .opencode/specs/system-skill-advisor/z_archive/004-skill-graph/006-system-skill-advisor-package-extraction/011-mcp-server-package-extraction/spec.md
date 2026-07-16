---
title: "Feature Specification: Full MCP extraction of skill graph library and lifecycle"
description: "Move skill graph DB/query code and startup lifecycle out of spec_kit_memory into the standalone system_skill_advisor MCP server."
trigger_phrases:
  - "013/009/011"
  - "mcp server full extraction"
  - "skill graph lifecycle advisor"
  - "skill graph lib move"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction"
    last_updated_at: "2026-05-14T17:45:00Z"
    last_updated_by: "codex"
    recent_action: "D2a moved skill graph library and lifecycle to advisor"
    next_safe_action: "Dispatch D2b (hooks + tests + schemas verification)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:013009011d2a0000000000000000000000000000000000000000000000000000"
      session_id: "013-009-011-d2a"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Council D1 resolved Q1-Q8 YES; D2a performs the atomic clean cut."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Full MCP extraction of skill graph library and lifecycle

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet completes D2a of the council-recommended clean cut: the skill graph DB/query library and startup lifecycle move from `spec_kit_memory` into `system_skill_advisor`. The public tool ids stay unchanged, but the writer lifecycle now has one owner.

**Key Decisions**: physical `git mv`, advisor-only DB init, advisor-only startup scan/watcher/publication, no proxy window.

**Critical Dependencies**: D2b must still verify hooks, schemas, and broader tests after this atomic source transfer.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Spec Folder** | `011-mcp-server-package-extraction` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`system_skill_advisor` owned the public `skill_graph_*` tools, but the SQLite DB/query library and lifecycle still lived in `system-spec-kit/mcp_server`. That left a dual-writer risk: memory startup initialized and watched the skill graph while advisor exposed the tool surface.

### Purpose

Make `system_skill_advisor` the sole runtime owner of skill graph code and lifecycle while leaving `spec_kit_memory` focused on memory indexing and context serving.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create the Level 3 packet docs and promote the D1 council artifact.
- Move `lib/skill-graph/{skill-graph-db.ts, skill-graph-queries.ts, README.md}` into the advisor package with `git mv`.
- Rewire advisor handlers, daemon, scorer lane, and rebuild path to package-local skill graph imports.
- Move startup DB init, startup scan, watcher lifecycle, generation publication, and DB close into `advisor-server.ts`.
- Remove skill graph init, scan, watcher, generation publication, and DB close from `context-server.ts`.
- Delete the empty `system-spec-kit/mcp_server/handlers/skill-graph/` orphan directory.

### Out of Scope

- Hook rewiring and runtime prompt-submit validation - D2b owns it.
- Tool id or server id renames - council locked both.
- Broad suite cleanup for accepted red baselines - D2b owns broader verification.
- Proxy compatibility windows - council Q7 forbids them for this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/*` | Move/Modify | Advisor-local skill graph DB/query library. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modify | Adopt DB init, startup scan, watcher daemon, generation publication, and shutdown close. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/*.ts` | Modify | Rewire handlers to package-local DB/query imports. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/**` | Modify/Create | Local caller context plus package-local lifecycle imports needed to remove the old skill graph dependency. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Remove skill graph lifecycle ownership. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/` | Delete | Remove empty orphan directory. |
| `.opencode/specs/.../011-mcp-server-package-extraction/**` | Create | Packet docs and promoted council research artifact. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Move skill graph library into advisor. | `git status` shows the three files as renames into `system-skill-advisor/mcp_server/lib/skill-graph/`. |
| REQ-002 | Advisor owns startup lifecycle. | `advisor-server.ts` initializes DB, runs startup scan, publishes generation, starts daemon watcher, and closes DB on shutdown. |
| REQ-003 | Memory server stops writing the skill graph DB. | `context-server.ts` no longer imports or calls skill graph DB init, scan, watcher, generation publication, or DB close. |
| REQ-004 | Reverse skill graph imports are gone. | `rg -l 'system-spec-kit.*lib/skill-graph' .opencode/skills/system-skill-advisor/mcp_server` returns zero matches. |
| REQ-005 | Orphan handler directory is deleted. | `ls .opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph` reports no such file or directory. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Targeted verification passes. | Advisor typecheck, memory typecheck, targeted advisor skill graph Vitest, and both MCP startup smokes pass or start cleanly under timeout. |
| REQ-007 | Council decisions are recorded. | `decision-record.md` contains ADR-001 through ADR-008 mapping Q1-Q7 and R1-R8 mitigation. |
| REQ-008 | D2b handoff remains explicit. | `implementation-summary.md` caps completion at 60 and sets next safe action to D2b. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system_skill_advisor` is the only server that initializes and writes the skill graph DB.
- **SC-002**: `spec_kit_memory` starts without skill graph init or watcher lifecycle.
- **SC-003**: The advisor startup smoke logs startup scan and daemon active evidence.
- **SC-004**: The old spec-kit skill graph lib directory and orphan handler directory are absent.
- **SC-005**: Packet docs strict-validate cleanly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R1 split-brain DB state | High | Remove memory init/write path and close DB only in advisor. |
| Risk | R2 duplicate watchers | High | Remove memory watcher and start only advisor daemon watcher. |
| Risk | R3 inert lifecycle | High | Advisor smoke must log startup scan and daemon active. |
| Risk | R4 stale hook notice | Medium | D2b verifies hooks against advisor freshness after source move. |
| Risk | R5 old test imports | Medium | D2a updates targeted moved-lib imports; D2b owns broad tests. |
| Risk | R6 topology summary regression | Medium | `session-bootstrap.ts` has no direct DB dependency; D2b verifies behavior. |
| Risk | R7 private import confusion | Medium | D2a removes skill graph private imports; D2b handles remaining shared-payload/test seams. |
| Risk | R8 smoke passes while lifecycle inert | Medium | Advisor smoke checks startup scan plus daemon active logs. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Startup scan failures must be non-fatal and diagnostic.
- **NFR-R02**: Shutdown must close the advisor daemon watcher and skill graph DB.

### Maintainability
- **NFR-M01**: Final skill graph library imports in advisor must be package-local.
- **NFR-M02**: No compatibility proxy is allowed for the moved library.

### Operations
- **NFR-O01**: MCP smoke evidence must show advisor lifecycle engagement and memory server startup without skill graph init.

---

## 8. EDGE CASES

### Data Boundaries
- Missing `.opencode/skills`: advisor logs a startup scan skip rather than crashing.
- Empty skill scan: the indexer preserves existing graph rows.

### Error Scenarios
- Watcher dependency unavailable: advisor startup fails loudly instead of silently running without lifecycle.
- Generation publication assertion fails: advisor publishes a stale generation and logs the reason.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Cross-package source move plus lifecycle transfer. |
| Risk | 22/25 | Startup ownership and DB writer boundary. |
| Research | 16/20 | Council artifact and code-graph extraction precedent. |
| Multi-Agent | 4/15 | No spawned agents; sibling sessions are doc-only. |
| Coordination | 12/15 | D2a/D2b split and parallel packet awareness. |
| **Total** | **74/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R1 | Both servers write skill graph state. | High | Medium | Remove memory lifecycle calls in same commit as advisor adoption. |
| R2 | Watchers race generation publication. | High | Medium | Advisor daemon is the only watcher after D2a. |
| R3 | Advisor exposes tools but lifecycle never starts. | High | Medium | Startup smoke checks scan and daemon logs. |
| R4 | Prompt hooks show stale advisor state. | Medium | Medium | D2b verifies hooks after D2a lands. |

---

## 11. USER STORIES

### US-001: Advisor owns skill graph lifecycle (Priority: P0)

**As a** runtime operator, **I want** `system_skill_advisor` to initialize and watch its own skill graph, **so that** `spec_kit_memory` cannot race or mask advisor state.

**Acceptance Criteria**:
1. Given advisor starts, When startup completes, Then logs show DB path, startup scan, and daemon active.

### US-002: Memory no longer writes advisor state (Priority: P0)

**As a** maintainer, **I want** memory startup to avoid skill graph writes, **so that** the MCP boundary is clean and auditable.

**Acceptance Criteria**:
1. Given memory starts, When startup logs are inspected, Then no skill graph init or watcher log appears.

---

## 12. OPEN QUESTIONS

- None for D2a. D2b remains responsible for hooks, schemas, and broad tests.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `research/multi-ai-council-deliberation.md`
