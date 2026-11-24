---
title: "Acceptance Criteria: Phase 3: docs-registries-and-skill-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: docs-registries-and-skill-removal

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-docs-registries-and-skill-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited docs and registries, When `rg -n -i orca` runs over them, Then it prints nothing | implementation-summary.md Verification | Met | - |
| AC-002 | REQ-002 | Given the deletion, When `git status` and `find . -xtype l` run, Then 62 paths are deleted and no link dangles | implementation-summary.md Verification | Met | - |
| AC-003 | REQ-003 | Given the three graph files, When each is parsed, Then it is valid JSON | implementation-summary.md Verification | Met | - |

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
