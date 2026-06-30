---
title: "Implementation Summary: Deferred enhancements & external-tool borrows (TIER-3 / future) [template:level_2/implementation-summary.md]"
description: "The TIER-3 items the research explicitly deferred plus the lower-priority borrow-list techniques: DTCG typed tokens + tokens.css, multi-viewport breakpoints, gradient decomposition, CIEDE2000 contrast, MCP token endpoint, composite/aliased tokens, semantic component tagging, hybrid clustering, and the semantic-data section gaps."
trigger_phrases:
  - "deferred enhancements"
  - "DTCG typed tokens"
  - "tokens.css output"
  - "gradient decomposition"
  - "MCP token endpoint"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator/006-deferred-enhancements"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 006 (deferred bucket) from research TIER-3"
    next_safe_action: "Revisit after phases 002-005 ship; each item is independently optional"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary | v2.2 -->
# Implementation Summary: Deferred enhancements & external-tool borrows (TIER-3 / future)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 006 of 006 |
| **Status** | PLANNED — not yet implemented |
| **Parent** | `design/006-sk-design-md-generator` |
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

Pre-decided from research: DTCG is a parallel tokens.dtcg.json first (never a breaking native migration) because it does not itself fix prose fabrication (iter-024).
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

