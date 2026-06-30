---
title: "Implementation Summary: Validator semantic checks (make the checker see prose) [template:level_2/implementation-summary.md]"
description: "Extend validate.ts beyond hex/section-header checks so it can detect prose fabrication: a section-coverage report, a prose-discipline check, non-color stability gating, source-sentinel provenance, and a values-vs-claims score split."
trigger_phrases:
  - "validator prose checks"
  - "section coverage report"
  - "non-color stability gating"
  - "source sentinel provenance"
  - "dual score split"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/004-validator-semantic-checks"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped phase 004 (0efe91fc1f): prose/coverage checks + dual-score, 61/61"
    next_safe_action: "Phase complete; citation-gating tail needs SOURCE markers"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary | v2.2 -->
# Implementation Summary: Validator semantic checks (make the checker see prose)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 004 of 006 |
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

Pre-decided from research: Prose-word and self-review checks are WARNING-tier only; the reliable signal is the structural section-coverage report + citation counting (iter-036).
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

