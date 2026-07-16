---
title: "Verification Checklist: semantic validation and fixtures"
description: "Verification evidence for the W1/W2/W6 semantic-validation phase. Each item marked [x] carries evidence of completion."
trigger_phrases:
  - "verification"
  - "checklist"
  - "semantic validation"
  - "gate obligation"
  - "mode completeness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T13:20:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-2 checklist for semantic-validation phase"
    next_safe_action: "Canonize W6 mode-completeness in Step 10, then build the checks"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Verification Checklist: semantic validation and fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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
  - **Evidence**:
- [ ] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**:
- [ ] CHK-003 [P1] Phase-001 contract available for per-family input/mode facts
  - **Evidence**:

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Adapter and oracle pass `node -c` syntax check
  - **Evidence**:
- [ ] CHK-011 [P0] New checks reuse the shared makeFinding shape and vocabulary
  - **Evidence**:
- [ ] CHK-012 [P1] Checks are contract-driven, not re-hard-coding family behavior
  - **Evidence**:
- [ ] CHK-013 [P1] Comment hygiene: no artifact ids in code comments
  - **Evidence**:

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001 gate-obligation: required-input router without its gate fails; conformant passes
  - **Evidence**:
- [ ] CHK-021 [P0] REQ-002 mode-completeness: advertised mode missing YAML or EXECUTION TARGETS row flags P1
  - **Evidence**:
- [ ] CHK-022 [P0] REQ-003 one independent mutation fixture fails per new invariant; adapter and oracle agree
  - **Evidence**:
- [ ] CHK-023 [P1] REQ-004 reference coverage reports all six families with no hard-coded omission
  - **Evidence**:
- [ ] CHK-024 [P1] Conformant real corpus produces no new false positives from the new checks
  - **Evidence**:

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The three enforced rules are classified as new semantic invariants (gate obligation, mode completeness, coverage), not section-presence checks
  - **Evidence**:
- [ ] CHK-FIX-002 [P0] Producer inventory: the checks read the phase-001 contract for per-family input and mode facts
  - **Evidence**:
- [ ] CHK-FIX-003 [P0] Consumer inventory covers the adapter, the reference oracle, the reference CLI, and create-command Step 10
  - **Evidence**:
- [ ] CHK-FIX-004 [P0] Adversarial case: each new invariant has a mutation fixture that fails, detected by both adapter and oracle
  - **Evidence**:
- [ ] CHK-FIX-005 [P1] Coverage matrix: all six families are covered with no hard-coded omission
  - **Evidence**:
- [ ] CHK-FIX-006 [P1] No runtime dispatch behavior changes; the phase adds validation only
  - **Evidence**:
- [ ] CHK-FIX-007 [P1] Evidence pinned to adapter differential test, oracle --verify, and strict-validator receipts
  - **Evidence**:

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Reference oracle boundary intact — adapter does not import the oracle
  - **Evidence**:
- [ ] CHK-031 [P1] No fixture escapes its package root; fixture builder path guards hold
  - **Evidence**:

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] REQ-005 Step 10 documents mode completeness before the check enforces it
  - **Evidence**:
- [ ] CHK-041 [P1] spec/plan/tasks/implementation-summary synchronized to final state
  - **Evidence**:

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files left outside the scratchpad
  - **Evidence**:
- [ ] CHK-051 [P1] Commit scope limited to intended files (no operator dirty files)
  - **Evidence**:

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 13 | 0/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
