---
title: "Plan: Deep AI Council Research + Architecture Design"
description: "Research strategy + ADR-emission plan for deep-ai-council architecture."
trigger_phrases:
  - "deep ai council 001 plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/001-research-and-architecture-design"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Author plan.md"
    next_safe_action: "Dispatch deep-research or council deliberation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: Deep AI Council Research + Architecture Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

## 1. APPROACH

Recommended: 5-7 iter `/spec_kit:deep-research` dispatch on this folder + optional follow-on sk-ai-council deliberation on the runtime-boundary ADR. Executor preference: cli-codex gpt-5.5 high fast (architecture work benefits from larger context model). Optionally cli-devin SWE-1.6 if budget-constrained.

The research target is "deep-ai-council architecture" — distinct from sibling packet 130's question of differentiation between deep-* skills. Coordination: this packet writes architecture ADRs; 130 writes routing rules. The two converge in phase 005 wiring.

## 2. EXECUTION SEQUENCE

| Step | Action | Output |
|------|--------|--------|
| 1 | Initialize deep-research packet under `research/` | `research/deep-research-config.json` |
| 2 | iter-001 — current sk-ai-council surface inventory (state files, seat assets, command YAMLs) | iter-001 delta |
| 3 | iter-002 — deep-loop-runtime primitive inventory (loop-lock, jsonl-repair, atomic-state, executor-audit) | iter-002 delta |
| 4 | iter-003 — schema design (session/topic/round/findings) | iter-003 delta |
| 5 | iter-004 — convergence semantics for opinion-shaped artifacts | iter-004 delta |
| 6 | iter-005 — runtime-boundary options (extract peer vs extend in place) with cost/risk comparison | iter-005 delta |
| 7 | iter-006 — cost-guard defaults + migration path | iter-006 delta |
| 8 | iter-007 — synthesis | iter-007 delta |
| 9 | Emit `decision-record.md` with ≥ 4 ADRs | decision-record.md |
| 10 | Fill `implementation-summary.md` Status=Completed | implementation-summary.md |
| 11 | Strict validate | exit 0 |

## 3. ALTERNATIVES CONSIDERED

- **Pure AI Council route** — 4-seat deliberation, no deep-research. Faster but produces less concrete schema sketches. Rejected for now; council can run as a check after ADRs.
- **Skip research, jump straight to implementation** — risks rework if runtime boundary wrong; rejected.
