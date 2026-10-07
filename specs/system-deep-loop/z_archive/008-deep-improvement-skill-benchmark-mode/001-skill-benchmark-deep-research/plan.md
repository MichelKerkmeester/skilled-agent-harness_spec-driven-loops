---
title: "Implementation Plan: Phase 001 — Skill-benchmark deep research"
description: "Plan for the 001 multi-model deep-research phase: a 20-iteration sweep (5 each across MiniMax-2.7, DeepSeek-v4-pro, GPT-5.5-xhigh-fast and Opus-4.8-native) run through a packet-local worker pool, stitched per-model state, and a cross-model research.md synthesis."
trigger_phrases:
  - "skill-benchmark deep research plan"
  - "phase 001 multi-model research plan"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan — Phase 001: Skill-benchmark deep research

<!-- ANCHOR:summary -->
## Approach
Run a 20-iteration multi-model deep-research sweep (5 each: MiniMax-2.7, DeepSeek-v4-pro, GPT-5.5-xhigh-fast, Opus-4.8-native), 2 executors in parallel, each iteration a LEAF @deep-research pass writing its own packet; then synthesize a cross-model `research/research.md`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:phases -->
## Steps
1. Initialize packet-local research state (config, strategy charter with RQ1–RQ7, JSONL).
2. Dispatch 20 iterations via a background `xargs -P 2` worker pool (one executor per iteration sandbox); salvage replies into iteration `.md` when in-repo writes are blocked.
3. Stitch per-model `state-parts/*` into `deep-research-state.jsonl`.
4. Synthesize all 20 iterations into `research/research.md` (per-RQ, cross-model, recommended design + rename map + next steps).

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## Verification
All 4 models reach 5/5 iteration `.md` files; `research/research.md` present with the required sections; `orchestration-status.log` shows every iteration `exit=0`.
<!-- /ANCHOR:testing -->
