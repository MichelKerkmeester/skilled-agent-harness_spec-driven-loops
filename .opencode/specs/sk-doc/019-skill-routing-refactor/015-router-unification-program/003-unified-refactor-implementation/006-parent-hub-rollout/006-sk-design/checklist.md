---
title: "Verification Checklist: sk-design Compiled Router Rollout"
description: "Evidence-backed Level-2 checklist for the sk-design parent-hub canary."
trigger_phrases: ["sk-design checklist", "sk-design real green", "sk-design scorer verification"]
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/006-sk-design"
    last_updated_at: "2026-07-19T11:08:33.000Z"
    last_updated_by: "codex"
    recent_action: "Recorded the sk-design verification evidence."
    next_safe_action: "Retain the compiled candidate in shadow-only authority."
---
# Verification Checklist: sk-design Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---
<!-- ANCHOR:protocol -->
## Verification Protocol

P0 is a blocker; P1 is required; P2 is optional with documented deferral.
<!-- /ANCHOR:protocol -->

---
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Read every requested source before implementation. [EVIDENCE: activation/acceptance.json:1 binds all consumed authored bytes.]
- [x] CHK-002 [P0] Fix scope and rollback before edits. [VERIFIED: retained `manifest.prior.json` and child-local fence.]
<!-- /ANCHOR:pre-impl -->

---
<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Reuse shared compiler, canonical helpers, parser, and projector. [VERIFIED: direct imports in `lib/` and `harness/`.]
- [x] CHK-011 [P0] Keep output deterministic and dependency-free. [VERIFIED: consecutive builds are byte-identical.]
- [x] CHK-012 [P0] Keep comments durable and pass syntax. [VERIFIED: all seven `.cjs` files pass `node --check`.]
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Pass frozen schemas. [EVIDENCE: harness/validate-canary.cjs:1 validates policy, advisor, card, and thirteen typed rows.]
- [x] CHK-021 [P0] Pass the real scorer. [VERIFIED: 13/13 live and 13/13 persisted rows pass; writeback false.]
- [x] CHK-022 [P0] Prove scorer teeth. [EVIDENCE: harness/validate-canary.cjs:1 rejects a corrupted positive resource observation.]
- [x] CHK-023 [P0] Close bundle and negative algebra. [EVIDENCE: harness/validate-canary.cjs:1 checks both bundles and target-free non-routes.]
- [x] CHK-024 [P0] Pass document and advisor parity. [EVIDENCE: fixtures/canary-cases.v1.json:1 defines fourteen document and five advisor cases.]
- [x] CHK-025 [P0] Pass execution and rollback fences. [EVIDENCE: harness/validate-canary.cjs:1 checks VERIFY-before-COMMIT and byte-exact rollback.]
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Preserve six destination identities. [EVIDENCE: compiled/policy.v1.json:1 contains six unique destination identity tuples.]
- [x] CHK-031 [P0] Project authored nested leaves. [EVIDENCE: compiled/policy.v1.json:1 contains ninety authored leaf resources.]
- [x] CHK-032 [P1] Refuse authored drift. [EVIDENCE: harness/validate-canary.cjs:1 tests default, tie-break, bundle, resource, and source mutations.]
<!-- /ANCHOR:fix-completeness -->

---
<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Prevent authority on negative branches. [EVIDENCE: harness/validate-canary.cjs:1 checks clarify, defer, and reject authority closure.]
- [x] CHK-041 [P0] Prevent read-only and transport COMMIT. [VERIFIED: both fences reject with `ROLE_CANNOT_COMMIT`.]
- [x] CHK-042 [P1] Avoid external side effects. [EVIDENCE: activation/manifest.candidate.json:1 keeps the candidate shadow-only.]
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Use Level-2 templates and required anchors. [EVIDENCE: spec.md:1 and implementation-summary.md:1 carry template provenance and required anchors.]
- [x] CHK-051 [P0] Pass strict packet validation. [EVIDENCE: `validate.sh --strict` exits zero with Errors: 0 and Warnings: 0.]
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Separate libraries, harnesses, fixtures, generated artifacts, activation, and docs. [EVIDENCE: plan.md:1 defines the child-local artifact boundaries.]
- [x] CHK-061 [P0] Keep all task writes inside `006-sk-design/`. [VERIFIED: final scope audit shows only this additive child.]
<!-- /ANCHOR:file-org -->

---
<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Verified |
|----------|-------|----------|
| P0 | 19 | 19/19 |
| P1 | 2 | 2/2 |
| P2 | 0 | 0/0 |

**Verification Date**: 2026-07-19  
**Scope**: Compile, schemas, routing, nested leaves, projector, real scorer, parity, authority,
activation, rollback, syntax, packet, hash, and file-scope gates.
<!-- /ANCHOR:summary -->
