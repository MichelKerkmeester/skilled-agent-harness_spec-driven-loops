---
title: "Verification Checklist: Ponytail-Based Refinement Research"
description: "Verification checklist for the ponytail -> sk-code/sk-code-review deep-research packet."
trigger_phrases:
  - "ponytail refinement checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement
    last_updated_at: 2026-06-13T11:05:00Z
    last_updated_by: claude-opus
    recent_action: "12-iter deep research complete; research.md synthesized"
    next_safe_action: "Operator: /speckit:plan starting with Wave A additive doc rows"
---
# Verification Checklist: Ponytail-Based Refinement Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Research-only packet. Verification = evidence quality + convergence + on-disk fact-checking, not code tests. Mark `[x]` with evidence.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Both model lanes authed + resolving: Opus → `claude-opus-4-8`, gpt-5.5-fast responds. Evidence: smoke-test exit 0 both lanes.
- [x] CHK-002 [P0] Reference + targets readable: `external/ponytail-main/**` (gitignored, embedded for gpt seats), `sk-code/**`, `sk-code-review/**`.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Every recommendation cites a real grep-traceable path in sk-code / sk-code-review (verified during synthesis). Evidence: `research/research.md` §2.
- [x] CHK-004 [P1] No skill code modified (research-only scope honored). Evidence: `git status` shows only the new packet folder.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] 12 iterations completed (Opus ×6, gpt-5.5-fast ×6); generate (10) + verify (2) rounds present. Evidence: `research/deep-research-state.jsonl`, `iterations/iteration-001..012.md`.
- [x] CHK-006 [P1] Adversarial refute-first round-2 run; verdicts recorded. Evidence: `iterations/iteration-011.md`, `iteration-012.md`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-007 [P0] Each ponytail mechanism has a portability verdict + target file/section. Evidence: `research/research.md` §2 (25 ranked recs).
- [x] CHK-008 [P0] All 7 load-bearing factual claims independently verified on disk (7/7 confirmed). Evidence: `research/research.md` header + `findings-registry.json`.
- [x] CHK-009 [P1] Conflict/precedence matrix + negative-knowledge documented. Evidence: `research/research.md` §3, §2 DO-NOT-ADOPT.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P1] No secrets/credentials in prompts or artifacts; read-only seats; no external publication.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-011 [P1] `research/research.md` complete; `spec.md` findings fence reconciled; dashboard + registry present.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-012 [P2] Artifacts under `research/` (state, strategy, iterations, deltas, prompts, registry, dashboard); reference under `external/`.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

All P0/P1 items satisfied. 12-iteration 2-model deep research converged on 25 ranked recommendations (8 ADOPT-NOW, 9 ADOPT-LATER, 8 DO-NOT-ADOPT); round-2 refuted zero recs and produced 2 scope corrections; all factual claims confirmed on disk. Outstanding by design: implementation of the recommendations (separate `/speckit:plan` → `/speckit:implement` packet, sequenced Wave A-D).

<!-- /ANCHOR:summary -->
