---
title: "Tasks: AI Fingerprint Registry for the design-audit anti-slop layer"
description: "Build tasks for the per-model AI-tell registry, the generated self-defect card, the deterministic parity validator, and audit-mode wiring."
trigger_phrases:
  - "ai fingerprint registry tasks"
  - "design audit registry build tasks"
  - "ai tell registry validator tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/003-ai-fingerprint-registry"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all tasks complete with evidence after validator PASS and BITE confirmed"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity enforceable now vs per-tell detection needing phase 004 fixtures: resolved as a deliberate fixture_id-named forward split"
---
# Tasks: AI Fingerprint Registry for the design-audit anti-slop layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Registry schema and rows, 1.5-2 hours]

### Schema
- [x] T001 Define registry JSON shape with the seven required fields: `tell_id`, `model_family`, `self_defect_prompt`, `deterministic_check`, `fixture_id`, `severity_floor`, `owner` (`.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json`) [20m] — seven-field schema authored, all rows carry every field

### Rows (one per current catalog tell)
- [x] T002 Author the five Codex rows: ghost-card border-plus-shadow, over-rounded cards, sketchy SVG illustration, diagonal stripe background, element-tracking on display type (`.../assets/ai_fingerprint_registry.json`) [40m] — five Codex rows present
- [x] T003 [P] Author the Gemini row: image-hover animation (`.../assets/ai_fingerprint_registry.json`) [10m] — Gemini row present
- [x] T004 [P] Author the three 2026-general rows: cream/sand body background, eyebrow above every section (including the numbered variant), uniform section fade-and-rise (`.../assets/ai_fingerprint_registry.json`) [25m] — three general rows present (9 total)
- [x] T005 Set `severity_floor` and `owner` per row from the catalog severity rule and owner mapping (`foundations`, `interface`, `motion`, `sk-code`) (`.../assets/ai_fingerprint_registry.json`) [20m] — severity floors P2/P3 and owners set per row, validator vocabulary check passes

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Validator and self-defect card, 2-3 hours]

### Parity Validator
- [x] T006 Add the deterministic parity validator beside the existing shared validators (`.opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs`) [1h] — validator added, `node --check` clean
- [x] T007 [P] Implement catalog tell enumeration: parse the model-family sections of `ai_fingerprint_tells.md` into a tell list (`.../shared/scripts/ai-fingerprint-registry-check.mjs`) [30m] — `parseCatalogTells` reads CODEX/GEMINI/2026-GENERAL sections, 9 tells enumerated
- [x] T008 Implement parity rules: fail when a catalog tell has no matching registry row, and fail when a row lacks a `fixture_id` (`.../shared/scripts/ai-fingerprint-registry-check.mjs`) [30m] — forward + reverse parity, field, slug, and vocabulary checks enforced

### Generated Self-Defect Card
- [x] T009 Add the card generator and emit one self-check prompt per registry row (`.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md`) [40m] — card present with 9 prompts, one per row

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Audit-mode wiring and verification, 1 hour]

### Wiring (additive)
- [x] T010 Add the registry and card to the audit mode resource map under the anti-patterns intent (`.opencode/skills/sk-design/design-audit/SKILL.md`) [15m] — resource-map rows + `ANTI_PATTERNS_PRODUCTION` RESOURCE_MAP entry added, 0 prose lines removed
- [x] T011 [P] Cross-link the prose catalog to the registry with an additive pointer note (`.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md`) [10m] — additive "Structured mirror" cross-link added

### Verification
- [x] T012 Run the validator green against the real catalog and the authored registry (`.../shared/scripts/ai-fingerprint-registry-check.mjs`) [10m] — "PASS ... catalogTells=9 registryRows=9", exit 0
- [x] T013 Negative test: temporarily remove a row or a `fixture_id` and confirm a non-zero exit, then restore [10m] — exit 1, "catalog tell uniform-section-fade-and-rise: missing registry row" (scratch copy, registry untouched)

### Documentation
- [x] T014 Update spec.md status and complete implementation-summary.md with validation evidence [15m] — spec upgraded to Level 2, implementation-summary.md authored with PASS/BITE evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] One registry row per current catalog tell, all seven fields populated
- [x] Validator passes green and fails deterministically on the negative case
- [x] Self-defect card generated with one prompt per row
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
