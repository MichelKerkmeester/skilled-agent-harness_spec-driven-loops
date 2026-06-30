---
title: "Verification Checklist: AI Fingerprint Registry for the design-audit anti-slop layer"
description: "Verification gates for the per-model AI-tell registry, parity validator, generated self-defect card, and audit-mode wiring, including fix-completeness checks."
trigger_phrases:
  - "ai fingerprint registry checklist"
  - "design audit registry verification"
  - "ai tell registry parity checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/003-ai-fingerprint-registry"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verified all checklist items against the registry, card, and validator PASS/BITE exits"
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
# Verification Checklist: AI Fingerprint Registry for the design-audit anti-slop layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Registry target and shape confirmed from spec.md
  - **Evidence**: registry authored at `design-audit/assets/ai_fingerprint_registry.json` with the seven row fields (`tell_id`, `model_family`, `self_defect_prompt`, `deterministic_check`, `fixture_id`, `severity_floor`, `owner`)
- [x] CHK-002 [P0] Current catalog tell inventory enumerated
  - **Evidence**: 9 tells (5 Codex, 1 Gemini, 3 general) enumerated from `ai_fingerprint_tells.md` before authoring rows
- [x] CHK-003 [P1] Owner and severity vocabulary sourced
  - **Evidence**: owners limited to `foundations`, `interface`, `motion`, `sk-code`; severity floors P2/P3 drawn from the catalog severity rule; the validator enforces both vocabularies

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Registry is valid JSON
  - **Evidence**: parses to 9 rows without error
- [x] CHK-011 [P0] Every catalog tell has exactly one registry row (forward parity, fix-completeness)
  - **Evidence**: validator reports `catalogTells=9 registryRows=9`, no catalog tell missing a row
- [x] CHK-012 [P1] Every registry row has all seven fields populated (fix-completeness)
  - **Evidence**: validator required-field check passes; no empty or placeholder fields across rows
- [x] CHK-013 [P1] Each `deterministic_check` mirrors the catalog Check rule for its tell
  - **Evidence**: each row's check text reflects the concrete catalog rule for that tell
- [x] CHK-014 [P1] No orphan registry rows without a catalog tell (reverse parity, recommended)
  - **Evidence**: validator reverse-parity check finds every row maps to a catalog tell

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Validator passes green against the complete registry and real catalog
  - **Evidence**: exit 0, "PASS ai-fingerprint-registry-check: catalogTells=9 registryRows=9"
- [x] CHK-021 [P0] Validator fails when a catalog tell lacks a row (deterministic negative)
  - **Evidence**: exit 1, "catalog tell uniform-section-fade-and-rise: missing registry row" on a scratch registry with one row removed
- [x] CHK-022 [P0] Validator fails when a row lacks a `fixture_id` (deterministic negative)
  - **Evidence**: `fixture_id` is in `REQUIRED_FIELDS`; a missing or blank `fixture_id` fails the required-field check at exit 1 naming the row
- [x] CHK-023 [P1] Self-defect card generated with one prompt per row
  - **Evidence**: card carries 9 prompts grouped Codex/Gemini/General, one per registry row

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only — this phase adds one registry, one card, and one validator and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; an evergreen grep over the three new files and two edits finds no spec/packet IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the registry's only consumers are the parity validator and the audit resource map; both are wired additively, and the prose catalog gains a pointer only
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: adversarial matrix executed — missing row, missing field, malformed slug, out-of-vocabulary value, orphan row, and a full-parity no-op all behave deterministically
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix axes are forward-parity, reverse-parity, field-completeness, slug-shape, and vocabulary, over the 9 registry rows
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the validator reads only the catalog and registry text and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Evidence**: evidence pins to `ai_fingerprint_registry.json`, `ai_fingerprint_self_defect_card.md`, and the `validateRegistry` parity function in `ai-fingerprint-registry-check.mjs`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Additive only: prose catalog and existing assets unchanged except the additive cross-link
  - **Evidence**: diff shows 3 new files plus additive wiring in two files, 0 removed prose lines
- [x] CHK-031 [P0] Registry content is evergreen
  - **Evidence**: stable tell slugs and skill-relative paths only; no spec packet IDs or spec-folder paths embedded
- [x] CHK-032 [P1] `fixture_id` forward references align with the sibling fixture-corpus naming
  - **Evidence**: ids are stable `ai-fingerprint-*` slugs documented as forward references to the phase 004 corpus; the validator checks presence and slug shape, file resolution deferred

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Registry and card are usable by the audit mode
  - **Evidence**: `design-audit/SKILL.md` resource-map rows plus the `ANTI_PATTERNS_PRODUCTION` RESOURCE_MAP entry reference the registry and card so they load with the catalog
- [x] CHK-041 [P1] Catalog cross-links the registry
  - **Evidence**: `ai_fingerprint_tells.md` carries the additive "Structured mirror" pointer to the registry, card, and validator
- [x] CHK-042 [P1] Spec/plan/tasks synchronized and implementation-summary complete
  - **Evidence**: spec/plan/tasks/checklist are Level 2 and synchronized; implementation-summary records the parity-now vs detection-needs-004 split and the same PASS/BITE evidence

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New files confined to `design-audit/assets/` and `shared/scripts/`
  - **Evidence**: the three new files live under `design-audit/assets/` (registry, card) and `shared/scripts/` (validator) only
- [x] CHK-051 [P2] scratch/ cleaned before completion
  - **Evidence**: the negative-case registry copy lived only in `/tmp` and was removed; the working tree carries only the named files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent — verified against the delivered registry, card, and parity validator (exit 0 at 9=9 parity, exit 1 on a removed row, exit 2 usage)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
