---
title: "Design: the alignment state machines"
description: "Six Mermaid state machines: the skilled-alignment run, the doc-alignment run, the finding, the recheck bucket, the topic and this phase's own clean-criterion loop, with every state and every edge named."
trigger_phrases:
  - "alignment run state machine"
  - "finding lifecycle"
  - "recheck bucket machine"
  - "clean criterion loop"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The alignment state machines

Six machines decide this phase. The first two are the commands' own step order, read from their workflow summaries. [SOURCE: .skilled/commands/local-skilled-alignment.md:91] [SOURCE: .skilled/commands/local-doc-alignment.md:80] The third and fourth are the finding and the recheck bucket, read from the aggregator and the recheck script. [SOURCE: .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs:397] [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:148] The fifth is the topic, read from the loader. [SOURCE: .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs:91] The sixth is this phase's own loop, which is the one machine no script enforces and the one a builder is most likely to get wrong.

A state named here is a state a reader can observe in a file or in a status line. A state that exists only in a person's head is not drawn.

---

## 1. THE SKILLED-ALIGNMENT RUN

The run is report-only unless `--fix literal` is passed. [SOURCE: .skilled/commands/local-skilled-alignment.md:15] Every state below writes at least one file into the run folder, so the folder is the record of how far the run got.

```mermaid
stateDiagram-v2
  [*] --> Bound: the router binds target, base, scope_mode, surfaces, out_dir, config_path, no_lanes, recheck_from, fix_mode, lanes_preset, keep and execution_mode

  Bound --> Stopped: an asset is missing, the executor config is unreadable, or the scope script prints STATUS=ERROR
  Bound --> Scoped: resolve-scope.cjs writes scope.json and scope-summary.json
  Bound --> Rechecking: recheck_from is set, so steps 1 to 6 are replaced

  Scoped --> Battery: run-battery.cjs runs the fired surfaces' checks and writes battery.json and env-tokens.json
  Scoped --> Stopped: the scope fires no surface, so the battery has zero rows and the run records an empty scope

  Battery --> Lanes: no_lanes is false
  Battery --> Aggregated: no_lanes is true, so the run is battery-only

  Lanes --> Probed: four read-only lanes returned and one completeness critic scored them
  Lanes --> Aggregated: a lane failed, so the critic scores a partial set and the report names the missing lane
  Probed --> Aggregated: run-probes.cjs scored the routing lane's probes and a failed probe counts only when the critic upheld it

  Aggregated --> Reported: aggregate-findings.cjs writes findings.json, fix-plan.md and report.md
  Reported --> Fixed: fix_mode is literal and the operator approved the diff
  Reported --> Pruned: fix_mode is none, or the operator chose skip at the fix checkpoint
  Fixed --> Pruned: apply-fixes.cjs writes applied.json and applied.diff

  Rechecking --> Rechecked: recheck.cjs lists the failing rows, run-battery.cjs --rows-from re-runs only those, and recheck.cjs writes recheck.md and recheck.json
  Rechecked --> Pruned: step 7 still runs

  Pruned --> [*]: prune-runs.cjs keeps the newest keep run folders
  Stopped --> [*]: the run folder holds what was written before the stop and no report.md
```

Three edges carry a rule a builder would otherwise invent.

- **`Scoped` to `Stopped` on an empty scope.** A scope with no `.skilled` change fires no surface and the battery writes zero rows. The run still writes `report.md` with `- Open findings: 0`, and the phase records that the scope was empty rather than claiming a clean pass over a change set that did not exist. The scope line's `note=` text is printed on a second line for exactly this case. [SOURCE: .skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-presentation.txt:66]
- **`Lanes` to `Aggregated` on a failed lane.** A lane that errors does not stop the run. The critic scores what came back and the report's `Lanes:` line names the missing ids, so a partial review is visible rather than silent.
- **`Reported` to `Fixed` only under `--fix literal`.** This phase never takes that edge. The applier reaches only a literal finding whose exact text the critic did not overturn, and 4 of the last run's 40 findings were literal. [SOURCE: .skilled/commands/local-skilled-alignment.md:15]

---

## 2. THE DOC-ALIGNMENT RUN

The doc run has no recheck mode and no git range. Its scope is the doc set the topic resolves, so its first state can fail before any file is written.

```mermaid
stateDiagram-v2
  [*] --> Routed: the router binds topic, lanes_preset, lane_count, no_lanes, no_checks, fix_mode, out_dir, keep and execution_mode

  Routed --> NoTopic: no positional word, so the presentation lists the topics and stops
  Routed --> UnknownTopic: the word names no key in topics.json
  Routed --> BadTopic: the topic has no terms, has no codeRoots, or names a codeRoot that does not exist
  Routed --> Scoped: doc-alignment.cjs scope writes scope.json, scope-summary.json, an empty battery.json, lanes.json and one lane prompt per lane

  NoTopic --> [*]: STATUS=FAIL ERROR="no topic", and no run folder is written
  UnknownTopic --> [*]: STATUS=FAIL ERROR="unknown topic <name>", and no run folder is written
  BadTopic --> [*]: the script's STATUS=ERROR line, and no run folder is written

  Scoped --> Checked: doc-alignment.cjs checks runs the topic's checks into battery.json
  Scoped --> Lanes: no_checks is true, so D2 stays fired with zero rows and the report says so

  Checked --> Lanes: no_lanes is false
  Checked --> Aggregated: no_lanes is true, so the run is checks-only

  Lanes --> Critic: run-lanes.cjs ran the lanes in parallel and each returned findings as JSON
  Lanes --> Aggregated: a lane failed, so the critic scores a partial set
  Critic --> Aggregated: doc-alignment.cjs critic-prompt built the prompt and one completeness critic verified the findings

  Aggregated --> Reported: aggregate-findings.cjs writes findings.json, fix-plan.md and report.md
  Reported --> Fixed: fix_mode is literal and the operator approved the diff
  Reported --> Pruned: fix_mode is none, or the operator chose skip
  Fixed --> Pruned: apply-fixes.cjs writes applied.json and applied.diff

  Pruned --> [*]: prune-runs.cjs keeps the newest keep run folders
```

The three failure edges before `Scoped` are the reason the topic must land first. A run that stops at `NoTopic` writes no run folder, so a typo in the topic name is distinguishable from a clean run by the absence of the folder rather than by a green report. [SOURCE: .skilled/commands/local-doc-alignment.md:41]

---

## 3. THE FINDING

One finding, from the moment a lane writes it to the moment it leaves the open count. The aggregator decides the first three edges and the fix pass decides the rest.

```mermaid
stateDiagram-v2
  [*] --> Raw: a lane, the battery, the env check, a probe or the critic reports it

  Raw --> Dropped: it has no issue text, so the aggregator records a problem and does not count it
  Raw --> Normalized: the aggregator fills severity, fix_class, surface, standard and inferred

  Normalized --> Overturned: the critic refuted it or showed it repeats another finding
  Normalized --> Outside: the critic showed it pre-dates the scope, or its file is not in scope.json
  Normalized --> Open: it is in scope and the critic upheld it

  Overturned --> [*]: it leaves every count and is listed under Overturned by the critic
  Outside --> [*]: it keeps its severity and is listed under Outside the scope

  Open --> Fixed: the fix pass edits the file and the next run no longer reports it
  Open --> HandedOff: the code root is wrong, so the finding goes to 014 and the doc is not edited
  Open --> Rebutted: the fix pass declines it with a reason

  HandedOff --> [*]: disposition status handed_off, and the open count drops by one
  Rebutted --> [*]: disposition status rebutted, and the open count drops by one

  Fixed --> Resolved: the recheck finds the row passing or the literal fix's new text present and its old text absent
  Fixed --> StillOpen: the recheck finds the row still failing or the old text still there
  Fixed --> NeedsReview: the finding is a judgment one, or its file changed differently

  Resolved --> [*]
  StillOpen --> Open: the fix pass reopens it
  NeedsReview --> [*]: a person settles it, and the recheck's exit status does not depend on it
```

The `Open` to `HandedOff` edge is decision D3 and it is the one edge a builder is most likely to take wrongly. A finding whose code root is wrong is not fixed by editing the doc to agree with the runtime, because that turns the doc into a record of the bug. It is recorded in `scratch/rebuttals.md` with status `handed_off` and it goes to 014.

The `Fixed` to `NeedsReview` edge is why the clean criterion reads `still_open` and `new` and not `needs_review`. A judgment finding is settled by a person reading the file, and a re-run cannot decide it. The last full run over this repository left 33 findings in that bucket, so a criterion that counted it would never pass.

---

## 4. THE RECHECK BUCKET

Every row and every finding enters exactly one bucket, and the five buckets are disjoint. The machine is drawn because two of them look alike and only one of them blocks.

```mermaid
stateDiagram-v2
  [*] --> Compared: recheck.cjs reads the original battery.json and findings.json and the new battery.json

  Compared --> Resolved: a row is pass or not_applicable now, or a literal fix's new text is present and its old text is absent
  Compared --> StillOpen: a row is fail or cannot_run now, or a row the new battery did not produce, or a literal fix's old text is still there
  Compared --> New: a row is open now and was not open in the original run
  Compared --> NeedsReview: a finding is a judgment one, or a literal finding's file changed differently
  Compared --> Disposed: a finding carries a disposition, so its status and note settle it

  Resolved --> [*]
  StillOpen --> Blocks: the recheck exits 1 and the phase reopens the fix pass
  New --> Blocks: the recheck exits 1 and the phase reopens the fix pass
  NeedsReview --> [*]: the recheck exits 0 and a person settles the finding
  Disposed --> [*]: the recheck exits 0 and the finding is already settled

  Blocks --> [*]: STATUS=OPEN
```

The exit rule is the whole point of the machine: `still_open` or `new` above 0 gives exit 1 and `STATUS=OPEN`, and everything else gives exit 0 and `STATUS=OK`. [SOURCE: .skilled/commands/assets/local-skilled-alignment/recheck.cjs:157] A `new` bucket above 0 reopens the fix pass even when `still_open` is 0, because a finding the first run missed is a finding the fix pass did not see.

---

## 5. THE TOPIC

The topic is a record with a lifecycle, and the phase's first task moves it from `Absent` to `Added`. The measured gap is the `Absent` to `NoTopic` edge.

```mermaid
stateDiagram-v2
  [*] --> Absent: topics.json holds ten topics and none names this skill

  Absent --> NoTopic: /local-doc-alignment runs with no positional word, so the presentation lists the topics and stops
  Absent --> UnknownTopic: /local-doc-alignment system-skilled-bots runs, and the name resolves to no key
  NoTopic --> [*]: STATUS=FAIL ERROR="no topic", and no run folder is written
  UnknownTopic --> [*]: STATUS=FAIL ERROR="unknown topic system-skilled-bots", and no run folder is written

  Absent --> Added: the entry lands with a title, four terms, three codeRoots and three checks
  Added --> Resolved: the loader reads it and finds terms, codeRoots and three existing code roots
  Added --> BadTopic: a term list is empty, a code root list is empty, or a code root does not exist
  BadTopic --> [*]: the script's STATUS=ERROR line, and no run folder is written

  Resolved --> Scoped: the scope step writes 121 docs into 4 lanes
  Scoped --> Checked: the three checks run and each exits 0
  Checked --> Reviewed: four lanes and one critic read the 121 docs against the three code roots
  Reviewed --> [*]: the report is written and the topic stays in topics.json for every later run
```

The `Added` to `Resolved` edge is the one the completion criterion reads: `codeRoots.length` is 3 and `checks.length` is 3. The `Resolved` to `Scoped` edge is the one the design measured: 121 docs in 4 lanes.

---

## 6. THIS PHASE'S OWN LOOP

The machine no script enforces. It is drawn because the phase's clean criterion is a loop and a builder who treats it as a single pass will close on a run that is not the last one.

```mermaid
stateDiagram-v2
  [*] --> NotRun: the topic is absent and no doc run has ever been made here

  NotRun --> TopicAdded: the entry lands in topics.json
  TopicAdded --> FirstRuns: both commands run once and each writes report.md, findings.json and fix-plan.md

  FirstRuns --> Triaged: every finding in both findings.json files is read and given a class
  Triaged --> FixPass: the doc edits and the CLI help edit are made, and every declined finding is written to scratch/rebuttals.md

  FixPass --> ReRuns: both commands run again, the skilled one with --recheck and the doc one whole
  ReRuns --> Clean: each report reads Open findings 0, the recheck reads still_open 0 and new 0, and every rebuttal names an id a run carries
  ReRuns --> FixPass: a report reads above 0, or the recheck's new bucket is above 0, so the fix pass reopens

  Clean --> EvidenceCopied: report.md, findings.json and recheck.md are copied into evidence/skilled-alignment and evidence/doc-alignment
  EvidenceCopied --> Closed: the packet validates and every acceptance row reads Met

  Closed --> [*]
```

Three rules the machine encodes.

- **`ReRuns` to `Clean` reads the last run only.** A clean report from an earlier run does not satisfy the criterion when a later run reported a finding. The criterion reads the newest folder that holds a `report.md`, which is why the recheck's own folder, which holds no `report.md`, cannot be mistaken for it.
- **`ReRuns` to `FixPass` fires on `new` as well as on `still_open`.** A finding the first run missed is a finding the fix pass did not see, so a `new` bucket above 0 reopens the pass even when nothing is still open.
- **`Clean` to `EvidenceCopied` is not optional.** The two run roots sit outside the checkout, so a clean close that is not copied cannot be checked later. That is the gap this phase closes and the reason `evidence/` exists.
