---
title: "Feature Specification: MCP daemon reliability (socket-dir, lifecycle, build-safety, embedding-provider memory)"
description: "Phase parent consolidating the MCP daemon reliability work: socket-dir startup robustness, the daemon-failure root-cause research + hardened roadmap, build-safety, and the embedding-provider memory/supervision/bridge fixes that keep mk-spec-memory and mk_code_index healthy and self-recovering."
trigger_phrases:
  - "mcp daemon reliability"
  - "007-mcp-daemon-reliability phase parent"
  - "daemon socket lifecycle build provider"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability"
    last_updated_at: "2026-05-28T20:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Consolidated daemon-reliability phases under 007; authored parent map for 7 phases"
    next_safe_action: "Perfect + implement phases 005/006/007 (provider-dispose, watchdog, bridge)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000007"
      session_id: "026-007-mcp-daemon-reliability-parent"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions:
      - "Execution order: socket-dir -> code-graph-scan -> research -> build -> provider-dispose -> watchdog -> bridge"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: MCP daemon reliability (socket-dir, lifecycle, build-safety, embedding-provider memory)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates independently; the daemons stay healthy and self-recover (no manual /mcp reconnect loop) once 005-007 ship |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mk-spec-memory and mk_code_index MCP daemons fail repeatedly during sessions: a missing `/tmp` socket dir crashes startup, the embedding model RSS grows until the OS OOM-kills the process, nothing auto-restarts a dead daemon, reconnects bridge to a dead socket, and rebuilding the server wipes the live `dist/` out from under it. Each forces a manual `/mcp` reconnect.

### Purpose
Make the daemons reliable end to end — robust startup, bounded memory with supervised recovery, liveness-aware reconnect, and rebuild-safe builds — so they stay up and self-heal without operator intervention. Detailed root-cause analysis and the hardened, adversarially-verified fix roadmap live in phase `003-daemon-reliability-research`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child-phase manifest for the daemon-reliability work.
- Per-phase implementation details (in the child folders).

### Out of Scope
- Detailed per-phase implementation plans at the parent level.
- The upstream embedding-backlog investigation (`../003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation`), which remains in place and is referenced by phase 003.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modify | 001 | Canonicalize missing socket dir |
| (operational scan) | N/A | 002 | Populate the empty code graph |
| (research only) | N/A | 003 | Root cause + hardened roadmap |
| `mcp_server/package.json` | Modify | 004 | Non-destructive build |
| `shared/embeddings*.ts`, `mcp_server/lib/embedders/*` | Modify | 005 | Provider dispose + native-run gate |
| `bin/mk-spec-memory-launcher.cjs` | Modify | 006 | RSS watchdog + graceful-exit supervision |
| `bin/lib/launcher-ipc-bridge.cjs` | Modify | 007 | Liveness-probe + reap-aware bridge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-ipc-socket-dir-canonicalize/ | Canonicalize a missing IPC socket dir so reboot-cleared /tmp dirs don't crash mk_code_index startup (RC-4-adjacent) | Complete |
| 2 | 002-code-graph-initial-scan/ | Run a full code_graph_scan to populate the empty code graph + verify readiness | Pending (needs mk_code_index reconnect) |
| 3 | 003-daemon-reliability-research/ | Root-cause the recurring daemon failures; deliver the ranked, adversarially-verified fix roadmap | Complete (research) |
| 4 | 004-nondestructive-build/ | Stop the build wiping the live dist (RC-4) so rebuilds don't crash the running daemon | Complete |
| 5 | 005-provider-dispose/ | Dispose the embedding provider's native ONNX session on swap with a native-run-lifetime gate (RC-1 / F2′) | Planned |
| 6 | 006-graceful-exit-watchdog/ | Launcher RSS-ceiling watchdog + graceful-exit supervision (no transparent respawn) (RC-1/RC-2 / F1′) | Planned |
| 7 | 007-bridge-liveness-reap/ | Liveness-probe-before-bridge + reap-aware respawn on a dead socket (RC-3 / F3′) | Planned |

| 30 | 030-client-side-reconnect-survival/ | [Phase 30 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 003-daemon-reliability-research | 005-provider-dispose | Hardened roadmap + required guards finalized | research.md §6 complete |
| 005-provider-dispose | 006-graceful-exit-watchdog | Native-run-gate dispose lands so the watchdog's recycle can't trigger a use-after-free | dispose tests pass |
| 006-graceful-exit-watchdog | 007-bridge-liveness-reap | Daemon child pid recorded in the lease (precondition for reap-aware bridge) | lease carries child pid |
| 029-cross-session-kill-scoping | 030-client-side-reconnect-survival | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should 005-007 land as one release (they share the child-pid lease + dispose-gate invariants) or sequentially behind feature flags?
- Does verification of 005-007 require a dedicated live-daemon harness (kill/OOM/respawn/reconnect cycles)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md` (026-graph-and-context-optimization).
- **Upstream investigation**: `../003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation` (embedding backlog; referenced by phase 003).
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
