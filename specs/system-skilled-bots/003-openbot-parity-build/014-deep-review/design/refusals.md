---
title: "Design: the review's refusals and stop conditions"
description: "Every way this phase stops before it writes a verdict, with the layer that decides it, the exit code, what is on disk when it stops and what it does not refuse."
trigger_phrases:
  - "deep review refusals"
  - "review stop conditions"
  - "review exit codes"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The review's refusals and stop conditions

This phase adds no runtime refusal. It changes no module under `.skilled/skills/system-skilled-bots/runtime/lib/` unless a finding names one, and a finding that names one is fixed under the runtime's own refusal table. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.11 Phases 012 to 014"]

What this file fixes is the other set: the ways the review run itself stops. A review that cannot read its surface, cannot spawn a reader or cannot prove its own close must not write a verdict, because a verdict is a claim about a surface someone read.

---

## 1. THE LAYERS

| Layer | Where it is decided | How it surfaces | Exit |
|-------|---------------------|-----------------|------|
| Orchestrator refusal | the orchestrator's own check, before any dispatch | one `bots-review: <reason>: <detail>` line on stderr, and no verdict line | 2 for a usage error, 1 for a check that ran and said no |
| Gate refusal | a gate command ran and its output is not what the phase requires | the gate's own output, then one `bots-review: <reason>` line | 1 |
| Runner refusal | `fanout-run.cjs` refuses the run or loses every lineage | the runner's own stderr and its exit | 3 when every lineage failed, 2 when the matrix is refused |
| Record refusal | a record this phase reads is missing, unreadable or incomplete | one `bots-review: <reason>: <path>` line | 1 |

The exit codes follow the runtime's own table, so a reader who knows `bots` knows this run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "1. EXIT CODES THAT EXIST TODAY"] Exit 1 is a check that ran and said no, exit 2 is a command line or a path that is wrong, and exit 3 is a run that lost every reader.

The `bots-review:` prefix is this phase's own. It is not a `bots:` line, because the review is not a `bots` verb and a reader must not confuse the two.

---

## 2. THE CATALOGUE

### 2.1 Before any lineage spawns

| Name | Layer | Exit | Raised when | On disk when it stops |
|------|-------|------|-------------|-----------------------|
| `review-013-not-clean` | Gate | 1 | `validate.sh --strict` on `013-skilled-and-doc-alignment` does not print `RESULT: PASSED`, or a row in its `acceptance-criteria.md` is not `Met` | nothing. `review/` is not created |
| `review-baseline-missing` | Gate | 1 | `npm test` in the runtime folder exits non-zero, so no `suiteBaseline` can be recorded | nothing |
| `review-no-executor` | Orchestrator | 2 | all five binaries are absent, or every present one fails its version probe | `preflight.json` with `presentCount` `0`, and nothing else. The probe table is printed to stderr as well, so the operator sees which five were tried |
| `review-scope-empty` | Orchestrator | 2 | the scope discovery found no file, so `fanout-review-scope.txt` is empty | the empty scope file, and nothing else |
| `review-scope-stale` | Orchestrator | 1 | the scope file holds no module phases 001 to 011 add, so the file list was built from the pre-packet modules alone | the scope file as written, and nothing else. The run stops before any lineage spawns |
| `review-seed-unreadable` | Record | 1 | a handoff path exists and a row in it cannot be read | `seeded-findings.json` with the rows read so far and the failing path in `missingSources` |
| `review-dry-run-missing` | Orchestrator | 1 | the dry run does not print five lineage lines and one `dry_run_halt` line naming `step_fanout_spawn` | the dry run's own output, and no lineage folder |

`review-no-executor` is the one D3 settles. Setup probes the five binaries and records which are present. At least one must be. An absent one is replaced in the fallback order, so a host with three binaries runs five lineages on three executors. A host with none cannot run a review at all. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D3]

### 2.2 During the fan-out

| Name | Layer | Exit | Raised when | On disk when it stops |
|------|-------|------|-------------|-----------------------|
| `review-lineage-orphaned` | Runner | 3 | a lineage is marked orphaned, so its directory holds a writer that outlived its runner | the orphan row in the ledger and the lineage's own folder. The run refuses before a second writer enters that folder |
| `review-all-lineages-lost` | Runner | 3 | every lineage failed or was dropped | `orchestration-summary.json` with `all_failed` true, and no verdict line |
| `review-merge-incomplete` | Record | 1 | `orchestration-summary.json` is missing, or `total_cli_lineages` is not 5 or `orphaned_lineages` is not empty | the summary as written, and no report |

`review-all-lineages-lost` is the case the spec's edge cases name: a run that loses every lineage exits non-zero and writes no verdict line, because a review with no reader is not a clean review.

### 2.3 During synthesis

| Name | Layer | Exit | Raised when | On disk when it stops |
|------|-------|------|-------------|-----------------------|
| `review-report-incomplete` | Record | 1 | the report does not carry all nine core headings | the report as written, and no ledger |
| `review-verdict-missing` | Record | 1 | the report carries no `Review verdict: ` line, or more than one | the report as written, and no ledger |
| `review-ledger-incomplete` | Record | 1 | a finding in `openFindings` has no ledger row, or a row's last cell is neither `pass` nor `deferred` | the ledger as written, and no fix wave |

A report that carries two verdict lines is refused for the same reason as one that carries none. The line is a claim about the whole run, and two claims are not one.

### 2.4 During the fix pass

| Name | Layer | Exit | Raised when | On disk when it stops |
|------|-------|------|-------------|-----------------------|
| `review-fix-outside-surface` | Gate | 1 | `git status --porcelain` lists a path outside the surfaces the review named and outside this phase's own outputs | the fix, and the finding stays `active` |
| `review-p1-unrouted` | Orchestrator | 1 | a P1 has no route left in the fallback order and no deferral reason | the finding stays `active`, and the close is blocked |
| `review-scenario-rerun-missing` | Record | 1 | a touched phase's scenarios have no entry in `scenario-rerun.json` | the re-run record as written, and no close |

`review-fix-outside-surface` is the one REQ-009 settles. The scope check exempts `review/` and `implementation-summary.md`, because those are this phase's own outputs and a review that cannot write its own report has nowhere to put its verdict. Every other path is checked.

### 2.5 At the close

| Name | Layer | Exit | Raised when | On disk when it stops |
|------|-------|------|-------------|-----------------------|
| `review-suite-below-baseline` | Gate | 1 | `npm test` exits non-zero, or prints fewer tests than `suiteBaseline.tests` in `preflight.json` | the suite's own output, and no close |
| `review-validator-failed` | Gate | 1 | `validate.sh --strict` on this packet does not print `RESULT: PASSED` | the validator's own output, and no close |
| `review-verdict-blocked` | Orchestrator | 1 | the verdict is `FAIL`, so a P0 is still active | the report with its `FAIL` line, and no close |

A `CONDITIONAL` verdict does not refuse the close. It closes the packet and names what blocks a `PASS` in the report's Deferred Items section. A `FAIL` does refuse it, because a P0 is a defect no later phase owns.

---

## 3. WHAT IS NOT A REFUSAL

| Case | Why it is not a refusal | What the run does |
|------|-------------------------|-------------------|
| A handoff path does not exist | A phase that filed nothing has nothing to hand over | records it in `missingSources` with the reason and continues |
| A P2 finding stays open | goal D6 says it does not block the close | the verdict reads `PASS` with `hasAdvisories` true, and the finding is in Deferred Items |
| A P1 is deferred | REQ-005 allows it and the handoff criteria reads zero active P1 | the verdict reads `CONDITIONAL` and the close proceeds |
| A lineage is complete but its terminal row is missing | its work is whole and the merge reads the work | counts it as complete and records the missing row in the Audit Appendix |
| A lineage is replaced by the fallback | D3 says the fallback wins | the label set changes and the count stays five |
| A scenario re-run reads `SKIP` for a prerequisite the build does not own | a missing channel account or a host without a tty is not a defect the build can fix | records it with its reason and does not block the close |
| A scenario re-run reads `SKIP` for a missing verb or a missing field | phases 001 to 011 are closed before the corpus runs, so the verb or the field was supposed to exist | the verdict reads `CONDITIONAL` and the row is named in Deferred Items. It blocks a `PASS` |
| A finding is withdrawn as a false positive | the orchestrator re-read it and the evidence did not hold | moves it to `resolvedFindings` with `status` `resolved` and names it in the Audit Appendix |

The last row is the one that keeps the evidence gate honest. A P0 that a lineage inferred rather than observed is withdrawn before any fix, and the withdrawal is recorded, because a fix for a defect that does not exist is a change to a surface nobody asked to change.

---

## 4. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The review's refusals carry a `bots-review:` prefix | A `bots:` line is a runtime refusal and a reader who greps for one must not find the other. The two sets have different owners and different fixes |
| Exit 3 is kept for a run that lost every lineage | `fanout-run.cjs` already returns 3 for `all_failed`, and a second code for the same fact would be a second thing to learn |
| A missing handoff file is recorded and not refused | A clean build files nothing, and refusing there would block the one run that has nothing to seed |
| A `CONDITIONAL` verdict closes and a `FAIL` does not | A deferred P1 is a recorded decision and an active P0 is an unowned defect. Only the second needs a later phase |
| The scope check exempts `review/` and `implementation-summary.md` | They are this phase's own outputs. Without the exemption the check refuses the report that carries the verdict, which is the one file the phase exists to write |
| A `SKIP` for a missing verb or field blocks a `PASS` | A skip is a recorded outcome only when the blocker is outside the build. A missing verb after phases 001 to 011 closed is a defect, and a verdict that reads `PASS` over it claims a surface nobody proved |
| A withdrawn finding is recorded rather than deleted | The evidence gate's value is that a reader can see what was claimed and why it did not hold. A deleted claim teaches nothing |
