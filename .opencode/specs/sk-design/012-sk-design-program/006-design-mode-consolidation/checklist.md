---
title: "Verification Checklist: sk-design mode consolidation"
description: "Evidence checklist for four-mode routing, permanent interface-owned foundations and audit workflows, exact relocations, frozen styles, and downstream verifier preservation."
trigger_phrases:
  - "sk-design consolidation verification"
  - "four mode checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-26T09:08:32Z"
    last_updated_by: "opencode"
    recent_action: "Created the exact topology and behavior verification matrix"
    next_safe_action: "Capture baseline evidence before relocation"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim completion until verified |
| **[P1]** | Required | Must complete or receive user-approved deferral |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and approved override are documented in `spec.md`. [evidence: `spec.md` Requirements and Open Questions]
- [x] CHK-002 [P0] Technical sequence and file-scoped rollback are documented in `plan.md`. [evidence: `plan.md` Architecture and Rollback Plan]
- [ ] CHK-003 [P0] All required behavior gates have captured baselines.
- [ ] CHK-004 [P0] Exact source counts and styles hashes are recorded before relocation.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Authored JSON, Markdown, JavaScript, TypeScript, Python, Bash, and YAML pass relevant syntax/format checks.
- [ ] CHK-011 [P0] No generated artifact is manually approximated.
- [ ] CHK-012 [P1] No ephemeral packet identifiers or paths are added to code comments.
- [ ] CHK-013 [P1] File permissions and executable bits match their pre-move sources.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Registry has exactly the four approved entries in deterministic order.
- [ ] CHK-021 [P0] `/interface:foundations` resolves to a complete permanent interface-owned subworkflow.
- [ ] CHK-022 [P0] `/interface:audit` resolves to a complete permanent interface-owned subworkflow.
- [ ] CHK-023 [P0] Foundations corpus and validators pass from their new paths.
- [ ] CHK-024 [P0] Audit scoring, report, comparison-corpus, fingerprint, and Bash gates pass from their new paths.
- [ ] CHK-025 [P0] Package and command contract pass counts equal or exceed green baselines without weakened assertions.
- [ ] CHK-026 [P0] Parent-hub, compiled-routing, drift, and benchmark gates pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Producers inventoried: registry, router, command metadata, leaf manifest, advisor metadata, and compiled-route sync.
- [ ] CHK-FIX-002 [P0] Consumers classified as live, generated, or historical before edits.
- [ ] CHK-FIX-003 [P0] Exact accounting verifies 112 subordinate relocations, two READMEs, two contract transformations, and two changelogs.
- [ ] CHK-FIX-004 [P0] Interface leaf manifest contains exactly 69 leaves.
- [ ] CHK-FIX-005 [P1] Algorithm invariant preserves workflow capability independently of mode identity.
- [ ] CHK-FIX-006 [P1] Final grep has no live old-path or nested-identity consumer.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Existing audit shell/path-validation gates remain intact.
- [ ] CHK-031 [P0] No secret, credential, network dependency, or external data transfer is introduced.
- [ ] CHK-032 [P1] Command and router inputs retain existing fail-closed validation.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Hub, interface, command, README, contract, and generated routing docs describe the same four-mode/subworkflow topology.
- [ ] CHK-041 [P1] Historical changelogs remain present and legible.
- [ ] CHK-042 [P2] Research recommendation override remains explicit in the decision record.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] No `design-foundations/` or `design-audit/` peer-mode directory remains after successful relocation.
- [ ] CHK-051 [P0] No nested `SKILL.md`, `description.json`, or `graph-metadata.json` identity exists for either subworkflow.
- [ ] CHK-052 [P1] Temporary manifests and command output remain in packet `scratch/` and are excluded from final source topology.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 2/25 |
| P1 Items | 17 | 0/17 |
| P2 Items | 7 | 0/7 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] All architecture decisions in `decision-record.md` are Accepted.
- [ ] CHK-101 [P0] Permanent command ownership is distinct from top-level mode identity.
- [ ] CHK-102 [P1] Standalone audit, shared-procedure flattening, temporary aliasing, and styles migration alternatives remain rejected.
- [ ] CHK-103 [P2] Final topology diagram matches authored and generated source.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] No new process, query, hydration, or routing pass is introduced.
- [ ] CHK-111 [P1] Relevant test durations and baseline deltas are recorded.
- [ ] CHK-112 [P2] Additional load testing is deferred unless existing gates expose a regression.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] File-scoped rollback is executable from the recorded Git/manifests without touching unrelated changes.
- [ ] CHK-121 [P0] All 7,812 tracked styles files have identical pre/post SHA-256 values.
- [ ] CHK-122 [P1] No feature flag is required for repository-local topology consolidation.
- [ ] CHK-123 [P2] No external deployment runbook is required.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security and executable-path preservation review is complete.
- [ ] CHK-131 [P1] No dependency or license change is introduced.
- [ ] CHK-132 [P2] OWASP review is not applicable to repository-local routing topology.
- [ ] CHK-133 [P2] Existing local data handling remains unchanged.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet, hub, command, and generated routing documents are synchronized.
- [ ] CHK-141 [P1] Public command contracts document permanent subworkflow routing.
- [ ] CHK-142 [P2] No visual user-facing documentation change is required.
- [ ] CHK-143 [P2] Relocated READMEs and contracts preserve knowledge transfer.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Automated package and contract gates | Technical verification | Pending | |
| SpecKit strict validator | Documentation verification | Pending | |
<!-- /ANCHOR:sign-off -->
