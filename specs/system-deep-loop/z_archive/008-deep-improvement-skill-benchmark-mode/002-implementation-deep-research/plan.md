---
title: "Implementation Plan: Phase 002 — Implementation deep research"
description: "Plan for the 002 implementation deep-research phase: 5 GPT-5.5 xhigh-fast iterations via cli-codex through a packet-local worker pool, two Opus 4.8 verification passes, and a synthesized build-ready implementation playbook in research.md."
trigger_phrases:
  - "implementation deep research plan"
  - "phase 002 build playbook plan"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan — Phase 002: Implementation deep research

<!-- ANCHOR:summary -->
## Approach
Run a 20-iteration multi-model deep-research sweep (5 each: MiniMax-2.7, DeepSeek-v4-pro, GPT-5.5-xhigh-fast, Opus-4.8-native), 2 executors in parallel, each iteration a LEAF @deep-research pass writing its own packet; then synthesize a cross-model build-ready implementation playbook `research/research.md`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:phases -->
## Steps
1. Initialize packet-local research state (config, strategy charter with IQ1–IQ8, driver, prompts, dirs). [scaffolded — ready to run]
2. Dispatch 20 iterations via the background `xargs -P 2` worker pool (one executor per iteration sandbox); salvage replies into iteration `.md` when in-repo writes are blocked.
3. Stitch per-model `state-parts/*` into `deep-research-state.jsonl`.
4. Synthesize all 20 iterations into `research/research.md` (per-IQ, cross-model, implementation module map + rename runbook + next steps for Phase 003/004).

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## Verification
All 4 models reach 5/5 iteration `.md` files; `research/research.md` present with the required sections; `orchestration-status.log` shows every iteration `exit=0`.
<!-- /ANCHOR:testing -->
