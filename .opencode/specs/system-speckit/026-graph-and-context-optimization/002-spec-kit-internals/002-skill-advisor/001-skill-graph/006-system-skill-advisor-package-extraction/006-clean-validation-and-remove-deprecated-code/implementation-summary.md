---
title: "Implementation Summary: Validate advisor extraction and remove deprecated bridge"
description: "Execution ledger for child 006 final cleanup: memory proxy removed, stale live docs swept, standalone advisor probe passed, package-local validation blocked."
trigger_phrases:
  - "013/009/006 implementation summary"
  - "advisor cleanup implementation ledger"
  - "system_skill_advisor final validation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Validation cleanup landed; P0 tests blocked"
    next_safe_action: "Fix system-skill-advisor package-local Vitest/path failures, then rerun final matrix"
    blockers:
      - "Package-local system-skill-advisor Vitest failed: 153 passed / 71 failed / 38 files."
      - "Hook smoke failed one settings-driven suite because expected Claude settings file is absent."
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0130090060000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-006-validation-cleanup"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "ADR-003 operator confirmation was pre-granted in the 2026-05-14 dispatch."
      - "Memory MCP advisor proxy removal was applied and direct tool exposure now returns no advisor_* tools."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Validate Advisor Extraction and Remove Deprecated Bridge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `006-clean-validation-and-remove-deprecated-code` |
| **Status** | Implemented-with-blockers |
| **Level** | 3 |
| **Created** | 2026-05-14 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Child 006 executed the final cleanup allowed by scope: the temporary `spec_kit_memory` advisor proxy was removed, bridge-only tool descriptors were deleted from memory MCP exposure, migration-window deprecation text was removed from install guides, and stale live references to the retired old advisor path were rewritten.

### Cleanup Results

| Surface | Result | Evidence |
|---------|--------|----------|
| Memory MCP proxy | PASS | `tools/index.ts` no longer exports `advisorTools`; proxy helpers and dispatcher entry were deleted. |
| Memory MCP tool schemas | PASS | `tool-schemas.ts` bridge descriptors were deleted; `TOOL_DEFINITIONS.filter(t => t.name.startsWith('advisor_'))` returned `[]`. |
| Memory MCP smoke | PASS | Direct `spec_kit_memory` tools/list returned 45 tools and `advisorTools: []`. |
| Stale old path docs | PASS | `rg -n "mcp_server/skill_advisor" .opencode --glob '!**/dist/**' --glob '!**/specs/**' --glob '!**/node_modules/**'` returned 0. |
| Install guides | PASS | Both relevant guides now describe `spec_kit_memory` plus standalone `system_skill_advisor`; deprecated proxy text is gone. |
| Standalone advisor direct probe | PASS | Direct MCP `tools/list` returned `advisor_rebuild`, `advisor_recommend`, `advisor_status`, `advisor_validate`; `advisor_recommend` returned status `ok` with one recommendation. |
| DB path | PASS | `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` exists; `.opencode/skills/system-skill-advisor/database/skill-graph.sqlite` does not. |

### Inventory Counts

| Inventory | Before | After |
|-----------|--------|-------|
| `spec_kit_memory.advisor_*` non-markdown callers | 0 callers (1 proxy deprecation constant hit) | 0 |
| Old `mcp_server/skill_advisor` live hits | 159 | 0 |
| Invalid second-server warnings | 0 | 0 |
| Cluster C files swept | 44 | n/a |
| Historical refs annotated | 0 | Specs were left untouched; live docs were rewritten. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was delivered in cleanup clusters:

1. Proxy code and bridge descriptors were deleted from `system-spec-kit/mcp_server`.
2. TypeScript was rebuilt with `tsc --build --force`; the legacy flat runtime `dist` files were synced from the freshly built nested output because the launcher still executes the flat `dist/context-server.js` tree.
3. Install guides and live stale docs were rewritten to point at `.opencode/skills/system-skill-advisor/mcp_server/`.
4. Direct MCP probes verified standalone advisor availability and memory MCP advisor absence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove proxy despite advisor package tests already failing | ADR-003 was satisfied: zero caller evidence plus pre-granted operator confirmation. The failing tests are in the forbidden standalone advisor surface, not caused by proxy deletion. |
| Rewrite live old-path references instead of retaining historical callouts | ADR-004 says live operator docs must not point users back to the old path. Spec packet history was left untouched. |
| Mark packet blocked, not complete | P0 package-local Vitest is red and the hook smoke matrix has a failing runtime-settings suite. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Required reading | PASS: ADR-001, child 006 spec/plan/decision/tasks, proxy code, tool schemas, install guides, and stale-doc samples read. |
| Package-local Vitest | FAIL: `npm test` from `system-skill-advisor/mcp_server` discovered 38 files / 224 tests; 153 passed, 71 failed. Failures include missing `chokidar`, missing package-local paths, parity regression, and absent Claude settings fixture. |
| Python parity | PASS with degraded status: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --health` exited 0 and reported `status: degraded` because SQLite was unavailable to the Python fallback. |
| Hook smoke | FAIL: `vitest run tests/hooks` from system-spec-kit produced 5 passing files and 1 failing settings-driven suite due absent `/Users/michelkerkmeester/MEGA/Development/Code_Environment/.claude/settings.local.json`. |
| Runtime OpenCode | PASS: `opencode mcp list` showed connected `spec_kit_memory` and `system_skill_advisor`. |
| Runtime Codex | PASS: `codex mcp list` showed enabled `spec_kit_memory` and `system_skill_advisor`. |
| Runtime Claude | INCONCLUSIVE: repo `.claude/mcp.json` lists both servers, but `claude mcp list` did not show `system_skill_advisor` in the returned rows. |
| Runtime Gemini | INCONCLUSIVE: repo `.gemini/settings.json` lists both servers, but `gemini mcp list` returned no usable rows. |
| Direct MCP advisor probe | PASS: standalone server listed all four advisor tools and `advisor_recommend` returned `status: ok`. |
| Memory MCP absence probe | PASS: memory server direct tools/list returned no `advisor_*` tools. |
| Build | PASS: `../node_modules/.bin/tsc --build --force` exited 0 from `system-spec-kit/mcp_server`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P0 package-local Vitest is failing.** The failures are in `.opencode/skills/system-skill-advisor/mcp_server/`, which this dispatch explicitly forbids editing.
2. **Hook smoke has one failing suite.** The failing suite expects a Claude settings file outside this repo root.
3. **Runtime CLI probes are mixed.** Direct MCP probes are green, OpenCode/Codex list both servers, Claude/Gemini CLI listing remains inconclusive.
<!-- /ANCHOR:limitations -->
