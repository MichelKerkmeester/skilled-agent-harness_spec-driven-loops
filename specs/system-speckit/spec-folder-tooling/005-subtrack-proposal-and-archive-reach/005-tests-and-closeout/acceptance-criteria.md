---
title: "Acceptance Criteria: Phase 5: tests-and-closeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "tests and closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-tests-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: tests-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`K` is `.skilled/skills/system-spec-kit`. Every `npx vitest run` command runs in `K/runtime/cli`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a temp repository built by `buildSubtrackTree`, When `npx vitest run tests/relocate.vitest.ts` runs, Then it exits 0 with passing cases for move, renumber, re-parent, a refusal, a second run that writes nothing and an inbound reference rewrite | The vitest report lists the six case names as passed | Unmet | - |
| AC-002 | REQ-002 | Given fixture tracks at 7 and 9 packets, When `npx vitest run tests/suggest-subtracks.vitest.ts` runs, Then it exits 0 with passing cases for the whole-track map, the threshold and the present-time fit | The vitest report lists the three case names as passed | Unmet | - |
| AC-003 | REQ-003 | Given an archived `007-b` beside a live `001-a`, When `npx vitest run tests/archive-numbering.vitest.ts` runs, Then it exits 0 and the specs root, track and subtrack cases each assert `008` | The vitest report lists three passed cases | Unmet | - |
| AC-004 | REQ-004 | Given a tree with one archived document, When `npx vitest run tests/rg-include-archive.vitest.ts` runs, Then it exits 0 and asserts the unchanged default vector and an `archived` hit under the flag | The vitest report | Unmet | - |
| AC-005 | REQ-005 | Given archived packets at track, subtrack and phase depth, When `npx vitest run tests/validate-archive-recursive.vitest.ts` runs, Then it exits 0 and asserts that each is reached with the flag and none without it | The vitest report | Unmet | - |
| AC-006 | REQ-006 | Given the baseline in `001-relocation-engine/scratch/baseline.txt`, When `npm test` runs in `K/runtime/cli` from the final state, Then it exits 0 and the fail count is not above the baseline | The final pass and fail counts beside the baseline counts | Unmet | - |
| AC-007 | REQ-007 | Given a sample map, When `relocate.mjs --map` runs as a dry run on the real tree and with `--apply` twice in a throwaway copy, Then the dry run changes nothing and the second apply exits 0 with nothing to do | `git status --porcelain` on the real tree and both exit codes in the copy | Unmet | - |
| AC-008 | REQ-008 | Given a real flat track with more than eight packets, When its `suggest-subtracks.mjs` map is passed to `relocate.mjs --map`, Then preflight accepts it | The dry run exits 1 and not 2 | Unmet | - |
| AC-009 | REQ-009 | Given the final tree, When `sweep-track-roots.mjs` and `generate-trigger-index.mjs --check` run, Then the sweep exits 0 apart from the known `ai-systems` drift and the check exits 0 | Both outputs and exit codes | Unmet | - |
| AC-010 | REQ-010 | Given a phrase that lives only in `specs/sk-doc/z_archive/`, When `/speckit:search` runs with and without the archive mode, Then only the run with the mode returns a hit and that hit is labeled `archived` | Both search reports | Unmet | - |
| AC-011 | REQ-011 | Given every child with a filled `implementation-summary.md`, When `validate.sh --strict --recursive` runs on the parent folder, Then it prints `RESULT: PASSED` for the parent and all five children | The six `RESULT:` lines | Unmet | - |

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
