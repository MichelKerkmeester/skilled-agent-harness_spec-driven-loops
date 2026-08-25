---
title: "Changelog: Weak-Model Loop Adherence [010-weak-model-loop-adherence]"
description: "Hardened the deep-loop observation-only write boundary in the shared fan-out lineage prompt and weak-model dispatch rules so DeepSeek Flash completes runs without write-containment fatals."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-16

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/010-weak-model-loop-adherence` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation`

### Summary

Closed the weak-model observation-only write-boundary gap that caused DeepSeek Flash lineages to fail write-containment. The shared fan-out lineage prompt now explicitly forbids mutating repo tooling (`generate-context.js`, `validate.sh`, `git` write operations) and confines writes to the lineage artifact directory. The directive was mirrored into the small-model dispatch rules, a regression test asserts the hardened wording for research and review on both cli-opencode and cli-pi, and a live two-executor fan-out review proved DeepSeek completes with zero out-of-scope reverts while strong-model runs stayed unchanged.

### What Changed

- Hardened `buildLoopPrompt` in `fanout-run.cjs` with an explicit weak-model observation-only prohibition naming forbidden tooling and the lineage-only write rule.
- Applied the boundary across all eight loop modes via the shared fan-out prompt surface (cli-opencode and cli-pi).
- Mirrored the weak-model observation-only directive into `sk-prompt/sk-prompt-models` (`cli-prompt-quality-card.md` §6).
- Added regression coverage in `fanout.vitest.ts` asserting the prohibition renders for research and review on both executor kinds.
- Proved live acceptance: DeepSeek lineage `fulfilled`, zero write-containment violations; strong-model (luna-max) run unaffected.
- Left `write-containment.ts` unchanged; the containment net remains the enforced backstop.

### Status

Complete. Prompt-hardening shipped; hard pre-write jail not adopted.
