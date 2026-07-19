---
title: Quick Reference
description: Short operational reference for running the deep-improvement workflow.
trigger_phrases:
  - "deep-improvement quick reference"
  - "agent improvement command"
  - "improvement runtime layout"
  - "dimension weights"
importance_tier: normal
contextType: general
version: 1.17.0.20
---

# Quick Reference

Quick reminder for running `deep-improvement` without re-reading the full protocol. Use it when you already know the workflow and only need the command shape, runtime layout, and core guards.

---

## 1. OVERVIEW

### Purpose

Provides a compact reminder of the deep-improvement workflow, the canonical command shape, and the packet-local runtime layout.

### When to Use

Use this reference when:
- You need the shortest possible command reminder
- You want to confirm the expected runtime folder layout
- You need a quick safety check before running the loop

### Core Principle

Proposal-first evidence is the default. Canonical mutation is a later guarded step, not the starting point.

The workflow copies `improvement_*` assets into the runtime, but the packet-local runtime files currently use the `agent-improvement-*` naming family shown below.

---

## 2. COMMANDS

```text
# Dynamic mode (the only evaluation path; works for any agent)
/deep:agent-improvement ".opencode/agents/debug.md" :confirm --spec-folder={spec_folder}
```

### Standalone Scripts

```text
# Scan integration surfaces
node scripts/agent-improvement/scan-integration.cjs --agent=debug

# Generate dynamic profile
node scripts/agent-improvement/generate-profile.cjs --agent=.opencode/agents/debug.md

# 5-dimension scoring (dynamic mode, the only supported path)
node scripts/agent-improvement/score-candidate.cjs --candidate=.opencode/agents/debug.md

# Static benchmark fixtures
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs
node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs

# Model-benchmark mode (benchmarks a model/prompt, not an agent file; default path unchanged)
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs --mode=model-benchmark --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs
# Opt-in 5-dimension scorer (default is --scorer pattern); grader noop|mock|llm
node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs --scorer 5dim --grader noop
```

### Dimension Weights (Dynamic Mode)

| Dimension | Weight |
| --- | --- |
| Structural Integrity | 0.20 |
| Rule Coherence | 0.25 |
| Integration Consistency | 0.25 |
| Output Quality | 0.15 |
| System Fitness | 0.15 |

---

## 3. RUNTIME LAYOUT

```text
{spec_folder}/improvement/
  agent-improvement-config.json
  agent-improvement-state.jsonl
  agent-improvement-strategy.md
  agent-improvement-dashboard.md
  experiment-registry.json
  candidates/
  benchmark-outputs/
```

---

## 4. KEY GUARDS

- proposal-only by default
- promotion is a per-target decision under dynamic mode
- dynamic profiles drive scoring and benchmarks
- append-only ledger
- scorer independent from mutator
- benchmark evidence separate from mirror-sync packaging

---

## 5. RELATED RESOURCES

- `loop-protocol.md`
- `../model-benchmark/evaluator-contract.md`
- `../agent-improvement/integration-scanning.md`
- `../model-benchmark/benchmark-operator-guide.md`
- `promotion-rules.md`
- `../../README.md`
