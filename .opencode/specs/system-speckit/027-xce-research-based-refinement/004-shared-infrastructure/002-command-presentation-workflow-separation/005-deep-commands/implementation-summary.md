---
title: "Implementation Summary: Deep Commands Presentation Workflow Separation"
description: "Completed the 011 presentation/router split for the deep command family: six mode-based commands split into thin routers plus _presentation.md assets, behavior preserved per Fable parity verification, sk-doc command standard aligned."
trigger_phrases:
  - "deep commands split summary"
  - "deep presentation implementation"
  - "deep router rewire summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands"
    last_updated_at: "2026-06-11T13:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Completed deep-commands split: 6 routers + 6 presentation assets + sk-doc alignment"
    next_safe_action: "None; phase complete, parity-verified, and remediated"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Extend phase 011 with a deep-commands leaf rather than a new top-level packet."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Parent** | `../spec.md` (011 phase parent) |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Completed** | 2026-06-11 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 011 presentation/router split now covers the deep command family. Each of the six mode-based deep commands was split into a thin router plus a `deep_<command>_presentation.md` asset, with the existing `_auto.yaml` / `_confirm.yaml` workflow assets untouched (byte-identical per git):

| Command | Router (lines, before -> after) | Presentation asset (lines) |
|---------|--------------------------------|---------------------------|
| ask-ai-council | 429 -> 118 | 328 |
| start-agent-improvement-loop | 564 -> 147 | 461 |
| start-context-loop | 494 -> 108 | 390 |
| start-model-benchmark-loop | 573 -> 160 | 463 |
| start-research-loop | 486 -> 135 | 374 |
| start-review-loop | 544 -> 106 | 432 |

Each router carries the speckit-pattern sections (Router Contract, Owned Assets, Mode Routing, Execution Targets, Presentation Boundary, Workflow Summary) and retains its frontmatter, Phase 0 @general verification gate, and mandatory-input gate. Each presentation asset carries the startup prompts, auto pre-bound-setup schema and resolution tables, dashboards and checkpoints, result templates, and next-step wording.

The two non-mode deep commands (`start-non-dev-ai-system-loop`, `start-skill-benchmark-loop`, ~95 lines each, no `_auto`/`_confirm` assets) were verified as already thin and are out of split scope.

sk-doc alignment: `command_template.md` now documents the presentation/router split as the canonical pattern for mode-based workflow command families (asset table, router section order, reference shape), and a new `command_presentation_template.md` skeleton scaffolds the presentation contract.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A pilot split (`start-review-loop`) was dispatched to cli-opencode gpt-5.5-fast (xhigh) with the Gate-3 answer and the speckit reference shape baked into the brief, then host-verified before the remaining five were dispatched in two staggered waves (concurrency 3 then 2). The sk-doc alignment was authored directly by the orchestrator. Verification ran in three layers: a structural grep gate over all six routers, a deterministic line-level parity sweep of original vs router+presentation, and two concurrent Fable 5 adversarial parity seats (three commands each).

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Extend phase 011 with a `005-deep-commands` leaf rather than open a new top-level packet (operator directive).
- Relocate, do not rewrite: presentation content moved verbatim in meaning; routing-governing content (Phase 0 gate, mandatory-input gate, mode resolution, command chain) stayed in the router.
- Level 1 documentation: behavior-preserving doc refactor, proportional rigor (structural gate + parity sweep + Fable parity pass instead of a full multi-iteration deep review).

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Structural gate (6 routers) | PASS: each references all three owned assets, has Router Contract + Presentation Boundary, frontmatter intact |
| Workflow assets | PASS: all six `_auto`/`_confirm` YAML pairs byte-identical to HEAD |
| Deterministic parity sweep | PASS: all flagged lines were rephrased router blockquotes or renamed headers; reference bodies relocated to the presentation assets |
| Fable 5 parity (2 seats, 3 commands each) | PASS overall, 6/6 commands PASS; frontmatter unchanged, gates preserved, routing semantics unchanged, routers thin |
| Fable P2 findings (3) | REMEDIATED: restored the "keep AGENTS, skills, and quick references synchronized" clause in `start-context-loop` and `start-review-loop` Mode Routing, and the explicit two-gate HARD BLOCK framing sentence in `start-context-loop` |
| Spec validation | PASS: `validate.sh --strict` on this folder, 0 errors / 0 warnings |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The presentation assets surface in the skill registry as `deep:assets:deep_<command>_presentation` entries, matching how the speckit/create/doctor/memory presentation contracts surface. This mirrors the sibling families and is expected.
- Per-command auto/confirm YAMLs were intentionally not audited beyond byte-identity; their content was owned and verified by the phases that shipped them.

<!-- /ANCHOR:limitations -->
