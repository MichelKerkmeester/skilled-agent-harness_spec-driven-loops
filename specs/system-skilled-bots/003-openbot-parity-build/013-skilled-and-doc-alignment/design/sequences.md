---
title: "Design: the alignment sequences"
description: "Five Mermaid sequence diagrams: the skilled-alignment run, the doc-alignment run, the fix pass, the recheck and the evidence copy that hands the result to 014, each naming the script, the file it writes and the line it prints."
trigger_phrases:
  - "alignment run sequence"
  - "doc alignment sequence"
  - "fix pass sequence"
  - "evidence copy sequence"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The alignment sequences

Five sequences. Each one names the actor that does the work, the file it writes and the line it prints, so a builder can tell from the diagram alone whether a step happened. The participants are the router, the workflow, the scripts the workflow calls, the lane executor and the operator.

The scripts are the ones the two command documents list as owned assets. [SOURCE: .skilled/commands/local-skilled-alignment.md:19] [SOURCE: .skilled/commands/local-doc-alignment.md:21] A step that writes a file names the file. A step that prints a line quotes the line's shape from the presentation contract.

---

## 1. THE SKILLED-ALIGNMENT RUN

```mermaid
sequenceDiagram
  autonumber
  actor OP as Operator
  participant R as Router
  participant W as Workflow
  participant S as resolve-scope.cjs
  participant B as run-battery.cjs
  participant L as run-lanes.cjs
  participant C as Critic
  participant P as run-probes.cjs
  participant A as aggregate-findings.cjs
  participant PR as prune-runs.cjs

  OP->>R: /local-skilled-alignment :auto
  R->>R: bind target HEAD, base origin/main, scope_mode first-parent, lanes_preset native, keep 10
  R->>W: load local-skilled-alignment-auto.yaml
  W->>S: resolve the scope from git topology
  S-->>W: scope.json and scope-summary.json
  W-->>OP: scope branch HEAD: 716 files, 12 commits, 2 uncommitted
  W->>B: run the fired surfaces' checks
  B-->>W: battery.json and env-tokens.json
  W-->>OP: battery pass 215, fail 6, cannot run 0, not applicable 2
  W->>L: four read-only lanes at the fired surfaces
  L->>C: one completeness critic over every lane
  C-->>L: critic.json with an optional overrides array
  L-->>W: one lane result per lane
  W-->>OP: lane A ok 41s, lane B ok 38s, lane C ok 52s, lane D ok 44s
  W->>P: score the routing lane's probe prompts
  P-->>W: probes.json and probes-held.json
  W-->>OP: probes pass 9, fail 5, cannot run 0, held 0 not upheld by the critic
  W->>A: merge the battery, the lanes, the critic and the probes
  A-->>W: findings.json, fix-plan.md and report.md
  W-->>OP: report <run dir>/report.md
  W->>PR: keep the newest 10 run folders
  PR-->>W: removed 0 runs, 0 scratch folders, kept 10
  W-->>OP: Alignment report written, Findings 40 (P0 2, P1 19, P2 19), STATUS=PARTIAL
```

The run is report-only, so no step writes the checkout. [SOURCE: .skilled/commands/local-skilled-alignment.md:15] The one step that can write a repository file is `apply-fixes.cjs`, and it runs only under `--fix literal`, which this phase does not pass.

The `STATUS=PARTIAL` line is not a failure. It says the run finished and the report holds findings. A run with no findings prints `STATUS=OK`.

---

## 2. THE DOC-ALIGNMENT RUN

```mermaid
sequenceDiagram
  autonumber
  actor OP as Operator
  participant R as Router
  participant W as Workflow
  participant D as doc-alignment.cjs
  participant L as run-lanes.cjs
  participant C as Critic
  participant A as aggregate-findings.cjs
  participant PR as prune-runs.cjs

  OP->>R: /local-doc-alignment system-skilled-bots :auto
  R->>R: bind topic system-skilled-bots, lanes_preset native, lane_count 4, keep 10
  R->>W: load local-doc-alignment-auto.yaml
  W->>D: scope --topic system-skilled-bots --out <run dir>
  D->>D: read topics.json and load the topic
  alt the topic is absent or unknown
    D-->>OP: /local-doc-alignment: unknown topic system-skilled-bots, STATUS=FAIL ERROR="unknown topic system-skilled-bots"
    D-->>W: exit 2, and no run folder is written
  else the topic resolves
    D->>D: list every tracked doc whose text matches the terms, plus every doc inside a code root
    D-->>W: scope.json, scope-summary.json, an empty battery.json, lanes.json and one lane prompt per lane
    W-->>OP: scope topic system-skilled-bots: 121 docs in 4 lanes, 3 checks
    W->>D: checks --run-dir <run dir>
    D->>D: run each check in the topic through bash -c from the repository root
    D-->>W: battery.json with one D2 row per check
    W-->>OP: checks pass 3, fail 0, cannot run 0
    W->>L: run the four lanes in parallel
    L-->>W: one lane result per lane
    W->>D: critic-prompt --run-dir <run dir>
    D-->>W: the critic prompt built from every lane result
    W->>C: one completeness critic
    C-->>W: critic.json
    W-->>OP: critic done
    W->>A: merge the battery, the lanes and the critic
    A-->>W: findings.json, fix-plan.md and report.md
    W-->>OP: report <run dir>/report.md
    W->>PR: keep the newest 10 run folders
    PR-->>W: removed 0 runs, 0 scratch folders, kept 10
    W-->>OP: Doc alignment report written, Topic system-skilled-bots 121 docs, STATUS=OK
  end
```

The `alt` block is the whole reason the topic lands first. A run that takes the first branch writes no run folder, so the operator sees a failure line and the state root gains nothing. [SOURCE: .skilled/commands/local-doc-alignment.md:41]

The doc run's `checks` step runs before the lanes, so a failing package validator is a `D2` row in the report whether or not a lane ever reads the file. That is the deterministic half of the run and it is the half that catches a broken package rather than a wrong sentence.

---

## 3. THE FIX PASS

The fix pass is a hand edit. It is drawn as a sequence because the order of its three outputs matters: the doc edit first, then the disposition, then the re-run that proves the edit landed.

```mermaid
sequenceDiagram
  autonumber
  actor OP as Operator
  participant F as Fix pass
  participant R1 as skilled report
  participant R2 as doc report
  participant DOC as The doc or the CLI help
  participant RB as scratch/rebuttals.md
  participant DJ as dispositions.json

  OP->>F: read both fix-plan.md files
  F->>R1: read findings.json
  F->>R2: read findings.json
  F->>F: give every finding a class, instance-only, class-of-bug, cross-consumer, algorithmic, matrix or evidence, or test-isolation
  loop every finding in either report
    alt the code root is right and the doc is wrong
      F->>DOC: edit the doc so its claim matches the code
      F->>RB: record nothing, because the finding is fixed
    else the code root is wrong
      F->>RB: record status handed_off with the reason and the 014 destination
      F->>DJ: write an entry with status handed_off
    else the finding is wrong
      F->>RB: record status rebutted with the fact that makes it wrong
      F->>DJ: write an entry with status rebutted
    end
  end
  F->>DJ: place dispositions.json in each run folder
  F-->>OP: the fix pass is done when every finding is fixed, handed off or rebutted
```

Three rules the diagram encodes.

- **A fixed finding gets no disposition.** A disposition is for a finding the pass declines. A fixed finding leaves the open count because the next run no longer reports it, and a disposition on it would hide a fix that did not land.
- **`dispositions.json` goes into the run folder, not the phase folder.** The aggregator reads it from the run folder it is aggregating, so a disposition written anywhere else is ignored. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:620]
- **The rebuttals record and the disposition carry the same status word.** `scratch/rebuttals.md` is the phase's record and `dispositions.json` is the aggregator's input, and the two disagreeing is the one way a declined finding can be counted as open.

---

## 4. THE RECHECK

```mermaid
sequenceDiagram
  autonumber
  actor OP as Operator
  participant W as Workflow
  participant RC as recheck.cjs
  participant B as run-battery.cjs
  participant FS as The checkout
  participant PR as prune-runs.cjs

  OP->>W: /local-skilled-alignment --recheck=<original run dir>
  W->>RC: list the original run's failing rows
  RC->>RC: read battery.json and keep the rows whose status is fail or cannot_run
  RC-->>W: rows.json
  W->>B: --rows-from rows.json
  B->>FS: re-run only those checks
  B-->>W: a new battery.json
  W->>RC: compare the original run with the new battery
  RC->>RC: classify every row into resolved, still_open or new
  RC->>RC: classify every finding into resolved, still_open, needs_review or disposed
  RC->>FS: read each literal finding's file to test its old and new text
  RC-->>W: recheck.json and recheck.md
  W-->>OP: recheck resolved 5, still open 3, new 0, needs review 33
  W->>PR: keep the newest 10 run folders
  PR-->>W: removed 0 runs, 0 scratch folders, kept 10
  W-->>OP: Recheck of <original run dir> written, Still open 3, New 0, STATUS=OK
```

The recheck writes into a new run folder, so the original run's `report.md` stays the record of what the first run found. That is why the clean criterion reads the newest folder that holds a `report.md` and not the newest folder under the root.

`STATUS=OK` on a recheck means the recheck ran. The counts say what is still open, and the phase's criterion reads the counts. [SOURCE: .skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-presentation.txt:145]

---

## 5. THE EVIDENCE COPY AND THE HANDOFF TO 014

```mermaid
sequenceDiagram
  autonumber
  actor OP as Operator
  participant P as This phase folder
  participant S as The skilled run root
  participant D as The doc run root
  participant E as evidence/
  participant R as scratch/rebuttals.md
  participant N as 014-deep-review

  OP->>S: ls -t <root>/*/report.md and take the first
  OP->>D: ls -t <root>/*/report.md and take the first
  OP->>P: confirm each report reads Open findings 0
  OP->>E: copy report.md, findings.json and recheck.md from the skilled run into evidence/skilled-alignment
  OP->>E: copy report.md, findings.json and recheck.md from the doc run into evidence/doc-alignment
  OP->>R: confirm every heading names an id a run's findings.json carries
  OP->>P: record both roots, the criterion and the re-measured counts in implementation-summary.md
  P->>N: hand over evidence/ and scratch/rebuttals.md
  N->>N: seed one finding per row of each handoff file
  N-->>OP: the review reads a checked surface rather than an assumed one
```

The copy is the fix for the gap that both reports were written outside the checkout. A later reader opens `evidence/skilled-alignment/report.md` without the operator's state root, and the clean close is checkable after the run folders are pruned.

The handoff is two paths and nothing else: `evidence/` and `scratch/rebuttals.md`. 014 seeds one finding per row of each, so a `handed_off` row becomes a finding the review must settle and a `rebutted` row becomes a finding the review may overturn. That is the connection the plan-depth research found missing, and naming both paths here is what closes it.
