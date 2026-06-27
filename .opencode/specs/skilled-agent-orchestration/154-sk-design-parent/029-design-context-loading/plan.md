---
title: "Plan: preventing sk-design sub-skill context under-loading (deep research)"
description: "Implementation Plan: a single GPT-5.5-xhigh cli-codex deep-research lineage, run via the deep-loop fan-out runner, investigates the design context-loading problem across four axes and synthesizes research/research.md. Research only."
trigger_phrases:
  - "design context loading research plan"
  - "deep research plan sk-design context"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/029-design-context-loading"
    last_updated_at: "2026-06-27T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the deep-research approach after convergence"
    next_safe_action: "Open build phase to implement research §15-16 contract"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-029-design-context-loading"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: preventing sk-design sub-skill context under-loading

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

A single GPT-5.5 (reasoning xhigh) deep-research lineage, dispatched through the deep-loop fan-out runner (cli-codex executor), investigates how to guarantee the right `sk-design` sub-skill context is loaded and applied for design/UI build work. The loop runs fresh-context iterations with externalized state to convergence or a 10-iteration cap, then synthesizes `research/research.md`. No live skill content is changed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- The lineage runs and produces `research/research.md` with a recorded stop reason.
- Findings cite live-skill `file:line` sources.
- Each observed miss (skipped register, late contrast, ad-hoc audit, thin small-model) maps to a concrete proof field / gate.
- No file outside this phase folder is modified.
- `validate.sh --strict` is clean for the packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

- **Executor**: `cli-codex` → `gpt-5.5` at reasoning effort `xhigh`. The requested `gpt-5.5-fast` / `gpt-5.5-codex` are unavailable on this ChatGPT-account Codex (verified 400 "model not supported"); plain `gpt-5.5` @ xhigh was used.
- **Runner**: `deep-loop-runtime/scripts/fanout-run.cjs` with one cli-codex lineage (concurrency 1). The subprocess loads the deep-research SKILL and self-drives init → loop → synthesis into `research/lineages/gpt55x/`; the orchestrator then merges + promotes `research/research.md`.
- **State**: externalized per the deep-research contract (config, state.jsonl, strategy, registry, dashboard, per-iteration files + deltas).
- **Inputs (read-only)**: live `sk-design` hub + five mode packets + shared register, `cli-opencode`, `sk-prompt-small-model` (incl. the MiniMax-M3 profile), deep-loop-runtime fan-out + promotion-gate docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

1. **Setup** — create the phase + research packet; smoke-test the executor; validate the fan-out config.
2. **Loop** — dispatch the fan-out research loop; iterate to convergence across four axes (skill structure & routing, dispatch contracts, hard gates, verification/adopt-if-better).
3. **Synthesis** — merge the lineage registry; promote `research/research.md`; author the lean wrapper; validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

This is a research phase with no runtime code. Verification is documentary: confirm iteration artifacts exist, the synthesis is grounded with `file:line` citations, the convergence/stop reason is recorded, and `validate.sh --strict` passes for the packet. No unit/integration tests apply.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- Live `sk-design` hub + five mode packets + shared register (read-only baseline).
- `cli-opencode` + `sk-prompt-small-model` dispatch contracts (read-only).
- `deep-loop-runtime` fan-out runner + `deep-loop-workflows/deep-research` workflow.
- `codex` CLI with a GPT-5.5-capable account.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Research-only and fully reversible: delete the `029-design-context-loading/` phase folder. No live skill content is touched, so nothing downstream depends on this phase until a future build phase explicitly adopts its recommendations through the promotion-style gate.
<!-- /ANCHOR:rollback -->

---

## Cross-References
- **Specification**: `spec.md`
- **Deliverable**: `research/research.md`
- **Sibling precedent**: `../024-designer-skills-research/`
