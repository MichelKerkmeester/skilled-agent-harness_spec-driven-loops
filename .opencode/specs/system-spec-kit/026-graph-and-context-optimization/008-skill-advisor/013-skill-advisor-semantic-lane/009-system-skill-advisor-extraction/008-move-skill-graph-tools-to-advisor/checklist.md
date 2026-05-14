---
title: "Verification Checklist: Move skill_graph_* tools to advisor ownership"
description: "Pending verification checklist for the Level 3 skill_graph_* ownership migration."
trigger_phrases:
  - "013/009/008 checklist"
  - "skill graph advisor move verification"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/008-move-skill-graph-tools-to-advisor"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Packet scaffolded by cli-codex"
    next_safe_action: "Fill evidence during implementation"
    blockers: []
    completion_pct: 0
---
# Verification Checklist: Move skill_graph_* tools to advisor ownership

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get operator-approved deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: Pending implementation.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`.
  - **Evidence**: Pending implementation.
- [ ] CHK-003 [P1] Dependencies identified and available.
  - **Evidence**: Pending implementation.
- [ ] CHK-004 [P1] Baseline consumer inventory captured.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Advisor server registers all four `skill_graph_*` tools.
  - **Evidence**: Pending implementation.
- [ ] CHK-011 [P0] Advisor-local handlers exist for scan, query, status, and validate.
  - **Evidence**: Pending implementation.
- [ ] CHK-012 [P0] No long-lived duplicate primary handler logic remains in memory MCP.
  - **Evidence**: Pending implementation.
- [ ] CHK-013 [P1] Handler authorization and output shapes are preserved.
  - **Evidence**: Pending implementation.
- [ ] CHK-014 [P1] Code follows existing advisor package conventions.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Advisor package tests cover descriptor registration and handler dispatch.
  - **Evidence**: Pending implementation.
- [ ] CHK-021 [P0] Memory proxy tests cover forwarding and timeout behavior.
  - **Evidence**: Pending implementation.
- [ ] CHK-022 [P0] Final memory MCP tests prove `skill_graph_*` descriptors are removed after cleanup.
  - **Evidence**: Pending implementation.
- [ ] CHK-023 [P1] System-code-graph readiness smoke passes after retarget.
  - **Evidence**: Pending implementation.
- [ ] CHK-024 [P1] Hook wrapper smoke passes after retarget.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] `spec_kit_memory` proxy is removed after zero-caller evidence.
  - **Evidence**: Pending implementation.
- [ ] CHK-026 [P0] `spec_kit_memory` descriptors and schemas no longer expose `skill_graph_*`.
  - **Evidence**: Pending implementation.
- [ ] CHK-027 [P1] Remaining `skill_graph_*` grep hits are classified as advisor-owned, historical, or plain tool-id references.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Trusted-caller behavior for `skill_graph_scan` is preserved.
  - **Evidence**: Pending implementation.
- [ ] CHK-031 [P1] Proxy does not expose new unauthenticated write paths.
  - **Evidence**: Pending implementation.
- [ ] CHK-032 [P1] No secrets, credentials, or machine-local paths are introduced in docs.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Install guides describe `system_skill_advisor` as skill graph tool owner.
  - **Evidence**: Pending implementation.
- [ ] CHK-041 [P1] Feature catalogs and playbooks reflect new ownership.
  - **Evidence**: Pending implementation.
- [ ] CHK-042 [P1] Historical references are preserved only when clearly historical.
  - **Evidence**: Pending implementation.
- [ ] CHK-043 [P2] `ARCHITECTURE.md` or equivalent topology docs include the server-prefix distinction.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-044 [P1] Live docs use `system_skill_advisor` for server-prefixed `skill_graph_*` calls.
  - **Evidence**: Pending implementation.
- [ ] CHK-045 [P1] Historical packet references are not rewritten into misleading current-state claims.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Scope stays within implementation packet and approved code/doc files.
  - **Evidence**: Pending implementation.
- [ ] CHK-051 [P1] Temporary scratch or generated files are avoided or kept in approved locations.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 through ADR-004 are accepted and aligned with parent ADR-001.
  - **Evidence**: Pending implementation.
- [ ] CHK-101 [P0] Tool-id stability is proven: public ids remain `skill_graph_*`.
  - **Evidence**: Pending implementation.
- [ ] CHK-102 [P0] Server ownership changes from `spec_kit_memory` to `system_skill_advisor`.
  - **Evidence**: Pending implementation.
- [ ] CHK-103 [P1] Consumer cutover order follows risk ordering: system-code-graph, hooks, plugins, docs.
  - **Evidence**: Pending implementation.
- [ ] CHK-104 [P1] Rollback paths are documented per cluster.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-105 [P1] Proxy timeout behavior is bounded at 10 seconds.
  - **Evidence**: Pending implementation.
- [ ] CHK-106 [P1] `skill_graph_scan` runtime does not regress materially versus baseline.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-107 [P0] Tool ids remain `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`.
  - **Evidence**: Pending implementation.
- [ ] CHK-108 [P1] Server-prefix migration is documented as caller-visible.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:runtime-verify -->
## L3: Runtime Verification

- [ ] CHK-110 [P1] OpenCode smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: Pending implementation.
- [ ] CHK-111 [P1] Codex smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: Pending implementation.
- [ ] CHK-112 [P1] Claude smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: Pending implementation.
- [ ] CHK-113 [P1] Gemini smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: Pending implementation.
- [ ] CHK-114 [P1] Doctor/update smoke exercises advisor-owned skill graph probes.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:runtime-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [ ] CHK-120 [P0] Final grep shows zero live `mcp__spec_kit_memory__skill_graph_` callers.
  - **Evidence**: Pending implementation.
- [ ] CHK-121 [P0] Strict validation passes for packet 008.
  - **Evidence**: Pending implementation.
- [ ] CHK-122 [P1] Strict validation passes for parent 013/009 and grandparent 013.
  - **Evidence**: Pending implementation.
- [ ] CHK-123 [P1] Implementation summary records test results and residual risks.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 20 | 0/20 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending implementation
**Verified By**: Pending implementation
**ADRs**: 5 scaffolded, 5 accepted for planning
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

- [ ] CHK-124 [P0] Operator confirms proxy removal after zero-caller evidence.
  - **Evidence**: Pending implementation.
- [ ] CHK-125 [P1] Final packet handoff names residual risks and next safe action.
  - **Evidence**: Pending implementation.
<!-- /ANCHOR:sign-off -->
