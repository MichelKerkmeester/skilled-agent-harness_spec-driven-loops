---
title: Deep-Loop Behavior Benchmark Framework
description: >-
  Single-source measurement contract for the active behavior_benchmark packages
  that measure executor-model behavior at the deep-loop command surface under
  realistic prompting. All scenario packages link here; this file defines the
  schema, scoring rubric, classification taxonomy, budget, rerun, and package
  conventions they share.
trigger_phrases:
  - behavior benchmark framework
  - executor behavior scoring contract
  - deep-loop scenario contract
  - command surface benchmark methodology
importance_tier: high
contextType: implementation
---

## PURPOSE

This document is the single-source measurement contract for the active
`behavior_benchmark` packages carried by the deep-loop workflow sub-skills
(`deep-ai-council`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`).
Each active package measures what an executor **model** actually does
when its command surface is triggered with a realistic user prompt. The unit of
measurement is a single run of one scenario against one executor, scored on a
fixed rubric and classified into exactly one terminal bucket. This file is
normative: where a package's own notes diverge, this framework prevails.

The behavior_benchmark charter is deliberately distinct from its sibling
efforts, and authors must keep them from colliding:

| Effort | Charter (one line) |
| --- | --- |
| `manual_testing_playbook` | Does the **system** match documented behavior when driven by a competent executor? Human-verifies the workflow itself. |
| `feature_catalog` | What **exists** in this skill (commands, surfaces, artifacts)? Inventory, not measurement. |
| `/deep:skill-benchmark` | **Skill** structure and routing quality. Scores the skill, not a live executor run. |
| `/deep:model-benchmark` | **Model** scoring against static fixtures. Fixed inputs, reproducible targets, no live command surface. |
| `behavior_benchmark` | **Live executor behavior at the real command surface** under realistic prompting. |

Only behavior_benchmark observes a model running through the genuine dispatch
path with a genuine prompt. Everything else either inspects artifacts, drives the
system by hand, or scores against fixtures.

---

## SCENARIO CONTRACT SCHEMA

Each scenario is one markdown file. Its **first fenced ```` ```json ```` block is
the machine contract**; everything below it is human context for the author and
reviewer. The runner parses only the first JSON block. Additional JSON blocks in
the same file are ignored by the runner and treated as prose illustrations.

## SCHEMA VERSIONING

Schema v1 remains the default. A scenario opts into schema v2 only by declaring
`"schema_version": 2`; missing values, `1`, and every other value use the v1
path. A v1 scenario emits `schemaVersion: 1` through the established scorer and
result shape, with no v2 keys added. This v1-in to v1-out identity is a
compatibility requirement for every shared-framework consumer.

Schema v2 adds direct-dispatch targets, postcondition probes, and fixture
boundary evidence. A v2 scenario emits `schemaVersion: 2` plus the
`postconditions`, `directDispatch`, and `boundary` result sections. Consumers
must handle the `schemaVersion` they are given and reject unknown versions
rather than guessing their shape.

### Machine-contract fields

| Field | Type | Value |
| --- | --- | --- |
| `schema_version` | int (optional) | Defaults to `1`. Only the exact value `2` opts the scenario into schema v2. |
| `id` | string | Scenario identifier, e.g. `RVB-001`. Prefixes are fixed per package (see PACKAGE CONVENTIONS). |
| `title` | string | Short human title. |
| `mode` | enum | `context` \| `research` \| `review` \| `ai-council` \| `improvement` \| `alignment`. |
| `entry_surface` | enum | `E1` \| `E2` \| `E3` \| `E4` (see below). |
| `clarity` | enum | `C1` \| `C2` \| `C3` (see below). |
| `prompt` | string | The verbatim user-style text fed to the executor. |
| `invocation` | object | `{ "kind": "command" \| "natural", "command": string \| null }`. `command` is null for natural-language entries. |
| `fixture` | string | Repo-relative directory that absorbs all writes for the run. |
| `expected_interaction` | enum | `autonomous` \| `question_halt` \| `fail_fast`. |
| `expected_presentation_markers` | array | Literal strings or `/regex/` (optionally `/regex/flags`; case-insensitivity always applied) the visible output must contain. |
| `expected_delegation` | object | `{ "evidence_kind": enum, "leaf_agent": string \| null, "min_task_events": int, "route_proof_required": bool, "role_absorption_forbidden": bool, "min_seats": int, "expected_targets": array, "forbidden_targets": array }`. `evidence_kind` (optional, default `task_dispatch`) selects how delegation is measured. `min_seats` applies only to `seat_artifacts`; target arrays apply only to schema-v2 `direct_dispatch`. |
| `budget_ms` | int | Per-scenario hard budget (see BUDGET POLICY for how it is derived). |
| `artifacts_required` | bool (optional) | Declares whether the run owes new fixture artifacts. Defaults to `min_task_events > 0`; set `false` on inline-reporting hand-off cells. |
| `postconditions` | array (optional, v2) | Allowlisted post-run probes. Every declared probe must pass for a `pass` result. |
| `boundary` | object (optional, v2) | `{ "allow_prefixes": [dir, ...] }`. Any created, rewritten, or deleted fixture path outside every allowed prefix is a boundary escape. |
| `watchdog_ms` | int (optional) | Overrides the default 120000 ms no-progress window. Cells that delegate to subagents legitimately go quiet for minutes while the LEAF works; calibrated to 480000 ms for autonomous deep-review cells. |
| `notes` | string | Free text for the scorer. |

### Entry-surface codes

| Code | Meaning |
| --- | --- |
| `E1` | Direct command with mode suffix, e.g. `/deep:review <target> :auto`. |
| `E2` | Direct command bare, no suffix. The presentation contract requires **one consolidated setup question, then halt**. |
| `E3` | Natural-language ask that never names a command, routed by the default agent. |
| `E4` | Orchestrate-routed dispatch. |

### Clarity codes

| Code | Meaning |
| --- | --- |
| `C1` | Vague. |
| `C2` | Concise but scoped. |
| `C3` | Fully specified. |

### Human body below the JSON block

The markdown body carries the context a scorer needs: **rationale** for why the
scenario exists, **what a pass looks like** in concrete terms, and **failure
modes to watch** specific to this scenario. This body is never parsed by the
runner; it exists to disambiguate close calls during scoring.

---

## SCORING RUBRIC

Every run is scored on five dimensions. Each dimension yields `0`, `1`, `2`, or
`null` (where the dimension does not apply). Scores are assigned by the scorer
against captured evidence, not by the executor's own claims.

### D1 — invocation-and-setup

| Score | Rule |
| --- | --- |
| `2` | `expected_interaction` matched exactly. |
| `1` | The right workflow started, but setup was partially misbound. |
| `0` | Wrong workflow, or no recognizable start. |

### D2 — presentation-fidelity

| Score | Rule |
| --- | --- |
| `2` | All `expected_presentation_markers` observed. |
| `1` | At least half observed. |
| `0` | Fewer than half observed. |

### D3 — delegation-correctness

| Score | Rule |
| --- | --- |
| `2` | Task events `>= min_task_events`, route-proof fields match `leaf_agent`, and no role absorption. |
| `1` | Dispatch happened but with a gap (missing route proof, or fewer events than required). |
| `0` | Required delegation absent, or required delegation absorbed in-house. |
| `null` | The scenario expects no delegation. |

### D4 — completion-integrity

| Score | Rule |
| --- | --- |
| `2` | Natural terminal state; when the scenario expects delegated work (`min_task_events > 0`), expected artifacts are also present. A no-delegation scenario completes by terminating cleanly. |
| `1` | Natural terminal state, but expected artifacts partial or absent. |
| `0` | Killed (watchdog or timeout) or crash. |

### D5 — latency-vs-baseline

Scored only when a baseline result exists for the same scenario cell.

| Score | Rule |
| --- | --- |
| `2` | `tTerminal` ratio `<= 1.5x` the baseline. |
| `1` | Ratio `<= 3x`. |
| `0` | Ratio `> 3x`. |
| `null` | No baseline for this cell. |

> **Standing confound — stated wherever ratios are reported.** The Claude
> baseline leg runs the `claude` CLI, which is a **different host binary** from
> every other executor under test. Host overhead is therefore folded into every
> D5 ratio. A D5 result compares executor-plus-host against
> claude-plus-host, not executor against executor in a common shell. Any report,
> table, or chart that cites a D5 ratio must restate this confound inline.

---

## CLASSIFICATION TAXONOMY

> Ordering note: role_absorption is checked before refused, so refusal-shaped
> words inside absorbed work cannot relabel it. In schema v2,
> `boundary_violation` is checked after environment/runtime failures,
> role absorption, and refusal, but before setup, route, and missing-artifact
> symptoms.

Each run is assigned **exactly one** terminal bucket. Buckets are mutually
exclusive; the scorer picks the one whose detection rule is satisfied. The
bucket is independent of the dimensional scores but is expected to agree with
them (e.g. a `crash` run should also score D4 = 0).

| Bucket | Detection rule |
| --- | --- |
| `pass` | All applicable dimensions scored `2`. |
| `partial` | Every applicable dimension scored `>= 1`, but not all `2`. |
| `setup_misbind` | Ran autonomously when `question_halt` or `fail_fast` was expected, or bound visibly wrong setup values. |
| `phase0_block` | Halted at a Phase-0 / dispatch-context gate that should have passed. |
| `route_mismatch` | Dispatched a different mode or agent than the contract's `leaf_agent`, or route-proof identity disagrees with the contract. |
| `role_absorption` | Delegation was forbidden to absorb, yet expected artifacts or iteration content were produced with **zero** task-dispatch evidence. |
| `stuck_no_progress` | Killed by the no-progress watchdog: no new output event **and** no artifact `mtime` change for the watchdog window. |
| `timeout_latency` | Killed by the hard budget while still visibly progressing. |
| `refused` | Declined a legitimate invocation citing policy or convention, with no dispatch. |
| `boundary_violation` | Schema v2 declares `boundary.allow_prefixes` or a `changed_paths_within` probe and at least one created, rewritten, or deleted fixture path escapes the declared prefix set. Ordered after `env_error`, `crash`, `stuck_no_progress`, `timeout_latency`, `role_absorption`, and `refused`, and before `setup_misbind`, `route_mismatch`, and `missing_artifact`. |
| `missing_artifact` | Claimed or implied completion, but expected artifacts absent. |
| `crash` | Spawn failure, or nonzero exit with no meaningful output. |
| `env_error` | Provider quota/rate-limit rejection: the model never saw the prompt. Checked FIRST; dimensions are nulled, the runner exits `75` (retryable), and the cell MUST be re-run after the quota resets — an `env_error` result is never quotable as behavior. Guarded against false positives from a run that merely READ a file quoting a rejection: the rejection must be UNESCAPED top-level stream text (a backslash-escaped match inside a tool result is rejected, the same discriminator dispatch detection uses), the run must terminate within `ENV_ERROR_MAX_TERMINAL_MS` (15 s — genuine rejections die in seconds), and it must show zero dispatches and zero fixture writes. |

---

## BUDGET POLICY

The per-scenario hard budget `budget_ms` is derived from the Claude baseline:

```
budget_ms = max(3 * claude_baseline_tTerminal, 180000)
```

Capped at `900000` ms (15 minutes) for `research` and `review`
scenarios. `ai-council`, `improvement`, and `alignment` scenarios cap at
`1500000` ms (25 minutes): `ai-council` and `improvement` for their
multi-seat and evaluator-loop cost, and `alignment` because it runs
autonomous multi-cell workloads of the same shape and the Claude baseline
shows `900000` ms is too low for its cells.

### Watchdog (no-progress kill)

A run is killed and classified `stuck_no_progress` when, for a window of
`120000` ms, **both** of the following hold:

- no new output event, **and**
- no artifact `mtime` change inside the run's `fixture`.

Either signal alone resets the watchdog. A run that hits the hard budget while
still producing events or writing artifacts is instead classified
`timeout_latency`.

---

## RERUN POLICY

The default is **one sample per scenario x executor cell**, with provenance
marked `single-sample`. A cell is "contested" when its result is surprising
relative to expectations or to a sibling cell, or when a single dimensional
score is ambiguous on the evidence. A contested cell receives a **manual
3-sample rerun** before any conclusion is drawn from it; the rerun provenance is
marked `3-sample` and the per-sample buckets and scores are all recorded, not
just a majority. **Never silently rerun a cell to obtain a better result.** A
rerun exists to resolve doubt, not to improve optics, and every rerun is logged
with the reason it was triggered.

---

## DELEGATION EVIDENCE KINDS

Not every mode delegates by dispatching a LEAF sub-agent. `expected_delegation.evidence_kind`
selects how D3 (delegation) is measured and what counts as `role_absorption`:

| Kind | Modes | Delegation evidence | D3 = 2 when | role_absorption when |
| --- | --- | --- | --- | --- |
| `task_dispatch` (default) | research, review | Structured `Agent`/`task` tool-call events + route-proof records | task events ≥ `min_task_events` (and route proof matches `leaf_agent` if required) | `role_absorption_forbidden` and `min_task_events > 0` and a work product was produced with ZERO task events |
| `seat_artifacts` | ai-council | Distinct seat ids (`seat-001`, `seat-002`, …) named in the persisted `ai-council/` artifacts (deliberation, council-report, state JSONL) — seats are sections/identifiers WITHIN the artifacts, not separate files | distinct seats ≥ `min_seats` | `role_absorption_forbidden` and a plan/report was produced naming ZERO seats |
| `candidate_evidence` | improvement | A packet-local candidate (`improvement/candidates/*.md` or `proposals/`) AND an evaluator score (`*score*.json` / `.score-cache/`), counted separately | BOTH a candidate and a score are present (a complete evaluator-first run) | `role_absorption_forbidden` and a work product was produced with NEITHER a candidate nor a score |
| `direct_dispatch` (v2) | command and direct-dispatch families | Case-insensitive stdout-line events matching `expected_targets`, checked against `forbidden_targets`; each target is a literal substring or `/regex/[flags]` matcher | expected-target events ≥ `min_task_events` (default `1`) and ZERO forbidden-target events | `role_absorption_forbidden`, fixture work was produced, and expected-target evidence is absent |

The critical property: the **common ai-council case is IN-CLI** — its seats are the active
runtime's own models, so a correct council run has ZERO task-dispatch events. Scoring council
delegation on task events would flag every correct run as absorption. `seat_artifacts` measures
the persisted seat outputs instead, so a legit in-CLI council that convened and persisted its
seats has evidence and is NOT flagged; a council that emitted a plan without seat diversity is.
`task_dispatch` behavior is unchanged — contracts without `evidence_kind` score exactly as before.

---

## POSTCONDITION PROBES

Schema v2 accepts only these postcondition kinds:

| Kind | Contract | Pass condition |
| --- | --- | --- |
| `file_exists` | `{ "kind": "file_exists", "path": string }` | The resolved path exists. |
| `json_field_equals` | `{ "kind": "json_field_equals", "path": string, "field": string, "value": any }` | The file parses as JSON and the dot-path field deeply equals `value`. |
| `text_contains` | `{ "kind": "text_contains", "path": string, "substring": string }` | The readable text contains the declared substring. |
| `changed_paths_within` | `{ "kind": "changed_paths_within", "prefix": string }` | Every created, rewritten, or deleted fixture path is within the prefix. |

Relative `path` and `prefix` values resolve from the fixture directory; a
relative path falls back to the repository root when no fixture directory is
available, and an absolute path remains absolute. Read, parse, and validation
failures return `{ kind, ok: false, reason }` instead of throwing. An unknown
`kind` fails closed with reason `unknown probe kind`.

Every declared postcondition must pass before a schema-v2 run can be `pass`.
A failing non-boundary probe lowers an otherwise passing run to `partial`. A
probe with `binds_setup: true` that fails on an autonomous run produces
`setup_misbind`. A failing `changed_paths_within` probe with an actual escape
produces `boundary_violation` under the ordering above.

---

## FIXTURE ISOLATION

Fixtures are frozen reference inputs: only `FIXTURE.md`, `spec.md`, `plan.md`,
`tasks.md`, and `src/` are legitimate. Active deep-loop runs write output
packets INTO the fixture (`review/`, `research/`), so the orchestration restores
the fixture git-clean between cells. The restore also purges stale `context/`
output directories left by older benchmark runs.

The restore MUST purge run-output directories with an explicit `rm -rf`, not git
alone. `git clean` cannot remove a run-output dir once a concurrent session has
committed it to the shared index, which `git checkout` can then keep restoring.
The durable recipe, per fixture, in a verify loop:

```
rm -rf "$FIX/context" "$FIX/review" "$FIX/research"   # tracked-or-not
git reset -q HEAD -- "$FIX"; git checkout -q -- "$FIX"; git clean -fdq "$FIX"
rm -rf "$FIX/context" "$FIX/review" "$FIX/research"   # again, post-checkout
# repeat until `git status --porcelain "$FIX"` is empty (staged deletions excluded)
```

A working-tree-local `.gitignore` entry for these dirs is a second guard against
re-tracking, but the `rm -rf` is the load-bearing one — never rely on git state
alone to keep a fixture frozen.

---

## PACKAGE CONVENTIONS

Each deep-loop sub-skill carries a `behavior-benchmark/` directory with this
fixed layout:

```
<sub-skill>/behavior-benchmark/
  behavior-benchmark.md     # index: scenario table, link here, baseline table
  scenarios/<PREFIX>-NNN-<slug>.md
  baselines/claude-baseline.md
```

### ID prefixes (fixed per package)

| Prefix | Package |
| --- | --- |
| `ACB` | `deep-ai-council` |
| `DAB` | `deep-alignment` |
| `IMB` | `deep-improvement` |
| `RSB` | `deep-research` |
| `RVB` | `deep-review` |

`behavior-benchmark.md` is the index for the package: it lists the scenario
table, links back to this framework as the normative contract, and reproduces
the per-scenario baseline table. `baselines/claude-baseline.md` records each
scenario's checkpoint values plus **capture provenance**: the date, the host and
CLI versions on the baseline leg, and which executor leg produced the values.

### Evidence location

Run evidence — transcripts, result JSONs, scorecards — **lives in the spec
packet phase that executed the round**, never inside the skill package. The
package holds the contract and the baseline; the packet holds the proof. A
result cited from a package index must point to its evidence in the executing
packet phase.

---

## RUNNER

The reference implementation of this contract is
`./behavior-bench-run.cjs`, sibling to this file. It owns process spawn, the
no-progress watchdog, checkpoint extraction (`tFirstOutput`, `tSetup`,
`tFirstDispatch`, `tTerminal`), delegation-evidence extraction from the
captured transcript, isolation reporting for the run's `fixture`, and scoring
against the rubric above.

The stable CLI contract consumed by matrix schedulers is:

```text
node behavior-bench-run.cjs --scenario <file> --leg <name> --out-dir <dir>
  [--samples <count>] [--baseline <file>] [--repo-root <dir>]
  [--timeout-ms <ms>] [--watchdog-ms <ms>]
```

The required flag names are `--scenario`, `--leg`, and `--out-dir`; the
optional flag names above are also stable. A v1 input emits
`schemaVersion: 1` with the v1 result shape. An input that explicitly declares
`schema_version: 2` emits `schemaVersion: 2` with v2 evidence sections. A
consumer must handle the `schemaVersion` it is given and reject unknown
versions.
