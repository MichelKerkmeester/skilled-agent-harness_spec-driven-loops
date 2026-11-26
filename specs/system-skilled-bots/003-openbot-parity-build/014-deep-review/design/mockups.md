---
title: "Design: the review's operator-facing surfaces"
description: "The console transcript, the rendered report, the rendered ledger and the dashboard as an operator reads them, plus the two failure frames, so the run's output is fixed before it is produced."
trigger_phrases:
  - "deep review mockups"
  - "review report rendering"
  - "review dashboard"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The review's operator-facing surfaces

Four surfaces are read by a person: the console transcript of the run, the rendered `review-report.md`, the rendered `fix-ledger.md` and the dashboard. Each frame below is a state the run can be in. A frame is a contract: the lines, their order and their wording are settled here, so a later writer produces text rather than choosing it.

The frames are ours. The loop's own dashboard and report shapes are the reference, and no frame reproduces another project's text. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:71]

Trailing blanks are trimmed. A frame's longest line is at most 100 columns, so it reads in a plain terminal and in a rendered document.

---

## 1. THE CONSOLE TRANSCRIPT

The run prints one line per phase boundary and nothing per tool call. A reader who watches the console sees where the run is, not what it is doing.

The two counts in a `suite baseline` line are the ones the setup run recorded in `preflight.json`, so a frame shows a shape and not a number. A frame that printed a fixed count would read as a floor the build could not move.

### 1.1 A clean run

```text
bots-review: preflight
  phase 013        RESULT: PASSED
  suite baseline   <files> files, <tests> tests, exit 0
  executors        vibe pi opencode devin codex, all present, preflight.json written
  handoff 012      failures.md, 1 row
  handoff 013      rebuttals.md, 3 headings, 1 handed on
  handoff 013      evidence/, 2 findings, 0 open
  seeded           2 findings, F001 P0 and F002 P1
bots-review: fan-out
  matrix           5 lineages, concurrency 5
  dry run          5 lineage lines, dry_run_halt at step_fanout_spawn
  spawn            vibe pi opencode devin codex
  merge            5 of 5 complete, 0 orphaned, merged verdict FAIL
bots-review: synthesis
  registry         4 findings, 1 withdrawn, 1 seeded P0 still active
  report           9 sections, 1 verdict line, Review verdict: FAIL
  ledger           4 rows, 4 active
bots-review: fix wave 3
  lane 1           F001 answer.ts, suite pass, regression test fails without the fix
  registry         F001 fixed, active P0 0
bots-review: fix wave 4
  lane 2           F002 bots.cjs, suite pass
  lane 3           F003 needs-you.ts, suite pass
  lane 4           F004 README.md, deferred, P2
  registry         active P0 0, active P1 0, deferred P1 0
bots-review: scenario re-run
  touched phases   006 010
  scenarios        9 re-run, 9 PASS, 0 FAIL
bots-review: close
  suite            <files> files, <tests> tests, exit 0
  validator        RESULT: PASSED
  scoped diff      0 paths outside the named surfaces
  report           rewritten, Review verdict: PASS
  verdict          PASS, hasAdvisories true
```

### 1.2 A run that refuses before any lineage spawns

```text
bots-review: preflight
  phase 013        RESULT: PASSED
  suite baseline   <files> files, <tests> tests, exit 0
  executors        none present
bots-review: review-no-executor: command -v vibe pi opencode devin codex printed no path
```

Exit 2. `review/preflight.json` is written with `presentCount` `0` and nothing else, so a reader can see which five were tried. No lineage folder exists, so the refusal cannot be mistaken for a run that reviewed nothing.

### 1.3 A run that falls back to four executors

```text
bots-review: preflight
  phase 013        RESULT: PASSED
  suite baseline   <files> files, <tests> tests, exit 0
  executors        vibe pi opencode codex, devin absent, preflight.json written
  fallback         devin dropped, pi runs twice, 5 lineages on 4 executors
  handoff 012      failures.md, 1 row
  handoff 013      rebuttals.md, 3 headings, 1 handed on
  handoff 013      evidence/, 2 findings, 0 open
  seeded           2 findings, F001 P0 and F002 P1
bots-review: fan-out
  matrix           5 lineages, concurrency 5
  spawn            vibe pi pi opencode codex
  merge            5 of 5 complete, 0 orphaned, merged verdict FAIL
```

The label set reads `cli-mistral-vibe`, `cli-pi-1`, `cli-pi-2`, `cli-opencode` and `cli-codex`, so a reader sees which executor ran twice. `total_cli_lineages` still reads five, which is what AC-003 checks. That is the case D3 makes normal. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D3]

### 1.4 A run that closes CONDITIONAL

```text
bots-review: close
  suite            35 files, 383 tests, exit 0
  validator        RESULT: PASSED
  scoped diff      0 paths outside the named surfaces
  report           rewritten, Review verdict: CONDITIONAL
  verdict          CONDITIONAL, F005 deferred P1, reason recorded
```

Exit 0. The packet closes and the report names what blocks a PASS. A `CONDITIONAL` close is a recorded decision, and the one outcome the run may not produce is a PASS over an open P1.

---

## 2. THE RENDERED REPORT

The report is read top to bottom by an operator who wants one answer and then the evidence. The Executive Summary carries the answer in its first paragraph and the verdict on its last line.

```text
Deep review report: the OpenBot parity build

  Target   specs/system-skilled-bots/003-openbot-parity-build
  Run      rvw-2026-11-25T21-14-04Z, five lineages, expansive depth
  Dimensions  correctness, security, traceability, maintainability

Executive Summary
  The build holds together. Five independent readers reviewed the code and
  docs phases 001 to 013 built, and the merged registry closed with no active
  P0 and no active P1. Four findings were raised, three were fixed and one P2
  is deferred.

  Severity   Found   Fixed   Deferred   Active
  P0             1       1          0        0
  P1             2       2          0        0
  P2             1       0          1        0

  hasAdvisories: true, because F004 is deferred.

  Review verdict: PASS

Planning Trigger
  The verdict routes to a changelog entry rather than a remediation plan.

Active Finding Registry
  No finding is active at close. The four findings are in fix-ledger.md.

Remediation Workstreams
  Lane 1  runtime/lib/answer.ts        F001  wave 3  pass
  Lane 2  .skilled/bin/bots.cjs        F002  wave 4  pass
  Lane 3  runtime/lib/needs-you.ts     F003  wave 4  pass
  Lane 4  runtime/lib/README.md        F004  none    deferred

Spec Seed
  No spec delta is implied.

Plan Seed
  No plan starter is needed.

Traceability Status
  Six protocols covered, no unresolved gap.

Deferred Items
  F004   P2 advisory   the runtime README is a surface no phase owns
  fn-003 frontier node closed exhausted, maintainability uncovered

Audit Appendix
  Coverage      four canonical dimensions in every lineage
  Replay        the state log replays to the same registry
  Convergence   0.04, below the 0.1 threshold, frontier drained
  Reviewed commit: 79519553b62
  Stop reason: converged
```

The verdict line is the last line of the Executive Summary and it appears nowhere else. A reader who greps for `^Review verdict: ` gets one line, which is what AC-008 counts.

---

## 3. THE RENDERED LEDGER

The ledger is read by an operator who wants to know what changed and how it was proved. One row per finding, in registry order.

```text
Fix ledger

  Finding     File                              Fix                          Verify                Status
  F001 (P0)   runtime/lib/answer.ts             derive the scope before      answer.vitest.ts      pass
                                                the write, so a reject
                                                stores deny
  F002 (P1)   .skilled/bin/bots.cjs             print the object envelope    chat --transcript     pass
                                                with version and messages
  F003 (P1)   runtime/lib/needs-you.ts          filter on the item id        needs-you.vitest.ts   pass
                                                shape as well as the suffix
  F004 (P2)   runtime/lib/README.md             deferred: a documentation    rg -c 'module'        deferred
                                                surface no phase owns
```

The `Status` column is the last cell of every row, so a reader can count the rows that read `pass` or `deferred` without parsing the middle. The `Verify` cell carries no pipe, because a pipe would split the cell.

---

## 4. THE DASHBOARD

The dashboard is a status view and never the source of truth. When it disagrees with the state log, the log wins and the reducer regenerates the dashboard. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:71]

```text
Deep review dashboard

  Run          rvw-2026-11-25T21-14-04Z, generation 1, new
  Status       complete
  Iteration    7 of 7, stop reason converged
  Verdict      PASS, provisional until the fix pass closes

  Findings     P0 0   P1 0   P2 0   active
               P0 1   P1 2   P2 1   found
               P0 1   P1 2   P2 0   fixed
               P0 0   P1 0   P2 1   deferred

  Dimensions   correctness      covered
               security           covered
               traceability       covered
               maintainability    covered

  Convergence  0.04 against a 0.1 threshold
               frontier 10 answered, 0 open, 0 pruned

  Gates        evidence   pass, every active finding carries file:line
               scope      pass, nothing outside the declared target
               coverage   pass, four dimensions and six protocols

  Fix waves    wave 3  1 lane   pass
               wave 4  3 lanes  2 pass, 1 deferred
```

The `Findings` block reads four ways because one number is not enough: what was found, what is active, what was fixed and what was deferred. A dashboard that showed only the active count would read zero at close and hide the work.

---

## 5. THE TWO FAILURE FRAMES

### 5.1 A report that cannot be synthesized

```text
bots-review: synthesis
  registry         4 findings, 1 withdrawn
  report           8 sections, missing Audit Appendix
bots-review: review-report-incomplete: review/review-report.md
```

Exit 1. No ledger is written, so no fix wave starts against a report nobody can read.

### 5.2 A fix that leaves the named surfaces

```text
bots-review: fix wave 4
  lane 2           F002 bots.cjs, suite pass
  scoped diff      1 path outside the named surfaces
                   .skilled/skills/system-skilled-bots/runtime/lib/README.md
bots-review: review-fix-outside-surface: 1 path
```

Exit 1. The finding stays `active` and the close is blocked. The path is named, so the operator can either revert it or amend the review's scope with a recorded reason.

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The console prints one line per phase boundary and nothing per tool call | A reader who watches the console needs to know where the run is. A line per tool call buries that |
| A refusal prints no `review/` folder | A refusal that left a folder would read as a run that reviewed nothing, which is the one thing a refusal must not look like. The one exception is `preflight.json`, which is the record of what was tried and is written before the refusal is raised |
| The fallback frame is a console frame and not a failure frame | A host with four binaries is the normal case D3 settles, so it belongs beside the clean run. A failure frame would tell the operator something went wrong when nothing did |
| The verdict line is the last line of the Executive Summary | A reader who stops after the first section still gets the answer, and the line stays outside the nine headings so the heading count is unaffected |
| The dashboard shows four finding counts, not one | The active count reads zero at close and would hide the work. The found, fixed and deferred counts are what a reader needs |
| A `CONDITIONAL` close exits 0 and a `FAIL` exits 1 | The exit code is the machine's answer and the verdict is the reader's. A recorded deferral is a decision, and an active P0 is an unowned defect |
| A failure frame names the path it refused on | A refusal without a path leaves the operator searching. One line with the path is the difference between a fix and an investigation |
