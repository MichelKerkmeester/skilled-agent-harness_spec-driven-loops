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
    recent_action: "Closed all eleven criteria, ten Met and AC-008 Superseded by ADR-001"
    next_safe_action: "Review the branch, then decide on push and merge"
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
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`K` is `.skilled/skills/system-spec-kit`. Every `npx vitest run` command runs in `K/runtime/cli`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a temp repository built by `buildSubtrackTree`, When `npx vitest run tests/relocate.vitest.ts` runs, Then it exits 0 with passing cases for move, renumber, re-parent, a refusal, a second run that writes nothing and an inbound reference rewrite | The file holds 12 cases. The five new files together gave 31 passed, exit 0, at commit `5fefd819e1`, and commit `36b3a68ab7` added the empty-map case, which passes. Its cases: move, renumber, re-parent, five refusals each asserting exit 2 and an unchanged tree, dry run by default, a second apply that changes nothing, an empty map as nothing to do and an inbound reference rewrite with the prefix-id pair. The suite builds its tree with its own helpers and not with `buildSubtrackTree`. Limit: its temp repository runs the real `relocate.mjs`, `refresh-track-roots.mjs` and `lib/track-roots.mjs`, and the other follow-up tools are stubs there | Met | - |
| AC-002 | REQ-002 | Given fixture tracks at 7 and 9 packets, When `npx vitest run tests/suggest-subtracks.vitest.ts` runs, Then it exits 0 with passing cases for the whole-track map, the threshold and the present-time fit | 6 cases pass. Read in the file: "maps every packet of a flat track to a proposed sub-track", "withholds a map below the threshold and prints one when the threshold drops" and "names the best-fitting declared sub-track and says when none fits", plus a missing track, an unchanged tree and, since commit `36b3a68ab7`, a track that holds no packets. The threshold case uses a 6-packet track and `--threshold 4` in place of 7 packets | Met | - |
| AC-003 | REQ-003 | Given an archived `007-b` beside a live `001-a`, When `npx vitest run tests/archive-numbering.vitest.ts` runs, Then it exits 0 and the specs root, track and subtrack cases each assert `008` | 4 cases pass: specs root, track, sub-track and a lower-only archive. Read in the file: the first three each expect `008-after-archive` | Met | - |
| AC-004 | REQ-004 | Given a tree with one archived document, When `npx vitest run tests/rg-include-archive.vitest.ts` runs, Then it exits 0 and asserts the unchanged default vector and an `archived` hit under the flag | 6 cases pass. Read in the file: "keeps the archive exclusion in the default vector for every recipe", and the archive-only phrase case expects exit 1 without the mode, then one row with `archived: true` and a summary line ending `[archived]` with it | Met | - |
| AC-005 | REQ-005 | Given archived packets at track, subtrack and phase depth, When `npx vitest run tests/validate-archive-recursive.vitest.ts` runs, Then it exits 0 and asserts that each is reached with the flag and none without it | 5 of 5 pass. The suite runs the real `validate.sh` in temp trees. The track, sub-track and phase parent cases each assert the archived folder is reported with the flag and absent without it | Met | - |
| AC-006 | REQ-006 | Given the baseline in `001-relocation-engine/scratch/baseline.txt`, When `npm test` runs in `K/runtime/cli` from the final state, Then it exits 0 and the fail count is not above the baseline | Final at commit `f1cfed3d20`, in `scratch/final-npm-test.txt`: exit 0, 211 files passed and 3 skipped, 2558 tests passed and 20 skipped, 0 failed in every legacy stage. Baseline: 206 files and 2524 tests passed, 0 failed. Delta: 5 files and 34 tests more, 0 failures in both | Met | - |
| AC-007 | REQ-007 | Given a sample map, When `relocate.mjs --map` runs as a dry run on the real tree and with `--apply` twice in a throwaway copy, Then the dry run changes nothing and the second apply exits 0 with nothing to do | Real tree: `relocate.mjs --map 001-relocation-engine/scratch/sample-map.json` exited 1 with `moves=1 moved=0 rewrites=33 identity=1 roots=3 ledger=1`, and `git status --porcelain` was identical before and after. Throwaway clone of the final commit with its own runtime build: `--apply` exited 0 with "applied 1 move(s)", sweep ok and validate `RESULT: PASSED` for the moved packet. A second `--apply` exited 0 with "nothing to do" | Met | - |
| AC-008 | REQ-008 | Given a real flat track with more than eight packets, When its `suggest-subtracks.mjs` map is passed to `relocate.mjs --map`, Then preflight accepts it | Not observed on a real track: none holds more than eight live packets, and the largest, `cli-classifier`, holds 6. Observed on a fixture: in the clone a committed 10-packet track `demo` gave `suggest-subtracks.mjs --track demo` exit 0 with a 10-entry map, and `relocate.mjs --map` on it exited 1 and not 2 with `moves=10 moved=0 rewrites=11 identity=10 roots=3 ledger=10`. The operator answered "Accept the fixture (Recommended)", recorded as Q003 in `decision-record.md`, and ADR-001 there supersedes this row with the fixture run as its evidence | Superseded | ADR-001 |
| AC-009 | REQ-009 | Given the final tree, When `sweep-track-roots.mjs` and `generate-trigger-index.mjs --check` run, Then the sweep exits 0 apart from the known `ai-systems` drift and the check exits 0 | `sweep-track-roots.mjs` on this worktree exited 0 with "all track roots match their declared children" and no missing-archive line. The trigger index was regenerated and committed as `f1cfed3d20`, and `generate-trigger-index.mjs --check` then exited 0 with 0 untrusted docs | Met | - |
| AC-010 | REQ-010 | Given a phrase that lives only in `specs/sk-doc/z_archive/`, When `/speckit:search` runs with and without the archive mode, Then only the run with the mode returns a hit and that hit is labeled `archived` | `rg-wrapper.mjs path "skill routing refactor"` exits 1 with 0 paths. With `--include-archive` it exits 0 with 2 paths under `specs/sk-doc/z_archive/019-skill-routing-refactor/`, each ending `[archived]`. This is the wrapper `/speckit:search` documents, run directly. The slash command itself was not run | Met | - |
| AC-011 | REQ-011 | Given every child with a filled `implementation-summary.md`, When `validate.sh --strict --recursive` runs on the parent folder, Then it prints `RESULT: PASSED` for the parent and all five children | Run by the final closeout worker on 2026-11-13 after the last document edit: six `RESULT: PASSED` lines. `rg -o '\[YOUR_VALUE_HERE:'` over the five `implementation-summary.md` files printed nothing | Met | - |

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

10 of the 11 criteria are Met with evidence observed on 2026-11-13, and one is Superseded by a decision record. None blocks closure.

- AC-008 is Superseded by ADR-001 in `decision-record.md`. It names a real flat track with more than eight packets. No such track exists, and the largest holds 6. The operator accepted the 10-packet fixture track in a throwaway clone in its place, recorded as Q003.
- AC-009 closed when the trigger index was regenerated and committed as `f1cfed3d20` and `generate-trigger-index.mjs --check` exited 0 with 0 untrusted docs.

The five suites are in commits `5fefd819e1` and `36b3a68ab7` and hold 33 cases. `npm test` at `f1cfed3d20` exits 0 with 5 files and 34 tests more than the baseline and 0 failures in both. Nothing is pushed or merged.
<!-- /ANCHOR:closure -->
