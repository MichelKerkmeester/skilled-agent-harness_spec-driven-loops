---
title: "Implementation Summary: Doc, prompt & routing fixes (remove the fabrication mandates) [template:level_2/implementation-summary.md]"
description: "Remove the structural instructions in the format spec, style guide, prompt template, and SKILL.md that REQUIRE the AI to write content with no backing data. Adds the ABSENT-stamp path, the AP-29 anti-pattern, the per-section anti-fabrication ruleset, and loads the cardinal-rules card as a pre-write gate."
trigger_phrases:
  - "fabrication mandate removal"
  - "absent stamp"
  - "named principle evidence gate"
  - "comparative framing removal"
  - "per-section anti-fabrication ruleset"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/003-doc-prompt-routing-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped phase 003 (1e15dfda37): fabrication mandates removed, re-author proven"
    next_safe_action: "Phase complete; validator 004 enforces remaining residuals"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary | v2.2 -->
# Implementation Summary: Doc, prompt & routing fixes (remove the fabrication mandates)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 003 of 006 |
| **Status** | PLANNED — not yet implemented |
| **Parent** | `design/004-sk-design-md-generator` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. This phase is scaffolded and planned; see `spec.md` (scope + requirements) and `tasks.md` (task breakdown). This section is completed when the phase is implemented.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. The planned delivery sequence is in `plan.md` §4 IMPLEMENTATION PHASES (Setup → Implementation → Verification), each task behind a `vitest`/`validate.ts` regression check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Pre-decided from research: Make interpretive requirements conditional-on-evidence and add an ABSENT-stamp output, rather than deleting narrative entirely — evidence-backed named principles are the highest-value prose (iter-024).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Pending. Planned gates: `vitest`, live anobel re-extraction diffed vs baseline, `validate.sh --strict`, `package_skill.py --check`. Completion criteria in `checklist.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This is a planning artifact; no code has shipped. Known constraints are captured in `spec.md` §6 RISKS and the research open-questions (`research/research.md` §7).
<!-- /ANCHOR:limitations -->

---

