---
title: "Design: the review packet's records"
description: "Every field of every record this phase writes, the seeded-finding intake from phases 012 and 013, the fix ledger row, the scenario re-run record and the nine report sections, so a builder copies a shape rather than inventing one."
trigger_phrases:
  - "deep review packet records"
  - "seeded findings intake"
  - "fix ledger row shape"
  - "scenario rerun record"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The review packet's records

This file fixes the shape of every record phase 014 writes. It does not restate the loop's own records, which `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` owns. It fixes the four records the loop does not write, the three keys this phase adds to the merged registry, and the two handoff files it reads.

The packet-level contracts are frozen and this file agrees with them. Where a shape is a shared record, this file cites the contract section instead of copying it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md:17]

---

## 1. THE FILE SET

The loop writes nine files under `review/` and an expansive run adds two more. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:34] This phase adds four of its own and writes no file the loop owns before the loop's terminal transition.

| File | Owner | Mutability | This phase's rule |
|------|-------|------------|-------------------|
| `review/deep-review-config.json` | the loop | immutable after init | read only. The phase asserts its values and never rewrites it |
| `review/deep-review-state.jsonl` | the loop, then this phase | append only | the phase appends its own event rows after the terminal transition and edits no earlier row |
| `review/deep-review-findings-registry.json` | the reducer, then this phase | regenerated, then owned | the phase takes the file at the terminal transition and folds the fix dispositions in. Section 4 |
| `review/deep-review-strategy.md` | the reducer | regenerated | read only |
| `review/deep-review-dashboard.md` | the reducer | regenerated | read only |
| `review/iterations/iteration-NNN.md` | the iteration agent | write once | read only |
| `review/frontier-nodes.jsonl` | the frontier admission step | append only | read only |
| `review/frontier-seed.json` | the seed step | written once | read only |
| `review/review-report.md` | synthesis | mutable | written once at synthesis and once more after the last fix wave. Section 9 |
| `review/orchestration-summary.json` | `fanout-run.cjs` | written once | read only. Section 5 |
| `review/seeded-findings.json` | this phase | written once | created at setup, before any lineage spawns. Section 7 |
| `review/preflight.json` | this phase | written once | created at setup, before the seeded intake. Section 11 |
| `review/fix-ledger.md` | this phase | mutable | one row per finding, updated after each wave. Section 6 |
| `review/scenario-rerun.json` | this phase | written once | created after the last fix wave. Section 8 |
| `review/lineages/<label>/` | `fanout-run.cjs` | one folder per lineage | read only |

The mutability column is the loop's own `fileProtection` table. [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:1] A file this phase adds carries no entry there, because the loop never writes it.

---

## 2. `deep-review-config.json`

The loop's config asset fixes every key. [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:1] This phase writes only the values below and asserts them in T006.

| Key | Type | Null | Value this phase writes | Why |
|-----|------|------|-------------------------|-----|
| `topic` | string | no | `deep review of the OpenBot parity build` | the run's subject |
| `sessionId` | string | no | `rvw-<createdAt with colons replaced by hyphens>` | the loop's own form |
| `parentSessionId` | string | yes | `null` | a new run, not a resume |
| `lineageMode` | string | no | `new` | NFR-R02 resumes with `resume` and keeps this value from the first run |
| `generation` | integer | no | `1` | a resume keeps it |
| `continuedFromRun` | string | yes | `null` | a new run |
| `maxIterations` | integer | no | `7` | the contract default [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:152] |
| `convergenceThreshold` | number | no | `0.1` | the contract default |
| `stuckThreshold` | integer | no | `2` | the contract default |
| `antiConvergence.depthMode` | string | no | `expansive` | REQ-002 |
| `antiConvergence.stopPolicy` | string | no | `fail-closed` | a stop the gates cannot prove is not a stop |
| `antiConvergence.minIterations` | integer | no | `2` | the contract default |
| `expansiveDepth.maxDepth` | integer | no | `3` | the contract default |
| `expansiveDepth.maxChildrenPerNode` | integer | no | `6` | the contract default |
| `expansiveDepth.maxFrontierNodes` | integer | yes | `null` | a fan-out run refuses `--frontier-max-nodes`, so the budget step derives it [SOURCE: .skilled/commands/deep/review.md:102] |
| `maxDurationMinutes` | integer | no | `120` | NFR-P01 |
| `maxToolCallsPerIteration` | integer | no | `24` | the contract default |
| `maxMinutesPerIteration` | integer | no | `10` | the contract default |
| `specFolder` | string | no | `specs/system-skilled-bots/003-openbot-parity-build/014-deep-review` | the packet this run reports into |
| `mode` | string | no | `review` | the loop's mode |
| `reviewTarget` | string | no | `specs/system-skilled-bots/003-openbot-parity-build` | the thirteen phase folders plus the contracts folder |
| `reviewTargetType` | string | no | `spec-folder` | the target is a folder tree |
| `reviewDimensions` | array | no | `["correctness","security","traceability","maintainability"]` | the four canonical ids. The five named dimensions ride on them, per `spec.md` section 4 |
| `reviewFocus` | string | yes | `null` | no single focus, because the run covers the whole build |
| `severityThreshold` | string | no | `P2` | every severity is reported |
| `status` | string | no | `initialized`, then `complete` at the terminal transition | the loop's own flip |
| `executionMode` | string | no | `auto` | the run is `/deep:review:auto` |
| `executor.kind` | string | no | `native` | the root config names no single executor, because the fan-out matrix carries the five |
| `executor.timeoutSeconds` | integer | no | `900` | the contract default |
| `reviewScopeFiles` | array | no | the paths the scope discovery found | written by `step_frontier_scope` and copied into each lineage config |
| `createdAt` | string | no | the run's instant, ISO 8601 UTC with a `Z` | the loop's own form |

`reviewDimensions` is the one key the completion criteria read. A run whose list differs is a different run, so T006 fails rather than repairs.

The five named dimensions and their canonical ids are in `spec.md` section 4. This file does not repeat the mapping.

---

## 3. `deep-review-state.jsonl`

The loop's record shapes are in `state-jsonl.md`. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:1] This phase appends four event rows after the terminal transition and writes no iteration row.

| Row | `type` | `event` | Keys this phase writes | When |
|-----|--------|---------|------------------------|------|
| Seeded intake | `event` | `seeded_intake` | `run`, `sources`, `rows`, `seededCount`, `timestamp` | setup, before any lineage spawns |
| Fix wave | `event` | `fix_wave` | `run`, `wave`, `findingIds`, `executor`, `model`, `reasoningEffort`, `startedAt`, `endedAt`, `result` | after each wave |
| Scenario re-run | `event` | `scenario_rerun` | `run`, `scenarios`, `rerunCount`, `failedCount`, `timestamp` | after the last fix wave |
| Verdict | `event` | `verdict` | `run`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `deferredP1`, `openProductFailures`, `stopReason`, `timestamp` | at the close |

`result` on a fix wave row is `pass`, `partial` or `failed`. `stopReason` on the verdict row is `converged` or `max_iterations`, which is the pair goal D3 requires the run to record.

A row this phase appends carries `run` as the loop's iteration number at the terminal transition, so a reader can order it after every iteration row.

---

## 4. `deep-review-findings-registry.json`

The reducer writes this file while the loop runs. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:240] The loop's terminal transition flips `status` to `complete` in the config, and no further iteration regenerates the registry. From that point this phase owns the file, because the fix pass is the only writer left.

### 4.1 The document

| Key | Type | Null | Value at close | Source |
|-----|------|------|----------------|--------|
| `sessionId` | string | no | the config's `sessionId` | the reducer |
| `generation` | integer | no | `1` | the reducer |
| `lineageMode` | string | no | `new` | the reducer |
| `mergedFrom` | array of string | no | the five lineage labels, sorted | the merge [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1309] |
| `mergedVerdict` | string | no | `PASS`, `CONDITIONAL` or `FAIL` | the merge, strongest restriction |
| `openFindings` | array | no | one entry per finding the fix pass owns, in ledger order. Section 4.2 | the merge, then this phase |
| `resolvedFindings` | array | no | findings closed during synthesis, each with `status` `resolved` | the merge |
| `findingsBySeverity` | object | no | `{"P0": 0, "P1": 0, "P2": 0}` at close | derived, section 4.3 |
| `openFindingsCount` | integer | no | `openFindings.length` | the merge |
| `resolvedFindingsCount` | integer | no | `resolvedFindings.length` | the merge |
| `dimensionCoverage` | object | no | one boolean per canonical id, all `true` at close | the reducer |
| `convergenceScore` | number | no | the last iteration's score, below `0.1` | the reducer |
| `searchDebt` | array | no | `[]` at close, or one entry per open frontier node | the reducer |
| `frontier` | object | yes | `nodes`, `stats`, `budget`, `activeNodeId`, `activeNextDimension`. Absent on a default run | the reducer |
| `seededFindings` | integer | no | the count `seeded-findings.json` holds | this phase |
| `corruptionWarnings` | array | no | `[]` | the reducer |

`mergedFrom` and `mergedVerdict` are the merge's own keys. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1312] This phase adds `seededFindings` and nothing else at the document level.

### 4.2 One finding

| Key | Type | Null | Value | Written by |
|-----|------|------|-------|------------|
| `findingId` | string | no | `F001`, `F002` and so on, in ledger order | this phase |
| `title` | string | no | one line naming the defect | the lineage, then this phase |
| `severity` | string | no | `P0`, `P1` or `P2` | the lineage, then this phase on a regrade |
| `status` | string | no | `active`, `fixed` or `deferred` | this phase |
| `dimension` | string | no | one canonical id | the lineage |
| `file` | string | no | `path:line`, the evidence the quality gate requires | the lineage |
| `evidence` | string | no | what the lineage observed, in one sentence | the lineage |
| `recommendation` | string | no | the change the finding asks for | the lineage |
| `findingClass` | string | no | `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation` | this phase at triage |
| `scopeProof` | string | no | the search that proves the class, as a command and its hit count | this phase at triage |
| `affectedSurfaceHints` | array of string | no | the surfaces the fix may touch | the lineage |
| `source` | string | no | `review`, `012-failures`, `013-rebuttals` or `013-evidence` | this phase |
| `sourceRef` | string | yes | the row, heading or finding id the seed came from. `null` for `review` | this phase |
| `fixWave` | integer | yes | the wave that fixed it, `null` while `active` | this phase |
| `verifyCommand` | string | yes | the command whose output proved the fix, `null` while `active` | this phase |
| `deferReason` | string | yes | the reason that blocks the fix, `null` unless `deferred` | this phase |
| `_lineages` | array of string | no | the labels that reported it | the merge |

`findingId` is the phase's own key and it is the one the ledger's first cell carries. The loop's iteration rows keep their `P1-001` style ids, and `seeded-findings.json` records the mapping from each of those to the `F` id.

### 4.3 How `findingsBySeverity` is derived

`findingsBySeverity` counts the entries of `openFindings` whose `status` is `active`. A `fixed` or `deferred` finding is not active, so it is not counted.

At close every entry reads `fixed` or `deferred`, so all three counts read `0`. That is the intended reading and not a lost count. The counts of what the review found, by severity, live in the report's Executive Summary and in `seeded-findings.json`. The registry's counts are the active ones, which is what the stop rule and the dashboard read while the loop runs.

A `deferred` P1 therefore leaves `findingsBySeverity.P1` at `0` and still blocks a PASS. The verdict rule in `design/state-machines.md` section 5 carries that case.

---

## 5. `orchestration-summary.json`

`fanout-run.cjs` writes this file once, at the end of the fan-out. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:6314] This phase reads it and writes nothing into it.

| Key | Type | Null | Value | Source |
|-----|------|------|-------|--------|
| `run_id` | string | no | the fan-out run's id | the runner |
| `loop_type` | string | no | `review` | the runner |
| `spec_folder` | string | no | the packet path | the runner |
| `base_artifact_dir` | string | no | `review/` | the runner |
| `total_cli_lineages` | integer | no | `5` after the fallback | the runner |
| `frontier_partition` | object | yes | one key per label, each an array of node ids. Absent when the run dealt no seed | the runner |
| `orphaned_lineages` | array | no | `[]` at close. Each entry is `{label, index, started_at_iso}` | the runner |
| `total` | integer | no | the lineages the pool ran | the runner |
| `succeeded` | integer | no | the lineages that left a complete packet | the runner |
| `failed` | integer | no | the lineages that did not | the runner |
| `all_failed` | boolean | no | `false`, because a run that loses every lineage writes no verdict | the runner |
| `gauges` | object | no | `{lag, pending, failed}` | the runner |
| `convergence` | object | no | `{status, reason, no_new_findings}` | the runner |
| `lineages` | array | no | one entry per lineage. Section 5.1 | the runner |
| `provider_cost_usd` | object | yes | one key per label. Absent when no provider reported a cost | the runner |

### 5.1 One lineage entry

| Key | Type | Null | Value |
|-----|------|------|-------|
| `label` | string | no | the lineage label. A group with `--count=2` yields `<label>-1` and `<label>-2` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:1366] |
| `status` | string | no | `succeeded`, `skipped_complete` or `failed` |
| `failure_class` | string | yes | `null` on success, else the class the runner recorded |
| `exit_code` | integer | yes | the lineage's exit, `null` when it never started |
| `rerun_command` | string | yes | the command that reruns it, `null` on success |
| `rerun_note` | string | yes | the archive-first note when the lineage's config is already `complete` |

`total_cli_lineages` is `5` and `orphaned_lineages` is empty at close. Those are the two values AC-003 reads.

---

## 6. `fix-ledger.md`

One table, one row per finding the fix pass owns, in `openFindings` order. The header is literal, because T009 counts it.

```text
| Finding | File | Fix | Verify | Status |
```

| Column | Holds | Rule |
|--------|-------|------|
| `Finding` | `F001` and the severity, as `F001 (P1)` | the first cell starts with `F` and a digit, so the row counts |
| `File` | the one file the fix changed, or `deferred` when no file changed | one file per row, because a wave is partitioned by file |
| `Fix` | one sentence naming the change and the finding class | no command, no pipe |
| `Verify` | the command whose output proved the fix, in backticks | no pipe, because a pipe would split the cell |
| `Status` | `pass` or `deferred` | the last cell, so the row ends `| pass |` or `| deferred |` |

A row reads `pass` when the fix landed and its verify command printed what the row says. A row reads `deferred` when the fix did not land, and then the `Fix` cell carries the reason that blocks it and names the finding id.

The ledger is the phase's own record and no contract owns it. Its two counts are the ones AC-004 and AC-005 read.

---

## 7. `seeded-findings.json`

The intake record. It is written at setup, before any lineage spawns, so a seeded finding is in the registry before the review reads anything.

### 7.1 The document

| Key | Type | Null | Value |
|-----|------|------|-------|
| `version` | integer | no | `1` |
| `createdAt` | string | no | the setup instant, ISO 8601 UTC with a `Z` |
| `sources` | array | no | one entry per handoff file. Section 7.2 |
| `rows` | array | no | one entry per seeded finding. Section 7.3 |
| `seededCount` | integer | no | `rows.length` |
| `missingSources` | array of string | no | the handoff paths that did not exist, each with the reason. Empty when all three exist |

### 7.2 One source

| Key | Type | Null | Value |
|-----|------|------|-------|
| `path` | string | no | the handoff path, repository relative |
| `kind` | string | no | `failures-table`, `rebuttals-headings` or `evidence-findings` |
| `present` | boolean | no | whether the path exists |
| `rowCount` | integer | no | the rows, headings or findings the file holds |
| `seededCount` | integer | no | how many of them became a finding |

The three paths are fixed by the plan-depth research, so this phase does not choose them. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:298]

| Path | Kind | What one row is |
|------|------|-----------------|
| `specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/failures.md` | `failures-table` | one table row carrying the scenario id, the phase, the requirement, the observed line and the evidence path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/tasks.md:144] |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/scratch/rebuttals.md` | `rebuttals-headings` | one `## <finding-id>` heading and the reason under it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/tasks.md:65] |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/evidence/` | `evidence-findings` | one finding in `skilled-alignment/findings.json` or `doc-alignment/findings.json` |

A missing source is not a refusal. It is recorded in `missingSources` with the reason, and the run continues, because a phase that filed nothing has nothing to hand over. A source that exists and holds a row this phase cannot read is a refusal, `review-seed-unreadable`, in `design/refusals.md`.

### 7.3 One seeded row

| Key | Type | Null | Value |
|-----|------|------|-------|
| `findingId` | string | no | the `F` id the row takes |
| `source` | string | no | `012-failures`, `013-rebuttals` or `013-evidence` |
| `sourceRef` | string | no | the scenario id, the rebuttal heading or the evidence finding id |
| `phase` | string | no | the phase the row names, as `001` to `013` |
| `requirement` | string | yes | the `REQ` id the row names, `null` when it names none |
| `observed` | string | no | the observed line, verbatim |
| `evidencePath` | string | yes | the evidence the row names, `null` when it names none |
| `severity` | string | no | assigned by the table in section 7.4 |
| `title` | string | no | one line, derived from `observed` |
| `registryId` | string | yes | the loop's own id for the same finding when the review also found it, else `null` |

### 7.4 The severity a seeded row takes

The orchestrator assigns the severity, so no builder decides it.

| Source | Condition | Severity |
|--------|-----------|----------|
| `012-failures` | the observed line names a lost write, a secret in output, a path outside the state root or a refusal that blocks every later scenario | `P0` |
| `012-failures` | any other observed line | `P1` |
| `013-rebuttals` | the reason is `handed to 014` and the finding names a security or data-loss defect | `P0` |
| `013-rebuttals` | the reason is `handed to 014` and the finding names any other runtime defect | `P1` |
| `013-rebuttals` | the reason is anything else | not seeded, because 013 fixed it or declined it with a reason of its own |
| `013-evidence` | the finding's own `severity` is `P0` | `P0` |
| `013-evidence` | the finding's own `severity` is `P1` or `P2`, or it carries none | `P1` |

A seeded `P0` or `P1` enters `openFindings` with `status` `active` before the first lineage spawns. That is what makes the verdict rule in `design/state-machines.md` section 5 able to read a filed product failure.

---

## 8. `scenario-rerun.json`

The record of the re-run D7 requires. It is written after the last fix wave and before the final suite run.

### 8.1 The document

| Key | Type | Null | Value |
|-----|------|------|-------|
| `version` | integer | no | `1` |
| `createdAt` | string | no | the re-run instant |
| `touchedPhases` | array of string | no | the phases the fix pass changed a file in, as `001` to `013` |
| `scenarios` | array | no | one entry per re-run scenario. Section 8.2 |
| `rerunCount` | integer | no | `scenarios.length` |
| `failedCount` | integer | no | the entries whose `result` is `FAIL` |

### 8.2 One scenario entry

| Key | Type | Null | Value |
|-----|------|------|-------|
| `scenarioId` | string | no | `BOT-026` and so on |
| `category` | string | no | the playbook folder the scenario lives in |
| `phase` | string | no | the owning phase, resolved by section 8.3 |
| `fixIds` | array of string | no | the `F` ids whose fix touched that phase |
| `command` | string | no | the scenario's section 3 bash block, run from the repository root |
| `result` | string | no | `PASS`, `FAIL` or `SKIP` |
| `reason` | string | yes | the reason a `FAIL` or a `SKIP` carries, `null` on `PASS` |
| `evidencePath` | string | no | the transcript the run left |

### 8.3 Which scenarios are re-run

A scenario is re-run when its owning phase is in `touchedPhases`. The owning phase is resolved in two steps, and the first that answers wins.

1. **The filed failure.** When `012-manual-testing-scenarios/scratch/failures.md` holds a row for the scenario, that row's phase is the owning phase.
2. **The category folder.** Otherwise the owning phase is read from the table below. A folder names every phase whose requirements its scenarios assert, so a fix in any of them re-runs the folder's scenarios.

| Category folder | Phases whose requirements its scenarios assert |
|-----------------|-----------------------------------------------|
| `conversations` | 001, 005, 006, 009, 010, 011 |
| `routines` | 002 |
| `activity` | 001 |
| `terminal-screen` | 003 |
| `working-place` | 004 |
| `memory` | 005 |
| `apps` | 007 |
| `vault` | 008 |
| `skills` | 009 |
| `channels` | 011 |

The ten folders are the ones 012 creates, one per phase group. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/plan.md:84] The seven pre-parity folders are not re-run, because no phase of this build changed a verb they drive.

A `FAIL` in the re-run is a new finding. It enters `openFindings` with `source` `review` and `sourceRef` the scenario id, and it blocks the close until it is fixed or deferred with a reason.

---

## 9. `review-report.md`

Synthesis writes the report, and the phase rewrites it once after the last fix wave so its verdict describes the final state. The nine headings are literal, because AC-008 counts them. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:519]

| # | Heading | What it holds here |
|---|---------|--------------------|
| 1 | `## Executive Summary` | the verdict, the counts found by severity, the scope, `hasAdvisories` |
| 2 | `## Planning Trigger` | why the verdict routes to a remediation plan or to a changelog entry |
| 3 | `## Active Finding Registry` | every finding still active, with its evidence and its final severity |
| 4 | `## Remediation Workstreams` | the fix waves, one lane per file group |
| 5 | `## Spec Seed` | the spec delta the findings imply |
| 6 | `## Plan Seed` | the plan starter a later packet would read |
| 7 | `## Traceability Status` | the core and overlay protocol status, and the unresolved gaps |
| 8 | `## Deferred Items` | every deferred finding, every blocked check and every frontier node closed short |
| 9 | `## Audit Appendix` | coverage, replay validation and convergence evidence |

Three lines sit outside the nine sections and each appears exactly once.

| Line | Form | Where |
|------|------|-------|
| the verdict | `Review verdict: PASS`, `Review verdict: CONDITIONAL` or `Review verdict: FAIL` | the last line of the Executive Summary |
| the reviewed commit | `Reviewed commit: <sha>` | the Audit Appendix |
| the stop reason | `Stop reason: converged` or `Stop reason: max_iterations` | the Audit Appendix |

The verdict line is the one AC-008 counts, and it is the one line the report may not carry twice. An iteration file carries its own verdict line, and that is a different file. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:51]

---

## 10. `implementation-summary.md`

The phase's own summary carries the review outcome in four rows, so REQ-010 is answerable from one file.

| Row | Holds |
|-----|-------|
| Verdict | the report's verdict line, verbatim |
| Found | the counts by severity the review reported, as `P0 n, P1 n, P2 n` |
| Fixed | the `F` ids whose ledger row reads `pass` |
| Deferred | the `F` ids whose ledger row reads `deferred`, each with its reason |

The summary's other sections are the template's and this file does not change them.

---

## 11. `preflight.json`

The probe record. It is written at setup, before the seeded intake, and it is what makes D3 checkable: the run records which of the five binaries it found rather than assuming all five. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md:26]

### 11.1 The document

| Key | Type | Null | Value |
|-----|------|------|-------|
| `version` | integer | no | `1` |
| `createdAt` | string | no | the probe instant, ISO 8601 UTC with a `Z` |
| `binaries` | array | no | one entry per roster executor, always five. Section 11.2 |
| `presentCount` | integer | no | the entries whose `present` is `true` |
| `fallbackUsed` | boolean | no | `true` when `presentCount` is below five, so a reader knows the matrix was re-run |
| `fallbackOrder` | array of string | no | the order `plan.md` §8.3 fixes, so the record names the order it used rather than pointing at a doc |

### 11.2 One binary entry

| Key | Type | Null | Value |
|-----|------|------|-------|
| `label` | string | no | the lineage label, `cli-mistral-vibe`, `cli-pi`, `cli-opencode`, `cli-devin` or `cli-codex` |
| `binary` | string | no | the command name, `vibe`, `pi`, `opencode`, `devin` or `codex` |
| `present` | boolean | no | whether `command -v` resolved it |
| `path` | string | yes | the resolved path, `null` when absent |
| `version` | string | yes | the first line of its `--version` output, `null` when absent |
| `pin` | string | no | the version the mode names, so a version outside the pin reads as absent |
| `pinOk` | boolean | no | whether `version` satisfies `pin`. `false` when absent |

A binary whose `pinOk` is `false` is treated as absent, because a lineage on an unpinned version reviews a different model than the roster names. The run then re-runs the matrix with `--count=2` on the next executor in `fallbackOrder`, so `total_cli_lineages` still reads five. A run whose `presentCount` is `0` refuses before spawn, `review-no-executor`, in `design/refusals.md`.

---

## 12. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The phase takes the registry at the loop's terminal transition | The reducer regenerates the file after every iteration and lifecycle transition, and the fix pass runs after the last one. A disposition written before the flip would be overwritten, and one written after it is the only writer's [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:240] |
| `findingsBySeverity` counts active findings only | The completion criteria read `P0` and `P1` as zero while REQ-005 allows a deferred P1. Counting a deferred finding as active would make the two rules contradict, and the report already carries the found totals |
| The ledger's first cell is the `F` id and the severity | The row has to start with `F` and a digit to be counted, and a reader needs the severity without opening the registry |
| The `Verify` cell carries no pipe | A pipe would split the cell and the row would no longer end with its status |
| A missing handoff file is recorded and not refused | A phase that filed nothing has nothing to hand over, and a refusal there would block a clean build. An unreadable row is refused, because that is a real defect |
| The owning phase of a scenario comes from the failure row first and the folder second | The failure row is precise and the folder is conservative. Reading the folder first would re-run nine conversation scenarios for a fix in 001 |
| The report is rewritten once after the last fix wave | The verdict has to describe the final state, and a report written at synthesis describes the state before the fixes. The rewrite is the same file, so the nine headings stay in one place |
| `seededFindings` is the one key this phase adds to the registry document | Every other key is the merge's or the reducer's, and a second added key would be a second place to read the same count |
| The probe result is a file and not a log line | D3 makes the fallback the normal path, so a reader has to see which five were tried and which one ran twice. A log line is read once and a file is read by the check that proves the fallback happened [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md:26] |
