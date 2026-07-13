---
title: "Verification Checklist: Advisor Realignment"
description: "Evidence checklist for advisor routing through cli-external-orchestration."
trigger_phrases: ["advisor realignment checklist", "cli-opencode smoke"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/002-advisor-realign"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Advisor Realignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
P0 items require direct routing evidence; blocked repository-wide graph checks are not converted into phase passes.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] New hub identity and router boundary documented.
- [x] CHK-002 [P1] Phase 1 completed first.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Advisor projection points at the canonical hub.
- [x] CHK-011 [P1] Nested `cli-opencode` remains the workflow packet.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Local advisor smoke resolves `cli-opencode`.
- [x] CHK-021 [P0] Smoke reports confidence 0.95 and uncertainty 0.20.
- [x] CHK-022 [P1] Routing projection hash is `sha256:56e8cceee4c9c7a1eadcdb024e9ac48c9215323bafa96e851abc610dc5a583f0`.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Change classified as cross-consumer routing alignment.
- [x] CHK-FIX-002 [P1] Resolver and projection evidence recorded.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] No credentials or permission rules changed.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Phase docs use `cli-external-orchestration` for the hub and `cli-opencode` for the executor.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] Metadata points to the parent packet.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---:|---:|
| P0 | 6 | 6 |
| P1 | 6 | 6 |
| P2 | 0 | 0 |
<!-- /ANCHOR:summary -->
<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification
- [x] CHK-100 [P0] Hub-versus-executor identity decision is recorded.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

Not applicable — static documentation and routing-metadata edits carry no runtime performance surface.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

No deploy step; changes take effect in-repo. Verified by package validation and the advisor drift check.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

Scope-locked to the named files; no license, secret, or data-handling surface touched.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

Source-of-truth `SKILL.md` files and the regenerated registry agree; cross-references resolve.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

Ready for orchestrator gate: package validation green and recursive strict validation clean.
<!-- /ANCHOR:sign-off -->
