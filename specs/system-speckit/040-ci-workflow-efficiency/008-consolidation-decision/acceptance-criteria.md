---
title: "Acceptance Criteria: Phase 8: consolidation-decision"
description: "The criteria this packet must satisfy before it may be closed: the nine always-run workflows' 13 jobs measured before and after phases 002 to 007, a reproducible cost table and merge bound, a decision record naming the FRESHNESS candidates and the message-contract exclusion, D8's answer, a no-merge path that leaves the workflow tree untouched, a conditional merge with every step preserved, and the gates."
trigger_phrases:
  - "consolidation decision acceptance criteria"
  - "phase 8 consolidation decision acceptance criteria"
  - "always-run workflow measurement criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/008-consolidation-decision"
    last_updated_at: "2026-10-25T20:45:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed all nine rows: eight Met and AC-007 Superseded by ADR-001"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-008-consolidation-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: consolidation-decision

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
**Level:** 3
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | R-id | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|------|-----|---------------------|--------------|--------|--------|
| AC-001 | R27 | REQ-001 | Given the 001 dataset and the 002 post-R1 baseline, When `scratch/consolidation-baseline.md` is read, Then it carries the 9 workflow rows, the 13 job rows, the 1,065 job-second and 25 billed-minute totals, the 1,241..1,606 runner-min/day bound with its arithmetic, and the 002 baseline's path | `grep -c '^\| ' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-baseline.md` returns `26`; `grep -c '1,241..1,606'` returns at least `1`; `grep -c '1,065'` returns at least `1`; `grep -c '002-rebuild-fanout-removal/scratch/baseline-24h/summary.md'` returns at least `1`; the 13 job-second cells sum to `1065` Observed 2026-10-25: `grep -c '^\| '` printed `26`; `1,241..1,606` `1`; `1,065` `2`; the 002 path `1`; the T003 parse printed `data rows 22` and `job seconds 1065`. Evidence: `scratch/consolidation-baseline.md:37` and `scratch/consolidation-baseline.md:42`. | Met | - |
| AC-002 | R27 | REQ-001, REQ-006 | Given the post-007 tree, When the snapshot is read, Then `scratch/jobs/` holds 9 workflow directories, each with 20 to 40 run files plus its `index.json`, every run file parses and holds a `jobs` array, and `scratch/window.json` names the same 9 workflows with a run count and an hours value each | `ls -d specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/jobs/*/ \| wc -l` returns `9`; `find specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/jobs -name '*.json' ! -name 'index.json' -exec jq -e '.jobs' {} \;` exits `0` on every file; `jq '.perWorkflow \| length' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/window.json` returns `9`; every per-workflow `runs` value is between `20` and `40`, and every `hours` value is greater than `0` Observed 2026-10-25: `ls -d scratch/jobs/*/ \| wc -l` printed `9`; `jq -e '.jobs'` passed on all 360 run files (`jobs-key-ok`); `.perWorkflow \| length` printed `9`; every workflow has `40` runs, and hours run from `19.1` to `51.18`. The snapshot came about 19 h after the last edit to the nine, not 24 h (`scratch/snapshot-window.md`). Evidence: `scratch/snapshot-window.md:8`. | Met | - |
| AC-003 | R27 | REQ-001, REQ-006 | Given the saved snapshot, When the cost script runs twice, Then it recomputes every per-workflow and per-job figure and both bounds from the saved JSON, and `--check` exits 0 with `check: ok` | `node specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.mjs --check` prints `check: ok` and exits `0`; `jq '.workflows \| length' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.json` returns `9`; `jq '.jobs \| length'` returns `13`; `grep -c '^\| ' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.md` returns `26` Observed 2026-10-25: `--check` printed `check: ok`, exit `0`; `.workflows \| length` `9`; `.jobs \| length` `13`; `grep -c '^\| ' scratch/consolidation-cost.md` `26`. Evidence: `scratch/phase-result.md:39` and `scratch/consolidation-cost.md:37`. | Met | - |
| AC-004 | R27 | REQ-002, REQ-006 | Given the measured cost table, When `scratch/consolidation-decision.md` is read, Then it carries the six ADR sections, names the nine workflows and 13 jobs, the eight-workflow FRESHNESS set and its 12 jobs, the `message-contract.yml` exclusion, both bounds, the measurement rules and D8's answer | `grep -cE '^## (Context\|Candidates\|Measurements\|Signal cost\|Recommendation\|D8 answer)$' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-decision.md` returns `6`; `grep -c 'message-contract'` returns at least `1`; `grep -c 'SKILLED_CI_FRESHNESS'` returns at least `1`; `grep -c '1,241..1,606'` returns at least `1`; `grep -c 'ceil(seconds / 60)'` returns at least `1`; `grep -c '24 / 23.5'` returns at least `1`; `grep -cE 'run id: [0-9]+'` returns at least `1`; `grep -cE '^D8: (no\|yes)$'` returns `1` Observed 2026-10-25: headings `6`; `message-contract` `5`; `SKILLED_CI_FRESHNESS` `3`; `1,241..1,606` `2`; `ceil(seconds / 60)` `1`; `24 / 23.5` `1`; `run id: [0-9]+` `2` lines; `^D8: (no\|yes)$` `1`. Evidence: `scratch/consolidation-decision.md:55`. The operator confirmed the answer on 2026-10-26. | Met | - |
| AC-005 | D8 | REQ-003 | Given the decision record, When D8's answer is read, Then `scratch/d8-answer.md` holds exactly one `D8=` line and the decision record holds the same answer, written before any merge task ran | `grep -cE '^D8=(no\|yes)$' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/d8-answer.md` returns `1`; `diff <(grep -E '^D8=' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/d8-answer.md \| sed 's/^D8=/D8: /') <(grep -E '^D8: ' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-decision.md)` prints nothing and exits `0`; `grep -c '^D8: pending$'` returns `0` Observed 2026-10-25: `^D8=(no\|yes)$` in `scratch/d8-answer.md` printed `1`; the diff printed nothing and `answer-matches`; `^D8: pending$` printed `0`. The answer file also carries the date, the operator's verbatim delegation and the note that `no` is the session's judgment. Evidence: `scratch/d8-answer.md:1` and `scratch/consolidation-decision.md:55`. The operator confirmed the answer on 2026-10-26. | Met | - |
| AC-006 | D8 | REQ-003 | Given D8 = no, When the phase's own diff is inspected, Then no workflow file changed, `scratch/no-merge.md` holds both command outputs, and the decision record says no | `git diff --stat "$(cat specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-start-sha.txt)"..HEAD -- .github/workflows` prints nothing; `git status --porcelain -- .github/workflows` prints nothing; `grep -c '^## Workflow diff$' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/no-merge.md` returns `1` and `grep -c '^## Worktree status$'` returns `1`; `grep -c '^D8: no$' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-decision.md` returns `1`. Observed 2026-10-25 from start SHA `1c317e13c5` to `HEAD` `7041b05478` (four later commits, none in `.github/workflows`): the diff printed nothing (exit `0`); the status printed nothing (exit `0`); both headings `1`; `^D8: no$` `1`. Rerun the diff after the orchestrator commits this phase. Evidence: `scratch/no-merge.md:5` and `scratch/no-merge.md:12`. | Met | - |
| AC-007 | D8 | REQ-004 | Given D8 = yes, When the merged file and the probe are read, Then `.github/workflows/always-run-guards.yml` carries one job, every step after the checkout carries an `if: always()` prefix, the two Node majors survive, `fetch-depth: 0` and the daily schedule survive, message-contract is absent, and the probe shows a later step running after a failure | `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/always-run-guards.yml')); j=d['jobs']['always-run-guards']; s=j['steps']; print(len(d['jobs']), sum(1 for x in s if str(x.get('if','')).startswith('always()')), len(s)-1, 'schedule' in (d.get(True) or d.get('on'))))"` prints `1 <n> <n> True` with both counts equal; `grep -c 'node-version' .github/workflows/always-run-guards.yml` returns `2`; `grep -c 'fetch-depth: 0'` returns `1`; `grep -c 'message-contract'` returns `0`; `grep -cE 'failure' specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/merge-probe.md` returns at least `1` and the file names a step that ran after it Superseded 2026-10-25 by ADR-001: D8 = no, so no merged workflow and no probe exist and the commands above were not run. | Superseded | ADR-001 |
| AC-008 | R27, D8 | REQ-005 | Given the phase end, When the gates run, Then the twin gate passes, every workflow parses, and this folder validates strict | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` with `failures=0`; `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` exits `0` with no output; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision" --strict --no-recursive` reports `Errors: 0` and `RESULT: PASSED` Observed 2026-10-25: `check-gate-inputs.sh` printed `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` and `RESULT: PASSED`, exit `0`; the YAML parse exited `0` with no output; `validate.sh --strict` on this folder printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit `0`, after `repair-derived.cjs --apply`. Evidence: `scratch/phase-result.md:71` and `scratch/phase-result.md:75`. | Met | - |
| AC-009 | D8 | REQ-007, REQ-008 | Given D8's answer, When the README and the phase diff are read, Then under yes the merged file appears once in the contents table, once in the push/PR table and once in the switch list, under no the README is unchanged, and in both cases no ephemeral id appears in a workflow comment, a step name, a job name or a README sentence | Under yes: `grep -c 'always-run-guards.yml' .github/workflows/README.md` returns `3`, `grep -c '^\| `message-contract.yml` \|'` returns `1`, and `grep -c '^\| `gate-inputs.yml` \|'` returns `0`. Under no: `git diff --stat "$(cat specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-start-sha.txt)"..HEAD -- .github/workflows/README.md` prints nothing. In both cases `git log -1 --format=%B -- .github/workflows \| grep -cE '\bR[0-9]+\b\|\bD[0-9]+\b\|[Pp]hase 0[0-9]'` returns `0`. Observed 2026-10-25 under D8 = no: the README diff printed nothing (exit `0`); the id grep over `git log -1 --format=%B -- .github/workflows` (commit `c02124d0ff`) printed `0`. Evidence: `scratch/no-merge.md:5`. | Met | - |

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

Eight rows are `Met` and AC-007 is `Superseded` by ADR-001. D8 is `no`, the session's judgment under the operator's delegation of 2026-10-25, confirmed by the operator on 2026-10-26. The measurement exists (`scratch/consolidation-baseline.md`, `scratch/consolidation-cost.json`, `scratch/consolidation-decision.md`), `node scratch/consolidation-cost.mjs --check` exits 0, the workflow tree is unchanged, and the gates pass. The two commit tasks, T022 and T025, are the orchestrator's.

The two conditional rows resolve on the answer, never both: AC-006 closes on `D8: no`, AC-007 on `D8: yes`. Whichever path is not taken keeps its row `Superseded` and cites ADR-001 in the Waiver cell, because the decision that cancelled it is recorded there.
<!-- /ANCHOR:closure -->
