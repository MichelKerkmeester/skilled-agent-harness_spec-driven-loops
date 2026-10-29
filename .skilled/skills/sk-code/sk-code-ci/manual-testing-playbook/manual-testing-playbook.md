---
title: "sk-code-ci: Manual Testing Playbook"
description: "Corpus for the sk-code-ci surface: the routing-recall scenario for its CI_WORKFLOW intent signal and resource map, the negative floor that keeps CI words out of unrelated turns, one scenario per shipped rule reference, and the two /doctor:ci scenarios for a repository with its own switch names."
version: 1.1.2.0
---

# sk-code-ci: Manual Testing Playbook

Routing-recall, rule-reference and foreign-repository corpus for the `sk-code-ci` surface.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and
> reason are recorded into `sk-code/benchmark/reports/<dated-run-label>/`. The packet carries no
> `benchmark/` of its own, so its runs land in the hub's report tree.
>
> The record is written by hand, because the harness that once wrote it was retired with its lane.
> A manual run produces one dated folder holding a `README.md` with the verdict, the reason, the
> evidence paths and the scenario ids, and a `source.md` naming the spec packet that holds the raw
> transcript. The hub's own report index states that its rows are written by that harness at the
> moment it writes a report, so a hand-written run adds its folder and leaves that index alone; the
> folder name is what makes it findable.

---

## 1. OVERVIEW

Three kinds of scenario live here. One is routing recall: `ci-surface-ci-standards` sends one prompt through the hub and confirms the four routed references, the compiled route and the registry rows that name them. One is the floor under that recall: `ci-surface-routing-floor` sends prompts that share CI vocabulary without being CI requests and confirms the packet stays out of them. Four are rule-reference scenarios, one per file the packet ships, and each one drives the rule it documents against a fixture that breaks it and against this repository, where it holds. Two are `/doctor:ci` scenarios that run the three doctor scripts in a repository whose conventions are not this one's.

The rule references themselves are read from the `MACHINE ROUTER` section at the end of [`ROUTER.md`](../ROUTER.md); `SKILL.md` section 2b carries the prose that names the same four paths.

The hub's router-sync guard replays every scenario here that declares `expected_intent` (check `4` of `sk-code-skilled/assets/scripts/verify-router-sync.cjs`), and the guard walks packet-level playbooks only, so a routing scenario kept anywhere else would never be replayed. Every other scenario declares no intent, because what it asserts is a behaviour rather than a route, and an operator runs it by hand.

### Categories

| # | Category | Folder | Scenario IDs |
|---|---|---|---|
| 1 | CI Surface | `ci-surface/` | ci-surface-ci-standards, ci-surface-rule-index, ci-surface-trigger-and-filter, ci-surface-job-shape, ci-surface-protected-set, ci-surface-routing-floor |
| 2 | Foreign Repository | `foreign-repository/` | ci-foreign-repository-profile, ci-doctor-route-options |

### Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | ci-surface-ci-standards | CI_WORKFLOW | [ci-surface.md](ci-surface/ci-surface.md) |
| 2 | ci-surface-rule-index | None; runs the rule index quick checks | [rule-index-checks.md](ci-surface/rule-index-checks.md) |
| 3 | ci-surface-trigger-and-filter | None; runs the twin rule and reads the three honour-system rules | [trigger-and-filter-checks.md](ci-surface/trigger-and-filter-checks.md) |
| 4 | ci-surface-job-shape | None; reads the drift flags and renders both templates | [job-shape-checks.md](ci-surface/job-shape-checks.md) |
| 5 | ci-surface-protected-set | None; walks the profile sources and the toggle refusals | [protected-set-checks.md](ci-surface/protected-set-checks.md) |
| 6 | ci-surface-routing-floor | None, and asserts no CI route; `stage: negative` | [routing-floor.md](ci-surface/routing-floor.md) |
| 7 | ci-foreign-repository-profile | None; operator-run | [foreign-repository-profile.md](foreign-repository/foreign-repository-profile.md) |
| 8 | ci-doctor-route-options | None; drives the target flags and exit codes | [route-options.md](foreign-repository/route-options.md) |

A **routing** scenario, meaning one that declares `expected_intent` and `expected_resources`, is `PASS` when every path in its `expected_resources` resolves under the packet root and the router emits it for the exact prompt. A **behavioural** scenario carries no such declaration, and is `PASS` when the transcript matches the scenario's own expected-result table. Either kind is `FAIL` when its checks do not hold, and `SKIP` only when a specific sandbox or runtime blocker prevented the run.

---

## 2. GLOBAL PRECONDITIONS

- Run every command from the repository root, unless a step says otherwise. The doctor scenarios change into their scratch fixture and change back.
- The `sk-code` hub registers `sk-code-ci` in `mode-registry.json`, so the packet is a known surface, and the compiled route serves the hub.
- Node is available for the router-sync guard and for every scenario that runs a doctor script, and those also need the checkout's `.skilled/node_modules` on `NODE_PATH`.
- `git config --get-all skcode.ciProfile` prints nothing, or the run sets `GIT_CONFIG_GLOBAL`. A value pointing at a path outside the repository under test aborts the doctor with exit 3, and the profile scenario relies on both behaviours.
- The doctor scenarios build their fixtures under `mktemp -d` and remove them in their last step. No step in this corpus writes inside the repository, so a run leaves the tree unchanged.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Keep the command transcript and the exit status for each step.
- For a scenario that declares `expected_intent`: record the resolved `expected_resources` block from its frontmatter and the guard's check-`4` result for this packet, which is the count of its problem lines naming a `sk-code-ci` scenario plus the count of the leg's summary line. The leg is fleet-wide, so a red total whose problem lines all name another packet is that packet's finding.
- For every scenario: record its own expected-result table with the observed value beside each row, because that table is the verdict rule the scenario states.

---

## 4. DETERMINISTIC COMMAND NOTATION

Commands are written as numbered steps with the exact shell line in backticks. A step passes when its output matches the scenario's Expected text and its exit status is the one the scenario states, which is `0` unless the step says otherwise.

Several steps expect a non-zero status on purpose, and each one names it where it is written. A `grep` that finds nothing exits 1, so the count and the quick-check steps in the rule scenarios report 1 when the tree is clean, and a step that runs a doctor script on a validating failure reports 2 or 3. A step whose status is not stated is expected to exit 0.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook.
2. The scenario file for each feature under review.
3. The command transcript and exit statuses recorded under section 3.
4. The feature-to-scenario map in section 8.
5. A triage note for any `FAIL` or `SKIP` verdict.

### Scenario Acceptance Rules

A routing scenario's verdict is `PASS` when every check below holds:

1. The section 2 preconditions held.
2. The prompt and commands ran exactly as written.
3. Every path in `expected_resources` exists under the packet root.
4. The router emits this packet for the exact prompt.
5. The transcript, the resolved `expected_resources` block and the guard's check-`4` result for this packet are recorded and readable.

A behavioural scenario's verdict is `PASS` when every check below holds:

1. The section 2 preconditions held.
2. The prompt and commands ran exactly as written.
3. Every row of the scenario's expected-result table holds with the observed value beside it, including the exit statuses the steps name.

Checks 3 to 5 of the routing list do not apply to a behavioural scenario, which declares no `expected_resources` and produces no check-`4` result. Applying them there would fail every one of them for a missing declaration rather than for a missing behaviour.

Either verdict is `FAIL` when any applicable check is false, including a run whose behaviour was right but whose evidence is incomplete. It is `SKIP` only when a named sandbox, runtime or fixture blocker kept the check from running.

### Feature Verdict Rules

- `PASS`: the mapped scenario is `PASS`.
- `FAIL`: the mapped scenario is `FAIL`.
- `SKIP`: the mapped scenario is `SKIP` for a named environment-only reason.

### Release Readiness Rule

The packet is release-ready only when every scenario is `PASS` or carries a justified `SKIP`. A `FAIL` on `ci-surface-ci-standards` or on `ci-surface-routing-floor` blocks the release, because they are the packet's two routing checks and a broken pair leaves `CI_WORKFLOW` routing unverified in one direction only: one proves the surface arrives when it should, the other proves it stays away when it should not.

### Root-vs-Feature Rule

Global verdict logic lives here. The prompt, the expected signals, the commands and the source anchors live in the per-feature files.

### Evidence Ledger Fields

| Field | Required | Notes |
|---|---|---|
| Scenario ID | Yes | The scenario's frontmatter `id`, copied as written |
| Feature file | Yes | The scenario's path relative to this root |
| Runtime | Yes | Native, or the skipped surface with its blocker |
| Exact prompt | Yes | The pasted prompt that proved canonical prompt equality |
| Evidence path | Yes | The dated folder under `sk-code/benchmark/reports/` that holds the record |
| Verdict | Yes | `PASS`, `FAIL` or `SKIP` |
| Blocking reason | Conditional | Required for `FAIL` and `SKIP` |

### Release Review Checklist

1. The package validator reports no violation and no warning for this package.
2. The root index links every scenario file and names no missing file.
3. Every file the section 7 and section 8 tables name still exists.
4. Every scenario that declares `expected_intent` recorded the guard's check-`4` result for this packet.
5. Every scenario that declares none recorded its expected-result table with the observed values.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Operational Rules

1. The two routing scenarios read the same compiled route and the same frontmatter, so they run in one operator session. Splitting them saves no wall time and makes the pair harder to read.
2. The four rule-reference scenarios and the two doctor scenarios each build their own scratch fixture and share no state, so they may run in parallel across operators. Give each one its own scratch root and its own `PATH` export, because two fixtures on one `PATH` would answer for each other.
3. Record the verdict and its evidence path before any follow-up work starts.
4. Keep the coordinator role with the operator who ran the check. There is no second runtime to reconcile against.

### Suggested Waves

| Wave | Category | Scenarios | Rationale |
|---|---|---|---|
| 1 | CI Surface | `ci-surface-ci-standards`, `ci-surface-routing-floor` | Both read the compiled route and one frontmatter block, with no fixture to schedule. Run them serially. |
| 2 | CI Surface | `ci-surface-rule-index`, `ci-surface-trigger-and-filter`, `ci-surface-job-shape`, `ci-surface-protected-set` | Each builds a small shell fixture and runs in minutes, so they split cleanly across four operators. |
| 3 | Foreign Repository | `ci-foreign-repository-profile`, `ci-doctor-route-options` | Each builds a doctor fixture with a `gh` stub and the checkout's node modules on `NODE_PATH`. They split across two operators, one fixture each. |

### What Belongs In Per-Feature Files

- The exact prompt.
- The `expected_resources` set, for a routing scenario.
- The command steps and their expected output, with the exit status of any step that is not 0.
- The expected-result table the verdict is read from.
- The source anchors behind each pass/fail rule.

---

## 7. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` (check `4`) | Replays every packet-level routing scenario against its `expected_resources` | ci-surface-ci-standards |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Asserts this scenario's prompt resolves to the `surfaceBundle` `[sk-code-review, sk-code-ci]` and that near-miss prompts never bundle `sk-code-ci` | ci-surface-ci-standards, ci-surface-routing-floor |
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | The report rows, the switch states, the drift flags and the exit codes | ci-doctor-route-options, ci-surface-job-shape |
| `.skilled/commands/doctor/scripts/tests/ci-profile.test.cjs` | Profile discovery, the validation faults and the generic default | ci-surface-protected-set |
| `.skilled/commands/doctor/scripts/tests/ci-toggle.test.cjs` | The toggle refusals, the no-op and the second confirmation, with a foreign-repository fixture | ci-foreign-repository-profile, ci-surface-protected-set |
| `.skilled/commands/doctor/scripts/tests/ci-scaffold.test.cjs` | The render cases for a foreign profile, a protected list and no profile | ci-foreign-repository-profile, ci-surface-job-shape |

---

## 8. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| ci-surface-ci-standards | CI workflow standards routing | CI Surface | [ci-surface](ci-surface/ci-surface.md) |
| ci-surface-rule-index | Rule index quick checks | CI Surface | [rule-index-checks](ci-surface/rule-index-checks.md) |
| ci-surface-trigger-and-filter | Trigger and filter rules | CI Surface | [trigger-and-filter-checks](ci-surface/trigger-and-filter-checks.md) |
| ci-surface-job-shape | Job shape rules and templates | CI Surface | [job-shape-checks](ci-surface/job-shape-checks.md) |
| ci-surface-protected-set | Repository CI profile and protected set | CI Surface | [protected-set-checks](ci-surface/protected-set-checks.md) |
| ci-surface-routing-floor | Routing floor for CI vocabulary | CI Surface | [routing-floor](ci-surface/routing-floor.md) |
| ci-foreign-repository-profile | A foreign repository reads clean | Foreign Repository | [foreign-repository-profile](foreign-repository/foreign-repository-profile.md) |
| ci-doctor-route-options | Doctor route options and exit codes | Foreign Repository | [route-options](foreign-repository/route-options.md) |

The catalog entry for every doctor scenario is `feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md`, and the entry for the routing and rule-reference scenarios is `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`. The rule references themselves have no separate catalog entry, which each scenario's Playbook Sources section states.
