---
title: "Acceptance Criteria: Phase 3: measure the residue and declare the unhealable"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-derived-artifact-registry/003-measure-and-declare"
    last_updated_at: "2026-09-11T06:37:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "specs/system-speckit/035-derived-artifact-registry/003-measure-and-declare/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-measure-and-declare"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: measure the residue and declare the unhealable

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/035-derived-artifact-registry/003-measure-and-declare
**Level:** 3
**Status:** Draft
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given one fixture tree, When `repair-derived.cjs` runs in text mode and JSON mode, Then the inspected, repairable and failed counts and the exit code agree | `runtime/cli/tests/repair-derived.vitest.ts`, parity case | Unmet | - |
| AC-002 | REQ-002 | Given a tree with refusals, When `heal-spec-docs.cjs --format json` runs, Then every refusal carries its document path and reason and the count matches text mode | `runtime/cli/tests/heal-spec-docs.vitest.ts`, census case | Unmet | - |
| AC-003 | REQ-003 | Given the extended weekly job, When it runs over the current tree, Then the repairable and refused counts appear in its artifact and summary | A local run of the step plus a workflow dispatch run | Unmet | - |
| AC-004 | REQ-004 | Given `runtime/cli/lib/unhealable-documents.json`, When it is read, Then every entry carries a path and a reason and the list is sorted | File contents compared with the T004 census | Unmet | - |
| AC-005 | REQ-005 | Given a fixture where one refusal is undeclared and one declared entry is no longer refused, When the job's comparison runs, Then both are listed in its report | `runtime/cli/tests/heal-spec-docs.vitest.ts`, declaration fixture case | Unmet | - |
| AC-006 | REQ-006 | Given a scratch worktree, When the extended workflow command runs, Then `git status --porcelain` is byte-identical and the step passes no `--apply` | Scratch-worktree run plus a read of the workflow file | Unmet | - |
| AC-007 | REQ-007 | Given one unchanged tree, When the measurement runs twice, Then both runs report the same counts and the recorded baseline equals them | Two runs of the repair command with their exit codes recorded | Unmet | - |

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

**Closeable:** No

Every criterion is `Unmet` until the phase executes. AC-001 and AC-005 carry the packet, because a count that disagrees with the text mode and a declaration that is checked in one direction only are both worse than no report at all. No row is waived, so no ADR is referenced here.
<!-- /ANCHOR:closure -->
