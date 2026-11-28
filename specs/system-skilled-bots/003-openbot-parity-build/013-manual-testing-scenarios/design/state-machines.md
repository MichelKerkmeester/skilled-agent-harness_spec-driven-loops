---
title: "Design: state machines of a scenario, a verdict and a run folder"
description: "Five Mermaid state machines: the scenario lifecycle, the verdict decision, the run folder lifecycle, the filed failure and the corpus census, each with the event that moves it and the file that records the move."
trigger_phrases:
  - "scenario lifecycle"
  - "verdict decision"
  - "run folder lifecycle"
  - "filed failure lifecycle"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# State machines

Five machines govern this phase. Each one names its states, the event that moves it and the file that records the move, so a builder reads the diagram and knows which file to write. The record shapes are in `scenario-contract.md`, and the refusal names a transition can raise are in `refusal-catalogue.md`.

---

## 1. THE SCENARIO LIFECYCLE

A scenario is authored once and executed many times. The corpus is an input, so an execution never moves a scenario back to `authored` unless the scenario itself was wrong.

```mermaid
stateDiagram-v2
    [*] --> Draft: the inventory row names the id, the category and the phase
    Draft --> Authored: the five sections and the eight fields are written
    Authored --> Validated: the package validator prints PASS with violations=0
    Validated --> Executed: the operator runs the one bash block
    Executed --> Pass: every expected signal appears and nothing contradicts it
    Executed --> Fail: a signal disagrees with the transcript
    Executed --> Skip: a stated prerequisite is absent
    Fail --> Triage: the operator reads the transcript against the requirement
    Triage --> Authored: the scenario was wrong, so it is fixed and re-validated
    Triage --> Filed: the product was wrong, so a failure row is written
    Skip --> Recorded: the blocker is named in the reason column
    Pass --> Recorded: the reason names the signals that appeared
    Filed --> Recorded: the row names the phase, the requirement, the line and the evidence
    Recorded --> [*]: the recorder writes the run folder
```

| State | Recorded in | Event that leaves it |
|-------|-------------|----------------------|
| `Draft` | the inventory table in `spec.md` | the file is written |
| `Authored` | the scenario file | the package validator passes |
| `Validated` | the validator's `PASS` line | the operator runs the block |
| `Executed` | the operator's transcript | the verdict is decided |
| `Pass` | the verdict row | the recorder writes the run |
| `Fail` | the verdict row | the triage decides scenario or product |
| `Skip` | the verdict row, with its blocker | the recorder writes the run |
| `Filed` | `scratch/failures.md` | the recorder writes the run |
| `Recorded` | `results.csv` | nothing, the run is closed |

A scenario that reaches `Filed` is still `Recorded`. The two are not exclusive, because a product failure is a recorded verdict and a filed row at the same time.

---

## 2. THE VERDICT DECISION

The verdict is decided by three questions in order. The first question is about the world, the second about the subject and the third about the signals.

```mermaid
stateDiagram-v2
    [*] --> Preflight
    Preflight --> Skip: node, git or the stub executor is absent
    Preflight --> Subject: the world is built
    Subject --> Skip: the verb the scenario drives is not in the CLI verb table
    Subject --> Signals: the verb answered
    Signals --> Pass: every expected signal appears
    Signals --> Fail: a signal disagrees
    Pass --> [*]
    Fail --> [*]
    Skip --> [*]
```

| Question | Answer that stops the run | Blocker written in the reason |
|----------|---------------------------|------------------------------|
| Is the world buildable? | `node`, `git` or the stub executor is missing | the binary's name |
| Is the subject present? | the verb is absent from the verb table | the verb and the phase that adds it |
| Do the signals agree? | no, one disagrees | the line that disagreed, quoted |

A real channel account is a fourth preflight answer for the two channel scenarios that name one. Those two run on the fake transport, so the account is never required, and a scenario that names a real account records `SKIP` with the account as its blocker. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md, REQ-017]

---

## 3. THE RUN FOLDER LIFECYCLE

The recorder is the one writer, so every state below is entered by one process and never by a hand edit.

```mermaid
stateDiagram-v2
    [*] --> Absent
    Absent --> Planned: the recorder reads the verdict CSV and checks every id
    Planned --> Refused: an id is unknown, a verdict is not PASS FAIL or SKIP, a FAIL or SKIP has no reason, or the folder exists
    Planned --> Staged: every row checks out
    Staged --> Written: results.csv, README.md and source.md land under a staging name
    Written --> Indexed: the staging folder is renamed and the index row is inserted
    Indexed --> [*]
    Refused --> [*]: nothing is written
```

| State | On disk | Event that leaves it |
|-------|---------|----------------------|
| `Absent` | nothing | the recorder is invoked |
| `Planned` | nothing | every row validates |
| `Refused` | nothing | nothing, the operator fixes the CSV |
| `Staged` | `<folder>.partial-<pid>/` | the three files are written |
| `Written` | the staging folder holds three files | the rename succeeds |
| `Indexed` | `<folder>/` and one row in `reports/README.md` | nothing, the run is closed |

A run whose result changes gets a new folder rather than an overwrite, so `Indexed` has no outgoing edge. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs:494]

---

## 4. THE FILED FAILURE

A filed failure is a handoff. This phase writes it, the deep review seeds it as a finding, and the fix pass closes it.

```mermaid
stateDiagram-v2
    [*] --> Filed: a FAIL is a product failure and the five fields are written
    Filed --> Copied: the file is copied beside results.csv in the run folder
    Copied --> Seeded: the deep review reads the row as a finding
    Seeded --> Fixed: the owning phase's fix lands
    Fixed --> ReRun: the scenario whose phase the fix touched is run again
    ReRun --> Closed: the re-run records PASS
    ReRun --> Filed: the re-run records FAIL and the row is rewritten
    Closed --> [*]
```

| State | Recorded in | Owner |
|-------|-------------|-------|
| `Filed` | `scratch/failures.md` | this phase |
| `Copied` | the run folder's `failures.md` | this phase |
| `Seeded` | the deep review's finding list | 015-deep-review |
| `Fixed` | the owning phase's packet | the phase the row names |
| `ReRun` | a second run folder | 015-deep-review |
| `Closed` | the second run's `results.csv` | 015-deep-review |

The re-run is decision D7: after the last fix, each scenario whose owning phase a fix touched is run again and its result recorded. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D7]

---

## 5. THE CORPUS CENSUS

The census is derived from the tree on every validator run, so a hand-typed count is a warning rather than a source of truth.

```mermaid
stateDiagram-v2
    [*] --> Baseline: 25 scenario files in 7 category folders
    Baseline --> Extended: 33 files land in 10 new category folders
    Extended --> Indexed: the root index links every file and holds 58 headings
    Indexed --> Verified: the validator prints scenarios=58 categories=17 violations=0 warnings=0
    Verified --> Drift: a file is added, removed or renamed without the index
    Drift --> Indexed: the index and the counts are corrected
    Verified --> [*]
```

| State | Derived from | Check |
|-------|--------------|-------|
| `Baseline` | the seven pre-parity folders | `scenarios=25 categories=7` |
| `Extended` | the tree walk | `find <playbook> -mindepth 2 -name '*.md' \| wc -l` prints 58 |
| `Indexed` | the root index's links | `INDEX_ORPHAN_FILE` names any file the index does not link |
| `Verified` | the validator's summary line | `violations=0 warnings=0` |
| `Drift` | the same walk, after a change | `CENSUS_MISMATCH` or `INDEX_ORPHAN_FILE` |

The root index states no hand-typed census, because the validator reports one as `HAND_TYPED_CENSUS` and this phase's criterion requires zero warnings. The counts live in the validator's summary line and in this phase's documents, never in the corpus root.
