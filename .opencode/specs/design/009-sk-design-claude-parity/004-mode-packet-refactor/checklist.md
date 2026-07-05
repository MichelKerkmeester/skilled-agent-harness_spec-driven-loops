---
title: "Verification Checklist: Phase 004 - Mode Packet Refactor"
description: "Verification checklist for the planned refactor of the five sk-design mode packets to consume private procedure support."
trigger_phrases:
  - "phase 004 checklist"
  - "mode packet refactor verification"
  - "sk-design routing checks"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/004-mode-packet-refactor"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 004 checklist."
    next_safe_action: "Use checklist during scoped future implementation."
---
# Verification Checklist: Phase 004 - Mode Packet Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` with five-mode preservation and no implementation claim.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` with public route preservation and private procedure support.
- [ ] CHK-003 [P0] Decision record documents public mode lanes, private support cards, and md-generator backend boundary.
- [ ] CHK-004 [P1] Future implementation is explicitly blocked until `.opencode/skills/sk-design/**` edits are in scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `design-interface` keeps its public mode identity and integrates private procedure support mode-locally.
- [ ] CHK-011 [P0] `design-foundations` keeps its public mode identity and integrates private procedure support mode-locally.
- [ ] CHK-012 [P0] `design-motion` keeps its public mode identity and integrates private procedure support mode-locally.
- [ ] CHK-013 [P0] `design-audit` keeps its public mode identity and integrates private procedure support mode-locally.
- [ ] CHK-014 [P0] `design-md-generator` keeps its public mode identity and mutating extraction backend boundary.
- [ ] CHK-015 [P0] No new public modes, public procedure skills, or advisor identities are introduced.
- [ ] CHK-016 [P1] Shared reference base is reused instead of duplicated across modes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Single `sk-design` advisor identity still routes to the hub.
- [ ] CHK-021 [P0] `mode-registry` resolves the five existing public modes.
- [ ] CHK-022 [P0] Hub-router selects public modes before private procedure selection.
- [ ] CHK-023 [P0] Link checks pass for hub, mode packets, shared references, README, and changelog.
- [ ] CHK-024 [P0] md-generator backend verification passes after mode changes.
- [ ] CHK-025 [P1] Mode proof review passes for context/proof expectations in all five modes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Each mode has procedure selection rules or an explicit no-procedure fallback.
- [ ] CHK-031 [P0] Each mode has proof expectations for procedure-backed output.
- [ ] CHK-032 [P0] Each mode has direct no-subagent fallback instructions.
- [ ] CHK-033 [P1] Verifier cadence states when to run route, link, proof, and backend checks.
- [ ] CHK-034 [P1] README and changelog updates match implemented behavior.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No external procedure bodies, secrets, or private notes are exposed through mode packets.
- [ ] CHK-041 [P0] Public docs do not instruct users to choose private procedure cards.
- [ ] CHK-042 [P1] md-generator extraction side effects remain explicit and separately verified.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized.
- [ ] CHK-051 [P0] `description.json` and `graph-metadata.json` exist in the Phase 004 root.
- [ ] CHK-052 [P1] Implementation summary remains planned/not-started until mode-packet edits are implemented.
- [ ] CHK-053 [P1] No standard spec artifact includes a Table of Contents section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Packet creation writes only inside the Phase 004 root.
- [ ] CHK-061 [P1] Future implementation modifies only approved `sk-design` mode, hub, registry, README, changelog, or backend reference files.
- [ ] CHK-062 [P1] Temporary or scratch artifacts are removed before claiming implementation completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions are documented in `decision-record.md`.
- [ ] CHK-101 [P0] Public execution lanes remain the five current mode packets.
- [ ] CHK-102 [P0] Private procedures remain internal support cards.
- [ ] CHK-103 [P0] md-generator keeps its mutating backend boundary.
- [ ] CHK-104 [P1] Alternatives include procedure publicization, shared-only procedure layer, and mode-local integration.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-110 [P1] Procedure selection avoids loading all cards across every mode for a single request.
- [ ] CHK-111 [P1] Link and routing checks remain deterministic enough for repeatable verification.
- [ ] CHK-112 [P2] Performance measurement is added if runtime procedure loading adds measurable overhead.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure is documented in `plan.md`.
- [ ] CHK-121 [P0] Future implementation boundary is confirmed before editing `sk-design` files.
- [ ] CHK-122 [P1] Handoff notes identify remaining mode-packet implementation tasks.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P0] Private procedure cards remain internal support cards rather than public routing options.
- [ ] CHK-131 [P1] README and changelog wording avoid exposing a private card inventory as a public taxonomy.
- [ ] CHK-132 [P1] External procedure references remain synthesized and do not copy restricted prompt bodies.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] All spec documents remain synchronized after future implementation.
- [ ] CHK-141 [P1] Metadata remains discoverable through `description.json` and `graph-metadata.json`.
- [ ] CHK-142 [P2] Knowledge transfer notes are added if the mode-packet refactor changes maintainer workflow.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 29 | 0/29 |
| P1 Items | 18 | 0/18 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not started
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Not requested | Not started |
| Implementer | Phase owner | Not started | Not started |
| Reviewer | Routing and md-generator reviewer | Not started | Not started |
<!-- /ANCHOR:sign-off -->
