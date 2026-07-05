---
title: "Implementation Summary: Phase 001 — Skill-benchmark deep research"
description: "20-iteration, 4-model deep-research sweep (MiniMax-2.7, DeepSeek-v4-pro, GPT-5.5-xhigh, Opus-4.8 — 5 iters each) into Lane C skill-benchmark design + the deep-agent-improvement->deep-improvement rename; converged into research/research.md."
trigger_phrases:
  - "122 phase 001 implementation summary"
  - "skill-benchmark deep research results"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran 20-iteration 4-model deep-research sweep (2 executors in parallel via background driver) and synthesized research/research.md"
    next_safe_action: "Use research/research.md to plan Phase 002 (rename) and Phase 003 (Lane C design+build)"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "RQ1 scoring dimensions + weights"
      - "RQ2 hint-free dispatch harness"
      - "RQ3 advisor-vs-router activation scoring"
      - "RQ4 scenario authoring / anti-circularity"
      - "RQ5 report + remediation taxonomy"
      - "RQ6 rename impact map + safe ordering"
      - "RQ7 external prior art"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary — Phase 001: Skill-benchmark deep research

## 1. What was done

A multi-model deep-research sweep investigating the design of **Lane C ("skill-benchmark")** for the `deep-improvement` skill and the `deep-agent-improvement → deep-improvement` rename. Per the user's directive, **20 iterations** were run, **5 per model** across four executors, with **2 executors in parallel at all times**:

| Model | Executor | Iterations | Status |
| ----- | -------- | ---------- | ------ |
| MiniMax-2.7 | cli-opencode (`minimax/MiniMax-M2.7`) | 5/5 | complete |
| DeepSeek-v4-pro | cli-opencode (`opencode-go/deepseek-v4-pro --variant high`) | 5/5 | complete |
| GPT-5.5 (xhigh, fast) | cli-codex (`gpt-5.5`) | 5/5 | complete |
| Opus-4.8 (native) | cli-claude-code (`claude -p --model claude-opus-4-8`) | 5/5 | complete |

Each model ran the same 5 foci: iter1 = RQ1 (scoring dimensions) + RQ7 (prior art); iter2 = RQ2 (hint-free dispatch harness); iter3 = RQ3 (advisor-vs-router activation) + RQ4 (scenario authoring); iter4 = RQ5 (report/remediation); iter5 = RQ6 (rename impact map).

## 2. How it ran

A background driver (`run_one.sh` + an `xargs -P 2` worker pool) dispatched each iteration to its executor in its own sandbox; each executor acted as a LEAF `@deep-research` agent for one iteration, reading the strategy/topic and writing its own packet. A salvage fallback recovers the model's reply into the iteration `.md` when an executor's sandbox blocks the in-repo write (notably codex/gpt-5.5 and intermittently MiniMax), so every iteration produced a usable artifact.

## 3. Outputs

- `research/research.md` — **canonical cross-model synthesis** (≈352 lines, 24 sections): executive summary, per-RQ synthesis across the 4 models, recommended Lane C design, rename impact map, cross-model observations, and actionable next steps for Phases 002/003.
- `research/<model>/iterations/iteration-00{1..5}.md` — 20 per-model iteration narratives (~3,356 lines total: DeepSeek 1,417, MiniMax 721, Opus 666, GPT-5.5 552).
- `research/<model>/deep-research-state.jsonl` — per-model iteration state (DeepSeek/GPT-5.5/Opus 5 records each; MiniMax state thin due to early salvaged iters, but all 5 MiniMax narratives present).
- `research/<model>/deltas/iter-00N.jsonl` — ~187 structured findings across all models.
- `research/orchestration-status.log` — full per-iteration driver ledger (START/DONE, exit, duration, md/json).

## 4. Headline finding (see research/research.md for full detail)

Lane C should measure whether a skill is **discovered, routed to, and used effectively by an AI in situ** — distinct from `sk-doc` (doc shape) and `system-skill-advisor` (which skill to pick). Recommended five scoring dimensions with weights: Routing/Activation Accuracy (0.25), Unprompted Reference/Asset Discovery (0.25), Efficiency/Bottlenecks (0.20), Usefulness-via-Ablation (0.20), Structural Connectivity (0.10); captured via a hint-free dispatch harness; reusing the existing candidate/dispatcher/scorer seams under `loop-host.cjs --mode=skill-benchmark`.

## 5. Next steps

- **Phase 002** — execute the rename using the impact map in `research/research.md` §4.
- **Phase 003** — design + build Lane C from the recommended design in `research/research.md` §3.

## 6. Notes / caveats

- The deep-research loop was driven via a packet-local background worker pool rather than a single `/deep:start-research-loop` invocation, because the canonical command runs one executor per invocation while the user required 4 models × 5 iters with 2 in parallel. The externalized-state, fresh-context-per-iteration, and per-iteration JSONL contracts were preserved.
- `research.md` was salvaged from the synthesizer's output because the codex sandbox blocked the direct in-repo write; content is complete.
