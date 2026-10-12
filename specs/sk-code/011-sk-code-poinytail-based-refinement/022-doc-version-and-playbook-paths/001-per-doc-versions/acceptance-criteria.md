---
title: "Acceptance Criteria: Per-doc versions"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "per doc versions acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions"
    last_updated_at: "2026-10-12T05:21:02Z"
    last_updated_by: "builder"
    recent_action: "Marked every criterion Met from final-state evidence"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-001-ac"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Per-doc versions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions
**Level:** 2
**Status:** Complete
**Date:** 2026-10-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the built phase, When `frontmatter-version.mjs verify` runs from the repository root, Then it exits 0 and a doc with frontmatter and no version makes it exit non-zero | `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify`; Tests table row for `verify` on a doc with no version | Met | - |
| AC-002 | REQ-002 | Given a staged in-scope doc whose body changed and whose version did not go up, When the commit runs, Then the hook raises the version and re-stages the file, and with the bypass variable set it does not | Tests table row for the hook auto-bump | Met | - |
| AC-003 | REQ-003 | Given a pull request that changes a doc body without raising its version, When the check runs, Then it fails and prints the one command that fixes it | Tests table row for the pull-request check | Met | - |
| AC-004 | REQ-004 | Given the files 31888d05bb touched, When each that still exists is read, Then each carries a 4-part `version:` line | `git show --format= --name-only 31888d05bb` piped to a per-file `grep -qE` for the line prints nothing | Met | - |
| AC-005 | REQ-005 | Given the ledger in `implementation-summary.md`, When its rows are counted, Then all 8 are Fixed with a backticked proof or Closed with a reason | `grep -cE` over the ledger prints 8 | Met | - |
| AC-006 | REQ-006 | Given `frontmatter-versioning.md`, When it is read, Then it states the per-doc contract, the bump rule, the out-of-scope classes and the bypass variable | PV-R2 ledger line | Met | - |
| AC-007 | REQ-007 | Given any sk-doc doc template, When it creates a doc, Then the doc carries `version: 1.0.0.0` | Tests table row for template seeding | Met | - |
| AC-008 | REQ-008 | Given this phase's commits, found by their Spec trailer, When their changelog additions are listed, Then sk-doc has exactly one and its `SKILL.md` version went up, and no skill has two | The bump command in `goal.md` prints ok | Met | - |
| AC-009 | REQ-009 | Given the Tests table, When its rows are read, Then every row shows a non-zero exit before and exit 0 after, and T1 to T4 exist | The Tests table command in `goal.md` prints ok | Met | - |

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

**Closeable:** Yes

All nine criteria are Met. AC-001, AC-004 and AC-005 rest on commands rerun from the final state; AC-002, AC-003, AC-007 and AC-009 on the Tests table in `implementation-summary.md`; AC-006 on the PV-R2 ledger line; AC-008 on the bump criterion in `goal.md`.
<!-- /ANCHOR:closure -->
