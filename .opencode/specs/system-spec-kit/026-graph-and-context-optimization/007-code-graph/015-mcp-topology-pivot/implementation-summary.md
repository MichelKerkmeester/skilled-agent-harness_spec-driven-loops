---
title: "MCP topology pivot execution"
description: "Execution summary populated during ADR-002 standalone MCP topology pivot; final validation metrics updated after verification."
trigger_phrases:
  - "mcp topology pivot"
  - "system code graph standalone mcp"
  - "ADR-002 code graph topology"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/015-mcp-topology-pivot"
    last_updated_at: "2026-05-14T13:25:00Z"
    last_updated_by: "claude"
    recent_action: "Repaired build, fixed vitest regressions, reconciled docs"
    next_safe_action: "Commit 014 slice to main; then user runtime restart"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140007"
      session_id: "007-mcp-topology-pivot"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: MCP topology pivot execution

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Updated** | 2026-05-14T09:13:21Z |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Authored `decision-record.md` ADR-002 superseding ADR-001 Q3 while preserving ADR-001 Q1/Q2/Q4-Q8 and Constraint A.
- Recalibrated 6 historical 014 child packets by updating only `graph-metadata.json` and `implementation-summary.md`.
- Created `.opencode/bin/system-code-graph-launcher.cjs` and `.opencode/skills/system-code-graph/mcp_server/index.ts`.
- Migrated 10 code-graph MCP tool schemas into `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` and removed all remaining code-graph schema registrations from spec-kit memory.
- Moved or confirmed ownership for 13 stress-test files, 1 plugin bridge, and 7 pure internal code-graph external tests; 2 cross-subsystem contract tests stayed in spec-kit.
- Updated `opencode.json`, command MCP grants, `doctor/update.md`, system-code-graph `SKILL.md`/`README.md`, parent 014 metadata, and the 007-code-graph phase map.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation used the flattened layout as canonical: code lives at `.opencode/skills/system-code-graph/mcp_server/{lib,handlers,tools,tests}/`. Spec-kit continues to consume code-graph libraries by direct in-process imports where needed, while MCP callers now use the standalone `mcp__system_code_graph__*` namespace.

The stale stub database at `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite` (and its WAL/SHM sidecars) has been removed — `ls` at handover-followup time confirms the directory entries no longer exist. The live 53 MB index lives at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`. `opencode.json` registers `system_code_graph` after `spec_kit_memory`; code-graph index env defaults moved to the standalone server entry with false end-user defaults. The new MCP child has not yet been spawned because the running OpenCode/Claude Code runtime started before `opencode.json` was updated; restarting the runtime (Cmd-Q + relaunch) will load the new entry. A first attempt by the launcher (`.opencode/bin/system-code-graph-launcher.cjs`) at 2026-05-14T09:34Z failed (`npx tsc` shadowed by zsh completion + sibling node_modules missing `@modelcontextprotocol/sdk`); a follow-up session restored the SDK by direct copy from `mcp-code-mode/mcp_server/node_modules/`, ran typecheck/build cleanly, and created the launcher's redirect stub at `mcp_server/dist/index.js` → `../../dist/system-code-graph/mcp_server/index.js`. On next runtime restart the launcher's `artifactsReady()` check passes (stub exists) and the child spawns directly without re-running the failing `npm install` chain.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Standalone clean MCP | User reversed ADR-001 Q3; legacy bridge adds no value while tool IDs stay stable. |
| Preserve direct imports | ADR-001 Q5 remains in force for handlers/hooks/session consumers. |
| Preserve tool IDs | ADR-001 Q4 remains in force. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 007 strict validate | exit 0 |
| 014 recursive strict validate | exit 0 |
| system-spec-kit typecheck (post-SDK-restore) | exit 0 |
| system-code-graph typecheck (post-SDK-restore) | exit 0 |
| system-code-graph build → dist/ | exit 0; `mcp_server/dist/index.js` redirect stub created |
| system-code-graph full Vitest | exit 0; 395 passed / 9 skipped (40 files); 6 stale-path bugs fixed post-handover |
| system-spec-kit tool-input-schema + review-fixes Vitest (014-touching) | exit 0; 74 passed; 3 dead describe-blocks removed (code_graph, ccc, single verify it); tool count 55→49 |
| system-spec-kit P1 stress tests (w10-degraded-readiness + gate-d-benchmark-session-resume) | exit 0; 2 passed |
| spec-kit remaining code-graph schema grep | 0 |
| system-code-graph migrated schema grep | 10 |

```text
PACKETS_001_006_RECALIBRATED=6
PACKET_007_VALIDATE=0
LAUNCHER_CREATED=yes
MCP_ENTRYPOINT_CREATED=yes
TOOL_SCHEMAS_MIGRATED_COUNT=10
TOOL_SCHEMAS_REMOVED_FROM_SPEC_KIT=10
OPENCODE_JSON_UPDATED=yes
STRESS_TESTS_MOVED=13
PLUGIN_BRIDGE_MOVED=yes
EXTERNAL_TESTS_MOVED=7
EXTERNAL_TESTS_KEPT=2
AGENT_TOOL_GRANTS_UPDATED=2
DOCTOR_UPDATE_MD_FIXED=yes
STUB_DB_DELETED=yes (files removed before this session; verified via ls)
PARENT_014_MARKED_COMPLETE=yes
SEVEN_PARENT_PHASE_MAP_UPDATED=yes
TYPECHECK_EXIT=0
VITEST_CODE_GRAPH_PASS=395
VITEST_CODE_GRAPH_FAIL=0
VITEST_SIBLING_014_TOUCHING_PASS=74
VITEST_SIBLING_014_TOUCHING_FAIL=0
STRESS_TEST_P1_PATCH_PASS=2
RECURSIVE_VALIDATE_EXIT=0
LAUNCHER_FIRST_ATTEMPT_FAILED=yes_at_2026-05-14T09:34Z
LAUNCHER_NPM_INSTALL_BLOCKED_BY_EPERM=yes_huggingface_deep_path
SDK_RESTORED_BY_DIRECT_COPY=yes_from_mcp-code-mode_v1.27.1
DIST_REDIRECT_STUB_CREATED=yes
MCP_CHILD_RUNNING=no_pending_runtime_restart
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

MCP children must restart before the new system_code_graph server appears to clients.
<!-- /ANCHOR:limitations -->
