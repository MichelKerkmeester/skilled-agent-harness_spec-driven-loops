---
title: "Acceptance Criteria: Phase 7: ci-rule-set-comparison"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ci rule set comparison acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: ci-rule-set-comparison

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison
**Level:** 2
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet that fails rule-set {A, B, C} at base, When the PR head fails rule-set {A, D, E}, Then the gate reports a regression (not pre-existing) | Create a test packet with different failing rules at base and head, run the PR gate, and verify the output names it as a regression | Unmet | - |
| AC-002 | REQ-001 | Given a packet that passes at base and fails at head, When the gate runs, Then it is still reported as a regression | Create a test with pass-to-fail transition, verify the gate catches it (existing behavior) | Unmet | - |
| AC-003 | REQ-002 | Given the weekly sweep with a previous artifact as baseline, When the sweep runs, Then a packet that passed in the baseline but now fails is reported as a regression | Run the sweep with a baseline artifact containing a passed folder, then modify that folder to fail; verify the sweep reports it as `regression` (not `first-run`) | Unmet | - |
| AC-004 | REQ-002 | Given the first run of the weekly sweep with no previous artifact, When the sweep runs, Then it proceeds without error and reports all failures as `first-run` (no baseline to compare) | Trigger the sweep on a fresh repository or without any prior artifacts, verify it completes without error and failing folders report as `first-run` | Unmet | - |
| AC-005 | REQ-003 | Given a failing packet in a PR, When the changed-packet gate runs, Then the output lists the new failing rules by name | Create a test PR where a packet fails on rules {A, B, C} at base and {A, D, E} at head; verify the gate reports the new rules {D, E} | Unmet | - |
| AC-006 | REQ-004 | Given the weekly sweep configuration with a previous artifact, When the sweep runs, Then the baseline is loaded and packets that passed before report as `known-failure` when they still fail | Download the previous sweep artifact and pass it as `--baseline`; run the sweep and verify packets that passed before show `known-failure` (not `first-run`) when they still fail | Unmet | - |
| AC-007 | - | Given multiple test scenarios (pass-to-fail, fail-to-fail-different-rules, baseline-present, baseline-absent), When the gates run on test data, Then each scenario produces its expected outcome with evidence recorded in implementation-summary.md | Create test scenarios with expected outcomes; run each and record evidence (gate output, rule sets, baseline presence, reported status) in implementation-summary.md | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No (Phase is planned, not built)

When the phase is built and all AC rows show `Met`, this packet may close.
<!-- /ANCHOR:closure -->
