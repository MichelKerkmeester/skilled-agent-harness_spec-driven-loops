---
title: "Phase 002: Implementation deep research (multi-model)"
description: "GPT-5.5-primary (xhigh-fast, cli-codex) implementation deep research with Opus 4.8 agent verification + synthesis, turning the converged 001 design into a build-ready implementation playbook for the deep-improvement rename + Lane C (skill-benchmark)."
trigger_phrases:
  - "implementation deep research"
  - "122 phase 002"
  - "deep-improvement implementation playbook"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-implementation-deep-research"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "GPT-5.5 sweep done 5/5; dual Opus verification; playbook synthesized"
    next_safe_action: "Begin Phase 003 narrow rename; checkpoint operator before shared advisor edits"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 002 — Implementation deep research

**Parent:** `122-deep-improvement-skill-benchmark-mode`
**Type:** Deep-research phase (turns the converged 001 design into a build-ready implementation playbook)
**Status:** Complete — GPT-5.5 sweep + Opus verification done; `research/research.md` synthesized

---

## 1. Purpose

Run a GPT-5.5-primary deep-research loop (with Opus 4.8 agent verification) to determine the best WAY TO IMPLEMENT the `deep-agent-improvement` → `deep-improvement` rename and Lane C ("skill-benchmark"). Phase 001 converged the DESIGN (what to measure, scoring, harness, fixtures, report, rename impact map); this phase produces the build-ready IMPLEMENTATION PLAYBOOK consumed by Phase 003 (rename) and Phase 004 (Lane C build).

Research only — no implementation. Report findings, cite sources, never implement fixes during research.

## 2. Implementation research questions

- **IQ1.** Lane C module architecture & seam reuse within the FIXED per-lane layout (`skill-benchmark/` subdir under `assets/`/`references/`/`scripts/` + `shared/`): what is genuinely shared vs Lane-C-specific, and how much of Lane B's scorer/grader/cache + `dispatch-model.cjs` to reuse vs fork.
- **IQ2.** How to wire `scripts/shared/loop-host.cjs --mode=skill-benchmark` (materialize → dispatch → score → report) while keeping Lane A/B byte-identical when the flag is absent (the TST-1 identity contract).
- **IQ3.** Trace-capture implementation: fidelity tier to build first; parse ALL file-touch verbs (Read, Bash cat/rg, Grep, Glob) across all 5 executors; canonicalize to resource keys; golden-trace fixture.
- **IQ4.** Router-replay (Mode A, pure route function) + live (Mode B) implementation; out-of-band `advisor_recommend` capture for the D1 inter-skill signal; the A↔B divergence finding.
- **IQ5.** Contamination linter (reusing the routers' own substring logic) + the 3-tier fixture pipeline (T1 auto+paraphrased / T2 hand-authored holdout / T3 adversarial) + public/private schema + T1↔T2 circularity meter + coverage assertion.
- **IQ6.** Scorer + report-builder: D1–D5 computation reusing Lane B shapes; render `report.md` FROM `report.json`; bottleneck ranking by funnel attrition; remediation taxonomy.
- **IQ7.** Rename execution runbook from the 001 impact map (atomic advisor TS+Python update, index-regen LAST, validation gate) + resolve the 4 decision-record items (agent identity; `deep-model-benchmark` alias; command verbs [keep]; narrow-vs-wide [operator chose NARROW]).
- **IQ8.** Pilot skills to dogfood Lane C on first; weight/verdict-band calibration; vitest/integration test patterns for the new lane; external prior art for harness implementation.

## 3. Method — GPT-5.5 primary, Opus verify (operator doctrine)

GPT-5.5 xhigh-fast (`cli-codex`) is the primary research executor; **Opus 4.8 agents verify the findings and synthesize the playbook.** Generation runs via the packet-local background worker pool (mirrors Phase 001): `cat jobs.txt | xargs -P 2 -L 1 ./run_one.sh`, each iteration a LEAF `@deep-research` pass writing its own packet; a salvage fallback recovers replies when the sandbox blocks the in-repo write.

| Stage | Executor | Role |
| ----- | -------- | ---- |
| Generation — 5 iterations | `cli-codex` `gpt-5.5`, `model_reasoning_effort=xhigh`, `service_tier=fast` | Run the 5 IQ-focused research iterations |
| Verification + synthesis | Opus 4.8 (native Agent) | Adversarially verify findings, then synthesize `research/research.md` |

Per-iteration foci: iter1 = IQ1 + IQ8; iter2 = IQ2 + IQ3; iter3 = IQ4 + IQ5; iter4 = IQ6; iter5 = IQ7.

Per the CLI dispatch rule, `cli-codex/SKILL.md` is read before composing executor prompts.

## 4. Deliverables

- `research/research.md` — Opus-synthesized, build-ready implementation playbook answering IQ1–IQ8, with a Cross-checks section recording the Opus verification verdicts.
- `research/gpt55/iterations/iteration-00{1..5}.md` — 5 GPT-5.5 iteration narratives.
- `research/gpt55/{deltas,state-parts}/*.jsonl` — per-iteration findings + state.
- `research/orchestration-status.log` — per-iteration driver ledger.

## 5. Success criteria

- 5/5 GPT-5.5 iteration artifacts present; `orchestration-status.log` shows every iteration `exit=0`; the Opus verification pass is complete.
- `research/research.md` answers each IQ with cited sources and a concrete shared-vs-skill-benchmark module map + rename runbook.
- The 4 rename decision-record items are resolved (including a documented narrow-vs-wide recommendation).
- Findings are concrete enough to drive Phase 003 (rename) and Phase 004 (Lane C build).

## 6. Out of scope

No implementation, no rename execution, no Lane C build, no skill mutation, no change to the fixed per-lane directory layout or the fixed (narrow) rename scope. This phase produces evidence and a build playbook only.
