---
title: "Verification Checklist: Live Reference Sweep"
description: "Evidence checklist for repointing live references and synchronizing prompt-quality-card data."
trigger_phrases: ["reference sweep checklist", "prompt quality card sync"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/003-reference-sweep"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Live Reference Sweep
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- ANCHOR:protocol -->
## Verification Protocol
P0 items cover live consumers; historical prose is not rewritten unless it acts as a current instruction.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Canonical hub and advisor routing were established first.
- [x] CHK-002 [P1] Live-reference scope was separated from historical records.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Live references were repointed to `cli-external-orchestration`.
- [x] CHK-011 [P1] Executor-specific references still name `cli-opencode`.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Prompt-quality-card sync reports PASS.
- [x] CHK-021 [P1] Later rename-invariant and routing-registry tests pass 11 tests.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Consumer sweep covered live routing and documentation surfaces.
- [x] CHK-FIX-002 [P1] Historical snapshots remain evidence rather than active contract sources.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] The sweep introduced no secrets or trust-boundary changes.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Canonical docs distinguish hub and executor names.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] Phase evidence remains under `003-reference-sweep/`.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---:|---:|
| P0 | 5 | 5 |
| P1 | 7 | 7 |
| P2 | 0 | 0 |
<!-- /ANCHOR:summary -->
<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification
- [x] CHK-100 [P0] Live-versus-historical reference policy is recorded.
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
