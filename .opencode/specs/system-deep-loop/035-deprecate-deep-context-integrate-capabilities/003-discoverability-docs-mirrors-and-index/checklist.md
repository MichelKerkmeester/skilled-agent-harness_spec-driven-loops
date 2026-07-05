---
title: "Verification Checklist: Discoverability Docs Mirrors And Index Cleanup"
description: "Verification checklist for phase 003 registry, advisor, docs, mirrors, and generated-index cleanup."
trigger_phrases:
  - "deep-context discoverability checklist"
  - "deep-context registry advisor verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-deprecate-deep-context-integrate-capabilities/003-discoverability-docs-mirrors-and-index"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Completed phase 003 verification checklist"
    next_safe_action: "Proceed to phase 004 runtime cleanup."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-003-checklist"
      parent_session_id: "2026-07-04-phase-003-contract-authoring"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Historical archive preservation remains in force."
      - "Generated index owner tooling ran; unrelated parity warnings are documented in implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Discoverability Docs Mirrors And Index Cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this phase ready until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [EVIDENCE: phase 003 requirements table]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [EVIDENCE: registry-outward cleanup plan]
- [x] CHK-003 [P1] Dependencies identified. [EVIDENCE: phase 002 gate and advisor projection dependency]
- [x] CHK-004 [P0] Phase 002 redirect proof recorded. [EVIDENCE: phase 002 strict validation and command redirect checks recorded in parent continuity]
- [x] CHK-005 [P0] Active discoverability inventory captured. [EVIDENCE: Grep for `/deep:context|@deep-context|deep-context|workflowMode.*context|runtimeLoopType.*context` across active docs, agents, registry, advisor, and generated skill graph]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Authored docs are based on SpecKit templates. [EVIDENCE: `SPECKIT_TEMPLATE_SOURCE` markers]
- [x] CHK-011 [P0] Phase docs contain no placeholders. [EVIDENCE: final strict validation]
- [x] CHK-012 [P0] Registry and advisor projections stay synchronized. [EVIDENCE: `npm --prefix ".opencode/skills/system-skill-advisor/mcp_server" run test -- tests/routing-registry-drift-guard.vitest.ts`; `skill_advisor.py --check-routing-projection`]
- [x] CHK-013 [P1] Active docs use replacement terms consistently. [EVIDENCE: active grep leaves only deprecation metadata/stubs and phase-004 legacy runtime key]
- [x] CHK-014 [P1] Generated indexes are refreshed through owner tooling. [EVIDENCE: `init-skill-graph.sh`; `skill_graph_scan --trusted`; metadata refresh scripts]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Routing registry drift guard passes. [EVIDENCE: Vitest drift guard 7 passed]
- [x] CHK-021 [P0] Advisor probes no longer select standalone `deep-context` for new context-loop prompts. [EVIDENCE: advisor probes returned `deep-loop-workflows`/`system-spec-kit`, not standalone `deep-context`]
- [x] CHK-022 [P0] Active docs grep shows no live `/deep:context` recommendation. [EVIDENCE: scoped Grep; remaining matches are deprecated redirect/stub/metadata only]
- [x] CHK-023 [P1] Mirror routing docs match actual file inventory. [EVIDENCE: active `.opencode` and `.claude` deep-context mirrors disabled; no Codex mirror found]
- [x] CHK-024 [P0] Phase 003 strict validation passes. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-003> --strict`]
- [x] CHK-025 [P0] Parent recursive strict validation passes. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <parent> --strict --recursive`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each active discoverability surface is classified. [EVIDENCE: scoped grep inventory]
- [x] CHK-FIX-002 [P0] Same-class producer inventory covers registry, advisor TS, advisor Python, skill graph, root docs, orchestrator docs, active agent mirrors, and generated indexes. [EVIDENCE: active-surface grep and owner tooling]
- [x] CHK-FIX-003 [P0] Consumers of registry/advisor changes are inventoried. [EVIDENCE: drift guard, compiled contract drift check, advisor probes]
- [x] CHK-FIX-004 [P1] Historical archive preservation rule documented. [EVIDENCE: `spec.md` scope]
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion claim. [EVIDENCE: `plan.md` affected surfaces table]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced during docs/index refresh. [EVIDENCE: changed files contain deprecation/docs/index metadata only]
- [x] CHK-031 [P0] No auth/authz behavior in scope. [EVIDENCE: phase scope]
- [x] CHK-032 [P1] Generated index refresh does not persist environment values. [EVIDENCE: owner tooling output contained topology/parity warnings only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for intended phase 003 work. [EVIDENCE: updated docs]
- [x] CHK-041 [P1] Root README and AGENTS updated if active. [EVIDENCE: active-doc grep returned no live standalone recommendations]
- [x] CHK-042 [P2] Historical note wording reviewed if retained. [EVIDENCE: retained only as explicit deprecation wording]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain unnecessary for phase doc authoring. [EVIDENCE: no scratch files authored]
- [x] CHK-051 [P1] Generated index outputs are limited to owner-generated files. [EVIDENCE: advisor skill graph owner tooling and SpecKit metadata scripts]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-04
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in `decision-record.md`. [EVIDENCE: registry-outward cleanup ADR]
- [x] CHK-101 [P1] Decision has status. [EVIDENCE: ADR status Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: ADR alternatives]
- [x] CHK-103 [P2] Migration path verified after registry/advisor diff is known. [EVIDENCE: no live standalone route remains; redirect/stubs preserve migration guidance]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Phase 003 has no runtime performance target. [EVIDENCE: discoverability cleanup scope]
- [x] CHK-111 [P1] Verification commands remain targeted. [EVIDENCE: scoped greps, drift guard, advisor probes, metadata refresh, strict validation]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented. [EVIDENCE: `plan.md` rollback]
- [x] CHK-121 [P0] No feature flag required for docs/routing cleanup. [EVIDENCE: phase scope]
- [x] CHK-122 [P1] OpenCode restart note prepared for command/agent/skill docs. [EVIDENCE: agent stubs and final handoff note restart requirement]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Generated index handling reviewed. [EVIDENCE: owner tooling refreshed skill graph/indexes; unrelated parity warnings documented]
- [x] CHK-131 [P1] No persisted user data migration occurs. [EVIDENCE: docs/routing/index cleanup only]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All phase 003 docs validate. [EVIDENCE: phase 003 strict validation]
- [x] CHK-141 [P1] Parent recursive validation passes. [EVIDENCE: parent strict recursive validation]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved phased conversion | 2026-07-04 |
| OpenCode assistant | Implementer | Verified | 2026-07-04 |
<!-- /ANCHOR:sign-off -->
