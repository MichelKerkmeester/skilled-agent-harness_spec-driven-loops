---
title: "Tasks: Ponytail-Based Refinement Research"
description: "Task breakdown for the 10-iteration ponytail -> sk-code/sk-code-review deep-research investigation."
trigger_phrases:
  - "ponytail refinement tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/146-sk-code-ponytail-based-refinement
    last_updated_at: 2026-06-13T11:05:00Z
    last_updated_by: claude-opus
    recent_action: "12-iter deep research complete; research.md synthesized"
    next_safe_action: "Operator: /speckit:plan starting with Wave A additive doc rows"
---
# Tasks: Ponytail-Based Refinement Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete · `[ ]` pending. Research-only packet; "tasks" are investigation steps, not code changes.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Init packet spec.md + research scaffold (config, state.jsonl seed, anchored strategy, lock, dirs).
- [x] Smoke-test both model lanes (Opus → `claude-opus-4-8`; gpt-5.5-fast responds).
- [x] Pre-stage all 10 seat prompts (file-based; ponytail source embedded for gpt seats after gitignore discovery).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Wave 1: iter-001 (Opus decision-ladder) + iter-002 (gpt hooks).
- [x] Wave 2: iter-003 (Opus intensity-sliders) + iter-004 (gpt ceiling-comments).
- [x] Wave 3: iter-005 (Opus rule-invariant guard) + iter-006 (gpt benchmark).
- [x] Wave 4: iter-007 (Opus ship-then-question) + iter-008 (gpt ponytail-review overlap).
- [x] Wave 5: iter-009 (Opus portability) + iter-010 (gpt synthesis).
- [x] Round 2: adversarial cross-verify (iter-011 Opus verifies gpt lane; iter-012 gpt verifies Opus lane).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Orchestrator grep-verify all 7 load-bearing factual claims (7/7 confirmed).
- [x] Synthesize `research/research.md` (25 ranked recommendations + conflict matrix + negative knowledge).
- [x] Reconcile `spec.md` generated findings fence; build findings-registry.json + dashboard.md.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `research/research.md` exists with prioritized, file-mapped recommendations (value/effort + integration-risk + negative knowledge).
- [x] 12 iterations recorded (Opus ×6, gpt-5.5-fast ×6); generate + verify rounds present.
- [x] No skill code modified.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md` · Summary: `implementation-summary.md`
- Findings: `research/research.md` · State: `research/deep-research-state.jsonl` · Registry: `research/findings-registry.json`

<!-- /ANCHOR:cross-refs -->
