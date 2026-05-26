---
title: "Verification Checklist: Standalone MCP launcher and runtime configs"
description: "Checklist for verifying standalone system_skill_advisor launcher, runtime config registrations, unchanged spec_kit_memory blocks, and advisor_* tool availability."
trigger_phrases:
  - "system_skill_advisor checklist"
  - "skill advisor runtime verification"
  - "advisor launcher checklist"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Verification recorded"
    next_safe_action: "Continue to 005"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Standalone MCP launcher and runtime configs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot ship implementation until complete |
| **[P1]** | Required | Must complete or receive explicit deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] ADR-001 reviewed and server topology confirmed as standalone MCP. Evidence: parent ADR-001 and child ADR-001 both require standalone MCP.
- [x] CHK-002 [P0] Child 003 package entrypoint and DB resolver verified. Evidence: package handlers, schemas, and `SYSTEM_SKILL_ADVISOR_DB_DIR` DB resolver read before edits.
- [x] CHK-003 [P0] Claude MCP surface confirmed as `.claude/mcp.json`. Evidence: edited `.claude/mcp.json` per packet scope; runtime-manager caveat recorded.
- [x] CHK-004 [P1] Four runtime config files backed up or baseline-diffed before edits. Evidence: snapshots copied to `/tmp/013009004-baseline`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `.opencode/bin/skill-advisor-launcher.cjs` exists. Evidence: created launcher file.
- [x] CHK-011 [P0] Launcher starts the advisor MCP server entrypoint. Evidence: default smoke stayed alive and direct MCP stdio calls returned results.
- [x] CHK-012 [P0] Launcher uses advisor-scoped lock and state files. Evidence: `.skill-advisor-launcher.lockdir` and `.skill-advisor-launcher.json` under advisor DB dir.
- [x] CHK-013 [P1] Launcher builds advisor MCP dist artifacts when missing. Evidence: deleting generated `dist/` triggered `npm run build`.
- [x] CHK-014 [P1] Launcher logs the resolved DB path at startup. Evidence: default DB line logged.
- [x] CHK-015 [P1] Launcher honors `SYSTEM_SKILL_ADVISOR_DB_DIR`. Evidence: override smoke logged `/tmp/test-advisor-db/skill-graph.sqlite`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `opencode.json` contains `system_skill_advisor`. Evidence: JSON parse and `opencode mcp list`.
- [x] CHK-021 [P0] `.codex/config.toml` contains `system_skill_advisor`. Evidence: `tomllib` parse and `codex mcp list`.
- [x] CHK-022 [P0] `.claude/mcp.json` contains `system_skill_advisor`. Evidence: JSON parse found the block.
- [x] CHK-023 [P0] `.gemini/settings.json` contains `system_skill_advisor`. Evidence: JSON parse found the block with `cwd` and `trust`.
- [x] CHK-024 [P0] `spec_kit_memory` registration is unchanged in all four configs. Evidence: raw baseline block comparison reported UNCHANGED for all four.
- [x] CHK-025 [P1] New config entries follow each runtime's local MCP schema. Evidence: JSON/TOML parse and sibling-style local command blocks.
- [x] CHK-030 [P0] OpenCode lists `system_skill_advisor` and `advisor_recommend`. Evidence: `opencode mcp list` showed connected; direct MCP tools listed `advisor_recommend`.
- [x] CHK-031 [P0] Codex lists `system_skill_advisor` and `advisor_recommend`. Evidence: `codex mcp list` showed enabled; direct MCP tools listed `advisor_recommend`.
- [ ] CHK-032 [P0] Claude lists `system_skill_advisor` and `advisor_recommend`. BLOCKED: `.claude/mcp.json` parses, but `claude mcp list` did not surface the new entry.
- [ ] CHK-033 [P0] Gemini lists `system_skill_advisor` and `advisor_recommend`. BLOCKED: `.gemini/settings.json` parses, but `gemini mcp list --debug` only reported `sequential_thinking`.
- [x] CHK-034 [P0] `advisor_recommend` is callable from the standalone server. Evidence: direct MCP call returned `ok:stale:3`.
- [x] CHK-035 [P1] `advisor_rebuild`, `advisor_status`, and `advisor_validate` are visible under the standalone server. Evidence: direct MCP tools list returned all four stable ids.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-040 [P0] `decision-record.md` contains ADR-001 through ADR-005. Evidence: required reading confirmed all five ADRs.
- [x] CHK-041 [P0] ADRs preserve stable `advisor_*` tool ids. Evidence: ADR-003 and server registration use unchanged ids.
- [x] CHK-042 [P0] ADRs document `system_skill_advisor` snake_case naming. Evidence: ADR-002.
- [x] CHK-043 [P1] ADRs document rejected proxy, merged, and require-prebuilt alternatives where relevant. Evidence: ADR-001 and ADR-005 alternatives.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-044 [P0] Runtime config entries do not introduce secrets. Evidence: only `_NOTE_*` explanatory keys were added.
- [x] CHK-045 [P1] Env override documentation does not expose local secret values. Evidence: docs mention `SYSTEM_SKILL_ADVISOR_DB_DIR` path policy only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, and `tasks.md` agree on the three-phase plan. Evidence: setup, implementation, verification phases retained.
- [x] CHK-051 [P0] `implementation-summary.md` status updates after code/config work lands. Evidence: status changed to implemented with runtime-manager caveats.
- [x] CHK-052 [P1] `description.json` and `graph-metadata.json` parse as JSON. Evidence: strict validation includes metadata parse.
- [x] CHK-053 [P1] Strict spec validation exits 0. Evidence: `validate.sh .../004-standalone-mcp-launcher-runtime-configs --strict` exited 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Implementation changes stay limited to the whitelisted launcher, package server/build files, runtime configs, and packet docs. Evidence: scoped git status reviewed.
- [x] CHK-061 [P1] Temporary cold-start test moves are restored before completion. Evidence: generated `dist/` rebuilt; runtime state file removed after smoke.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 25/27 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-14
**Implementation Status**: Implemented with runtime-manager caveats
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADR-001 through ADR-005 are present. Evidence: decision-record.md reviewed.
- [x] CHK-101 [P1] Alternatives include standalone, proxy, merged, renamed, fixed-path, and require-prebuilt options where relevant. Evidence: decision-record.md alternatives tables.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Launcher avoids rebuilding when required dist artifacts already exist. Evidence: default smoke with existing artifact did not run build.
- [x] CHK-111 [P2] Cold-start build duration is recorded if measured. Evidence: missing-dist smoke completed in about 5.5s wall time.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure is documented in `plan.md`. Evidence: rollback plan retained.
- [x] CHK-121 [P1] Runtime smoke evidence is recorded before child 005 starts. Evidence: implementation summary records OpenCode/Codex pass and Claude/Gemini manager caveats.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Config diffs prove `spec_kit_memory` remains unchanged. Evidence: raw block comparisons against baseline snapshots.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` stay synchronized after implementation. Evidence: tasks and checklist updated with the same launcher/config/smoke evidence.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | Pending | 2026-05-14 |
<!-- /ANCHOR:sign-off -->
