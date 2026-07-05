---
title: "Verification Checklist: Phase 003 - Private Procedure Card Layer"
description: "Verification checklist for the planned private procedure-card layer and packet validation."
trigger_phrases:
  - "phase 003 checklist"
  - "procedure-card verification"
  - "source adaptation review"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/003-private-procedure-card-layer"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 003 checklist."
    next_safe_action: "Use checklist for cards."
---
# Verification Checklist: Phase 003 - Private Procedure Card Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim phase implementation complete until verified |
| **[P1]** | Required | Must complete or receive explicit approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md` with private-card scope and no public fourteen-skill mirror.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` with mode-local default and shared-procedure exception rules.
- [ ] CHK-003 [P0] Decision record documents private mode-local cards over public external-procedure skills.
- [ ] CHK-004 [P1] Dependencies on Phase 002 and external source identifiers are understood before implementation starts.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Procedure-card schema includes purpose, trigger, owning mode, source reference, output contract, proof gate, and privacy rule.
- [ ] CHK-011 [P0] Every external procedure theme maps to one current mode or a justified shared orchestration card.
- [ ] CHK-012 [P0] Routing occurs after the existing public `sk-design` hub and mode selection.
- [ ] CHK-013 [P0] No new public OpenCode skills are created for the fourteen source procedures.
- [ ] CHK-014 [P1] Routing conflict rules define precedence and parent hub fallback.
- [ ] CHK-015 [P1] Shared cards have a cross-mode rationale and owner.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every card has a safe source citation or explicit no-source rationale.
- [ ] CHK-021 [P0] No card includes long-form copied external prompt text.
- [ ] CHK-022 [P0] Cards synthesize external procedure intent into OpenCode-native language.
- [ ] CHK-023 [P1] Reviewer checks compare procedure intent, not exact source wording.
- [ ] CHK-024 [P1] Source references are sufficient for audit without exposing restricted content.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Each card declares an output contract.
- [ ] CHK-031 [P0] Each card declares a proof gate tied to mode behavior.
- [ ] CHK-032 [P1] Procedure categories have evidence expectations for discovery, direction, prototype, extraction, review, and polish themes.
- [ ] CHK-033 [P1] Verification evidence distinguishes current packet validation from future card implementation evidence.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets or private external notes appear in cards.
- [ ] CHK-041 [P0] Public `sk-design` docs do not expose the private card inventory as a new skill taxonomy.
- [ ] CHK-042 [P1] Shared procedure cards do not leak source text through shared descriptions.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized.
- [ ] CHK-051 [P0] `description.json` and `graph-metadata.json` exist in the Phase 003 root.
- [ ] CHK-052 [P1] Implementation summary remains planned/not-started until procedure cards are implemented.
- [ ] CHK-053 [P1] No standard spec artifact includes a Table of Contents section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Packet creation writes only inside the Phase 003 root.
- [ ] CHK-061 [P1] Future implementation keeps cards mode-local unless shared orchestration is justified.
- [ ] CHK-062 [P1] Temporary or scratch artifacts are removed before claiming implementation completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 0/19 |
| P1 Items | 14 | 0/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not started
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decision is documented in `decision-record.md`.
- [ ] CHK-101 [P1] Alternatives include public fourteen-skill mirror, shared global library, and private mode-local cards.
- [ ] CHK-102 [P1] Rejection rationale is documented for public taxonomy expansion.
- [ ] CHK-103 [P2] Migration path is documented if an existing private procedure surface already exists.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Card selection avoids loading all cards for a single mode request.
- [ ] CHK-111 [P1] Routing remains deterministic when mode and trigger are known.
- [ ] CHK-112 [P2] Performance benchmark is documented if runtime card loading is added.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure is documented in `plan.md`.
- [ ] CHK-121 [P0] Implementation boundary is confirmed before editing future card locations.
- [ ] CHK-122 [P1] Handoff notes identify remaining implementation tasks.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] Source-adaptation rules reduce copying risk.
- [ ] CHK-131 [P1] Source citations are sufficient for review.
- [ ] CHK-132 [P1] Private cards do not expose external prompt bodies.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents remain synchronized after implementation.
- [ ] CHK-141 [P1] Metadata remains discoverable through `description.json` and `graph-metadata.json`.
- [ ] CHK-142 [P2] Knowledge transfer notes are added if the implementation changes maintainer workflow.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Not requested | Not started |
| Implementer | Phase owner | Not started | Not started |
| Reviewer | Source-adaptation reviewer | Not started | Not started |
<!-- /ANCHOR:sign-off -->
