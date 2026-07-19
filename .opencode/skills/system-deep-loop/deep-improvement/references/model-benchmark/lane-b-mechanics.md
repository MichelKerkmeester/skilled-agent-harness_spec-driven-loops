---
title: Lane B (Model-Benchmark) Mechanics
description: Entry-point routing, dispatcher, scorer selection, mode-aware promotion path, and hardening env-gate rationale for the model-benchmark lane.
trigger_phrases:
  - "model-benchmark entry point"
  - "dispatch-model dispatcher"
  - "5dim scorer grader selection"
  - "criteria exec hardening gate"
  - "mode-aware promotion path"
importance_tier: important
contextType: implementation
version: 1.17.0.0
---

# Lane B (Model-Benchmark) Mechanics

Full mechanics behind the SKILL.md summary of Lane B: how `loop-host.cjs` resolves mode, how the model dispatcher and scorers are selected, how promotion is mode-aware, and why the criteria-exec hardening gates default the way they do.

---

## 1. OVERVIEW

### Purpose

Documents the exact routing, dispatch, and scoring mechanics that let Lane B (model-benchmark) share the candidate, dispatcher, and scorer seams with Lane A (agent-improvement) while keeping the default agent-improvement path byte-identical when no mode flag is set.

### When to Use

Use this reference when:
- Debugging why `loop-host.cjs` routed to the wrong scorer or dispatcher
- Choosing between the `pattern` and `5dim` scorers, or between `noop`/`mock`/`llm` graders
- Deciding whether a hardening env gate should be flipped for a shared or hardened deployment
- Explaining why a benchmark-report promotion bypassed the agent-scored-file requirement

### Core Principle

Lane B benchmarks a model or prompt framework instead of mutating an agent file, but it reuses Lane A's promoter, archive, and runtime-mirror sync — the two lanes diverge only at mode resolution, dispatch, and scoring, and reconverge at a single canonical-target guard.

---

## 2. ENTRY POINT AND MODE RESOLUTION

`scripts/shared/loop-host.cjs` resolves the mode. `--mode=agent-improvement` (or no flag) routes to `scripts/agent-improvement/score-candidate.cjs`. `--mode=model-benchmark` runs `scripts/shared/materialize-benchmark-fixtures.cjs` then `scripts/model-benchmark/run-benchmark.cjs`. An unknown mode warns and falls back to agent-improvement.

---

## 3. DISPATCHER

`scripts/model-benchmark/dispatch-model.cjs` is the model-agnostic dispatcher (executor-routing map across cli-opencode, cli-claude-code, cli-opencode). It is loaded only on the model-benchmark path, never in agent-improvement mode.

---

## 4. SCORER SELECTION

`run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher. `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported 120/003 five-dimension scorer (deterministic checks plus a pluggable grader). `--grader noop` (default) stays deterministic with no model dispatch. `--grader mock` or `--grader llm` select the stub or real grader.

---

## 5. MODE-AWARE RECORDS AND PROMOTION PATH

Every state record carries `mode: agent-improvement` or `mode: model-benchmark`, and benchmark reports carry `scoringMethod: pattern|5dim`, so the reducer (`reduce-state.cjs`) and downstream consumers can attribute results per lane. Record-level mode metadata lives in the reducer, NOT in the promoter.

Lane A promotes a scored candidate through the agent-scored gates in `promote-candidate.cjs`. Lane B promotes from the benchmark report: pass `promote-candidate.cjs --benchmark-report <report.json>`, and when the report status is `benchmark-complete` with a passing benchmark recommendation, the benchmark-report path drives promotion and bypasses the agent-scored-file requirement. The promoter is NOT otherwise lane-branching beyond this benchmark-report path — both lanes share the same single canonical-target guard, archive, and runtime-mirror sync.

---

## 6. HARDENING ENV GATES

Set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to refuse criteria-driven shell execution in the 5-dim scorer. When the gate is off, BOTH criteria-exec paths are refused: the deterministic-criterion `execSync` in `score-model-variant.cjs` AND the bundle-gate Layer-3 acceptance-command `execSync` in `bundle-gate.cjs`. Set `DEEP_AGENT_GRADER_CACHE_RAW=0` to redact raw grader output from the on-disk cache. Both default to the permissive value for backward-compat.

### Trusted-Author Default Rationale (DOCUMENT-ACCEPT)

Criteria commands originate only from benchmark profiles authored by the operator running the loop, and the deterministic criterion runs in the same trust domain as the loop itself, so the default-on behavior is an intended trusted-author boundary rather than an untrusted-input risk. A shipped backward-compat test asserts the criterion runs by default, so flipping the default would be a behavior change with test impact, not a silent hardening. Hardened or shared-runner deployments set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to fail closed, and `DEEP_AGENT_GRADER_CACHE_RAW=0` to redact cached grader output.

---

## 7. RELATED RESOURCES

- `benchmark-operator-guide.md`
- `evaluator-contract.md`
- `mixed-executor-methodology.md`
- `../shared/promotion-rules.md`
- `../../scripts/model-benchmark/dispatch-model.cjs`
- `../../scripts/shared/loop-host.cjs`
