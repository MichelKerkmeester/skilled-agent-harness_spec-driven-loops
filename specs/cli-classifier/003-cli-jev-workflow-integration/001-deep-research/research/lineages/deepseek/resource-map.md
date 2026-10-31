---
title: "Resource Map — deepseek detached lineage"
trigger_phrases: []
---
# Resource Map — deepseek detached lineage

This map was emitted at synthesis. No parent `resource-map.md` was present at phase initialization, so the source inventory below is the lineage's own evidence set, grouped by role and iteration.

## Repository code opened (primary evidence)

| Resource | Role | Iterations |
|---|---|---:|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` | D4 grader factory, call, consumption | 1, 8, 9 |
| `.../scorer/grader/harness.cjs` | Grader dispatcher, parse-status vocabulary | 1 |
| `.../model-benchmark/run-benchmark.cjs` | Grader flag, refusal pattern, provenance | 1, 8, 9 |
| `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs` | Completion-claim regex and budget | 1 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | Stop adapter, advisory-only path | 1 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Advisor child shim, 2500 ms budget | 2 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Thresholds, flags, abstention | 2 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Ambiguity cluster definition | 2, 8 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` | Shadow lane definitions | 2 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` | Disabled-reason health shape | 2 |
| `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts` | Opt-in delta sink | 2 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs` | Arm template, MRR/right@3 | 2, 8 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Recorded baselines (via sibling) | 8 |
| `.skilled/hooks/goal/lib/goal-core.cjs` | Heuristic verifier, evidence caps, verdict shape | 3 |
| `.skilled/hooks/goal/pi/goal-context.ts` | Pi turn_end verify and nudge | 3 |
| `.skilled/plugins/opencode-goal.js` | Verifier mode switch, 30 s timeout, verdict set | 3, 9 |
| `.skilled/hooks/goal/cursor/goal-inject.mjs` | Injection-only confirmation | 3 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | PreCompact selection and budget warning | 3 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` | Hook timeout and token budgets | 3 |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Novelty corroboration guard, stop decision | 4 |
| `.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts` | Shadow pairing shape | 4 |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer carrier, inert-novelty warning | 4 |
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md` | newInfoRatio rubric | 4 |
| `.skilled/skills/system-deep-loop/runtime/lib/next-focus/next-focus-selection.ts` | Shadow comparator | 4 |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Near-duplicate rule and callers | 5 |
| `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` | Guard contract and counts | 5 |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Jev dispatch lint surface | 5 |
| `.skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/README.md` (+ `mode-adapters.ts`) | H14 service and deep-review adapter | 5 |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md` | Severity and verdict contract | 5 |
| `.skilled/bin/compiled-route.cjs` | Front door stdout contract | 6 |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Tri-state routing flag | 6 |
| `.../009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs` | Clarify and defer construction | 6 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts` | Alignment thresholds and alternatives | 6 |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs` | Stability coefficient | 8 |

## Repository docs and contracts opened

| Resource | Role | Iterations |
|---|---|---:|
| `.skilled/skills/cli-jev/SKILL.md` | Hub posture, transport identity | 7 |
| `.skilled/skills/cli-jev/cli-usage/SKILL.md` | Exit map, probes, hard rules | 1, 7, 9 |
| `.../references/cli-reference.md` | LIVE/SOURCE exit taxonomy, stderr split | 9 |
| `.../references/integration-patterns.md` | Gate/triage/score/batch shapes | 1, 7, 9 |
| `.../references/providers-and-models.md` | Provider flags and probe behavior | 7, 9 |
| `.../manual-testing-playbook/cli-invocation/binary-resolves-and-pins-version.md` | Exact version-pin probe | 9 |
| `.skilled/commands/deep/model-benchmark.md` | Grader flag surface | 1 |
| `.skilled/hooks/goal/goal-plugin.md`, `.skilled/hooks/goal/README.md` | Goal surface table and verifier contract | 3 |
| `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md` | Reviewer fixture oracle | 1, 8 |

## Vendored research material opened (npm `jevctl` 0.2.3 and the Python client)

| Resource | Role | Iterations |
|---|---|---:|
| `R/jev-cli-main/plugin/hooks/fast-jev.ts` | Compaction hook patterns and fallback | 3 |
| `R/jev-cli-main/src/vendor/compaction/compact.ts` | Compaction defaults and thresholds | 3 |
| `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py` | 60 s client timeout | 9 |

(`R/` = `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/`.)

## Sibling lineage material read

| Resource | Role | Iterations |
|---|---|---:|
| `research/lineages/grok/iterations/iteration-003.md`, `iteration-007.md`, `iteration-010.md`, `research.md` | Wave-2 and wave-4 cross-reading; final contest | 4, 5, 10 |
| `research/lineages/mimo/iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md` | D4 catch, headroom arithmetic, labeled-set design | 6, 8, 10 |

## Context digests (attributed, not reopened)

| Resource | Role |
|---|---|
| `context/seam-map.md` | Seam ids, hook deadlines, Jev contract summary |
| `context/measurement-digest.md` | Harness ids H1-H15, gaps table |
| `context/repo-rules-digest.md` | Fitness checklist, red flags, values |
| `context/jev-material-digest.md` | Vendored material summary, package table, patterns |

## Format exemplar (outside lineage, read-only)

| Resource | Role |
|---|---|
| `specs/mcp-tooling/z_archive/010-mcp-mobbin/001-research/research/lineages/luna/*` | Detached-lineage artifact shapes for config, state, dashboard, deltas |
