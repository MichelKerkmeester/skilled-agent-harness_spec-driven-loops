---
title: "Implementation Summary: Doc-as-view architecture (deterministic render, AI out of the value tables) [template:level_2/implementation-summary.md]"
description: "The structural endgame: generate the value-bearing sections deterministically from tokens (no AI), reduce AI prose to short token-cited annotations, and enforce citation gating. Removes the AI from the value-table surface where it can fabricate."
trigger_phrases:
  - "doc as view architecture"
  - "deterministic formatters"
  - "prompt builder"
  - "citation gating"
  - "three-class section partition"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator/005-doc-as-view-architecture"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped 005 A+B+C: formatters + build-write-prompt, vitest 61/61"
    next_safe_action: "Core shipped; citation-gating + token-dict/breakpoint formatters remain"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-005"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary | v2.2 -->
# Implementation Summary: Doc-as-view architecture (deterministic render, AI out of the value tables)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 005 of 006 |
| **Status** | PLANNED — not yet implemented |
| **Parent** | `skilled-agent-orchestration/152-sk-design-md-generator` |
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

Pre-decided from research: Additive, flag-gated rebuild: ship formatters Phase A behind a flag and prove byte-parity before expanding; keep the AI-write path as fallback.
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

