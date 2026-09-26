---
title: "Feature Specification: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode"
description: "Measure the OpenCode goal verifier's error rates for the first time on an operator-labeled set, score a Jev choice arm against it under the wrapper rule, and add a keyless-inert shadow OPENCODE_GOAL_VERIFIER=jev mode only if that arm clears a threshold fixed before the build."
trigger_phrases:
  - "goal verifier jev shadow"
  - "goal verifier labeled set"
  - "opencode goal verifier accuracy"
  - "jev shadow verifier mode"
  - "verifier keep threshold"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-26 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-advisor-jev-tiebreak-arm |
| **Successor** | None |
| **Handoff Criteria** | The scorer's report states keep or drop against the threshold in REQ-006. On drop the phase closes with the plugin untouched. On keep, the shadow mode passes REQ-010 and REQ-011 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cli-jev workflow integration specification. It builds recommendation R2 (verdict: next) from `../001-deep-research/research/research.md`, section 11 "R2" and section 13 "003-goal-verifier-jev-shadow".

**Scope Boundary**: Two slices, in order. Slice 1 is an operator-labeled set and one offline scorer: the heuristic arm with zero Jev calls, then a Jev arm behind a flag and the key gate. Slice 2 is a shadow `jev` value for the existing `OPENCODE_GOAL_VERIFIER` switch, and it is in scope only if slice 1's report says keep. In that mode the heuristic's verdict stays the only one that acts.

**Dependencies**:
- **The operator writes the labels.** 30 to 50 excerpts from the operator's own OpenCode sessions, each labeled `met`, `not_met` or `blocked`, with secrets stripped by the operator before any Jev call. No agent authors or labels rows. Nothing past the heuristic baseline can run until the set exists.
- The Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps, for the Jev arm only. The heuristic baseline needs no Jev install.
- Soft: 002's per-call latency record. Slice 1 records its own wall times, so either source can show whether a Jev call fits the 30 s verifier budget before slice 2.

**Deliverables**:
- The labeled set as a JSONL fixture and one offline scorer script
- A report with a confusion table per arm on identical rows, error attribution per heuristic check, a stability coefficient, per-call records and a keep or drop line
- Only on keep: the `jev` shadow mode in the goal plugin, its tests and its docs

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

In OpenCode autonomous mode the goal plugin decides "is this goal done" after each idle. A false `not_met` costs a continuation turn and a nudge, and a false `met` ends a goal early. Nobody knows how often either happens: the verifier's only harness is three unit tests and no labeled set (`goal-core.test.cjs:631-651`, per research R2). The research also found three facts that shape any Jev mode. The heuristic never returns `blocked` (`.opencode/plugins/opencode-goal.js:2197-2230`). An unknown mode value silently falls back to `heuristic` (`:226-229`), so `OPENCODE_GOAL_VERIFIER=jev` today quietly gives the heuristic. And a verifier that throws becomes `blocked` at confidence 0 (`:2378-2380`), so a Jev mode that let a missing key throw would show the operator a false `blocked`.

### Purpose

Give the goal verifier its first measured error rates. Then add a Jev shadow beside it only if a Jev `choice` measurably cuts false `not_met` without adding a false `met`. With no Jev key, everything behaves exactly as today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A labeled JSONL set of 30 to 50 rows, authored and secret-stripped by the operator.
- One offline scorer that runs the plugin's own heuristic over every row with zero Jev calls, attributes each error to the heuristic check that produced it, and, behind `--jev` and the key gate, runs a Jev `choice` arm under the wrapper rule for 3 reruns.
- Verdict normalization between the plugin's `not_met` and the shared core's `not-met` and `unclear`.
- Only if the report says keep: `OPENCODE_GOAL_VERIFIER=jev` as a shadow mode in the goal plugin, with tests and doc rows.

### Out of Scope

- Any mode where a Jev answer changes goal state. The heuristic stays authoritative in every mode this phase adds.
- The shadow mode, when the report says drop. The phase then ends with the plugin unchanged.
- Changing the heuristic's checks or `VERIFIER_BLOCKING_PATTERN`, even where the set shows they cause false `not_met`. That goes in the report as a finding, not a fix.
- Editing `goal-core.cjs`. Normalization lives in the scorer.
- Pi, Cursor, Devin, Claude and Codex goal surfaces. Pi verifies once per turn and follows OpenCode's result (research RQ3).
- The npm `jevctl`, which also installs a `jev` command. The gate refuses it.
- Any key literal on a command line, in a fixture, a report or a log.

### Files to Change

Every path is proposed and fixed at build time after `rg` confirms no clash.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | Create (operator) | 30 to 50 rows of `{id, objective, evidence, label}`. The operator authors, strips and labels it and decides whether it is committed |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` | Create | The offline scorer: heuristic arm, normalization, gate, Jev arm, report. About 100 to 150 LOC |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Create | Happy path on a synthetic three-row fixture with `jev` absent, plus the normalization and bad-label edge case |
| `.opencode/plugins/opencode-goal.js` | Modify, keep only | The `jev` mode value at `:134`, its branch at `:226-234` and the shadow call. About 60 to 100 LOC. `.skilled/plugins/` and `.skilled/hooks/goal/opencode/opencode-goal.js` are symlinks that resolve to this file |
| `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs` | Modify, keep only | No-key parity, a malformed answer, an exit 3 mid-session and an exit 4, all against a stub `jev` on `PATH` |
| `.skilled/hooks/goal/goal-plugin.md` | Modify, keep only | The idle-verification bullet at `:53` and the `OPENCODE_GOAL_VERIFIER` row at `:70` |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify, keep only | The `OPENCODE_GOAL_VERIFIER` enum row at `:337` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The labeled set exists and is well formed | The scorer reads 30 to 50 rows, each with a non-empty `objective`, `evidence` and a `label` that normalizes to `met`, `not_met` or `blocked`. It rejects any other label by row id and exits non-zero. Under 30 valid rows it prints `stop: fewer than 30 rows` and runs nothing further |
| REQ-002 | The heuristic baseline runs with zero Jev calls | With no flag, the scorer prints a label-by-verdict confusion table for the plugin heuristic, and it attributes each error to one of the five checks by the heuristic's reason (`opencode-goal.js:2201-2221`). Run with `jev` absent from `PATH`, it prints the same table and spawns no process |
| REQ-003 | The key gate runs before any Jev call and keyless behavior is unchanged | The Jev arm runs only when all of these hold, checked in order: `--jev` is set, `command -v jev` succeeds, `jev --version` prints `jev 0.6.2`, and `jev auth status` exits 0. The first failing check prints one line, `jev arm skipped: <check>`, the baseline prints unchanged and the scorer exits 0 |
| REQ-004 | The wrapper rule keeps blocking language away from Jev | The arm never asks Jev about a row the heuristic stopped at its length check or its blocking-language check. Those two run first (`:2201-2207`), so every row the pattern matches is held. The scorer asserts that no per-call record carries either reason, and that every row the shared core marks `not-met` is held |
| REQ-005 | Verdicts from both vocabularies are normalized | Labels and verdicts map `not-met` to `not_met` and the core's `unclear` to `not_met`, which is what the plugin returns for the same checks. Any other value is an error. The report records the vocabulary split as a finding |
| REQ-006 | The keep threshold is fixed now and read as written | Keep only if, on each of 3 reruns, (a) the Jev arm's false `not_met` count is at most 0.70 times the heuristic's, (b) the Jev arm has no false `met` the heuristic did not have, (c) every asked row labeled `blocked` is answered `blocked`, and (d) the stability coefficient `1 - stddev/mean` of the arm's correct-row count over the reruns is at least 0.95 (`benchmark-stability.cjs:22-28`). Any added false `met` means drop, whatever else improves |
| REQ-007 | Jev gets no secret, and egress is announced | Before the first call the scorer prints the payload class ("operator-labeled objective and evidence excerpts"), the row count and the call count. State reaches `jev` on stdin, never as an argument. No key appears on a command line, and no key, row text or evidence text appears in the per-call record |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Cheap stop boundaries run before any call | The scorer prints `stop: no headroom` and makes no call when the heuristic has no false `met` and a false `not_met` rate at or below 0.10, the rate being rows labeled `met` that the heuristic calls `not_met` over all rows labeled `met`. It prints `stop: no reachable rows` when every false `not_met` row is held by the wrapper rule |
| REQ-009 | Every call leaves a per-call record | A JSONL line per call holds row id, rerun number, `jev` version, exit code, wall time in ms, the parsed key or `unmeasured` and the reason. Its latency p50 and p95 print in the report |
| REQ-010 | The shadow mode, only on keep, leaves the heuristic in charge | `normalizeVerifierMode('jev')` returns `jev`, and the heuristic's result is what `maybeVerifyGoal` applies. The Jev call is an async spawn bounded by the verifier timeout, and it runs after the heuristic verdict is applied. It writes a shadow record with `source: jev-shadow` to its own JSONL file in the goal state directory. At most one shadow call runs per session at a time |
| REQ-011 | The shadow mode is inert without a key, and Jev failures stay out of the verdict path | The gate runs once per OpenCode session. With it failing, the mode writes one enablement line naming the failed check, then behaves exactly as `heuristic` with no line per verification. With it passing, the enablement line announces that objective and evidence leave the machine. An exit 3 on a live call disables the shadow for the rest of the session with one line. Exit 4, a timeout or a malformed answer skip that one shadow record. No Jev failure reaches the catch that turns an error into `blocked` (`:2378-2380`). The existing `opencode-goal-*.test.cjs` suites pass, and the new cases pass against a stub `jev` |
| REQ-012 | The change stays inside its files | `git status` shows no change outside the fixture, the scorer and its test, this phase folder and, only on keep, the four plugin, test and doc files in the table above |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:edge-cases -->
## Edge Cases

- **No `jev` on `PATH`, the npm `jevctl` on `PATH`, or `jev auth status` exiting 3.** The scorer prints the baseline and `jev arm skipped: <check>`, and exits 0. The shadow mode writes one enablement line and then acts as `heuristic`. `jev auth status` checks presence, not validity: it exits 0 for a stored key or an exported `TYPESAFE_API_KEY`, exits 3 with neither, never prints the key and spends no quota (confirmed live on 2026-09-26, recorded in the parent goal log).
- **A present but rejected key.** The gate passes, and the first call exits 3. The scorer stops the arm and reports the finished rows as partial. The shadow mode disables itself for the rest of the session with one line.
- **Exit 4 (429, 5xx, connection).** The scorer retries once after a backoff, then marks the row `unmeasured`. The shadow mode skips that record.
- **Exit 1, exit 2, or an answer outside `met`, `not_met` and `blocked`.** The row is `unmeasured`. Exit 2 also stops the scorer's arm, because it means the scorer built a bad command.
- **A call past 30 s.** Offline, the row is `unmeasured` and its wall time is kept. Live, that shadow record is skipped and the heuristic's verdict, already applied, stands.
- **Unmeasured rows.** They leave both arms' tables, and their count prints beside every metric. A rerun where more than 10% of asked rows are unmeasured does not count toward the keep.
- **A row labeled `blocked` that the wrapper rule holds.** Its arm verdict is the heuristic's `not_met`. It is reported in its own line and does not count against REQ-006 (c), which judges only rows Jev was asked about.
- **The labels file uses `not-met`.** It normalizes to `not_met`.
- **A second idle arrives while a shadow call is in flight.** The new shadow record is skipped with reason `busy`, and the heuristic runs as usual.
- **`OPENCODE_GOAL_VERIFIER=llm`.** Unchanged. The shadow runs only in `jev` mode.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:proof-plan -->
## Proof Plan

Written before the build, from research R2, with the operator's key-gate amendment to step 5.

1. The labeled set holds at least 30 rows, each with an objective, an evidence excerpt and one label. **Boundary:** under 30 rows proves nothing, and the phase stops there.
2. The heuristic baseline runs with zero calls and prints a confusion table with each error attributed to its check. **Boundary:** if the heuristic has no false `met` and a false `not_met` rate at or below 0.10, stop and build nothing. Stop as well if no false `not_met` row survives the wrapper rule.
3. The Jev arm runs under the wrapper rule for 3 reruns. **Boundary:** it never asks Jev about a row where the blocking pattern matched, and the script asserts this.
4. The report reads the keep threshold (REQ-006) against the heuristic's numbers. **Boundary:** any added false `met` fails the keep, whatever else improves.
5. Only then the plugin shadow mode. **Boundary:** with no key, a session in `jev` mode reaches the same verdicts as `heuristic` mode, with one log line at enablement and none per verification. Before this step, a per-call p95 from slice 1 or from 002 must sit under the 30 s budget. If it does not, the shadow would mostly time out, and the phase stops at the report.
<!-- /ANCHOR:proof-plan -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator knows the goal heuristic's false `met` and false `not_met` rates on their own sessions, and which check causes each error, whether or not Jev ever ships.
- **SC-002**: A Jev shadow mode ships only on a measured keep, and with no key a session cannot tell it from `heuristic` mode apart from one enablement line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's labeling time | Nothing past the baseline runs, and the phase cannot start measuring | The scorer and its test can be built and checked on a synthetic fixture first. The real set is the operator's task |
| Dependency | Python `jev-cli` 0.6.2 and a key | The Jev arm is skipped | The skip is the specified keyless behavior. The baseline still ships |
| Risk | The payload is the operator's own conversation, the most sensitive in this research | High | The operator strips secrets before any call. The scorer announces egress and call count first. State goes on stdin, and no row text reaches a report or record |
| Risk | The wrapper rule also holds rows where "error" or "failed" appear in a real completion ("fixed the failing test") | Med | This caps Jev's upside by design. The report counts false `not_met` rows held by the rule, so the cap is visible. REQ-008 stops when nothing is reachable |
| Risk | A small set gives a noisy threshold | Med | 3 reruns, a stability floor of 0.95 and a rule that a rerun with more than 10% unmeasured rows does not count |
| Risk | A spawn from OpenCode blocks the plugin host (`completion-evidence-sentinel.cjs:90-93`) | High, slice 2 only | Async spawn only, bounded by the verifier timeout, after the heuristic verdict is applied |
| Risk | The mode set and `OPENCODE_GOAL_VERIFIER` are a documented contract | Med, slice 2 only | `VALID_VERIFIER_MODES` has no reader outside the plugin (`rg` on 2026-09-26: `:134` and `:228` only). The build reruns that search, and `goal-plugin.md:70` and `ENV-REFERENCE.md:337` change in the same commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Can the provider and model be read from a `choice` answer's JSON, or only from one billed `jev auth test`? 002 may answer it first. Otherwise the scorer spends one `jev auth test` at the arm's start and counts it in the announced call count.
- Is the labeled set committed? It holds the operator's conversation excerpts, so that is the operator's call after review. The scorer takes the set's path as an argument either way.
- What does the npm `jevctl` print for `--version`? UNKNOWN. The gate refuses anything but `jev 0.6.2`, so the answer does not change the build.
<!-- /ANCHOR:questions -->

---
