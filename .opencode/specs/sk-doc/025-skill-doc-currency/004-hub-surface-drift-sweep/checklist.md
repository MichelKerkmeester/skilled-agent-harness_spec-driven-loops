---
title: "Verification Checklist: hub-surface-drift-sweep"
description: "Verification Date: pending"
trigger_phrases:
  - "surface sweep checklist"
  - "link resolution verification"
  - "install surface verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored verification checklist"
    next_safe_action: "Verify items as tasks complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: hub-surface-drift-sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Every one of the 20 scope items has a confirm-against-HEAD disposition before any edit
- [ ] CHK-005 [P0] The design-hub ownership group was confirmed first, and its cardinality numbers were re-derived rather than assumed
- [ ] CHK-006 [P0] The three registry-supplementary items each carry their own evidence line; none was batch-edited
- [ ] CHK-007 [P0] The four open forks are answered and recorded before the edits they govern
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:baselines -->
## Baselines (captured before any edit)

- [ ] CHK-010 [P0] Relative-link resolver failure count recorded over all skill markdown, with the phase-scoped subset separated
- [ ] CHK-011 [P0] Dangling-entry check result recorded
- [ ] CHK-012 [P1] Both installer paths exercised and their current behaviour recorded
- [ ] CHK-013 [P0] The fleet-gate re-baseline from the first phase is cited; no claim here uses a remembered pass count
<!-- /ANCHOR:baselines -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] The introduced checks pass lint/format for their language
- [ ] CHK-021 [P0] The link resolver is case-sensitive and reports its exclusion counts, so the number is interpretable
- [ ] CHK-022 [P0] The dangling-entry check does not follow symlinks outside the repository root; a negative test proves it
- [ ] CHK-023 [P1] Both checks report how many entries they examined
- [ ] CHK-024 [P1] Code follows project patterns
- [ ] CHK-025 [P1] No introduced comment embeds a spec path, packet id, phase id, requirement id or checklist id; the durable reason is kept instead
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All acceptance criteria in spec.md §4 met
- [ ] CHK-031 [P0] Dangling-entry check returns zero
- [ ] CHK-032 [P0] Both installer paths run without invoking a missing script
- [ ] CHK-033 [P0] Prose-versus-machine drift check returns zero mismatches in both code-hub surface documents
- [ ] CHK-034 [P1] Cardinality assertion holds: README equals workflow document equals disk
- [ ] CHK-035 [P1] Grep for retired lane names in active design-hub documents returns zero
- [ ] CHK-036 [P1] Grep for the retired branch shape returns only labelled legacy examples
- [ ] CHK-037 [P1] Link-resolver delta reported against the recorded baseline, phase subset separated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Link rot is `class-of-bug`: the resolver covers the tree, not only the reported paths.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — including a grep for each old path fragment before a rename is declared complete.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Applied to the resolver and the dangling check: case mismatch, anchor-only, external URL, outside-root symlink, and an empty target must each be classified correctly.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: hub × document class × claim type.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-045 [P1] The relative-link resolver rejects a target resolving outside the repository root; the adversarial fixture (CHK-FIX-004) proves it.
- [ ] CHK-046 [P2] No repaired reference or fixture embeds a credential, token, or absolute machine-local path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:safety -->
## Containment

- [ ] CHK-040 [P0] No symlink was repointed at a target that had not been verified to exist
- [ ] CHK-041 [P0] No procedure card was quarantined without a reachability check
- [ ] CHK-042 [P1] The version-pin outlier was resolved by the recorded fork answer, not by silently matching the majority
- [ ] CHK-043 [P1] The remote-branch policy document was not edited by this phase
<!-- /ANCHOR:safety -->

---

<!-- ANCHOR:coverage -->
## Coverage

- [ ] CHK-050 [P0] All 17 registry findings in scope reached a terminal state
- [ ] CHK-051 [P0] All 3 registry-supplementary findings reached a terminal state
- [ ] CHK-052 [P0] The arithmetic holds: 17 + 3 = 20 items, each in exactly one state
- [ ] CHK-053 [P1] The partially-duplicate supplementary item was repaired once for the shared file, under the scheduled finding, and its other files were covered separately
<!-- /ANCHOR:coverage -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] Spec/plan/tasks synchronized
- [ ] CHK-061 [P1] The four fork answers are recorded with their rationale
- [ ] CHK-062 [P2] Any deferral recorded with an owner and a reason
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Temp files in scratch/ only
- [ ] CHK-071 [P1] scratch/ cleaned before completion
- [ ] CHK-072 [P1] Baselines kept inside the packet, not in a system temp directory
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 0/26 |
| P1 Items | 22 | 0/22 |
| P2 Items | 3 | 0/3 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
