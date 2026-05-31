---
title: "Model dispatcher"
description: "Model-agnostic dispatcher that routes prompts across executor CLIs only on the model-benchmark path."
trigger_phrases:
  - "model dispatcher"
  - "dispatch-model.cjs"
  - "route model prompt"
  - "executor cli routing"
  - "model-agnostic dispatch"
---

# Model dispatcher

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Model-agnostic dispatcher that routes prompts across executor CLIs only on the model-benchmark path.

This feature is the invocation seam for model-benchmark runs. It separates which model runs a prompt from how the benchmark scores the result, so the same loop shape can target different executors.

---

## 2. HOW IT WORKS

`scripts/model-benchmark/dispatch-model.cjs` is the model-agnostic dispatcher. It routes through an executor map keyed on `opts.executor` across `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-gemini`, and `cli-devin`, building the spawn spec per executor instead of hard-coding a single CLI. The dispatcher is loaded only on the model-benchmark path and never in agent-improvement mode, so the default scoring route never pulls in executor-routing code.

The dispatcher forwards `cwd` to every executor so spawned CLIs run against the intended workspace. Its rate-limit backoff reuses the existing backoff schedule and pauses with a non-busy `Atomics` sleep on an un-signalled buffer, which avoids spinning the thread while waiting out a rate limit.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Dispatcher | Routes a prompt to one of five executor CLIs, forwards `cwd`, and applies non-busy rate-limit backoff. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner | Consumes dispatcher output on the model-benchmark path before scoring. |
| `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs` | Mode router | Gates the dispatcher behind `--mode=model-benchmark` so it loads only on that path. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/tests/remediation.vitest.ts` | Automated test | Exercises dispatcher behavior alongside the model-benchmark remediation fixes. |
| `.opencode/skills/deep-improvement/SKILL.md` | Skill contract | Documents the dispatcher as the model-agnostic seam loaded only on the model-benchmark path. |

---

## 4. SOURCE METADATA

- Group: Model-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--model-benchmark-mode/015-model-dispatcher.md`
Related references:
- [014-mode-switch.md](014-mode-switch.md) — Mode switch
- [016-opt-in-5dim-scorer.md](016-opt-in-5dim-scorer.md) — Opt-in 5-dimension scorer
