---
title: "Acceptance Criteria: Phase 2: rebuild-fanout-removal"
description: "The criteria this packet must satisfy before it may be closed: the token in the commit body, the trailer still last, the assertion that fails without it, the spec-kit-check trigger, zero runs on three rebuild SHAs, the 24 h baseline, and the gates."
trigger_phrases:
  - "rebuild fanout removal acceptance criteria"
  - "phase 2 rebuild fanout removal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal"
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "24 h baseline measured at 2,191 runner-min, outside its 1,700-1,850 band"
    next_safe_action: "Operator decides AC-006: amend the band or re-collect a quieter window"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-002-rebuild-fanout-removal"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: rebuild-fanout-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal
**Level:** 3
**Status:** In progress
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | R-id | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|------|-----|---------------------|--------------|--------|--------|
| AC-001 | R1 | REQ-001 | Given the rebuild commit step, When it builds the message, Then the body line ends with `[skip ci]` and the message still ends with the `Trigger-Index-Rebuild: ci` trailer | `grep -c 'rebuilt it\. \[skip ci\]"' .github/workflows/trigger-index-rebuild.yml` returns `1`; `sed -n '150,152p' .github/workflows/trigger-index-rebuild.yml` shows the trailer as the last `-m`; `git log -1 --format=%B <rebuild-sha>` shows the same order on the first post-change rebuild — observed: token at `:151`, trailer last at `:152`, and both real rebuild messages (`08bd79a68a`, `27490113c2`) match | Met | - |
| AC-002 | R1 | REQ-002 | Given `.github/workflows/README.md`, When the rebuild row and the push/PR row are read, Then both say the rebuild commit starts no workflow run | `grep -c 'The commit body carries `\[skip ci\]`' .github/workflows/README.md` returns `1`; `grep -c 'no other workflow runs on it' .github/workflows/README.md` returns `1` — observed: both greps return `1` | Met | - |
| AC-003 | R2 | REQ-003 | Given a copy of the workflow with the token removed, When the suite runs against it through `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH`, Then the new case fails; against the real workflow it passes | `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH=/tmp/trigger-index-rebuild.no-token.yml npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts` exits non-zero and names `marks the rebuild commit so the pushed commit starts no workflow run`; the same command without the variable exits `0` — observed 2026-10-25: the stripped copy holds 0 occurrences of `[skip ci]`; the suite against it exits `1` with 1 failed, 59 passed and 1 skipped of 61 tests and names `marks the rebuild commit so the pushed commit starts no workflow run`; the real suite exits `0` with 60 passed and 1 skipped of 61 tests (the override is read at the test file's `:34`) | Met | - |
| AC-004 | R2 | REQ-004 | Given `spec-kit-check.yml`, When its two path lists are read, Then `.github/workflows/trigger-index-rebuild.yml` appears in both | `grep -c 'trigger-index-rebuild\.yml' .github/workflows/spec-kit-check.yml` returns `2`; a pull request that touches only that workflow returns one `Spec-Kit Check` run for its head SHA by `gh run list --workflow spec-kit-check.yml --commit <head-sha>` — observed: grep returns `2`, and workflow-only PR #71 (`branches/018-probe-rebuild-workflow-trigger`, head `6c51acecb2f8`) produced one spec-kit-check run 40021934338, conclusion `success` | Met | - |
| AC-005 | R1 | REQ-005 | Given the change is on `main`, When three consecutive rebuild commits land, Then each rebuild SHA shows 0 workflow runs | `gh run list --commit <sha> --json databaseId --limit 30` returns `[]` for each of the three SHAs, against `14` rows per SHA captured in `scratch/pre-change/` (observed pre-change: `b0a8c0d18602ed9bed9ea7f93ac9ef8a8b110b17` returned `14`) — observed in `scratch/post-change/`: the three qualifying SHAs `08bd79a68a`, `27490113c2` and `c9d4deed31` each return `[]`; a fourth SHA, `c7c5bfb51b`, also returns `[]` | Met | - |
| AC-006 | Baseline | REQ-006 | Given at least 24 h after the merge, When the snapshot is collected, Then `scratch/baseline-24h/summary.md` records the window, the per-workflow rows and the total, and the total is about 1,739 runner-min/day against 3,812 | The file exists; its total falls in `1,700-1,850`; its per-rebuild-SHA run count is `0`; its window bounds are stated in the file — observed 2026-10-24T21:58Z: `scratch/baseline-24h/summary.md` exists and states the window 2026-10-23T21:59:34Z to 2026-10-24T21:59:34Z (795 runs, 728 from `.github/workflows/`) and a per-workflow table; the per-rebuild-SHA run count is `0` across 19 rebuild commits; the total is `2,191` runner-min for `.github/workflows/` runs, outside `1,700-1,850` (the `dynamic` runs, about 584 min, are a separate line), so the band condition fails | Unmet | - |
| AC-007 | Gates | REQ-007 | Given the change, When the gates run, Then `check-gate-inputs.sh` passes and spec-kit-check is green on the change | `bash .github/scripts/check-gate-inputs.sh` exits `0` and prints `failures=0` and `RESULT: PASSED` (observed pre-change: `files=45 inputs_resolved=236 dynamic_inputs=11 twin_pairs=311 failures=0`); `gh run list --workflow spec-kit-check.yml --commit <change-sha> --json conclusion` returns `success` — observed: `files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0` with `RESULT: PASSED`, and run 40018919244 on the change SHA concluded `success` | Met | - |

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

This phase is built and measured but not closeable. The token, its assertion, both filter entries and both README rows landed in `8e62a3d096`, and workflow-only PR #71 proved the new trigger. AC-001, AC-002, AC-003, AC-004, AC-005 and AC-007 are `Met`; AC-003 now carries the token-stripped run (exit 1) as well as the real run (exit 0). AC-006 is `Unmet`: the 24 h snapshot exists and the 19 rebuild commits in its window started 0 workflow runs, but the measured total of 2,191 runner-min is outside the 1,700-1,850 band, so the band condition fails. The number is reported as measured and was not rescaled. The phase closes when the operator either records a decision that changes the band or accepts a re-collected window that lands in it.
<!-- /ANCHOR:closure -->
