---
title: "Implementation Summary: Fold a condensed design-knowledge layer into the standalone skill"
description: "Fold complete: 8 condensed design-knowledge files distilled from the hub's shared base into references/design-knowledge/, 3 dangling ../shared links repointed to local copies, zero shared references remaining. Executor deviation documented (cli-devin blocked on -p write permission; completed in-context)."
trigger_phrases:
  - "fold design knowledge summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/004-fold-design-knowledge"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "8 design-knowledge files + 3 repoints; zero ../shared refs; verified"
    next_safe_action: "Phase 005: delete hub + interface commands (operator-gated hard stop)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/references/design-knowledge/README.md"
      - ".opencode/skills/sk-design-md-generator/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Fold a condensed design-knowledge layer into the standalone skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Mutation Class** | mutates (8 new reference files + 3 link repoints) |
| **Executor** | main agent in-context (cli-devin dispatched first, blocked on `-p` write permission — see Key Decisions) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A condensed, self-contained design-knowledge layer under `references/design-knowledge/`, so the extraction skill reads design *intent* off a surface, not only CSS:

- `register.md` + `register-card.md` — the Brand-vs-Product operating register and its fill-in card, trimmed so the posture is *recorded from the extracted surface*, never authored from a brief.
- `anti-slop-principles.md`, `cognitive-laws.md`, `numeric-design-laws.md`, `design-token-vocabulary.md` — condensed from the hub's shared base, reframed for reading a captured surface.
- `design-principles-digest.md` — new distillation of the interface design-process principles, framed as intent-vs-slop recognition (subject-grounding, thesis hero, meaningful structure, earned deviation, purposeful motion, restraint, writing-as-material).
- `README.md` — index of the layer.

The 3 previously-dangling `../shared/*` register links (in `SKILL.md`, `references/authoring-boundary.md`, `assets/source-of-truth-router-card.md`) now point at the local copies; the SKILL.md "Shared" subsection was renamed "Design Knowledge" to surface the whole layer. This makes the advisor identity authored in 003 (which advertises register / anti-slop / cognitive-laws / numeric-laws / token-vocabulary / design-principles) honest.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each folded file was distilled from its hub source and trimmed on two axes: (1) *posture* — every "author a register from a brief" framing was rewritten to "record the register the surface expresses", matching an extraction skill; (2) *self-containment* — every cross-reference to a sibling hub mode (interface/foundations/motion/audit) or a soon-deleted `shared/scripts` path was removed, and `numeric-design-laws.md` was reduced to `law_id | value/range | caveat` so its values survive without the deleted owner/enforcement columns. The digest kept the reusable design judgment and dropped the hub's build-time machinery (two-pass plan/challenge workflow, CSS signature-contract comment blocks, brief-to-dials intake) that a measured-extraction skill does not use.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Executor deviation from the plan-named cli-devin, documented.** The plan named cli-devin `gemini-3-7-flash-high`. It was dispatched (CLI verified installed + logged in) and rejected the first file write in non-interactive `-p` mode: `"rejected a tool call that requires confirmation ... Use --permission-mode dangerous"`. `dangerous` is forbidden without explicit operator approval; `--sandbox` runs an isolated session whose writes would not persist to the real tree; the GLM-5.2 fallback shares the same devin-runtime permission block (it is model-independent). Per cli-devin's own "direct action is faster when context is loaded" guidance, the fold — small and with sources already read — was completed in-context. The `dangerous`-mode question is surfaced to the operator for the remaining cli-devin phase (006).
- **Condensed, not re-homed.** Only the compact shared/ principles plus one distilled digest were folded; the full interface references were deliberately left behind — the point is a design-knowledge layer, not relocating the deprecated mode.
- **Surface the layer from SKILL.md.** Renaming the "Shared" pointer to "Design Knowledge" and pointing it at the layer README keeps the fold discoverable through the skill's own resource list rather than orphaned.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `grep -rniI --include='*.md' '\.\./\(\.\./\)*shared'` over `.opencode/skills/sk-design-md-generator` returns **nothing** — no reference escapes to the deleted hub.
- All 3 repointed link targets resolve: `SKILL.md → references/design-knowledge/README.md`, `authoring-boundary.md → design-knowledge/register.md`, `source-of-truth-router-card.md → ../references/design-knowledge/register-card.md` (each confirmed with `test -f`).
- All 8 files present under `references/design-knowledge/`; folded content spot-checked against sources — the six-dials table, the eight cognitive laws, the numeric thresholds, and the token vocabulary are preserved; only the posture framing and hub-mode cross-references were trimmed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The layer is intentionally condensed; it is design *judgment for reading a surface*, not the full interface-direction toolkit the deprecated mode carried. That breadth is out of scope by design (Q3: "less expanded").
- Fully reversible while uncommitted (`rm -r references/design-knowledge/`; `git checkout --` the 3 edited files). Nothing committed or pushed.
<!-- /ANCHOR:limitations -->
