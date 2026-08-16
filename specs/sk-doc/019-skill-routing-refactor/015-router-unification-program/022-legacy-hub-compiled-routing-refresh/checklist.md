---
title: "Verification Checklist: Legacy Hub Compiled Routing Refresh"
description: "Planned verification checklist for the two-hub compiled routing refresh, retained rollback, canary, fleet freshness, and frozen-artifact integrity"
trigger_phrases:
  - "legacy hub refresh checklist"
  - "compiled routing canary checklist"
  - "frozen scorer digest integrity"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/022-legacy-hub-compiled-routing-refresh"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored deferred legacy hub refresh plan"
    next_safe_action: "Run in complete compiled-routing environment"
    blockers:
      - "system-deep-loop harness lacks prior activation manifest"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Legacy Hub Compiled Routing Refresh

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The complete 015 compiled-routing environment is available.
- [ ] CHK-002 [P0] Activation state and retained-rollback closure are present and authoritative.
- [ ] CHK-003 [P1] Baseline route status, frozen bytes, and protected digests are captured.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The `system-deep-loop` owner harness handles its prior activation manifest without `ENOENT`.
- [ ] CHK-011 [P0] Both owner harnesses build from their current authored `ROUTER.md` files.
- [ ] CHK-012 [P1] Effective policy hashes match the current authored-policy target for both hubs.
- [ ] CHK-013 [P1] No scope expansion changes unrelated hubs or routing policy intent.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Both compiled artifact builds complete successfully.
- [ ] CHK-021 [P0] Activation manifests refresh and `compiled-route-sync` promotion completes.
- [ ] CHK-022 [P1] The program canary passes with retained rollback available.
- [ ] CHK-023 [P1] `compiled-route-status.cjs --all` reports all seven hubs compiled and fresh.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The harness failure is classified as a missing prior-manifest contract, not a route-policy break.
- [ ] CHK-FIX-002 [P0] Same-class owner harnesses are inventoried for prior-manifest creation or read behavior.
- [ ] CHK-FIX-003 [P0] Consumers of activation manifests, `compiled-route-sync`, canary, and route status are inventoried.
- [ ] CHK-FIX-004 [P0] Adversarial activation-state cases cover absent, incomplete, live-serving, and retained-prior manifests.
- [ ] CHK-FIX-005 [P1] The verification matrix covers both hubs, promotion state, all seven status rows, and frozen artifacts.
- [ ] CHK-FIX-006 [P1] A failed build or promotion is exercised through the retained rollback path before completion.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the controlled execution run and its resulting receipts.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or unrelated runtime state are introduced into artifacts or packet documents.
- [ ] CHK-031 [P0] The live-serving manifest is not used as an unsafe prior-manifest seed.
- [ ] CHK-032 [P1] Retained rollback is available before promotion and verified after any failed gate.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, and planned summary remain synchronized.
- [ ] CHK-041 [P1] Final execution receipts identify the harness, promotion, canary, status, and frozen-artifact checks.
- [ ] CHK-042 [P2] Any execution-specific operator notes are recorded in the owning 015 environment.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary build output stays within the controlled compiled-routing environment.
- [ ] CHK-051 [P1] No runtime-generated activation state is copied into this bare worktree.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: N/A — planned work has not been executed
<!-- /ANCHOR:summary -->
