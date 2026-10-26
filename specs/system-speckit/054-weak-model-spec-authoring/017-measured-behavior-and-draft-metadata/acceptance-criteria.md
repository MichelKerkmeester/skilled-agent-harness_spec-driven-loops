---
title: "Acceptance Criteria: Phase 17: measured-behavior-and-draft-metadata"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "measured behavior and draft metadata acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata"
    last_updated_at: "2026-10-26T18:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Recorded both full suites; every row Met"
    next_safe_action: "Commit the tree, then pin the commit SHA in implementation-summary.md (CHK-FIX-007)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-017-measured-behavior-and-draft-metadata"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 17: measured-behavior-and-draft-metadata

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-recommend-level-quiet`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--quiet` runs, Then `wc -l` prints 1. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited `spec.md.tmpl`, When a reader counts its anchors and H2 headings, Then it holds one `measured-behavior` anchor after the `problem` anchor and no H2 for it | `rg -c 'ANCHOR:measured-behavior' .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` prints 2; `rg -n '^## .*[Mm]easured' .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` prints nothing; `check-example-drift.sh` exits 0. Observed: `2`; the H2 `rg` printed nothing, exit 1; the anchor opens at line 109, two lines after `/ANCHOR:problem` at line 107; `EXAMPLE_DRIFT_OK`, exit 0 Evidence: `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:109` | Met | - |
| AC-002 | REQ-002 | Given specs at the new stamp, When `MEASURED_BEHAVIOR` runs on a missing block, an empty fence, a filled fence and an `N/A:` line with a reason, Then it reports warn, warn, pass, pass and never error | `npx vitest run --config vitest.config.ts --project cli tests/measured-behavior-rule.vitest.ts` from `.skilled/skills/system-spec-kit` prints every test passed. Observed: `Tests 7 passed (7)`, exit 0, with cases for a missing block, an empty fence, a filled fence, `N/A:` with and without a reason, a v2.3 stamp and never `fail` Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/measured-behavior-rule.vitest.ts:69` | Met | - |
| AC-003 | REQ-003 | Given the 4757 folders in the shared census list (`016-scaffold-filler-section-trim/scratch/baseline/census-list.txt`, every folder except 054 phases 015 to 018), When the strict and six-rule censuses rerun after the change, Then every row matches the baseline and no row reports a `MEASURED_BEHAVIOR` warning | From that baseline folder: `diff <(sort census-before.tsv) <(sort census-after.tsv)` and the same for `rules-*.tsv` print nothing; `rg -c '=warn\|=error' measured-after.tsv` prints nothing. Observed: both diffs printed nothing, exit 0; 4757 rows, 4562 PASS and 195 FAIL before and after; the `rg` printed nothing, exit 1, and all 4757 rows read `MEASURED_BEHAVIOR=pass` Evidence: `../016-scaffold-filler-section-trim/scratch/baseline/census-after.tsv:1` | Met | - |
| AC-004 | REQ-004 | Given a Draft packet whose only error is stale `graph-metadata.json`, When `validate.sh <packet> --strict` runs once, Then it prints the rewritten file, then `RESULT: PASSED`, and exits 0 | `npx vitest run --config vitest.config.ts --project cli tests/draft-auto-repair.vitest.ts` from `.skilled/skills/system-spec-kit` prints every test passed, including this case. Observed: `Tests 15 passed (15)`, exit 0, including "repairs a Draft packet whose only errors are stale derived metadata in one run, and names the file" Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/draft-auto-repair.vitest.ts:207` | Met | - |
| AC-005 | REQ-005 | Given the switch off, `CI` set, a non-Draft status, a mixed content error or a library `validateFolder` call, When validate runs, Then no file in the packet changes and the repair never runs twice | The same test file hashes the packet before and after each case and counts repair runs; every case passes. Observed: the switch at `0`, `false` and `off`, `CI` set, In Progress, a mixed content error, a library call, a narrowed rule set, a run without `--strict`, a failing repair child and a `--recursive` parent all passed; the repair case counts exactly one repair start Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/draft-auto-repair.vitest.ts:272` | Met | - |
| AC-006 | REQ-006 | Given the baseline suite output, When the full runtime suite reruns, Then it lists no failure the baseline lacks | Both full suites ran on the final tree and were compared with the nearest baseline. Observed: runtime project (`npx vitest run` in `runtime`) 279 of 282 test files passed and 3 skipped, 4184 tests passed and 21 skipped, `vitest_exit=0`, so it lists no failure at all; CLI project (`npx vitest run --config vitest.config.ts --project cli` in the skill root) 1 test failed, 2202 passed and 20 skipped of 2223, the one failure `recursive-child-manifest` (its fixture's bare `git ls-files` hung on fsmonitor), which phase 013's whole CLI run `../013-addon-removal-and-speed-refinements/scratch/baseline/cli-after.txt` (2 files failed and 186 passed: `recursive-child-manifest` and `repo-era`) also lists. No failure is new. Deviation: no pre-phase runtime-project baseline exists; with zero runtime failures none can be new Evidence: `scratch/baseline/suite-after-cli.txt:246`| Met | - |
| AC-007 | REQ-007 | Given the final tree, When the runtime builds with no test run at the same time, Then it exits 0 | `npm --prefix .skilled/skills/system-spec-kit/runtime run build` exits 0. Observed: the conductor ran the build on the final tree and it succeeded (not rerun at closeout, where builds were out of bounds); `dist/lib/validation/orchestrator.js` is newer than every runtime source `.ts`, and `validate.sh`, which exits 3 on a stale compiled orchestrator, ran without exit 3 Evidence: `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:334` | Met | - |
| AC-008 | REQ-008 | Given the doc edits, When the guards run, Then the card, `SKILL.md`, `validation-rules.md` and `ENV-REFERENCE.md` name the switch, no "41-rule registry" line remains, and the mirrors match | `check-card-sync.sh` prints `CARD SYNC OK`; `rg -n '41-rule registry' .skilled/skills/system-spec-kit` prints nothing; `sync-skills-hermes.cjs --check` prints `PASS`. Observed: `CARD SYNC OK`, exit 0; the `rg` printed nothing, exit 1; `PASS: 67 Hermes skill copies in sync`, exit 0; `rg -l SPECKIT_DRAFT_AUTO_REPAIR` lists `SKILL.md`, `validation-rules.md` and `ENV-REFERENCE.md`, and card line 147 describes the repair and the switch Evidence: `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:147` | Met | - |
| AC-009 | REQ-009 | Given a qualifying Draft packet, When validate runs with `--json` and with `--quiet`, Then stdout is one parseable JSON report or one `RESULT:` line, and the repair notice is on stderr | `draft-auto-repair.vitest.ts` parses stdout in both modes and finds the notice on stderr. Observed: "keeps stdout to one parseable report under --json and sends the notice to stderr" and "keeps stdout to one RESULT line under --quiet" both passed Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/draft-auto-repair.vitest.ts:230` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met.
<!-- /ANCHOR:closure -->
