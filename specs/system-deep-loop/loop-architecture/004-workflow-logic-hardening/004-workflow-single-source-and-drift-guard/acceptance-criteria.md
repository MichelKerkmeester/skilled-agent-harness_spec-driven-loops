---
title: "Acceptance Criteria: Phase 4: workflow-single-source-and-drift-guard"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "workflow single source and drift guard acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/004-workflow-single-source-and-drift-guard"
    last_updated_at: "2026-11-14T11:33:22Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-workflow-single-source-and-drift-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: workflow-single-source-and-drift-guard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 004-workflow-logic-hardening/004-workflow-single-source-and-drift-guard
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the merged tree, When the deep assets folder is listed, Then it holds `deep-research.yaml` and `deep-review.yaml` and no research or review twin | `ls .skilled/commands/deep/assets/*.yaml` lists exactly those two research and review files and `ls .skilled/commands/deep/assets/deep-research-auto.yaml` exits 1. Observed: `ls` lists `deep-research.yaml` and `deep-review.yaml` beside the two council files, and `ls` on each twin exits 1. Evidence at `.skilled/commands/deep/assets/deep-research.yaml:1`. | Met | - |
| AC-002 | REQ-002 | Given each single workflow, When its top-level keys are read, Then it declares `execution_mode` with `auto` and `confirm` and every confirm-only block carries `applies_to: confirm` | `rg -n '^execution_mode:' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml` prints 2 lines and `rg -c 'applies_to: confirm'` prints at least 1 per file. Observed: 2 lines, and 12 and 10. Evidence at `.skilled/commands/deep/assets/deep-research.yaml:1038`. | Met | - |
| AC-003 | REQ-003 | Given each single workflow, When the executor branches are counted, Then each of the eight `if_native` and `if_cli_*` branches appears once and none sits under an `applies_to` block | `npx vitest run tests/unit/executor-branch-contract.vitest.ts` in `.skilled/skills/system-deep-loop/runtime` exits 0. Observed: 6 passed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts:93`. | Met | - |
| AC-004 | REQ-004 | Given the census auto-only step lists, When each single workflow is searched, Then every listed step exists outside any `applies_to` block | Every name on the `auto-only workflow steps` lines of `scratch/census-before.txt` appears on the matching `step key list` line of `scratch/census-after.txt`, written by `measure-workflows.sh --single`. Observed: all 11 research names and all 4 review names appear. The requirement text counted 10 for research before phase 003 added `step_apply_lifecycle_request`. Evidence at `scratch/census-after.txt:5`. | Met | - |
| AC-005 | REQ-005 | Given each single workflow, When the failure branches are listed, Then only the policy phase 002 settled appears | `rg -c 'if_failed:' .skilled/commands/deep/assets/deep-research.yaml` and `rg -c 'if_failed_recoverable:'` never both print a count. Observed: `if_failed:` prints 1 per file and `if_failed_recoverable:` prints nothing. The one `if_failed` key belongs to the pivot result step, see `goal.md`. Evidence at `.skilled/commands/deep/assets/deep-research.yaml:1`. | Met | - |
| AC-006 | REQ-006 | Given `dry_run=true`, When each command runs in auto and in confirm mode, Then a `dry_run_halt` row prints and no executor dispatch or state file appears | `scratch/dry-run-research-auto.txt`, `dry-run-research-confirm.txt`, `dry-run-review-auto.txt` and `dry-run-review-confirm.txt` with `git status --short` showing no new state file. Observed: each of the four transcripts holds one `dry_run_halt` row at `step_create_directories`, `WRITES: none` and `DISPATCHES: none`, and the scratch spec folder held only its `spec.md`. Evidence at `scratch/dry-run-research-auto.txt:10`. | Met | - |
| AC-007 | REQ-007 | Given the drift guard, When a scratch copy restores `deep-research-confirm.yaml` or a doc lists an unread flag or a workflow reads an unlisted flag, Then the guard fails with the file or flag name. It checks the research and review definitions only and passes whether or not phase `006-ai-council-mode-deprecation` has removed the council twins | `npx vitest run tests/unit/compile-command-contracts.vitest.ts` in `.skilled/skills/system-deep-loop/runtime` exits 0, and `scratch/guard-negative.txt` holds the failing run. Observed: 21 passed, exit 0, and the scratch copy run exits 1 naming `deep-research-confirm.yaml`. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts:255`. | Met | - |
| AC-008 | REQ-008 | Given the surfaces in `plan.md` Affected Surfaces, When the old-name pattern is searched, Then nothing matches | `rg -l 'deep-(research\|review)-(auto\|confirm)\.yaml' .skilled/commands .skilled/skills/system-deep-loop/runtime .skilled/skills/system-spec-kit/runtime/cli/tests` prints nothing. Observed: no surface in `plan.md` Affected Surfaces matches. The `rg` over the three folders prints 15 paths: 14 docs phase 005 owns and the guard test's own negative fixture name. Evidence at `scratch/inventory-after.txt:1`. | Met | - |
| AC-009 | REQ-009 | Given both command docs and both presentation files, When `--dry-run` is searched, Then each documents it without a confirm-only restriction | `rg -c -- '--dry-run' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints at least 1 per file and `rg -ci 'dry[-_]run'` prints at least 1 per presentation file. Observed: 5 and 5, and 3 and 3. Evidence at `.skilled/commands/deep/review.md:3`. | Met | - |
| AC-010 | REQ-010 | Given the merged tree, When the single workflows are measured, Then each single workflow is smaller than both twins it replaces | `wc -c .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml`. Observed: 144394 against 172747 and 157907, and 158517 against 180254 and 165285. Evidence at `scratch/census-after.txt:2`. | Met | - |
| AC-011 | REQ-011 | Given the merged tree, When the census runs, Then each single workflow reports at most 2000 inline heredoc bytes | The `inline heredocs` lines of `scratch/census-after.txt`, written by `measure-workflows.sh --single`. Observed: `1 heredocs, 364 bytes` and `4 heredocs, 1860 bytes`. Evidence at `scratch/census-after.txt:3`. | Met | - |
| AC-012 | REQ-012 | Given each single workflow, When pivot seat steps are searched, Then one parameterized pair remains | `rg -c 'step_dispatch_pivot_seat_00[23]' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml` prints nothing. Observed: the `rg` prints nothing. Evidence at `.skilled/commands/deep/assets/deep-research.yaml:1`. | Met | - |
| AC-013 | REQ-013 | Given regenerated compiled contracts, When the drift checker runs, Then it reports no drift | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0. Observed: `[CONTRACT DRIFT] OK commands=3`, exit 0. Evidence at `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:1`. | Met | - |
| AC-014 | REQ-014 | Given the four parity tests rewritten for one file, When the full runtime suite runs, Then it passes | `cd .skilled/skills/system-deep-loop/runtime && npm test` exits 0 with 0 failed files. Observed: 182 test files, 3017 passed, 8 skipped, 0 failed, exit 0. Evidence at `.skilled/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts:1`. | Met | - |
| AC-015 | REQ-015 | Given each single workflow, When the Retry, Skip or Cancel gate is searched, Then it appears once per file inside a block marked `applies_to: confirm` | `rg -n 'Retry' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml` and the enclosing `applies_to: confirm` line, as T080 and T081 record. Observed: the gate option is at lines 1047 and 1125, each under `applies_to: confirm` at 1038 and 1116. The other `Retry` lines are timeout notes. Evidence at `.skilled/commands/deep/assets/deep-research.yaml:1047`. | Met | - |

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

Yes. Every criterion is met, with the observed result written in its Verification cell.
<!-- /ANCHOR:closure -->
