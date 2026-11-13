---
title: "Acceptance Criteria: Phase 3: subtrack-archive-and-numbering"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "subtrack archive and numbering acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/003-subtrack-archive-and-numbering"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-subtrack-archive-and-numbering"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: subtrack-archive-and-numbering

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/003-subtrack-archive-and-numbering
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`C` is `.skilled/skills/system-spec-kit/runtime/cli/spec`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a scratch tree with a declared subtrack `demo/sub` and no archive folder, When `node C/refresh-track-roots.mjs --track demo/sub --apply` runs, Then `demo/sub/z_archive/.gitkeep` exists, a second run changes nothing and a run without `--apply` writes nothing | `ls` of the scratch tree after each of the three runs | Unmet | - |
| AC-002 | REQ-002 | Given the same scratch tree before seeding, When `node C/sweep-track-roots.mjs` runs, Then it prints one line that names `demo/sub` as lacking `z_archive/`, and no such line after seeding | The sweep output before and after | Unmet | - |
| AC-003 | REQ-003 | Given the real tree after seeding and the operator's commit, When `git ls-files 'specs/*/*/z_archive/.gitkeep'` runs, Then it prints 40 lines | The command output piped to `wc -l` prints 40 | Unmet | - |
| AC-004 | REQ-004 | Given `specs/demo/001-a` live and `specs/demo/z_archive/007-b` archived in a scratch tree, When `create.sh --track demo --skip-branch` runs, Then the new folder is `specs/demo/008-*` | `ls <scratch>/specs/demo` lists a folder that starts with `008-` | Unmet | - |
| AC-005 | REQ-005 | Given `create-root-numbering.vitest.ts`, When the suite runs before and after the `create.sh` change, Then the archive case fails before and passes after | `npx vitest run tests/create-root-numbering.vitest.ts` output for both runs | Unmet | - |
| AC-006 | REQ-006 | Given the two docs, When they are searched for the subtrack archive, Then each names it | `rg -c -i "sub-track" .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` and the line 112 text of `C/README.md` | Unmet | - |

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

No work has started, so every criterion is unmet.
<!-- /ANCHOR:closure -->
