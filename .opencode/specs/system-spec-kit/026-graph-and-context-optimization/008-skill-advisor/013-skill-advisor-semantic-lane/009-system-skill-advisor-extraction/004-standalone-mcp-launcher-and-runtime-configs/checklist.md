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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/004-standalone-mcp-launcher-and-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffold authored"
    next_safe_action: "Verify implementation"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 0
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

- [ ] CHK-001 [P0] ADR-001 reviewed and server topology confirmed as standalone MCP.
- [ ] CHK-002 [P0] Child 003 package entrypoint and DB resolver verified.
- [ ] CHK-003 [P0] Claude MCP surface confirmed as `.claude/mcp.json`.
- [ ] CHK-004 [P1] Four runtime config files backed up or baseline-diffed before edits.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `.opencode/bin/skill-advisor-launcher.cjs` exists.
- [ ] CHK-011 [P0] Launcher starts the advisor MCP server entrypoint.
- [ ] CHK-012 [P0] Launcher uses advisor-scoped lock and state files.
- [ ] CHK-013 [P1] Launcher builds advisor MCP dist artifacts when missing.
- [ ] CHK-014 [P1] Launcher logs the resolved DB path at startup.
- [ ] CHK-015 [P1] Launcher honors `SYSTEM_SKILL_ADVISOR_DB_DIR`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `opencode.json` contains `system_skill_advisor`.
- [ ] CHK-021 [P0] `.codex/config.toml` contains `system_skill_advisor`.
- [ ] CHK-022 [P0] `.claude/mcp.json` contains `system_skill_advisor`.
- [ ] CHK-023 [P0] `.gemini/settings.json` contains `system_skill_advisor`.
- [ ] CHK-024 [P0] `spec_kit_memory` registration is unchanged in all four configs.
- [ ] CHK-025 [P1] New config entries follow each runtime's local MCP schema.
- [ ] CHK-030 [P0] OpenCode lists `system_skill_advisor` and `advisor_recommend`.
- [ ] CHK-031 [P0] Codex lists `system_skill_advisor` and `advisor_recommend`.
- [ ] CHK-032 [P0] Claude lists `system_skill_advisor` and `advisor_recommend`.
- [ ] CHK-033 [P0] Gemini lists `system_skill_advisor` and `advisor_recommend`.
- [ ] CHK-034 [P0] `advisor_recommend` is callable from the standalone server.
- [ ] CHK-035 [P1] `advisor_rebuild`, `advisor_status`, and `advisor_validate` are visible under the standalone server.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-040 [P0] `decision-record.md` contains ADR-001 through ADR-005.
- [ ] CHK-041 [P0] ADRs preserve stable `advisor_*` tool ids.
- [ ] CHK-042 [P0] ADRs document `system_skill_advisor` snake_case naming.
- [ ] CHK-043 [P1] ADRs document rejected proxy, merged, and require-prebuilt alternatives where relevant.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-044 [P0] Runtime config entries do not introduce secrets.
- [ ] CHK-045 [P1] Env override documentation does not expose local secret values.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] `spec.md`, `plan.md`, and `tasks.md` agree on the three-phase plan.
- [ ] CHK-051 [P0] `implementation-summary.md` status remains Planned until code/config work lands.
- [ ] CHK-052 [P1] `description.json` and `graph-metadata.json` parse as JSON.
- [ ] CHK-053 [P1] Strict spec validation exits 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Implementation changes stay limited to the launcher and four runtime configs.
- [ ] CHK-061 [P1] Temporary cold-start test moves are restored before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 0/27 |
| P1 Items | 11 | 0/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-14
**Implementation Status**: Planned
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 through ADR-005 are present.
- [ ] CHK-101 [P1] Alternatives include standalone, proxy, merged, renamed, fixed-path, and require-prebuilt options where relevant.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Launcher avoids rebuilding when required dist artifacts already exist.
- [ ] CHK-111 [P2] Cold-start build duration is recorded if measured.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure is documented in `plan.md`.
- [ ] CHK-121 [P1] Runtime smoke evidence is recorded before child 005 starts.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Config diffs prove `spec_kit_memory` remains unchanged.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` stay synchronized after implementation.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | Pending | 2026-05-14 |
<!-- /ANCHOR:sign-off -->
