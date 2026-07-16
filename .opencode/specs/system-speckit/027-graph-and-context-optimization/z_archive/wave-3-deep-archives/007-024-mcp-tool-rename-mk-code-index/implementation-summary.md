---
title: "Implementation Summary: MCP Tool Rename: mk-code-index"
description: "Renamed the standalone code-graph MCP server from system_code_graph to mk-code-index across runtime configs, launcher filename/state, MCP server metadata, and live client namespace references."
trigger_phrases:
  - "010 mcp tool rename mk code index summary"
  - "mk-code-index rename complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-024-mcp-tool-rename-mk-code-index"
    last_updated_at: "2026-05-14T17:29:04Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-010"
    recent_action: "Implemented MCP server rename"
    next_safe_action: "Restart MCP children after merge"
    blockers: []
    key_files:
      - ".claude/mcp.json"
      - "opencode.json"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-010-mcp-tool-rename-mk-code-index"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-mcp-tool-rename-mk-code-index |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The standalone code-graph MCP server identity now uses the operator-preferred name `mk-code-index`. Runtime config keys use `mk_code_index`, and MCP client-facing tool prefixes use `mcp__mk_code_index__*`.

The stable code-graph tool names remain unchanged: `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `ccc_status`, `ccc_reindex`, and `ccc_feedback`.

### Before-State Capture

| Surface | Before |
|---------|--------|
| `.claude/mcp.json` | `mcpServers.system_code_graph` pointed at `.opencode/bin/system-code-graph-launcher.cjs`. |
| `opencode.json` | `mcp.system_code_graph` pointed at `.opencode/bin/system-code-graph-launcher.cjs`. |
| Launcher | File and stderr prefix used `system-code-graph-launcher`; state files used `.system-code-graph-launcher.*`. |
| MCP entrypoint | `new Server({ name: 'system_code_graph' })`. |
| Client namespace refs | Live grants and hints used `mcp__system_code_graph__*`. |
| Launcher state | `.system-code-graph-launcher.json` contained command `system-code-graph-launcher`. |

### Files Touched

| File | Action | Purpose |
|------|--------|---------|
| `.claude/mcp.json` | Modified | Rename MCP key to `mk_code_index`, update launcher path, update namespace note. |
| `opencode.json` | Modified | Rename MCP key to `mk_code_index`, update launcher path, update namespace note. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Renamed/modified | New launcher filename, stderr prefix, state file names, and command metadata. |
| `.opencode/bin/system-code-graph-launcher.cjs` | Deleted | Old launcher filename removed. |
| `.opencode/commands/doctor/_routes.yaml` | Modified | Update doctor route MCP tool grants to `mcp__mk_code_index__*`. |
| `.opencode/commands/doctor/update.md` | Modified | Update command allowed-tools frontmatter to `mcp__mk_code_index__*`. |
| `.opencode/skills/system-code-graph/README.md` | Modified | Update server and namespace documentation. |
| `.opencode/skills/system-code-graph/SKILL.md` | Modified | Update skill continuity and MCP namespace references. |
| `.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json` | Renamed/modified | Preserve launcher state under the new state filename and command value. |
| `.opencode/skills/system-code-graph/mcp_server/database/.system-code-graph-launcher.json` | Deleted | Old launcher state filename removed. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Modified | Advertise server name `mk-code-index`. |
| `.opencode/skills/system-code-graph/mcp_server/index.js` | Modified | Keep checked-in JS companion aligned with `mk-code-index`. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | Modified | Update server ownership comment. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.js` | Modified | Keep checked-in JS companion comment aligned. |
| `.opencode/skills/system-code-graph/mcp_server/tools/index.ts` | Modified | Update unknown-tool error label. |
| `.opencode/skills/system-code-graph/mcp_server/tools/index.js` | Modified | Keep checked-in JS companion error label aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Update maintainer-mode launcher filename reference. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Update structural-routing MCP namespace hints. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Update memory tool descriptions and namespace migration comment. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modified | Update standalone server ownership comments. |
| `010-mcp-tool-rename-mk-code-index/` | Created | Track this rename and verification evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation kept the rename at the MCP server boundary. Config keys use the underscore form expected by MCP client config surfaces. The server itself advertises `mk-code-index`, and all live client-facing references use the normalized namespace prefix `mcp__mk_code_index__*`.

Historical packet docs under children `001` through `009` were not edited.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the skill folder as `.opencode/skills/system-code-graph/` | The user explicitly excluded folder renaming. |
| Keep `code_graph_*` and `SPECKIT_CODE_GRAPH_*` unchanged | These are tool/env namespaces, not the MCP server identity. |
| Update doctor/spec-kit runtime hints | They are live-facing tool namespace references, not historical docs. |
| Leave live MCP children running | The task forbids killing them; restart is an operator action after merge. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-check for existing `010-*` child | PASS, no matching folder returned. |
| `.claude/settings.local.json` namespace pattern read | PASS, observed `mcp__sequential_thinking__sequentialthinking`, matching MCP server key prefix behavior. |
| `npx tsc` in `.opencode/skills/system-code-graph` | EXPECTED FAIL in network-disabled runtime; attempted registry lookup for `tsc` and exited 1 with `ENOTFOUND registry.npmjs.org`. |
| `node node_modules/typescript/bin/tsc` in `.opencode/skills/system-code-graph` | PASS, exit 0. Dist regenerated under `.opencode/skills/system-code-graph/dist/system-code-graph/mcp_server/` with `mk-code-index` in emitted JS. |
| `timeout 8 node .opencode/bin/mk-code-index-launcher.cjs </dev/null 2>&1 \| head -10` | PASS, exit 0. Output used `[mk-code-index-launcher]` prefix and contained no stale-prefix or missing-module errors. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/024-mcp-tool-rename-mk-code-index --strict` | PASS, exit 0 with 0 errors and 0 warnings. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph` | PASS, exit 0 with 59 existing non-blocking warnings. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/commands/doctor` | PASS, exit 0 with 1 existing non-blocking warning. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server` | PASS, exit 0 with 6 existing non-blocking warnings. |
| `git add -- <intended files>` | BLOCKED, sandbox denied `.git/index.lock` with `Operation not permitted`; commit not created. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime restart still required.** Existing MCP children were not killed, so live sessions need a restart to pick up `mk_code_index`.
2. **Historical docs remain historical.** Existing shipped packet docs can still mention `system_code_graph` as past-state evidence.
3. **Exact `npx tsc` is blocked by npm resolution.** The local compiler exits 0, but the requested `npx tsc` command tries to fetch the `tsc` package because this checkout's `.bin/tsc` shim resolves through a missing sibling dependency.
<!-- /ANCHOR:limitations -->
