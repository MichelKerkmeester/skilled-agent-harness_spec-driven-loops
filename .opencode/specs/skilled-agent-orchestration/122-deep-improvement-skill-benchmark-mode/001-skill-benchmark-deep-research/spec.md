---
title: "Phase 001: Skill-benchmark deep research (multi-model)"
description: "20-iteration multi-model deep research (5x MiniMax-2.7, 5x DeepSeek-v4-pro, 5x GPT-5.5-xhigh-fast, 5x Opus-4.8-native) investigating Lane C skill-benchmark design and the deep-agent-improvement->deep-improvement rename impact map."
trigger_phrases:
  - "skill-benchmark deep research"
  - "122 phase 001"
  - "multi-model deep research skill benchmark"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored research-phase spec; preparing multi-model deep-research runs"
    next_safe_action: "Run /deep:start-research-loop:auto per model (5 iters each) into research/"
    blockers: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 001 — Skill-benchmark deep research

**Parent:** `122-deep-improvement-skill-benchmark-mode`
**Type:** Deep-research phase (informs design of Lane C + the rename)
**Status:** Active

---

## 1. Purpose

Run a multi-model deep-research loop to answer the open questions that gate the design of **Lane C (skill-benchmark)** and to produce an exhaustive **rename impact map** for `deep-agent-improvement → deep-improvement`. Findings feed Phase 002 (rename) and Phase 003 (Lane C design + build).

Research only — no implementation. Per the deep-research contract: report findings, cite sources, never implement fixes during research.

## 2. Research questions

Derived from parent `spec.md` §11 (OQ1–OQ6) and §7 (R1–R6):

- **RQ1.** What are the right scoring dimensions + weights for benchmarking a skill's *real-world utilization* (routing accuracy, unprompted reference/asset discovery, efficiency, usefulness/ablation, structural connectivity)? How are they normalized across skills of different shapes?
- **RQ2.** How do you build a credible **hint-free dispatch harness** that runs a realistic scenario against an AI and captures *which references/assets it loaded* and its tool trace — without leaking the expected answer into the prompt?
- **RQ3.** Should activation accuracy be scored against the skill-advisor, the in-`SKILL.md` smart router, or both (as separate sub-scores)? What does "properly utilized" mean operationally?
- **RQ4.** Scenario/fixture authoring: hand-authored vs generated-from-the-skill's-own-triggers — how to get realistic coverage while avoiding circularity (scoring a skill against scenarios derived from itself)?
- **RQ5.** How should the **Skill Benchmark Report** rank bottlenecks and express remediations so a follow-up packet (or Lane A) can act on them?
- **RQ6.** Exhaustive rename surface for `deep-agent-improvement → deep-improvement` and a safe ordering: skill dir, `SKILL.md` frontmatter/triggers, commands, agent + runtime mirrors (`.claude`/`.codex`/`.gemini`), skill-advisor graph (`skill-graph.json`), `descriptions.json`, sentinel `sk-prompt-small-model`, root docs/CLAUDE.md, and any tests/fixtures.
- **RQ7.** Prior art: how do agent/skill frameworks elsewhere measure tool/skill *discoverability* and routing efficiency (retrieval precision/recall, ablation, LLM-as-judge), and what transfers here?

## 3. Method — multi-model split

Run via the canonical loop only: `/deep:start-research-loop` (YAML owns dispatch, state, convergence, synthesis). Packet-local state under `001-skill-benchmark-deep-research/research/`.

**20 iterations, executor split (5/5/5/5):**

| Iterations | Model | Executor route |
| ---------- | ----- | -------------- |
| 1–5 | MiniMax-2.7 | `cli-opencode` |
| 6–10 | DeepSeek-v4-pro | `cli-opencode` (DeepSeek API / opencode-go) |
| 11–15 | GPT-5.5 (xhigh reasoning, fast) | `cli-codex` |
| 16–20 | Opus-4.8 | native `@deep-research` |

Per small-model dispatch rule, MiniMax-2.7 and DeepSeek-v4-pro dispatch consults `sk-prompt-small-model` (provider/quota/context-budget). Per CLI dispatch rule, the relevant `cli-*/SKILL.md` is read before composing executor prompts.

Iteration discipline (from deep-research contract): LEAF, one focus per iteration, 8–11 tool calls (max 12), externalize findings to `iterations/iteration-NNN.md`, append JSONL delta with `newInfoRatio`, cite every finding.

## 4. Deliverables

- `research/research.md` — synthesized findings answering RQ1–RQ7.
- `research/deep-research-findings-registry.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, dashboard — workflow-owned state.
- A convergence report (stop reason, iterations, questions-answered ratio, newInfoRatio trend).
- A rename impact map (RQ6) consumable by Phase 002.

## 5. Success criteria

- Loop reaches convergence or 20 iterations with consistent state files.
- The 5/5/5/5 model split is executed and recorded in iteration provenance.
- `research/research.md` answers each RQ with cited sources and per-iteration ruled-out directions.
- Findings are concrete enough to drive Phase 002 (rename) and Phase 003 (Lane C design).

## 6. Out of scope

No implementation, no skill mutation, no rename execution (that is Phase 002). This phase produces evidence and recommendations only.
