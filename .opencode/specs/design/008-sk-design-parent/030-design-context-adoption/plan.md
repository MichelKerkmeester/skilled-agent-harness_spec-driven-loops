---
title: "Plan: adopt the sk-design context-loading contract"
description: "Implementation Plan: four file-disjoint cli-codex gpt-5.5 @ high agents implement the 029 contract across the live design + dispatch skills, then a fresh opus reviewer verifies coherence and aligns the new docs with sk-doc."
trigger_phrases:
  - "context loading contract plan"
  - "sk-design adoption build plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/030-design-context-adoption"
    last_updated_at: "2026-06-27T15:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the four-agent build + opus-verify approach"
    next_safe_action: "Optional follow-ups; otherwise phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-030-design-context-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: adopt the sk-design context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Implement the converged `029` research contract across the live design + dispatch skills as additive edits, using four file-disjoint cli-codex `gpt-5.5` @ high agents (one per task group), then verify and sk-doc-align with a fresh opus reviewer. The work decomposes by file ownership so the agents cannot conflict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- Every new/edited file passes `python3 .opencode/skills/sk-doc/scripts/validate_document.py`.
- Smart-router blocks + anchors + frontmatter of edited SKILLs are unchanged except for additive insertions.
- All cross-references resolve; proof fields match research §6–9; gate table matches §12.
- A fresh opus reviewer records a verdict and applies safe fixes.
- Only the scoped files change (no stray writes).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

Four task groups, file-disjoint:
- **T-A** — `sk-design/shared/context_loading_contract.md` + `assets/context_loaded_card.md` + `assets/proof_of_application_card.md` (NEW).
- **T-B** — hub `SKILL.md` bundle rule + interface/foundations/audit `SKILL.md` load-and-prove hooks + `design-foundations/assets/contrast_pair_inventory.md`.
- **T-C** — `cli-opencode/assets/prompt_templates.md` design dispatch template + `sk-prompt-models/.../minimax-m3.md` Design-Task variant.
- **T-D** — four `manual_testing_playbook/` scenarios (one per miss) + index rows.

Executor: cli-codex `gpt-5.5` @ reasoning `high`, `--sandbox workspace-write`, prompt via stdin. (`gpt-5.5-fast`/`-codex` unavailable on this ChatGPT-account Codex; `gpt-5.5` @ high used.) Each agent loads `sk-doc` + `sk-design`, cites research §15–16 + exact insertion points, and is bounded to an allowed-write list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

1. **Plan + scope** — Explore pass pins insertion points; create the `030` packet; capture a git baseline.
2. **Build** — dispatch T-A…T-D sequentially (cli-* single-dispatch default); each self-validates with `validate_document.py`.
3. **Verify + align** — fresh opus reviewer checks coherence/cross-refs/routers, runs sk-doc validation, applies safe fixes, reports a verdict.
4. **Finalize** — author the wrapper docs; strict-validate the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

Documentary + structural: `validate_document.py` on every file; independent grep that each edited SKILL keeps its router/anchor markers; cross-reference existence checks; the four new manual-test scenarios encode PASS (guard fires) vs FAIL (miss recurs) for the four misses. `validate.sh --strict` on the `030` packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- `029` converged research (the spec).
- Live `sk-design` hub + five modes + shared register; `cli-opencode`; `sk-prompt-models`.
- `sk-doc` (quality standards + validator).
- `codex` CLI with a GPT-5.5-capable account.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

All edits are additive and on the current branch. Revert = `git checkout` the 10 edited skill files + delete the 8 new files + the `030` folder (baseline `3c170c46de`). No runtime/deploy impact; unrelated working-tree files (e.g. the pre-existing `system-spec-kit/changelog/v3.7.0.0.md`) are untouched.
<!-- /ANCHOR:rollback -->

---

## Cross-References
- **Specification**: `spec.md`
- **Spec (research)**: `../029-design-context-loading/research/research.md`
