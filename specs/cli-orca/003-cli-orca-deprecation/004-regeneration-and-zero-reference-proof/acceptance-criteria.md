---
title: "Acceptance Criteria: Phase 4: regeneration-and-zero-reference-proof"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: regeneration-and-zero-reference-proof

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-regeneration-and-zero-reference-proof
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the repository, When the residue sweep runs, Then every hit is on the keep list | implementation-summary.md Verification | Met | - |
| AC-002 | REQ-002 | Given the touched suites, When each reruns, Then none has a failure its baseline lacked | `scratch/after-exits.txt` and implementation-summary.md Verification | Met | - |
| AC-003 | REQ-003 | Given mcp-tooling, When `compiled-route-status.cjs` runs, Then it reports compiled-serving | implementation-summary.md Verification | Met | - |
| AC-004 | REQ-004 | Given the prompt `list my orca worktrees and open a terminal in the new one`, When the advisor scores it, Then it recommends nothing | implementation-summary.md Verification | Met | - |

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

Every criterion above is Met with observed evidence, so this phase may close.
<!-- /ANCHOR:closure -->
