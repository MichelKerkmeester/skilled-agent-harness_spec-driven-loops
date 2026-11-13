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
    recent_action: "Closed AC-002, all eight criteria are Met"
    next_safe_action: "Review the branch, then decide on push and merge"
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
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`K` is `.skilled/skills/system-spec-kit`. `W` is `K/runtime/cli/retrieval/rg-wrapper.mjs`. `PHRASE` is a phrase that lives only under `specs/sk-doc/z_archive/`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `PHRASE`, When `node W --include-archive` searches it, Then the run exits 0 and every row is labeled `archived` | `PHRASE` is "skill routing refactor". The path recipe with `--include-archive` exited 0 and printed 2 paths, both ending `[archived]`. The structured recipe with `--json` returned 2 rows, both `archived: true`, and `includeArchive: true` | Met | - |
| AC-002 | REQ-002 | Given `PHRASE`, When `node W` searches it without the flag, Then the run exits 1, and `generate-trigger-index.mjs --check` exits 0 | Without the flag the argument vector still holds `--glob '!**/z_archive/**'`, the run exits 1 with 0 paths and the JSON record holds no `jsonLane` and no `archived` field. `generate-trigger-index.mjs --check` exited 1 during the build, because 33 documents of this packet were new since the index was last built and not because of the code of this phase. The orchestrator regenerated the index and committed it as `f1cfed3d20`, and the check then exited 0 with 0 untrusted docs | Met | - |
| AC-003 | REQ-003 | Given the `packet_id` of an archived packet, When `node W --include-archive` searches it, Then the report holds a `graph-metadata.json` or `description.json` path under `z_archive` | `node W path "sk-doc/z_archive/019-skill-routing-refactor" --include-archive --limit 2` exited 0 and printed a `json    : 308 archived metadata file(s)` section. 154 of its lines are `graph-metadata.json` paths ending `[archived]`. A phrase that exists nowhere exited 1 with `json    : 0 archived metadata file(s)` | Met | - |
| AC-004 | REQ-004 | Given `specs/sk-doc`, a subtrack with one archived packet and a phase parent with one archived phase, When `validate.sh <folder> --recursive --include-archive` runs on each, Then each archived packet gets its own `RESULT:` line, and without the flag none does | Track depth observed: `validate.sh specs/sk-doc --recursive --include-archive` printed 73 `RESULT:` lines, one of them for `specs/sk-doc/z_archive/019-skill-routing-refactor`. Without the flag the run printed 25 `RESULT:` lines, none holding `z_archive`, exit 0, and its output with timings stripped was identical to the run with the script from before the change. Subtrack and phase depth observed through `tests/validate-archive-recursive.vitest.ts`, which runs the real `validate.sh` in temp trees and not on the real tree: its cases "visits an archived sub-track packet only with --include-archive" and "visits an archived phase beside a phase parent only with --include-archive" pass, 5 of 5 in the file, and each asserts that the archived folder is reported with the flag and absent without it | Met | - |
| AC-005 | REQ-005 | Given every `z_archive/` under `specs`, When `repair-derived.cjs --roots <archive>` runs as a dry run after the apply, Then it exits 0 and the measured count of non-null `parent_id` records is 0 | After the fix to `repair-derived.cjs` and `--apply` on the 31 packets that still recorded their archive as parent, the dry run exits 0 for all 53 `z_archive/` folders and 0 of 267 archived packets record a non-null `parent_id`. The T001 count before the phase was 35 of 267 | Met | - |
| AC-006 | REQ-006 | Given the regenerated cache, When its rows are checked against the disk, Then no row names a missing folder, and an archive followed by a restore in a scratch tree leaves the cache matching the disk both times | Cache observed: after the producer run on the real tree `specs/descriptions.json` holds 5152 rows, 0 dead rows and 2213 rows under `z_archive`. The T002 count before was 1334 of 3916. Archive observed in a throwaway clone: `archive.sh --force specs/cli-classifier/006-jev-feature-auto-enable` exited 0 in 13 seconds, and the cache then held no row for the old path, one row for `cli-classifier/z_archive/006-jev-feature-auto-enable` and 0 dead rows. Restore observed in a throwaway clone after that archive: `archive.sh --restore specs/cli-classifier/z_archive/006-jev-feature-auto-enable` exited 0, and the cache then held a row for `cli-classifier/006-jev-feature-auto-enable`, no row for the archived path and 0 dead rows | Met | - |
| AC-007 | REQ-007 | Given the two docs, When they are searched, Then each names `--include-archive` with one recipe and `search.md` says resume excludes archives | `rg -c -e "--include-archive"` printed 1 or more for `search.md` and for `retrieval-conventions.md`. Read in the diff of commit `05a83a7d88`: `search.md` shows the path recipe with `PHRASE` and says `/speckit:resume` excludes archives. `retrieval-conventions.md` names the flag beside the glob rules, in the glob order note and in the coverage row, in prose and with no command line of its own | Met | - |
| AC-008 | REQ-008 | Given the four files, When the corrected lines are read, Then none says `z_archive` is excluded from the description cache or that nothing re-derives an archived packet | `rg -c "staging and archive"` on `folder-discovery.ts` and `rg -c "nothing re-derives it"` on `orchestrator.ts` print nothing, and `npm run build` in `K/runtime` exited 0. The two `ENV-REFERENCE.md` rows and the `README.md` row name only z-future as excluded. Read in the diff of commit `05a83a7d88`: each of the three says `z_archive` stays in | Met | - |

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

All 8 criteria are Met with evidence the orchestrator observed on 2026-11-13.

- AC-002 closed last. `generate-trigger-index.mjs --check` exited 1 during the build because 33 documents of this packet were new since the index was last built. The orchestrator regenerated the index and committed it as `f1cfed3d20`, and the check then exited 0 with 0 untrusted docs.

AC-004 closed on the two vitest cases at subtrack and phase depth, and AC-006 closed on the restore run in a throwaway clone. `npm test` after the build exits 0 with counts identical to `scratch/baseline.txt`. The suites that cover this phase were written in phase 005 and are in commit `5fefd819e1`.
<!-- /ANCHOR:closure -->
