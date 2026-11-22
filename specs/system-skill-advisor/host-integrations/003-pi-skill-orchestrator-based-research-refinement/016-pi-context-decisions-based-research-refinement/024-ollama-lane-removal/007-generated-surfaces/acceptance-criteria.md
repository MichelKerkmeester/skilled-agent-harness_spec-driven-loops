---
title: "Acceptance Criteria: Phase 7: generated-surfaces"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "generated surfaces acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces"
    last_updated_at: "2026-11-21T00:00:00Z"
    last_updated_by: "plan-author"
    recent_action: "Wrote one acceptance row per requirement"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-generated-surfaces"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: generated-surfaces

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/007-generated-surfaces
**Level:** 2
**Status:** Draft
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given T008's regeneration, When `cmp` runs on the four outputs against a fresh `--out` copy before any doc edit, and `--check` and `samecontent` run from the final tree, Then `cmp` prints nothing, `--check` exits 0 with 0 stale, 0 obsolete and 0 untrusted, and `samecontent` prints `equal=4` | T008 and T009 output; T019's lines in `scratch/final-check.txt`. Observed: T008 `--check` exit 0 with 0 stale, 0 obsolete and 0 untrusted; T009 `cmp` silent with exit 0 for all four outputs before any doc edit; from the final tree `--check` exit 0 with 0 stale, 0 obsolete and 0 untrusted, and `samecontent` printed `equal=4`. Strict `cmp` from the final tree differs only because the doc body edits moved `manifestHash` and `corpusHash`, as ADR-005 expects | Met | - |
| AC-002 | REQ-002 | Given a fresh generation in `$T`, When `derived` and `oldnames` run on it, Then `derived` exits 0 ending `outside=0` and `oldnames` prints `old=0 lane-fusion=2` | T010 output; T019's `derived` line. Observed: `derived` printed `lane paths=1069 lane phrase keys=389 outside=0`, exit 0, on the T010 and final generations; `oldnames` printed `old=0 lane-fusion=2` on both | Met | - |
| AC-003 | REQ-003 | Given a clean build and `capture-scorer-eval-baseline.mjs --write`, When `scorecheck "$S"`, `git diff --numstat`, the `capturedAt` read, `hits`, the ratchet and the capture-date test run, Then `scorecheck` prints `differing=2 [capturedAtSha, env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC]` and `score fields=21 differing=0`, numstat prints `1` and `2`, `capturedAt` is `2026-10-11`, `hits` prints `lines=0`, the ratchet passes 7 and the capture-date test 2 | T004, T005 and T012 output. Observed: clean build exit 0; `scorecheck` printed `fields=30 differing=2 [capturedAtSha, env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC]` and `score fields=21 differing=0`; numstat `1` and `2`; `capturedAt` `2026-10-11`; `hits` `lines=0`; ratchet 7 passed; capture-date `Tests  2 passed (2)` | Met | - |
| AC-004 | REQ-004 | Given the four allowlist rows, When `sweep-lane-residue.mjs repo` and its `--json` run, Then it exits 0 with `live        : 0`, `counts.allowlistRows` is `N0` plus 4, `unusedAllowlistRows` is `[]`, and the four new rows name exactly the four index outputs | T006 and T011 output; T019's residue line. Observed: repo mode exit 0 with `live        : 0`; `counts.allowlistRows` 50 (N0 46 plus 4), all matched; `unusedAllowlistRows` `[]`; `git diff -U0` shows exactly four added `path` keys, naming the four index outputs | Met | - |
| AC-005 | REQ-005 | Given phase 006's export, When the freshness panel, the compiler's validation, a scratch export compare and `hits` run, Then freshness exits 0 with `SIGNAL DRIFT compiled vs disk: none`, validation prints `VALIDATION PASSED`, the compare prints `true`, `hits` prints `lines=0`, and `git diff --name-only "$S"` does not list the export | T013 output. Observed: freshness exit 0 with `SIGNAL DRIFT compiled vs disk: none`; `VALIDATION PASSED: all metadata files are valid`; scratch export compare `true`; `hits` `lines=0`; `git diff --name-only "$S"` printed nothing for the export | Met | - |
| AC-006 | REQ-006 | Given the conductor's answer to open question 1, When `cite-drift-scan.mjs`, the gate and the two node suites run, Then the scan exits 0 with an empty stderr, rows `live-14` and `constructed-16` are unchanged, the gate prints T002's report-only line, and both suites pass with T002's counts | T007 and T014 output; under option B this row is `Waived` by ADR-004 with the answer recorded. Observed: option A applied; scan exit 0 with 0 bytes of stderr; `live-14` and `constructed-16` byte-identical to S; gate printed `278 unresolved or past-end citations, report only`, as at T002; scan suite 67 of 67 and gate suite 5 of 5, as at T002 | Met | - |
| AC-007 | REQ-007 | Given the regenerated baseline, When the three ratchet files, the routing corpus command and `git diff --stat "$S"` over `routing-accuracy` and `tests/parity/fixtures` run, Then the ratchets pass 7, 9 and 6, the corpus exits 0 with `overall_pass: true` and T003's numbers, and the diff lists only `scorer-eval-baseline.json` | T003 and T012 output. Observed: ratchets 7, 9 and 6 passed, 22 total, as at T003; corpus exit 0 with `overall_pass: true`, `rows` 196, `accuracy` 0.602, `f1` 0.9844, `TT` 115, `FT` 3, `FF` 1, as at T003; `git diff --stat` listed only `scorer-eval-baseline.json` | Met | - |
| AC-008 | REQ-008 | Given the phase's changes, When bridges `--check`, both leaf manifest checks and the link check run, Then bridges exits 0 with `"changed": []`, both print `leaf-manifest.json OK`, and the link check prints `0 broken` | T015 output. Observed: bridges exit 0 with `"changed": []`; both leaf checks printed `leaf-manifest.json OK`; links printed `0 broken` | Met | - |
| AC-009 | REQ-009 | Given the final tree, When `git status --short` runs and `--check` reruns after T017, Then outside `specs/` only the five generated files, the allowlist and, under option A, the labels file are changed, no tracked spec doc is changed, and `--check` still prints 0 stale | T016, T017 and T019 output in `scratch/final-check.txt`. Observed: outside `specs/` the changed files are the five generated files, `lane-residue-allowlist.json`, `cite-drift-labels.jsonl` and `residue-allowlist.json`, the last being the memory sweep's reworded baseline reason the conductor's resolution in `spec.md` open questions added to this phase; no tracked spec doc changed; `--check` after the doc edits printed `stale documents   : 0`. The T019 results were in `scratch/final-check.txt` and were copied to the session scratchpad before the conductor's `scratch/` cleanup | Met | - |

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

**Closeable:** Yes, on the criteria

All nine rows are `Met` with observed evidence. The conductor answered open question 1 with option A, so AC-006 needed no waiver. `implementation-summary.md` and the spec status are left to the conductor.
<!-- /ANCHOR:closure -->
