---
title: "Implementation Summary: Hooks Compat And Consumer Cutover"
description: "Implemented the 005 consumer cutover from memory-owned advisor handlers to standalone system_skill_advisor routing with a temporary spec_kit_memory deprecation proxy."
trigger_phrases:
  - "013 009 005 implementation summary"
  - "advisor consumer cutover docs authored"
  - "hooks compat summary"
importance_tier: "critical"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover"
    last_updated_at: "2026-05-14T12:36:34Z"
    last_updated_by: "codex"
    recent_action: "Consumer cutover implemented"
    next_safe_action: "Continue to 006 cleanup"
    blockers:
      - "Legacy hook Vitest suites import removed ../skill_advisor test helpers outside the 005 edit whitelist."
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0130090050000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-005-hooks-compat-consumer-cutover"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Docs choose proxy with deprecation log for one migration window."
      - "Docs choose MCP-level dispatch as the plugin bridge default."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `005-hook-compatibility-consumer-cutover` |
| **Completed** | 2026-05-14 |
| **Level** | 3 |
| **Scope Completed** | Implemented with caveats |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 005 packet now cuts advisor consumers over to the standalone `system_skill_advisor` boundary while preserving public `advisor_*` tool ids. `spec_kit_memory` still exposes `advisor_*` for one migration window, but those handlers are now a deprecated stdio proxy that forwards to `system_skill_advisor` and returns a prompt-safe migration hint if forwarding fails.

### Runtime Cutover

- `.opencode/plugins/spec-kit-skill-advisor.js` now keys cache freshness off the standalone launcher/source/dist paths.
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` now reads the standalone advisor contract and calls `system_skill_advisor.advisor_recommend` over MCP stdio.
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` keeps the `advisorTools` export but changes it into the ADR-003 proxy with a once-per-process deprecation log.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` keeps advisor descriptors as deprecated proxy descriptors for child 006 removal.

### Consumer Surfaces

- Hook source under `mcp_server/hooks/**` already targets `system-skill-advisor`; no old hook-source import remained.
- The canonical Python shim path was corrected to resolve the repo root and standalone built handler/generation paths.
- Doctor assets now point scorer paths and advisor DB/health references at `.opencode/skills/system-skill-advisor/mcp_server`.
- Both install guides describe the dual-MCP topology and the temporary proxy window.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the packet sequence: required ADR/spec/plan/task reads, three required inventory greps, launcher/config verification, bridge/plugin cutover, memory proxy conversion, doctor/install-guide updates, Python shim verification, builds, stdio smokes, and stale-reference inventory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep memory-side `advisorTools` but proxy over stdio | Satisfies ADR-003 compatibility without importing or mutating advisor DB state in the memory MCP process. |
| Keep plugin bridge as subprocess + MCP client | Preserves the OpenCode host isolation and routes through the standalone server boundary. |
| Mark test-suite failures as blocked, not patched | The failing hook/plugin-bridge Vitest files are outside the packet edit whitelist and encode stale pre-005 paths. |
| Sync generated root dist for the existing launcher | The current launcher starts root `dist/context-server.js`; generated nested output was mirrored so smoke tests exercise the patched proxy. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Child 004 availability | PASS: launcher exists; all four runtime configs contain `system_skill_advisor`; standalone launcher printed DB path. |
| Build | PASS: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build`; `npm --prefix .opencode/skills/system-spec-kit run build --workspace=@spec-kit/mcp-server`. |
| Plugin bridge smoke | PASS: direct stdin JSON returned `status:"ok"`, `route:"native"`, `Advisor: stale; use system-spec-kit ...`. |
| Memory MCP startup | PASS: `node dist/context-server.js < /dev/null` reached `Context MCP server running on stdio` with no crash. |
| Advisor proxy smoke | PASS: `spec_kit_memory.advisor_recommend` forwarded through `system_skill_advisor`; stderr contained `[advisor-deprecation]`. |
| Standalone advisor smoke | PASS: `node .opencode/bin/skill-advisor-launcher.cjs < /dev/null` printed the package-local DB path and exited cleanly on closed stdin. |
| Python shim smoke | PASS: `--force-native`, `--force-local`, and `--health` all exited 0 after standalone path correction. |
| Doctor assets | PASS: Ruby YAML parse passed for `doctor_skill-advisor.yaml` and `doctor_update.yaml`. |
| Hook/plugin tests | PARTIAL: OpenCode plugin Vitest passed 30/30; four hook Vitest suites failed before tests ran because they import deleted `../skill_advisor/...` helpers; standalone plugin-bridge Vitests compute repo root one directory too high. |
| Stale-reference grep | PASS with caveat: post-edit live non-doc/non-test count is 3, limited to the proxy deprecation string and historical stress config excludes. |
| Strict spec validation | PASS: `validate.sh .../005-hook-compatibility-consumer-cutover --strict` exited 0 with 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Test fixtures remain stale.** The hook Vitest suites and standalone plugin-bridge tests need a child-006 or separately scoped test-fixture update because they reference removed old paths and were not in the 005 whitelist.
2. **Doctor full mutation route not executed.** The safe equivalent was YAML parse plus target grep; `/doctor:update --cleanup-legacy=false` was not run because it can mutate DB state.
3. **Proxy remains temporary.** Child 006 should remove memory-side advisor descriptors/dispatch and clean historical stress config excludes.
<!-- /ANCHOR:limitations -->
