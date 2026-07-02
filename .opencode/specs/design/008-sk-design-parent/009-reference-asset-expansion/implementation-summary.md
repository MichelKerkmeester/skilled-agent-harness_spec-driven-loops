---
title: "Implementation Summary: sk-design sub-skill reference and asset expansion research"
description: "A 2-lineage deep-research fan-out (10 Opus + 10 GPT-5.5, 16 iterations) produced a consolidated per-mode expansion matrix for the five sk-design sub-skills. Findings only; the reference/asset implementation is a gated follow-up."
trigger_phrases:
  - "design subskill reference expansion status"
  - "sk-design asset expansion research outcome"
  - "design mode expansion matrix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/009-reference-asset-expansion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the 2-lineage fan-out (16 iters), merged and synthesized research/research.md"
    next_safe_action: "Operator review of the matrix; then a gated implementation phase"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-009-reference-asset-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Three-dials ownership (foundations vs interface/shared)"
      - "md-generator authoring-boundary doc in-scope; forward-authoring capability out of scope"
    answered_questions: []
---
# Implementation Summary: sk-design sub-skill reference and asset expansion research

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-reference-asset-expansion |
| **Completed** | Research executed: 2-lineage fan-out, 16 iterations, consolidated matrix delivered |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is a research phase, so the deliverable is findings, not code. A 2-lineage deep-research fan-out ran against the charter and produced `research/research.md`: a consolidated per-mode expansion matrix for the five sk-design sub-skills, with each proposed reference/asset typed, sourced to the corpus, severity-tagged, effort-estimated, and marked by lineage agreement. The actual writing of the references and assets is a separate, gated follow-up.

### Lineages
- **opus48-claude2** (Claude Opus 4.8, xhigh): 6 iterations, converged (newInfoRatio 1.0 to 0.25). Produced the rigorous spine: cross-cutting prerequisites, priority ranking, negative-knowledge table.
- **gpt55fast** (openai/gpt-5.5-fast, xhigh): 10 iterations, final newInfoRatio 0.03. Produced more granular per-mode assets (motion cards, audit evidence references, foundations adaptation matrix).

The two were merged (`fanout-merge.cjs`, 18 key findings) and synthesized into one matrix with lineage-agreement markers.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A throwaway 1+1 smoke test confirmed the executor wiring, then the full 10+10 fan-out ran at concurrency 2 via `fanout-run.cjs`, grounded in `001-corpus-research/research/{research.md,gap-analysis.md}`, the 43-entry `external/` corpus, and the live `sk-design/` tree. Both lineages succeeded with zero failures. Opus converged early at 6 (genuine diminishing returns, a legitimate stop), GPT ran the full 10. Lineages were merged and synthesized into `research/research.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Accept Opus's convergence at 6 rather than force 10 | Convergence is the research engine's legitimate diminishing-returns stop; padding to 10 would add low-info repetition against the "if effective" bar |
| Synthesize a unified matrix with lineage-agreement markers | Both lineages found different concrete additions for the same gaps; "both" items are high-confidence, the unique grafts widen coverage |
| Reconcile the md-generator divergence | The authoring-boundary documentation is in-scope and low-risk; the forward-authoring capability stays out of scope (routes to a net-new design-spec child) |
| Keep implementation gated | The charter is findings-only; writing the references/assets is a separate phase the operator approves |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both lineages produced valid iterations + JSONL | PASS (orchestration-summary: 2 succeeded, 0 failed) |
| Iteration counts | opus 6 (converged), gpt 10 (cap) = 16 substantive iterations |
| Merge | `fanout-merge.cjs` ok, 18 key findings, attribution written |
| Consolidated deliverable | `research/research.md` present with the per-mode matrix |
| `validate.sh --strict` on this packet | run at finalization |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Findings only.** No references or assets were written; that is the gated follow-up.
2. **Effort estimates are coarse (S/M).** Calibrate during authoring.
3. **Two build-time decisions remain open.** Three-dials ownership and the N1/N2 owning home are flagged in the research, not resolved.
4. **One pre-existing defect to fix alongside the follow-up.** `design-audit/SKILL.md §8` cites the removed `changelog/v1.0.0.1.md`.
<!-- /ANCHOR:limitations -->
