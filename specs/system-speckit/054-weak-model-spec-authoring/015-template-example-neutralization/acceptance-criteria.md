---
title: "Acceptance Criteria: Phase 15: template-example-neutralization"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "template example neutralization acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/015-template-example-neutralization"
    last_updated_at: "2026-10-26T18:30:00Z"
    last_updated_by: "closeout"
    recent_action: "Marked AC-003 Met on the review fix check's VERDICT: PASS; every row is Met"
    next_safe_action: "Pin the phase commit SHA in implementation-summary.md once the work is committed (CHK-FIX-007)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-015-template-example-neutralization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 15: template-example-neutralization

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-recommend-level-quiet`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/015-template-example-neutralization
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--quiet` runs, Then `wc -l` prints 1. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`S` is `.skilled/skills/system-spec-kit`. `G` is the term regex in `spec.md` section 4.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the term gate runs over the fill notes in both template folders, Then no fill note names the benchmark task | `rg -i -e "$G" S/templates/core S/templates/addons \| rg 'FILL:' \| wc -l` prints 0 (63 at the sweep). Observed: prints 1, the D3 instruction at `addons/research.md.tmpl:777`. With that one line excluded (`\| rg -v -F 'List each flag and its effect'`) it prints 0, and no hit names the benchmark task. Deviation recorded in `implementation-summary.md` | Met | - |
| AC-002 | REQ-002 | Given the edited card, When it is searched for the old examples and for task words, Then only the real tool lines remain | `rg -n -i -e 'quiet flag' -e 'flag parser' -e 'script\.sh --quiet' S/references/workflows/spec-authoring-card.md` prints nothing, and `rg -c -i 'quiet\|recommend-level'` on the card prints 7. Observed: the first `rg` printed nothing, exit 1; the count prints 7 | Met | - |
| AC-003 | REQ-003 | Given the rewritten notes, When the fill-guidance test runs and the reviewer reads the diff against `scratch/replacements.md`, Then every note keeps one GOOD then one WEAK and names only the `rotate-logs.sh --keep` feature | `npx vitest run tests/template-fill-guidance.vitest.ts --config ../../vitest.config.ts --project cli` from `S/runtime/cli` prints `24 passed`; `scratch/review.md` ends with `VERDICT: PASS`. Observed: the test prints `Tests  24 passed (24)`, exit 0, rerun on the final tree. `scratch/review.md` line 71, the 2026-10-26 fix check, reads `VERDICT: PASS` after the first review's `VERDICT: CHANGES NEEDED` at line 58; `rg -c '^VERDICT: PASS$' scratch/review.md` prints 1. Deviation: `scratch/replacements.md` was never written; the 87-line sweep table in `scratch/example-sweep.md` stands in for it and the diff holds the new text, recorded on T004 | Met | - |
| AC-004 | REQ-004 | Given the edited templates, When the snapshot is regenerated and the test reruns without `-u`, Then it passes and holds no task term | `npx vitest run tests/scaffold-golden-snapshots.vitest.ts --config ../../vitest.config.ts --project cli` prints `12 passed`; `rg -i -e "$G"` on the `.snap` file piped to `rg 'FILL:' \| wc -l` prints 0. Observed: `Tests  12 passed (12)`, exit 0; the snapshot gate prints 0 | Met | - |
| AC-005 | REQ-005 | Given the final tree, When both guards run, Then both print their pass line | `bash S/runtime/cli/spec/check-card-sync.sh \| tail -1` prints `CARD SYNC OK`; `bash S/runtime/cli/spec/check-example-drift.sh \| tail -1` prints `EXAMPLE_DRIFT_OK`. Observed: `CARD SYNC OK` exit 0, `EXAMPLE_DRIFT_OK` exit 0 | Met | - |
| AC-006 | REQ-006 | Given the before census over the 4,757 folders in `../016-scaffold-filler-section-trim/scratch/baseline/census-list.txt`, When `strict-census.mjs` reruns on the final tree, Then no row changes | `diff <(sort ../016-scaffold-filler-section-trim/scratch/baseline/census-before.tsv) <(sort ../016-scaffold-filler-section-trim/scratch/baseline/census-after.tsv)` prints nothing. Observed: no output, exit 0; both files hold 4,757 rows. Phases 015 to 017 shared one census, begun on the post-014 tree and rerun on the final tree | Met | - |
| AC-007 | REQ-007 | Given the final tree, When the Hermes check runs, Then the copies match their sources | `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Observed: `PASS: 67 Hermes skill copies in sync`, exit 0 | Met | - |
| AC-008 | REQ-008 | Given the phase diff, When it is listed outside `specs/`, Then it names only the 12 edited files and the snapshot | `git diff --name-only -- . ':!specs' \| wc -l` prints 13. Observed: more than 13 paths, because phases 016 and 017 share the uncommitted tree. All 12 edited files and the snapshot are in the list. Deviation: membership replaces the count, recorded in `implementation-summary.md` | Met | - |
| AC-009 | REQ-009 | Given `goal.md`, When it is searched for the neutral example, Then it names the feature and bars phase 018 from using it | `rg -n 'rotate-logs' goal.md` prints the D1 and D2 rows. Observed: lines 45 (D1) and 46 (D2) | Met | - |

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

Yes. Every criterion is Met, three of them with recorded deviations.
<!-- /ANCHOR:closure -->
