---
title: "Phase Parent: Skill Advisor semantic lane (Gemma local embeddings)"
description: "Phase parent for activating a real semantic/cosine lane in the skill advisor using the local EmbeddingGemma runtime shipped by the 014 setup-A line."
trigger_phrases:
  - "skill advisor semantic lane"
  - "advisor cosine lane"
  - "advisor gemma embeddings"
  - "skill advisor optimization"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded phase parent + 001/002 children"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high on child 001"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000515"
      session_id: "015-skill-advisor-semantic-lane"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 phase-parent -->
# Phase Parent: Skill Advisor semantic lane (Gemma local embeddings)

<!-- SPECKIT_LEVEL: phase -->

---

## Root Purpose

The 014 setup-A line shipped local EmbeddingGemma 300m at ~6ms per embed via llama-cpp + Metal. The skill advisor's five-lane scorer (`scorer/lane-registry.ts`) carries a dormant `semantic_shadow` lane at `weight: 0.00, live: false` that is NOT a real semantic lane today — it is token-overlap with a 0.8 multiplier (see `scorer/lanes/semantic-shadow.ts`). This phase parent converts that lane into a real cosine-similarity lane and rebalances the five-lane weights so it actually contributes to advisor recommendations.

The split into two children isolates the risk of a behavior-changing weight rebalance from the underlying embedding-cache plumbing.

## Sub-Phase Control File

This is the phase parent. The lean trio (`spec.md`, `description.json`, `graph-metadata.json`) lives at this level. Heavy authoring lives in the children.

## What Needs Done

- Child **001-embed-cache-and-cosine-wiring**: implement skill-embedding cache in `skill-graph.sqlite`, embed each SKILL.md once on `skill_graph_scan`, embed incoming prompts at recommend-time, expose cosine score as a new lane behind a shadow-only weight (no live behavior change). Code + tests + dist rebuild.

- Child **002-ablation-sweep-and-promote**: run `eval_run_ablation` over the gold battery with rebalanced weights, find the weight vector that lifts recall on intent-described prompts without flipping today's correct routings, promote the lane to `live: true` with the chosen weights, document the chosen weights in the decision record.

Implementation is delegated to cli-codex gpt-5.5 high. The main agent (claude) scaffolded this packet, will dispatch codex on each child, and verify completion via strict-validate + a fresh cli-opencode + deepseek-v4-pro probe against the live MCP.
