---
title: "Acceptance Criteria: Legacy-era report and detection"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "legacy era report acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Legacy-era report and detection

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report
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
| AC-001 | REQ-001 | Given a fixture with 20 packets, when PacketClassifier walks it, then every packet is counted exactly once | Exit 0 from unit test with fixture walk counts matching assertions | Unmet | - |
| AC-002 | REQ-001 | Given a packet in lineages/, scratch/, z_archive/00-changelog, or marked git-ignored, when the classifier walks the tree, then it is excluded from the report | Exit 0 from exclusion test case covering all four types | Unmet | - |
| AC-003 | REQ-002 | Given the spec tree with both v3 `.opencode/specs` and v4 `specs/`, when the classifier detects layout, then it returns layout:v3 for the old tree and layout:v4 for the new tree | Exit 0 from layout detection test cases | Unmet | - |
| AC-004 | REQ-003 | Given the era report, when it is invoked multiple times on the same corpus, then the packet count is consistent across runs | Report output shows identical packet count in two consecutive runs | Unmet | - |
| AC-005 | REQ-004 | Given documents with `impl-summary-core`, `implementation-summary-core`, and `implementation-summary` headers, when the classifier applies aliases, then each resolves to the canonical `implementation-summary` name | Exit 0 from alias normalization test cases | Unmet | - |
| AC-006 | REQ-005 | Given a fixture with pre-v4 signal examples, when the era report runs, then it detects and counts each of five signals separately | Report output shows counts for each signal type in fixture | Unmet | - |
| AC-007 | REQ-006 | Given the latest spec-kit CLI test suite, when repo-era.mjs is added and tests run, then no new test failure is introduced | Exit 0 from `npm --prefix .skilled/skills/system-spec-kit test` | Unmet | - |
| AC-008 | REQ-003 | Given the era report performance characteristics, when the module is used in production, time budget is not recorded | Not recorded: time budget is an open question for Phase 8 | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
