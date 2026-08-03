---
title: "Verification Checklist: playbook standard enforcement and fleet normalization"
description: "The sk-doc operator-scenario contract has no mechanical check anywhere in the repository, so every playbook coverage claim in the fleet is hand-typed prose that has drifted. This keystone phase settles the corpus-split and verdict rulings, builds the missing operator-contract validator with paired fixtures and fail-closed CI wiring, derives a per-hub coverage map from live registries, and normalizes all 11 playbook roots to a derived census."
trigger_phrases:
  - "playbook standard and fleet normalization verification checklist"
  - "playbook scenario coverage verification checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/001-playbook-standard-and-fleet-normalization"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Playbook Standard Enforcement and Fleet Normalization

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Planned phase — all items open. Every `[x]` requires evidence: a command and its output, or a file:line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The full SC-001 baseline is captured and recorded **before any file is edited**.
- [ ] CHK-002 [P0] The topology gate's fail-open exit path and boundary resolution were re-read at HEAD, not assumed.
- [ ] CHK-003 [P0] `sk-create-manual-testing-playbook/` confirmed to have no `scripts/` directory at HEAD.
- [ ] CHK-004 [P0] The per-feature required-content field set is enumerated against the standard and pinned; the
      unverified "nine-field" shorthand was not carried forward.
- [ ] CHK-005 [P0] **OPERATOR-DECISION Q2** answered and recorded in `decision-record.md`.
- [ ] CHK-006 [P1] **OPERATOR-DECISION Q1** answered; the helper's location is fixed.
- [ ] CHK-007 [P1] **OPERATOR-DECISION Q7** answered; the reclassification wording is agreed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The validator is read-only: it never writes, renames, or deletes.
- [ ] CHK-011 [P0] The exit-code contract is exactly 0 conforming / 1 violations / 2 usage-or-boundary, strict by default.
- [ ] CHK-012 [P0] `--help` names both contracts and states which one this validator enforces.
- [ ] CHK-013 [P1] Code comments carry the durable WHY only — no spec paths, packet numbers, or finding ids.
- [ ] CHK-014 [P1] The validator follows the sibling gate's structure and error-class conventions where they apply.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every P0 requirement (REQ-003 … REQ-012) has a paired positive AND negative fixture.
- [ ] CHK-021 [P0] The seeded-violation test proves the CI job exits non-zero.
- [ ] CHK-022 [P0] The single-definition-site test for the count-derivation helper passes.
- [ ] CHK-023 [P0] The derived-census test fails if any root reintroduces a hand-typed count.
- [ ] CHK-024 [P1] The determinism test passes: same tree in, same report out, traversal-order independent.
- [ ] CHK-025 [P1] The coverage-map reproducibility test passes: two consecutive runs diff clean.
- [ ] CHK-026 [P1] The widening-only test proves the feature catalog can add expected features but never remove them.
- [ ] CHK-027 [P1] A test asserts the CI invocation does not pass `--no-strict`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding in the scope table has a finding class recorded.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed:
      `rg -n 'PARTIAL|UNAUTOMATABLE|READY'` over the 11 roots and both templates returns zero after the sweep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the playbook path:
      `rg -n 'manual-testing-playbook' .opencode --glob '*.cjs' --glob '*.ts' --glob '*.js' --glob '*.json'`.
- [ ] CHK-FIX-004 [P0] The link/path resolver has adversarial cases: relative-outside-root, symlinked, and
      case-differing paths.
- [ ] CHK-FIX-005 [P1] The {11 hubs} × {contract A, B} × {strict, no-strict} matrix axes and row count are listed
      before completion is claimed.
- [ ] CHK-FIX-006 [P1] The validator is exercised from a working directory other than the repository root.
- [ ] CHK-FIX-007 [P1] Baseline evidence is pinned to a SHA, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials in any fixture.
- [ ] CHK-031 [P0] The evergreen-truth check reports file and line, never echoing the matched developer path into
      shipped logs.
- [ ] CHK-032 [P1] Frozen fixtures copied from live files contain no operator-identifying content.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] SKILL.md §7 promotes the automated checks and the command is runnable exactly as written.
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close.
- [ ] CHK-042 [P1] `decision-record.md` records the corpus ruling in terms the siblings and the WS1 harness packet
      can cite without re-deriving it.
- [ ] CHK-043 [P2] Both templates read correctly after the `PARTIAL` removal — no dangling references.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Zero numeric-prefixed scenario filenames remain fleet-wide.
- [ ] CHK-051 [P0] Repository-wide link pass shows zero new broken links; scenario IDs unchanged.
- [ ] CHK-052 [P1] Fixtures live under `scripts/tests/` with provenance headers naming the live file they were copied from.
- [ ] CHK-053 [P1] Migrated run evidence lands under `<skill>/benchmark/reports/<dated-run>/`, not in scenario truth.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (validator ownership) and ADR-002 (strict default) recorded with status.
- [ ] CHK-101 [P1] Rejected alternatives documented with rationale.
- [ ] CHK-102 [P1] If Q2 ruled "move": the cutover landed as ONE commit with a pre/post fixture-count assertion.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Full-fleet validator wall-clock measured across all 11 playbook roots and recorded (NFR-P01).
- [ ] CHK-111 [P2] Determinism test proves two consecutive runs on an unchanged tree diff clean (NFR-R01).
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and the CI flip is its own revertible commit.
- [ ] CHK-121 [P0] The CI flip is sequenced relative to the Lane D sweep, and the sequencing choice is recorded.
- [ ] CHK-122 [P1] The four hubs that fail the sibling gate today are accounted for in the flip plan.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] The validator reads only repository files and performs no network access.
- [ ] CHK-131 [P1] No fixture embeds a credential, token, or absolute machine-local path.
- [ ] CHK-132 [P2] The evergreen-truth check (REQ-011) has its own paired positive and negative fixture.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] `sk-create-manual-testing-playbook/SKILL.md` documents the new validator and its exit-code contract.
- [ ] CHK-141 [P1] `assets/manual-testing-playbook-template.md` and the snippet template reflect the T009 pinned field set.
- [ ] CHK-142 [P2] `decision-record.md` cites the ADRs both sibling children reference rather than re-deciding.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 0/25 |
| P1 Items | 25 | 0/25 |
| P2 Items | 5 | 0/5 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Corpus-split ruling (Q2) | [ ] Approved | |
| Operator | Shared-helper ownership (Q1) | [ ] Approved | |
| Operator | NOT READY reclassification (Q7) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
