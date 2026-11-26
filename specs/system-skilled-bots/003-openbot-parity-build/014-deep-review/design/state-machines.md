---
title: "Design: the review run's state machines and sequences"
description: "Four state machines and five sequence diagrams for the review run, the lineage, the finding and the fix wave, plus the verdict derivation, so a builder reads an order rather than choosing one."
trigger_phrases:
  - "deep review state machine"
  - "review lineage lifecycle"
  - "review verdict derivation"
  - "deep review sequence"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The review run's state machines and sequences

This file fixes the order of the run. It draws the four machines the phase moves through, the five sequences that carry it, and the rule that turns findings into a verdict. The record shapes are in `design/records.md`. The refusals are in `design/refusals.md`.

The loop's own protocol is `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`. This file does not restate it. It fixes what this phase does around it.

---

## 1. THE RUN

The run has six states. A state is entered only when the one before it left the evidence the next one reads.

```mermaid
stateDiagram-v2
    [*] --> Preflight
    Preflight --> Refused: no executor present, or the scope is empty
    Preflight --> Seeded: at least one executor present, and the scope holds a file
    Seeded --> FanOut: seeded-findings.json written, and the dry run halted at step_fanout_spawn
    FanOut --> Merged: every lineage left a packet, or the fallback replaced the ones that did not
    FanOut --> Refused: every lineage was lost
    Merged --> Synthesized: the report carries nine sections and one verdict line
    Merged --> Refused: the report is missing a section or a verdict line
    Synthesized --> Fixing: the ledger holds one row per finding
    Fixing --> Fixing: a wave landed and its suites passed
    Fixing --> Verified: no finding reads active
    Verified --> Closed: the suite, the validator and the scoped diff all pass
    Verified --> Refused: the suite is below baseline, the validator failed, or the diff left the named surfaces
    Closed --> [*]
    Refused --> [*]
```

| State | Entered when | The evidence it leaves | The refusal if it cannot be entered |
|-------|--------------|------------------------|-------------------------------------|
| `Preflight` | the run starts | the five probes, the 013 validator line, the suite baseline | `review-no-executor`, `review-scope-empty` |
| `Seeded` | the three handoff paths were read | `seeded-findings.json` | `review-seed-unreadable` |
| `FanOut` | the dry run halted at `step_fanout_spawn` | `review/lineages/<label>/` for each lineage | `review-lineage-orphaned` |
| `Merged` | the merge wrote `orchestration-summary.json` | the merged registry and the summary | `review-merge-incomplete` |
| `Synthesized` | the report was written | `review-report.md` | `review-report-incomplete`, `review-verdict-missing` |
| `Fixing` | the ledger was written | `fix-ledger.md` | `review-ledger-incomplete` |
| `Verified` | the last wave landed | the ledger rows all read `pass` or `deferred` | `review-fix-outside-surface`, `review-suite-below-baseline`, `review-validator-failed` |
| `Closed` | the verdict row was appended | the verdict event and the summary | `review-verdict-blocked` |

`Refused` is terminal and writes no verdict line. A run that reaches it leaves the packet open and the report unwritten, because a review with no reader is not a clean review.

---

## 2. THE LINEAGE

Five lineages are planned. A lineage that cannot spawn is replaced, and a lineage that spawns and then fails is retried at most the runner's bound.

```mermaid
stateDiagram-v2
    [*] --> Probed
    Probed --> Present: the binary answers its version probe
    Probed --> Absent: the binary is missing, or its version is outside the pin
    Absent --> Replaced: the next executor in the fallback order takes its share
    Present --> Spawned: the matrix names it and the pool has a slot
    Spawned --> Running: the lineage writes its first iteration row
    Running --> Complete: the lineage leaves a terminal stop event and a full iteration set
    Running --> Failed: the lineage exits without a terminal stop event
    Failed --> Retried: the retry bound is not spent
    Retried --> Running: the same label, the same directory
    Failed --> Replaced: the retry bound is spent
    Complete --> Merged: the merge reads its registry
    Replaced --> Spawned: the replacement's label is the next executor's
    Merged --> [*]
```

| Transition | Rule | Where it is decided |
|------------|------|---------------------|
| `Probed` to `Present` | the binary is on `PATH` and its version probe exits 0 | T003 |
| `Probed` to `Absent` | the binary is missing, or its version is outside the pin its mode names | T003, contracts D3 |
| `Absent` to `Replaced` | the next executor in the fallback order takes the share with `--count=2` | `plan.md` section 8.3 |
| `Running` to `Complete` | a terminal stop event and a full iteration set, which is the runner's own completion policy | `fanout-run.cjs` |
| `Running` to `Failed` | the process exited with no terminal stop event | `fanout-run.cjs` |
| `Failed` to `Retried` | the retry bound is not spent | NFR-R01 |
| `Failed` to `Replaced` | the retry bound is spent | NFR-R01, `plan.md` section 8.3 |

A lineage that is `Complete` but whose config still reads `running` is the case the plan-depth research hit: the work is there and the terminal row is not. The merge reads the iteration files and the registry, so such a lineage counts as `Complete` and its missing terminal row is recorded in the report's Audit Appendix. It is not `Failed`, because a failed lineage's findings would be reported as partial and this one's are whole.

The fallback keeps the count at five. A group with `--count=2` yields `<label>-1` and `<label>-2`, so the label set changes and the count does not. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:1366]

Every `Probed` outcome is written to `review/preflight.json` before the first spawn, so the machine's first two transitions leave a record a reader can check. The shape is `design/records.md` section 11.

---

## 3. THE FINDING

A finding is seeded or found, then triaged, then fixed or deferred, then verified.

```mermaid
stateDiagram-v2
    [*] --> Seeded: a handoff row becomes a finding
    [*] --> Found: a lineage reports it
    Seeded --> Active
    Found --> Active
    Active --> Duplicate: another finding names the same file and the same defect
    Duplicate --> Resolved: the merge keeps one and closes the other
    Active --> Triaged: the orchestrator assigns a class and a wave
    Triaged --> Fixed: the fix landed and its verify command printed what the row says
    Triaged --> Deferred: the fix needs a surface the review did not name, or no route can fix it
    Fixed --> Verified: the module's suite passed and the regression test fails without the fix
    Verified --> Closed
    Deferred --> Closed: the reason is recorded and the verdict reads CONDITIONAL
    Resolved --> Closed
    Closed --> [*]
```

| State | `status` in the registry | Counted in `findingsBySeverity` | Blocks a PASS |
|-------|--------------------------|--------------------------------|---------------|
| `Active` | `active` | yes | yes for P0 and P1 |
| `Triaged` | `active` | yes | yes for P0 and P1 |
| `Fixed` | `fixed` | no | no |
| `Verified` | `fixed` | no | no |
| `Deferred` | `deferred` | no | yes for P1, no for P2 |
| `Resolved` | `resolved`, in `resolvedFindings` | no | no |

A `Deferred` P1 blocks a PASS and does not block the close. The packet closes on `CONDITIONAL` and the report's Deferred Items section names the finding and its reason. That is the one case where the close and the verdict disagree, and it is deliberate.

A `Deferred` P2 blocks nothing. The verdict reads `PASS` with `hasAdvisories` true, and the finding stays in the report's Deferred Items section. That is D6.

---

## 4. THE FIX WAVE

A wave is one dispatch round. The hard constraint is the file: no two workers in a wave touch the same file.

```mermaid
stateDiagram-v2
    [*] --> Partitioned: the findings are grouped by file
    Partitioned --> Dispatched: one worker per disjoint group, capped by the wave's worker limit
    Dispatched --> Landed: every worker returned
    Landed --> Proved: each fix's own suite ran and its regression test failed without the fix
    Proved --> NextWave: a finding still reads active
    Proved --> LastWave: no finding reads active
    Landed --> Reverted: a fix changed behavior a phase's acceptance criteria already proved
    Reverted --> Deferred: the finding is recorded deferred with the revert as its reason
    Deferred --> NextWave
    NextWave --> Partitioned
    LastWave --> [*]
```

| Wave | Task ids | Workers | What it proves |
|------|----------|---------|----------------|
| 0 | T001 to T004, T017 | 0 | the preconditions, the seeded intake and the preview |
| 1 | T005 to T007 | 5 lineages | the review ran and merged |
| 2 | T008, T009 | 0 | the report and the ledger exist |
| 3 | T010, T012 | at most 3 | every P0 is fixed and proved |
| 4 | T011, T012 | at most 4 | every P1 is fixed or deferred with a reason |
| 5 | T013 to T016, T018 | 0 | the suite, the validator, the scoped diff and the scenario re-run |

A wave's worker count is the number of disjoint file groups its findings fall into, capped by the wave's limit. A finding that needs a file another worker owns waits for the next wave. The seven file groups are in `tasks.md`.

---

## 5. THE VERDICT

The verdict is strongest restriction over the lineages, then narrowed by the fix pass's own state. The merge already applies strongest restriction, so any lineage's active P0 makes the merged verdict `FAIL`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1312]

```mermaid
stateDiagram-v2
    [*] --> Merged
    Merged --> FAIL: any lineage reported an active P0
    Merged --> CONDITIONAL: no active P0, and a lineage reported an active P1
    Merged --> PASS: no active P0 and no active P1
    FAIL --> FAIL: a P0 stays active after the fix pass
    FAIL --> CONDITIONAL: every P0 is fixed, and a P1 is deferred
    FAIL --> PASS: every P0 and every P1 is fixed
    CONDITIONAL --> CONDITIONAL: a P1 is deferred, or a filed product failure is open
    CONDITIONAL --> PASS: every P1 is fixed and no filed product failure is open
    PASS --> CONDITIONAL: a filed product failure is open, a frontier node closed short, or a scenario re-run reads SKIP for a missing verb or field
    PASS --> [*]
    CONDITIONAL --> [*]
    FAIL --> [*]
```

The rule, in the order it is applied:

| Step | Test | Verdict if true | Verdict if false |
|------|------|-----------------|------------------|
| 1 | any finding reads `active` with severity `P0` | `FAIL` | step 2 |
| 2 | any finding reads `deferred` with severity `P1` | `CONDITIONAL` | step 3 |
| 3 | `seeded-findings.json` holds a `012-failures` row whose finding is not `fixed` | `CONDITIONAL` | step 4 |
| 4 | a `scenario-rerun.json` entry reads `SKIP` with a reason naming a missing verb or a missing field | `CONDITIONAL` | step 5 |
| 5 | a frontier node closed `exhausted` or `blocked` short of its dimension universe | `CONDITIONAL` | step 6 |
| 6 | a `blocked_stop` event is in the state log | `CONDITIONAL` | step 7 |
| 7 | every test above is false | `PASS` | not reached |

Step 3 is D4. A filed product failure does not block 012's close and it does block this phase's PASS, so a run that leaves one open reads `CONDITIONAL` and names it in Deferred Items.

Step 4 is the scenario re-run rule. A `SKIP` whose reason names a prerequisite the build does not own, such as a channel account or a host without a tty, is a recorded outcome and does not reach this step. A `SKIP` whose reason names a missing verb or a missing field is a defect, because phases 001 to 011 are closed before the corpus runs, so the run reads `CONDITIONAL` and names the row in Deferred Items.

`hasAdvisories` is true when any finding reads `deferred` with severity `P2`. It does not change the verdict.

The verdict line is written once, at the end of the Executive Summary, and the same string is written into the verdict event row and into `implementation-summary.md`. Three copies of one string, and the report's is the one AC-008 counts.

---

## 6. THE SEQUENCES

### 6.1 Setup and preflight

```mermaid
sequenceDiagram
  autonumber
  participant Or as Orchestrator
  participant Va as validate.sh
  participant Su as runtime suite
  participant Bi as five binaries
  participant Hf as the three handoff paths
  participant Pk as review/
  Or->>Va: validate 013 with --strict
  Va-->>Or: RESULT: PASSED, or the run stops
  Or->>Su: npm test in the runtime folder
  Su-->>Or: the suite baseline, recorded in preflight.json
  Or->>Bi: command -v and one version probe each
  Bi-->>Or: present or absent, per binary
  Or->>Pk: write preflight.json with the five entries
  Or->>Or: refuse review-no-executor when all five are absent
  Or->>Hf: read failures.md, rebuttals.md and evidence/
  Hf-->>Or: the rows, or a missing path with its reason
  Or->>Pk: write seeded-findings.json
  Or->>Pk: dry run the matrix
  Pk-->>Or: five lineage lines and dry_run_halt at step_fanout_spawn
  Note over Or,Pk: review/ still holds no lineage folder, so nothing has spawned
```

### 6.2 Fan-out and merge

```mermaid
sequenceDiagram
  autonumber
  participant Or as Orchestrator
  participant Fr as fanout-run.cjs
  participant L1 as lineage vibe
  participant L2 as lineage pi
  participant L3 as lineage opencode
  participant L4 as lineage devin
  participant L5 as lineage codex
  participant Mg as fanout-merge.cjs
  Or->>Fr: the five executor groups with --concurrency=5
  Fr->>Fr: seed the depth-1 frontier and deal each node
  par five independent reads
    Fr->>L1: spawn with its own packet
    Fr->>L2: spawn with its own packet
    Fr->>L3: spawn with its own packet
    Fr->>L4: spawn with its own packet
    Fr->>L5: spawn with its own packet
  end
  L1-->>Fr: registry and iterations
  L2-->>Fr: registry and iterations
  L3-->>Fr: registry and iterations
  L4-->>Fr: registry and iterations
  L5-->>Fr: registry and iterations
  Fr->>Mg: merge the five registries
  Mg-->>Fr: openFindings, findingsBySeverity, mergedVerdict
  Fr->>Fr: write orchestration-summary.json
  Note over Fr,Mg: strongest restriction, so any lineage active P0 makes the merged verdict FAIL
```

### 6.3 Synthesis and triage

```mermaid
sequenceDiagram
  autonumber
  participant Sy as synthesis
  participant Rg as the merged registry
  participant Sd as seeded-findings.json
  participant Rp as review-report.md
  participant Lg as fix-ledger.md
  Sy->>Rg: read every active finding
  Sy->>Sd: read the seeded rows
  Sy->>Sy: dedupe a seeded row against a found one by file and defect
  Sy->>Rg: assign F ids in ledger order and set seededFindings
  Sy->>Rp: write the nine sections and one verdict line
  Sy->>Lg: write one row per finding, status active
  Note over Sy,Lg: the ledger row count equals openFindings.length from here on
```

### 6.4 A fix wave

```mermaid
sequenceDiagram
  autonumber
  participant Or as Orchestrator
  participant Wk as one worker per file group
  participant Su as the module's suite
  participant Rg as the registry
  participant Lg as fix-ledger.md
  Or->>Or: partition the active findings by file
  Or->>Wk: dispatch one worker per disjoint group
  Wk->>Wk: read the finding, the file and the contract it must agree with
  Wk->>Wk: edit the one file and add one regression test
  Wk-->>Or: the change and the command that proves it
  Or->>Su: run the suite covering the changed file
  Su-->>Or: pass or fail
  alt the suite passed and the regression test fails without the fix
    Or->>Rg: set the finding to fixed with its wave and verify command
    Or->>Lg: set the row to pass
  else the suite failed, or the fix needs a new surface
    Or->>Rg: set the finding to deferred with its reason
    Or->>Lg: set the row to deferred
  end
  Note over Or,Lg: a finding that needs a file another worker owns waits for the next wave
```

### 6.5 The scenario re-run

```mermaid
sequenceDiagram
  autonumber
  participant Or as Orchestrator
  participant Lg as fix-ledger.md
  participant Fm as failures.md
  participant Pb as the playbook corpus
  participant Rr as scenario-rerun.json
  Or->>Lg: read the files the pass changed
  Or->>Or: derive touchedPhases from those files
  Or->>Fm: read the filed failures
  Fm-->>Or: the scenario id and its phase, per row
  Or->>Pb: resolve every other scenario through its category folder
  Pb-->>Or: the scenario's section 3 bash block
  Or->>Pb: run each scenario whose owning phase was touched
  Pb-->>Or: PASS, FAIL or SKIP with its evidence
  Or->>Rr: write one entry per scenario and the two counts
  Note over Or,Rr: a FAIL becomes a new finding and blocks the close
```

---

## 7. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| A lineage whose work is whole but whose terminal row is missing counts as complete | The plan-depth research hit exactly this case and judged the lineage on content [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:5]. Calling it failed would report whole findings as partial |
| The fallback keeps the count at five and changes the label set | D3 says the fallback wins, and AC-003 reads five lineages after it. A group with `--count=2` yields two labels, so the count holds and the labels say which executor ran twice |
| A deferred P1 closes the packet on `CONDITIONAL` | REQ-005 allows a deferral and the handoff criteria reads zero active P1. A `CONDITIONAL` close is the honest reading of both, and a false PASS is the one outcome the phase may not produce |
| The verdict is applied as seven ordered tests, not as a score | A score leaves a builder choosing a weight. Seven tests each name a fact a reader can check |
| A `SKIP` for a missing verb or field is a verdict test and not a recorded outcome | A skip is honest only when the blocker is outside the build. After phases 001 to 011 close, a missing verb is a defect, and a `PASS` over it would claim a surface nobody proved |
| The scenario re-run resolves the owning phase from the failure row first | The row is precise and the folder is conservative. Reading the folder first would re-run nine conversation scenarios for a fix in 001 |
| A `FAIL` in the re-run is a new finding rather than a reopened one | The original finding was fixed and its fix proved. A new failure is a new defect, and merging the two would hide which change caused it |
