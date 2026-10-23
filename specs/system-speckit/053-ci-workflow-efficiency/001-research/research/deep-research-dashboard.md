---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Improve the efficiency and speed of every CI workflow in this repo (the 33 workflows in .github/workflows/, the README there, and the scripts and actions they call) and find overengineering, issues and optimization possibilities. Angles: (1) wall-clock and runner-minute cost per workflow measured from gh run list / gh run view --json jobs; (2) duplicate work across workflows, including the three workflows (opencode-dual-version.yml, opencode-plugin-tests.yml, hooks-node-tests.yml) that each source sk-git worktree-naming.sh and run provision_worktree with bun installed every time: measure cost per run and evaluate shared caching or one provisioning job feeding the others; (3) caching: npm, bun, provisioned trees, OpenCode installs, actions/cache and setup-node cache; (4) path filters and needless triggers, especially the Trigger Index Rebuild commit after every push to main that re-runs about 13 workflows; (5) parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups; (6) flaky or slow tests and timeouts; (7) overengineering: duplicates of pre-commit hooks or each other, advisory jobs that never gate; (8) security and pinning hygiene; (9) an on/off control for clones and base repos: disable workflows or groups without editing YAML (vars.* in job-level if:, a committed config such as .skilled/ci.json or an env file read by a gate job, workflow_dispatch inputs), compare skipped-job branch-protection behavior, fork and clone defaults, pull_request_target security, reuse of hook-flags.env and .env.example, recommend one design defaulting to everything on; (10) a /doctor:ci command following the existing /doctor:* commands that lists workflows with on/off state, trigger and purpose, toggles them, customizes path filters, schedules and Node versions, and scaffolds a new pinned workflow with .skilled/ and .opencode/ path parity and a README row; specify its mode surface, safety rules (dry-run default, never edit a protected workflow without confirmation), advisor routing, and whether it lives with the doctor commands, sk-git, or splits between them; (11) a new sk-code mode sk-code-ci holding the standards for writing and reviewing workflow YAML (SHA-pinned actions, path parity per gate-inputs, README row, set -euo pipefail, timeouts, least-privilege permissions, fork and secret safety, caching, concurrency, matrix), registered in the sk-code hub (mode-registry.json, hub-router.json, leaf-manifest.json) with sk-code-review applying it, and /doctor:ci scaffolding from its templates. Every load-bearing claim cites file:line or a run id and is labelled confirmed, documented or inferred. End with ranked recommendations (saving, risk, effort) grouped into proposed implementation phases 002+.
- Started: 2026-10-23T06:43:17.796Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Session ID: 2026-10-23T06:43:17.796Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Cost baseline: rank workflows by billed minutes/day and wall-clock, name top cost drivers and what each spends its time on (job-level medians); spot-check two figures against raw run JSON. | - | 0.72 | 0 | insight |
| 2 | Triggers and path filters; the Trigger Index Rebuild burst | - | 0.71 | 0 | insight |
| 3 | Duplicate provisioning: measure the provision_worktree and bun install cost per run in opencode-dual-version.yml, opencode-plugin-tests.yml and hooks-node-tests.yml | - | 0.68 | 0 | insight |
| 4 | Caching: inventory every actions/cache, setup-node cache, bun and npm install and OpenCode install; find where caching is missing, keyed badly or defeated; size savings from step timings | - | 0.66 | 0 | insight |
| 5 | Deep dive on spec-kit-check.yml step-by-step breakdown, parallelism, caching, concurrency and job splitting trade-offs | - | 0.74 | 0 | insight |
| 6 | Parallelism and concurrency: concurrency groups, cancel-in-progress, matrix, fail-fast and needs across all 33 workflows, plus the carried-forward vitest fileParallelism question | - | 0.78 | 0 | insight |
| 7 | Flaky vs real classification of the four failing workflows, timeout-minutes inventory and sizing, and the carried-forward vitest fileParallelism question | - | 0.70 | 0 | insight |
| 8 | Overengineering: CI versus git hooks and workflows versus each other, including advisory jobs that never gate | - | 0.66 | 0 | insight |
| 9 | Security and pinning hygiene across all 33 workflows | - | 0.62 | 0 | insight |
| 10 | CI on/off control part 1: vars.* gating, skipped-check semantics, clone/fork defaults | - | 0.58 | 0 | insight |
| 11 | CI on/off control part 2: evaluate a committed config, an env file read by a gate job, and workflow_dispatch inputs against the vars.* design; test hook-flags.env and .env.example reuse; assess pull_request_target security; recommend one design with the exact gate-job shape | - | 0.54 | 0 | insight |
| 12 | Duplicate provisioning, part 2: design and size the fix (actions/cache vs reusable workflow vs one provisioning job feeding artifacts), with risks | - | 0.58 | 0 | insight |
| 13 | /doctor:ci command surface: registration contract, validator-forced mode split, scaffold constraints from gate-inputs, ownership split with sk-code-ci | - | 0.62 | 0 | insight |
| 14 | Verify iteration 13's inferred advisor-routing and ownership findings; close the sk-code-ci key question; replace the judgement-based protected set with a functional rule. | - | 0.55 | 0 | insight |
| 15 | sk-code-ci contents: which of the seven workflow-authoring rules are machine-enforced today and which are only conventions | - | 0.58 | 0 | insight |
| 16 | sk-code-ci registration contract: what the sk-code hub registries require of a new mode | - | 0.62 | 0 | insight |
| 17 | sk-code-ci and /doctor:ci together: how sk-code-review applies sk-code-ci to workflow diffs, how /doctor:ci scaffolding reads sk-code-ci templates as the one source of truth, and the phase order between the two | - | 0.66 | 0 | insight |
| 18 | Consolidation: merge cost of push-to-main workflows — per-job billing, rebuild-commit multiplier, shared setup, changed-files gate, required-check names and the README contract | - | 0.72 | 0 | insight |
| 19 | Verification pass: re-check the five largest claimed savings against the workflow files and the dataset, correct any figure that does not hold, and rank the top 10 recommendations with saving, risk and effort. | - | 0.64 | 0 | insight |
| 20 | Phase plan: group the ranked recommendations into implementation phases 002-008 with scope, workflows touched, expected saving, risk, order and dependencies; sk-code-ci before /doctor:ci; the CI on/off control as its own phase. | - | 0.58 | 0 | insight |

- iterationsCompleted: 20
- keyFindings: 77
- openQuestions: 0
- resolvedQuestions: 12

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 12/12
- [x] What does each workflow cost in wall-clock and runner minutes, and which workflows dominate the total?
- [x] Which work is duplicated across workflows, and what does the repeated provision_worktree and bun install cost per run?
- [x] Where is caching missing or ineffective for npm, bun, provisioned trees and OpenCode installs?
- [x] Which triggers and path filters cause needless runs, including the run burst after each Trigger Index Rebuild commit?
- [x] Are parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups set well?
- [x] Which tests or jobs are flaky or slow, and are job timeouts set and sized right?
- [x] Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate?
- [x] What security and pinning hygiene gaps exist in the workflows?
- [x] What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?
- [x] What should a /doctor:ci command do, how is it made safe, and who owns it?
- [x] What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
- [x] How do the ranked recommendations group into ordered implementation phases 002 and later?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▆▅▅▇█▆▅▃▂▁▂▃▁▂▃▅▆▄▂
- score sparkline: ▆▆▅▅▇█▆▅▃▂▁▂▃▁▂▃▅▆▄▂
- Last 3 ratios: 0.72 -> 0.64 -> 0.58
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.58
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
