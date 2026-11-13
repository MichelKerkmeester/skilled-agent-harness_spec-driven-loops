---
title: "Acceptance Criteria: Phase 4: archive-search-and-json"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "archive search and json acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/004-archive-search-and-json"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-archive-search-and-json"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: archive-search-and-json

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/004-archive-search-and-json
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`K` is `.skilled/skills/system-spec-kit`. `W` is `K/runtime/cli/retrieval/rg-wrapper.mjs`. `PHRASE` is a phrase that lives only under `specs/sk-doc/z_archive/`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `PHRASE`, When `node W --include-archive` searches it, Then the run exits 0 and every row is labeled `archived` | The report of the run | Unmet | - |
| AC-002 | REQ-002 | Given `PHRASE`, When `node W` searches it without the flag, Then the run exits 1, and `generate-trigger-index.mjs --check` exits 0 | Both exit codes | Unmet | - |
| AC-003 | REQ-003 | Given the `packet_id` of an archived packet, When `node W --include-archive` searches it, Then the report holds a `graph-metadata.json` or `description.json` path under `z_archive` | The report of the run | Unmet | - |
| AC-004 | REQ-004 | Given `specs/sk-doc`, a subtrack with one archived packet and a phase parent with one archived phase, When `validate.sh <folder> --recursive --include-archive` runs on each, Then each archived packet gets its own `RESULT:` line, and without the flag none does | The count of `RESULT:` lines with and without the flag, at the three depths | Unmet | - |
| AC-005 | REQ-005 | Given every `z_archive/` under `specs`, When `repair-derived.cjs --roots <archive>` runs as a dry run after the apply, Then it exits 0 and the measured count of non-null `parent_id` records is 0 | The dry-run exit code and the T001 count measured again | Unmet | - |
| AC-006 | REQ-006 | Given the regenerated cache, When its rows are checked against the disk, Then no row names a missing folder, and an archive followed by a restore in a scratch tree leaves the cache matching the disk both times | The T002 count measured again prints 0, and the scratch run | Unmet | - |
| AC-007 | REQ-007 | Given the two docs, When they are searched, Then each names `--include-archive` with one recipe and `search.md` says resume excludes archives | `rg -c -e "--include-archive" .skilled/commands/speckit/search.md K/references/retrieval/retrieval-conventions.md` prints a count for both files | Unmet | - |
| AC-008 | REQ-008 | Given the four files, When the corrected lines are read, Then none says `z_archive` is excluded from the description cache or that nothing re-derives an archived packet | `rg -c "nothing re-derives it" K/runtime/lib/validation/orchestrator.ts` prints nothing, and the three other lines read back | Unmet | - |

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
