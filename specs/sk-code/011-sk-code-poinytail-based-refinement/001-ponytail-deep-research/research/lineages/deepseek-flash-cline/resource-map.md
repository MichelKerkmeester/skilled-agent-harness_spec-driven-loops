---
title: "Resource Map — Ponytail 5.1.0 → sk-code (deepseek-flash-cline lineage)"
description: "Evidence-derived resource map for the detached deepseek-flash-cline lineage."
trigger_phrases: []
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- Scope: Ponytail doctrine, hooks, commands, portability and guards, verification and measurement, benchmark design, quality-mode enforcement, prior-refinement reconciliation, original proposals, implementation phases.
- Generated from: ten iteration deltas (81 findings) in this lineage.
- Primary authorities: the vendored Ponytail tree under `context/`, the local `sk-code` hub under `.skilled/skills/sk-code/`, the `.skilled` hook family, and the archived 015 refinement.
- Status is an evidence snapshot of the repository at the time of the run; the hub is under active development.

## Ponytail sources (vendored, treated as data)

| Resource | Action | Status | Evidence use |
|---|---|---|---|
| `context/AGENTS.md` | Read | OK | Core doctrine, never-cut carve-outs, scope rule, ceiling convention |
| `context/README.md:46-49,80,120-122,152-163,167-168` | Read | OK | Cost model, command table, host capability notes |
| `context/.opencode/command/ponytail-{review,audit,debt,gain,help}.md:1-5` | Read | OK | Command contracts: four-bullet findings, coverage closers, lean line, anti-fabricated baseline |
| `context/skills/ponytail-review/SKILL.md:1-40` | Read | OK | Long-form review doctrine and traversal order |
| `context/plugin.yaml:8-19` | Read | OK | Command and skill name duplication |
| `context/hooks/ponytail-map.js:1-10,70-99`, `ponytail-activate.js:46-67`, `ponytail-subagent.js:1-11,32-94`, `ponytail-mode-tracker.js:53-67`, `ponytail-runtime.js:14-81`, `ponytail-instructions.js:58` | Read | OK | Codebase map, fail-open activation, subagent injection, mode tracking |
| `context/docs/agent-portability.md:1-59` | Read | OK | Adapter table with tiers and verified host versions; thin-adapter rule |
| `context/scripts/check-rule-copies.js:1-74` | Read | OK | Byte-equality copies plus invariant canary, never-cut phrases pinned |
| `context/scripts/check-versions.js:1-60` | Read | OK | Version pin plus release-tag anchor; uniform-staleness failure narrative |
| `context/scripts/build-openclaw-skills.js:1-45` | Read | OK | Generated transformed copies with staleness test |
| `context/tests/behavior.test.js:1-45`; `context/tests/` (18 suites) | Read | OK | Grader self-test; host-quirk suites |
| `context/benchmarks/README.md:1-111` | Read | OK | Headline numbers, method, reproduce steps, honesty correction |
| `context/benchmarks/loc.js:1-15`, `correctness.js:1-40`, `behavior.yaml:1-40` | Read | OK | Measurement-only LOC, correctness gate with declared limits, behavior-effect probes |
| `context/benchmarks/agentic/README.md:1-70`; `agentic/{run,tasks,judge,compare,answer,complete}.py` | Read (README); listed (code) | OK / not read | Fair baseline, arms, tiers, safety table; harness code not inspected line by line |
| `context/benchmarks/results/` (10 dated reports) | Listed | OK | Archive includes adversarial audits and hardening reports |

## Hub sources (`sk-code` and shared tooling)

| Resource | Action | Status | Evidence use |
|---|---|---|---|
| `.skilled/skills/sk-code/SKILL.md:52-64` | Read | OK | Compiled routing default-on, legacy sentinel, kill-switch |
| `.skilled/skills/sk-code/hub-router.json:1-107`, `ROUTER.md:22-106`, `mode-registry.json:22-114`, `leaf-manifest.json` | Read / listed | OK | Two-stage routing, tool surfaces, typed leaves |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-70` | Read | OK | Design Restraint Ladder, YAGNI rung, P0/P1/P2 gate rule |
| `.skilled/skills/sk-code/shared/references/workflow-verify.md`, `workflow-implement.md:51` | Read | OK | Iron Law relocation, pre-write touch list |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md:288-395,530` | Read | OK | Output contract, exact final-line contract, review-depth alias |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md:44-118` | Read | OK | Severity model, finding schema, output ordering |
| `.skilled/skills/sk-code/sk-code-review/assets/{code-quality-checklist.md:120-140,removal-plan.md:20-70}` | Read | OK | Native-duplication row, needed-ness prompt, removal evidence fields |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:1-140` | Read | OK | Exact per-file invariants, Iron Law concept pair, delivery-prefix anchors |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md:124-260` | Read | OK | Comment-hygiene gates, gate workflow, advisory envelope, NEVER rules |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:1-60`; `assets/scripts/verify_stack_folders.py` | Read | OK | Two live guards, retired router-sync note, stack-folder validator |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:1-40`; `design-restraint/` | Read | OK | Persisted-evidence contract, no-mocks policy, restraint scenarios |
| `.skilled/skills/sk-code/benchmark/README.md:1-50`; `benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:239-302` | Read | OK | Retired Lane C harness, frozen verdicts, two-layer verdict observation |
| `.skilled/hooks/git/pre-commit:78-94` | Read | OK | Staged-only agent mirror-sync gate |
| `.skilled/hooks/session-lifecycle/README.md:1-30`; `.skilled/hooks/post-edit-quality/README.md` | Read | OK | Continuity priming across five runtimes; fail-open warn-only adapters |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` | Grep | OK (negative) | No `code_loc` or over-engineering metric present |
| `.skilled/bin/compiled-route-sync.cjs:1-55`; `.skilled/bin/lib/compiled-route-layout.cjs:45-70` | Read | OK | Closure promotion and move-simulation; authored program location |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/activation-record.json` | Grep | OK | Compiled-routing lane names the router artifacts as inputs |

## Prior refinement

| Resource | Action | Status | Evidence use |
|---|---|---|---|
| `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:37-88` | Read | OK | 17 recommendations, 11 rejections, sequencing |

## Limitations

- Ponytail benchmark claims are the project's own measurements; they are cited as claims with their stated method, never as confirmed numbers.
- The agentic harness code was not read line by line; only its README and the file inventory.
- No network access was used; the vendored snapshot is the whole Ponytail evidence base.
- Hub files are a snapshot; line numbers may drift as the repository changes.
