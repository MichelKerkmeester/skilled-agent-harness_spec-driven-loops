---
title: "Implementation Summary: 004 — MCP Tool Surface Removal"
description: "Placeholder implementation summary for phase 004: delete 5 MCP handler files + 4 tool-schema entries + 4 input-schema entries + 4 registration calls. Concrete deliverables filled at completion."
trigger_phrases:
  - "MCP tool surface removal summary"
  - "118 phase 004 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/004-mcp-tool-surface-removal"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded placeholder shell for phase 004"
    next_safe_action: "Await phase 003 shims"
    blockers: ["depends-on:003-script-shim-and-db-relocation"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180041180041180041180041180041180041180041180041180041180040005"
      session_id: "118-004-mcp-tool-surface-removal-summary"
      parent_session_id: null
---
# Implementation Summary: 004 — MCP Tool Surface Removal

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `004-mcp-tool-surface-removal` |
| **Status** | Scaffolded (not yet implemented) |
| **Level** | 3 |
| **Estimated Effort** | ~2 hours (per `plan.md` §L2 effort estimation) |
| **Actual Effort** | To be filled at completion |
| **LOC Removed (estimated)** | ~500 (5 handler files + 4 tool-schema + 4 input-schema + 4 registration) |
| **LOC Removed (actual)** | To be filled at completion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 004 is a delete-only phase. When implemented, it removes the four `deep_loop_graph_*` MCP tools from `system-spec-kit/mcp_server/` entirely, with no backward-compat aliases. The work covers five file deletions, three file edits, and one folder removal across the spec-kit MCP server.

### Files Changed (planned)

| File | Action | Purpose | LOC (estimated) |
|------|--------|---------|-----------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` | Delete | Handler for `deep_loop_graph_convergence` | TBD |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` | Delete | Handler for `deep_loop_graph_upsert` | TBD |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` | Delete | Handler for `deep_loop_graph_query` | TBD |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts` | Delete | Handler for `deep_loop_graph_status` | TBD |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts` | Delete | Handler-registration module for the four above | TBD |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/` | Remove folder | Empty after deletes | n/a |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Drop 4 tool definitions | TBD (lines removed) |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Drop 4 schema entries | TBD (lines removed) |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modify | Drop 4 registration calls and the `handlers/coverage-graph/` import | TBD (lines removed) |
| **Total** | | | **TBD** |

> Placeholder until phase implementation completes; fill `LOC` columns with actual `git diff --numstat` figures from the phase commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three-phase delivery as specified in `plan.md`:

1. **Setup (M1)**: confirm phase 003 `.cjs` script shims exist, scan repo-wide for `deep_loop_graph_*` and `handlers/coverage-graph` references, capture pre-deletion `mcp tools list` baseline, and verify pre-phase `tsc --noEmit` exits 0.
2. **Implementation (M2)**: delete five handler files, remove the now-empty folder, edit three central files to drop the four entries each, clean unused imports, clear the TS build cache.
3. **Verification (M3 + M4)**: `tsc --noEmit` clean, five MCP smoke starts, `mcp tools list` delta confirmed at -4, phase-003 `.cjs` shims confirmed still callable, strict validator exit 0, ADR-001 status flipped to Accepted, checklist items marked with evidence.

To be filled at completion: exact command sequences, tool versions, and any deviations from the plan.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale | Reference |
|----------|-----------|-----------|
| Complete removal of 4 MCP tools | User directive FULL_ISOLATE_NO_MCP; aliases or wrappers leave the MCP layer intact and contradict the directive | ADR-001 (`decision-record.md`) |
| Remove the empty `handlers/coverage-graph/` folder in this phase | Phases 005 and 006 land in the same arc; no need to keep an empty placeholder folder around | spec.md §12 (open question, provisional answer) |
| Hard pre-condition: phase 003 `.cjs` shims must exist | Deleting handlers before the script replacements ship would break consumers | REQ-009 + ADR-001 alternatives table |

### Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Complete removal of 4 MCP tools (no aliases) | Proposed (scaffold) -> Accepted (on completion) | MCP surface shrinks by 4 tools; FULL_ISOLATE_NO_MCP directive realized |

See `decision-record.md` for full ADR documentation.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Details |
|-----------|--------|---------|
| `tsc --noEmit` on `mcp_server/` | TBD | Expect exit 0 (T018) |
| Repo-wide `deep_loop_graph_` symbol grep | TBD | Expect 0 hits inside `mcp_server/` (T019) |
| Repo-wide `handlers/coverage-graph` import grep | TBD | Expect 0 hits anywhere (T016) |
| MCP smoke start (5 runs) | TBD | Expect 5/5 clean starts (T020 + T021) |
| `mcp tools list` delta | TBD | Expect -4 vs pre-phase baseline (T022) |
| Phase-003 `.cjs` shim invocation (4 scripts) | TBD | Expect each script returns expected output (T023) |
| Strict validator | TBD | Expect `validate.sh ... --strict` exit 0 (T024) |

### Concrete file paths exercised in verification

- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/` (absent after delete)
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` (modified)
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` (modified)
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` (modified)
- `.opencode/skills/system-spec-kit/mcp_server/dist/` (cleared then rebuilt)
- `.opencode/skills/deep-loop-runtime/scripts/` (read-only; consumer of phase-003 deliverables)

### NFR Achievement (planned)

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | MCP cold start not regressed by >50ms | TBD | TBD |
| NFR-S01 | No new exposed handlers, ports, or RPC entry points | TBD | TBD |
| NFR-R01 | MCP smoke start 5/5 over five runs | TBD | TBD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Time-window break for `/doctor` + system-code-graph playbook**: between the moment phase 004 lands and the moment phase 006 lands, the `/doctor` diagnostic and the system-code-graph playbook scenario will fail if invoked because their MCP-tool targets no longer exist. Mitigation: phases 004, 005, and 006 are scheduled in the same arc, and the parent `spec.md` phase-map handoff criteria enforce the order.
2. **No alias safety net**: by design, this phase ships no backward-compat aliases. Any forgotten consumer outside the known list (deep-* YAMLs + `/doctor` + playbook) will break at first invocation. Mitigation: repo-wide grep sweeps in T002 + T003 + T019 catch hidden consumers before the deletes land.
3. **Doctor command may need a transient stub between 004 and 006**: optional; if the break window is judged risky, phase 005 or phase 006 can prepend a doctor-side error message instead of a real call until the swap lands. Not in scope for phase 004.
4. **Test deletions deferred**: MCP-specific tests for the deleted tools are not removed in this phase; phase 007 owns the test migration. The deletion of handlers may produce orphan test files until phase 007 lands.
<!-- /ANCHOR:limitations -->
