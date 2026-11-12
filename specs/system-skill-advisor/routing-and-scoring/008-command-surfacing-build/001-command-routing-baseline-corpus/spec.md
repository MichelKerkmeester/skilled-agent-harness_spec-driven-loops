---
title: "Feature Specification: Phase 1: command-routing-baseline-corpus"
description: "No corpus measures whether the skill advisor reaches a slash command, so the later phases could not prove a gain. This phase adds a command prompt corpus for the 44 tracked commands and a captured baseline, with no scorer change."
trigger_phrases:
  - "command routing baseline corpus"
  - "phase 1 command routing baseline corpus"
  - "command prompts corpus"
  - "command recall baseline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.4 -->
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Phase 1: command-routing-baseline-corpus



---

## EXECUTIVE SUMMARY

The advisor's four prompt corpora score skills, and only the doctor slice scores commands, so nothing records how often a prompt reaches any of the other 27 tracked commands. This phase adds `command-prompts.jsonl`, a capture script and a slice test that hold a per-command baseline, and it changes no scoring code. The proof is a baseline file that lists all 44 tracked commands while the existing capture still prints 158 of 195, 50 of 66, 20 of 24 and 5 false fires.

**Key Decisions**: generalise the doctor slice instead of building a new harness, hold out half of the plain-chat rows so phase 3 cannot tune on the rows it is measured by

**Critical Dependencies**: a fresh `dist` build of the advisor runtime, because the scorer is imported from `dist/runtime/lib/scorer/fusion.js`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-command-inventory-and-risk-metadata |
| **Handoff Criteria** | Corpus rows exist for all 44 tracked commands and a baseline records per-command recall, with the four existing numbers unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow specification.

**Scope Boundary**: Measurement only. This phase adds a corpus, a capture script, a baseline file and a slice test. It edits no scorer, bridge, schema, renderer or instruction file, and it edits none of the four existing corpora.

**Dependencies**:
- The review's measurement recommendation and its phase 0 exit check, in `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md` sections 3 and 6.
- The per-command policy table in section 5 of the same review, which supplies the policy labels.
- Operator decisions D3 and D5 in section 13 of `../../007-command-surfacing-and-workflow-enforcement/research/research.md`.

**Deliverables**:
- `command-prompts.jsonl` with rows for every tracked command.
- `capture-command-routing-baseline.mjs` and the `command-routing-baseline.json` it writes.
- `command-routing-slice.vitest.ts`, which fails when a live score differs from the baseline.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor is scored against three pinned skill corpora and one doctor slice, and none of them holds a gold label for a non-doctor command. The later phases change the scorer so that plain chat reaches a command, and without a number captured first there is no way to show that they helped or that they did not make the advisor offer commands nobody asked for.

### Purpose
A committed baseline states, for each of the 44 tracked commands, how often a typed and a plain-chat prompt reaches it today, so each later phase reports a delta against it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd .skilled/skills/system-skill-advisor/runtime
$ ls scripts/routing-accuracy/*.jsonl
scripts/routing-accuracy/ambiguity-prompts.jsonl
scripts/routing-accuracy/doctor-prompts.jsonl
scripts/routing-accuracy/holdout-prompts.jsonl
scripts/routing-accuracy/labeled-prompts.jsonl
$ node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '.metrics | {full: .full_corpus_top1.correct, of: .full_corpus_top1.total, holdout: .holdout_top1.correct, holdout_of: .holdout_top1.total, ambiguity: .ambiguity_top1.correct, ambiguity_of: .ambiguity_top1.total, gold_none_false_fire: .gold_none_false_fire.value}'
{"full":158,"of":195,"holdout":50,"holdout_of":66,"ambiguity":20,"ambiguity_of":24,"gold_none_false_fire":5}
```

The listing shows no command corpus. The second line is the floor this phase must leave untouched: 158 of 195, 50 of 66, 20 of 24 and 5 false fires on gold-none rows.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `command-prompts.jsonl` with typed, plain-chat, near-miss, must-not-start and slash-variant rows, covering every tracked command.
- Add a capture script that scores the corpus under the pinned regime the doctor slice uses and prints or writes a baseline.
- Commit the baseline with per-command recall, false offer rate, agreement and the count of commands the scorer cannot return today.
- Add a slice test that re-scores live and fails on any difference from the baseline, and on a tracked command with no corpus row.
- List the three new files in the routing-accuracy `README.md`.

### Out of Scope
- Any change to the scorer, the command bridges, the recommendation schema or the brief - that is phases 2, 3 and 5, and a change here would spoil the baseline.
- Editing `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` or `doctor-prompts.jsonl` - their hashes are pinned and the doctor slice has its own gate.
- Scoring the Python scorer - the ratchet and the doctor slice measure the TypeScript scorer, and the Python difference has its own ledger.
- Scoring the policy label - no recommendation field carries a policy until phase 5, so the label is stored and not scored.
- Transcript-based behaviour runs - that layer is phase 7.
- Rows for the private `/local-skilled-alignment` command - decision D5 excludes it.

### Files to Change

Paths are under `.skilled/skills/system-skill-advisor/runtime/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/routing-accuracy/command-prompts.jsonl` | Create | The command prompt corpus |
| `scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Create | Scores the corpus and prints or writes the baseline |
| `scripts/routing-accuracy/command-routing-baseline.json` | Create | The captured baseline |
| `tests/command-routing-slice.vitest.ts` | Create | Fails on drift from the baseline and on a command with no row |
| `scripts/routing-accuracy/README.md` | Modify | Names the three new files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `command-prompts.jsonl` holds, for each `.skilled/commands/<namespace>/<name>.md` file, at least one row typed as the slash command and at least two plain-chat rows that never contain the command string. |
| REQ-002 | Each row carries `id`, `prompt`, `row_type`, `split`, `expected_command`, `expected_top`, `expected_policy` and `source`. `expected_top` is the owner skill id or null. A must-not-start row has `expected_command` null. |
| REQ-003 | `capture-command-routing-baseline.mjs` scores under the pinned regime of `tests/doctor-routing-slice.vitest.ts`: empty database directory, semantic lane off, force-local, lane overrides cleared and the clock set to `capturedAt` of `scorer-eval-baseline.json`. |
| REQ-004 | The baseline records, per command, recall at 1 and reach in the top three for typed rows and for plain rows, plus the corpus-wide false offer rate on must-not-start rows. |
| REQ-005 | The four existing numbers do not move: `capture-scorer-eval-baseline.mjs` prints 158 of 195, 50 of 66, 20 of 24 and 5, and `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` passes. |
| REQ-006 | `tests/command-routing-slice.vitest.ts` fails when a live score differs from the baseline in either direction, and when a tracked command file has no corpus row. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Each plain-chat row has `split` set to `tune` or `holdout`, every command has at least one of each, and the baseline reports the two splits separately. |
| REQ-008 | The corpus holds at least 20 must-not-start rows. At least 8 of them are plain research or review requests with no wording about depth, iteration or convergence, so the phase gives decision D3 its false offer rate. |
| REQ-009 | The corpus holds at least one near-miss row per owner skill, where the skill alone is the gold label and no command should be on top. |
| REQ-010 | The corpus holds at least 10 slash-variant rows: a partial slash, a command quoted in backticks and a command named inside a question about it. |
| REQ-011 | The baseline lists every command that no active TypeScript bridge maps to, so its recall of zero reads as "cannot be returned" and not as a scoring miss. |
| REQ-012 | The baseline reports skill and command agreement: of the rows where a command is returned beside a skill, the share where the command's owner in `command-bridges.generated.json` is that skill. |
| REQ-013 | No prompt in the new corpus equals a prompt in the four existing corpora. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq '.commands | length' scripts/routing-accuracy/command-routing-baseline.json` prints 44.
- **SC-002**: `npx vitest run tests/command-routing-slice.vitest.ts tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts` passes with no file other than the five in section 3 changed.
- **SC-003**: Changing one `expected_command` value in the corpus makes the slice test fail with the row id in the message.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A fresh `dist` build of the advisor runtime | The capture script imports the built scorer, so a stale build scores old code | The script refuses a missing or stale build with exit 2, as `doctor-phrase-reach.cjs` does |
| Dependency | `command-bridges.generated.json` | It maps a returned id to its command and owner | Read it as it is and record its `counts` block in the baseline |
| Risk | Phase 3 authors phrases while reading the rows it is scored by | High: the recall gain would prove nothing | The `holdout` split, which phase 3 is told not to read, reported separately |
| Risk | Prompts written by one author share a style the scorer happens to like or dislike | Med | Take plain rows from the three research lineages' transcripts and from command descriptions where they exist, and note the source in the row |
| Risk | A new runtime file names a pinned corpus and trips `holdout-independent.vitest.ts` | Med | The new files read only the new corpus and `scorer-eval-baseline.json`. The duplicate check for REQ-013 is a shell command in `tasks.md`, not a runtime file |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The slice test finishes inside the suite's 30 second per-test timeout. The measured time is recorded in `implementation-summary.md`.

### Security
- **NFR-S01**: N/A. The files read prompts from a committed fixture and open no socket.

### Reliability
- **NFR-R01**: Two capture runs on the same commit print identical JSON, because the clock and the environment are pinned.

---

## 8. EDGE CASES

- Empty input: an empty or missing corpus file makes the capture script exit 2 with the path, and the slice test fail.
- Maximum input: a doctor command with several routes counts as reached when any of its route ids is returned, so 35 routes still report under 17 commands.
- Failure path: a row that names a command with no file under `.skilled/commands/` makes the capture script exit 2 with the row id.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 5, LOC: about 600 including about 200 corpus rows, Systems: 1 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N |
| Research | 6/20 | Row authoring needs the review's per-command table and the bridge inventory |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: 2, and phases 2 to 7 all read the baseline |
| **Total** | **28/100** | **Level 3+** |

The level was set by the parent scaffold for all six children. The helper would score this phase lower, and the level is kept so the six children share one shape.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 3 tunes on the rows that measure it | H | M | The `holdout` split and a separate number for it |
| R-002 | The new files move one of the four pinned numbers | H | L | No scoring file is edited, and REQ-005 reruns the ratchet |
| R-003 | A gold label encodes a preference the operator did not decide | M | M | Labels follow the review's section 5 table and decisions D1 to D5, and a row outside them is left out |
| R-004 | The corpus counts 45 commands on a checkout that holds the private command | M | M | The list is built from two-level paths only, which the top-level private file does not match |

---

## 11. USER STORIES

### US-001: A number to compare against (Priority: P0)

**As a** maintainer changing the advisor's scorer, **I want** a committed per-command baseline, **so that** I can show whether my change made a command easier to reach.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

### US-002: A guard against over-offering (Priority: P1)

**As an** operator who chats without typing commands, **I want** the false offer rate measured before the scorer changes, **so that** a later phase cannot trade it away unseen.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Operator | Approved | 2026-11-12 |
| Design Review | Operator | Pending | - |
| Implementation Review | Operator | Pending | - |
| Launch Approval | Operator | Pending | - |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance-checkpoints -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- N/A: the phase adds a test fixture, a script and a test. It reads no credential, no user data and no network resource.

### Code Compliance
- [ ] Coding standards followed
- N/A for licence: no dependency is added.
<!-- /ANCHOR:compliance-checkpoints -->

---

<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Operator | Product | High | The end-of-turn status of each session |
| Operator | Engineering | High | `implementation-summary.md` of this phase |
<!-- /ANCHOR:stakeholder-matrix -->

---

<!-- ANCHOR:change-log -->
## 15. CHANGE LOG

### v1.0 (2026-11-12)
**Initial specification**
<!-- /ANCHOR:change-log -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None blocks planning. The row counts in REQ-008 to REQ-010 are minimums chosen here, not measured needs, and the operator may raise them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`

---
