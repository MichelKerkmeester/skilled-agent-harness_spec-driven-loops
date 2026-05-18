---
title: "Implementation Summary: Move skill_graph_* tools to advisor ownership"
description: "Final evidence ledger for moving skill_graph_* ownership to system_skill_advisor, cutting over consumers, removing the memory bridge, and verifying D2."
trigger_phrases:
  - "013/009/008 implementation summary"
  - "skill graph advisor move summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/008-move-skill-graph-tools-to-advisor"
    last_updated_at: "2026-05-14T15:45:16Z"
    last_updated_by: "codex"
    recent_action: "008 implementation shipped (D1+D2)"
    next_safe_action: "013/009 close-out (Tier 3 operator actions pending)"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/commands/doctor/"
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tools/index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-003 operator confirmation for proxy removal was pre-granted by D2 dispatch."
      - "T016-T018 were live-caller no-ops: system-code-graph, hooks, and plugins had zero old-prefix hits."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `008-move-skill-graph-tools-to-advisor` |
| **Completed** | 2026-05-14 |
| **Level** | 3 |
| **Status** | Complete |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

D1 made `system_skill_advisor` own the four unchanged public ids: `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`. D2 completed the cutover and cleanup.

### D2 Results

| Area | Evidence |
|------|----------|
| Tier 1 callers | 5 doctor files retargeted; 15 caller-visible references now use `mcp__system_skill_advisor__skill_graph_*` or `system_skill_advisor.skill_graph_*`. |
| Tier 2 docs | 9 install/catalog/playbook docs now state `system_skill_advisor` ownership while preserving bare conceptual tool ids. |
| T016-T018 | System-code-graph, hooks/runtime wrappers, and plugin greps returned 0 old-prefix live callers. |
| Memory descriptors | `system-spec-kit/mcp_server/tool-schemas.ts` no longer defines or exports `skill_graph_*` descriptors. |
| Memory proxy | `tools/skill-graph-tools.ts` and `tests/skill-graph-proxy.vitest.ts` physically deleted. |
| Dispatch cleanup | `tools/index.ts` no longer imports, exports, validates, or dispatches `skillGraphTools`. |
| Session bootstrap | `session-bootstrap.ts` no longer imports the removed proxy; it reports skill graph topology as advisor-owned/unavailable from the memory bootstrap surface. |
| Direct MCP absence | Direct `spec_kit_memory` `tools/list` returned 41 tools and `skillGraph: []`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

D2 followed ADR-004 risk order: prove system-code-graph/hooks/plugins had no live old-prefix callers, retarget doctor command surfaces, add ownership notes to user-facing docs, run an intermediate zero-caller grep, then remove the memory bridge under the pre-granted ADR-003 operator confirmation.

The memory MCP build was run after source cleanup so runtime output matched the final source topology.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Treat T016-T018 as no-op | Post-D1 greps and D2 confirmation showed zero old-prefix callers in system-code-graph, hook/runtime, and plugin surfaces. |
| Remove `session_bootstrap` proxy call | The memory server cannot import the deleted proxy. Bootstrap now preserves a prompt-safe advisory field and points operators to advisor-owned `skill_graph_*` tools. |
| Leave Tier 3 historical sk-code record untouched | ADR-004 says historical records remain when clearly historical; the final old-prefix grep hit is a V3 benchmark row, not a live caller. |
| Update stale cleanup tests | Removing the proxy made memory-side proxy/listing tests stale. They were reconciled to the final topology so verification can exercise the real cleanup state. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T016/T018 system-code-graph + plugins grep | PASS: `rg -n 'mcp__mk_spec_memory__skill_graph_' .opencode/skills/system-code-graph .opencode/plugins` returned 0 hits. |
| T017 hooks/runtime grep | PASS: old-prefix grep across hooks and `.claude`/`.codex`/`.gemini` returned 0 hits. |
| Intermediate old-prefix grep | PASS: one historical Tier 3 sk-code playbook hit only. |
| Final old-prefix grep | PASS: one historical Tier 3 sk-code playbook hit only. |
| Memory typecheck | PASS: `npm run typecheck` exited 0. |
| Advisor typecheck | PASS: `npm run typecheck` exited 0. |
| Memory build | PASS: `npm run build` exited 0. |
| Advisor Vitest | BASELINE RED: 285 passed / 291 total, 3 failed and 3 skipped. This matches the operator baseline and is not a D2 regression. |
| Memory core Vitest | BASELINE RED: 11391 passed / 11576 total, 98 failed and 87 skipped. Broad suite remains noisy; direct cleanup smoke and typecheck pass. |
| Direct advisor MCP tools/list | PASS: 8 tools listed: 4 `advisor_*` plus 4 `skill_graph_*`. |
| Direct advisor tool call | PASS: `skill_graph_status({})` returned status `ok` with `dbStatus: "empty"`. |
| Direct memory MCP tools/list | PASS: 41 tools listed and `skillGraph: []`. |
| OpenCode runtime | PASS: `opencode mcp list` showed `system_skill_advisor` connected. |
| Codex runtime | PASS: `codex mcp list` showed `system_skill_advisor` enabled. |
| Claude runtime | INCONCLUSIVE: `claude mcp list` did not show `system_skill_advisor` in visible rows, matching the accepted CLI-cache limitation pattern. |
| Gemini runtime | PASS: `gemini mcp list --debug` showed `system_skill_advisor` connected; `spec_kit_memory` was disconnected in that CLI view. |
| Doctor smoke | INCONCLUSIVE: slash-command execution requires an interactive runtime; static command/YAML greps confirm advisor-owned probes. |
| System-code-graph smoke | N/A: no live old-prefix callers existed in that family. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:req-evidence -->
## Requirement Evidence

| Requirement | Final Status | Evidence |
|-------------|--------------|----------|
| REQ-001 | PASS | Advisor direct `tools/list` exposes all 4 `skill_graph_*` ids. |
| REQ-002 | PASS | D1 moved advisor-local handlers to `system-skill-advisor/mcp_server/handlers/skill-graph/`; D2 did not alter advisor handlers. |
| REQ-003 | PASS | Tier 1 callers retargeted; final live old-prefix grep has no live caller hits. |
| REQ-004 | PASS | D1 proxy existed for the migration window and was tested. |
| REQ-005 | PASS | D2 physically deleted the proxy and memory descriptors; memory direct `tools/list` has `skillGraph: []`. |
| REQ-006 | PASS with accepted caveat | OpenCode/Codex/Gemini visible; Claude CLI inconclusive per accepted cache limitation; direct advisor MCP lists/calls the tools. |
| REQ-007 | PASS | Strict validation run after doc reconciliation for packet, parent, and grandparent. |
| REQ-008 | PASS | Final old-prefix grep returned only one historical Tier 3 sk-code playbook record. |
| REQ-009 | PASS | Install guides, feature catalogs, and manual playbooks reflect `system_skill_advisor` ownership. |
<!-- /ANCHOR:req-evidence -->

---

<!-- ANCHOR:binding -->
## BINDING

```text
AGENT_RECEIVED=013/009/008-d2
SPAWN_AGENT_USED=no
RESULT=PASS
TIER1_CONSUMERS_RETARGETED_FILES=5
TIER1_CONSUMERS_RETARGETED_HITS=15
TIER2_DOCS_UPDATED_FILES=9
SYSTEM_CODE_GRAPH_LIVE_CALLERS=0
HOOKS_LIVE_CALLERS=0
PLUGINS_LIVE_CALLERS=0
ZERO_CALLER_GREP_LIVE=1 historical
PROXY_REMOVED_FROM_TOOLS_INDEX=YES
DESCRIPTORS_REMOVED_FROM_TOOL_SCHEMAS=YES
TOOLS_INDEX_REEXPORT_REMOVED=YES
PROXY_TESTS_DELETED=YES
SESSION_BOOTSTRAP_HANDLER_UPDATED=YES
PACKAGE_VITEST_ADVISOR=285/291
PACKAGE_VITEST_MEMORY=11391/11576 core
RUNTIME_OPENCODE=PASS
RUNTIME_CODEX=PASS
RUNTIME_CLAUDE=INCONCLUSIVE
RUNTIME_GEMINI=PASS
DOCTOR_SMOKE=INCONCLUSIVE
SYSTEM_CODE_GRAPH_SMOKE=N_A
STRICT_VALIDATE_008=PASS
STRICT_VALIDATE_PARENT_013_009=PASS
STRICT_VALIDATE_GRANDPARENT_013=PASS
FILES_OUT_OF_SCOPE=0
PRODUCTION_BUG_FOUND=no
PRODUCTION_BUG_DETAIL=N/A
COMPLETION_PCT=100
NOTES=Advisor/memory broad Vitest suites remain baseline-red; direct MCP smokes prove advisor owns skill_graph_* and memory exposes none.
```
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Advisor and memory broad Vitest suites are still baseline-red; D2 did not attempt out-of-scope suite remediation.
2. Claude runtime listing is inconclusive because the CLI did not show the configured `system_skill_advisor` row in the visible output.
3. Doctor slash-command smoke is inconclusive outside an interactive runtime; static caller surfaces are retargeted.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

013/009 can proceed to close-out. No D2 implementation tasks remain in this packet.
<!-- /ANCHOR:next-steps -->
