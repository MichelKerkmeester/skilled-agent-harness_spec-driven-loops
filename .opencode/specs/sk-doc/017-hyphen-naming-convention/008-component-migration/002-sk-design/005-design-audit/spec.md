---
title: "Feature Specification: Design-audit (017 phase 005)"
description: "The design-audit mode has a broad underscore-bearing fixture and evidence surface, including AI-fingerprint fixture directories, registry files, and audit references."
trigger_phrases:
  - "design-audit naming phase"
  - "sk-design design-audit phase"
  - "017 design-audit"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/005-design-audit"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-audit spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/SKILL.md"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/"
      - ".opencode/skills/sk-design/design-audit/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Design-audit (017 phase 005)

> Phase 005 of the sk-design component migration under `sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/005-design-audit |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 5 of the sk-design subtree in the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The design-audit mode has a broad underscore-bearing fixture and evidence surface, including AI-fingerprint fixture directories, registry files, and audit references.

**Purpose:** Rename the audit mode's non-exempt filesystem names to kebab-case and update evidence, fixture, and routing references without changing audit semantics.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the audit assets, fixture directory tree, procedures, and references listed above.
- Update registry-adjacent path values, SKILL.md, README.md, audit references, fixture documentation, and Markdown links.
- Preserve fixture IDs, JSON/YAML/TOML keys, audit labels, severity terms, and the Python scripts perf_evidence_check.py and polish_readiness_check.py.
- Keep feature-catalog and manual-testing-playbook work in phases 008/009.

### Live candidate boundary
- `assets/a11y_quick_fixes.md`, `ai_fingerprint_fixtures/`, `ai_fingerprint_registry.json`, `ai_fingerprint_self_defect_card.md`, and `ai_fingerprint_tells.md` become hyphenated
- `assets/ai_fingerprint_fixtures/` and its ten `ai_fingerprint_*` fixture directories become hyphenated; each keeps its `clean.html` and `tell.html` files
- `ai_slop_check.md`, `anti_patterns_production.md`, `anti_patterns_score_rubric.md`, and `anti_slop_production_hardening.md` become hyphenated
- `procedures/accessibility_audit.md` and `procedures/ai_slop_check.md` become hyphenated
- `references/accessibility_performance.md`, `ai_fingerprint_tells.md`, `anti_patterns_production.md`, `critique_hardening.md`, `evidence_capture.md`, `hardening_edge_cases.md`, `smart_router_pseudocode.md`, and `transform_remediation.md` become hyphenated

### Out of Scope
- Python scripts, Python package directories, fixture content, semantic fixture_id values, and audit rule behavior.
- Catalog/playbook, shared, benchmark, changelog, SKILL.md, mode-registry.json, and package-manifest naming.
- Changing the audit corpus, scores, or anti-slop policy.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | The fixture tree is fully mapped. | The map includes the fixture root, all ten ai-fingerprint fixture directories, registry/card paths, and every non-exempt Markdown path. |
| REQ-002 | Audit paths remain resolvable. | All fixture links, registry path values, SKILL.md resources, and reference links point to existing hyphenated targets. |
| REQ-003 | Semantic audit data is preserved. | Fixture IDs, JSON keys, rule names, HTML filenames, and Python script paths are unchanged. |
| REQ-004 | The phase does not absorb catalog/playbook work. | Those roots and their contents are listed as deferred sibling ownership. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The audit component outside catalog/playbook is kebab-clean.
- **SC-002**: Every fixture directory remains paired with its clean/tell files and registry references.
- **SC-003**: The evidence distinguishes filesystem path rewrites from unchanged audit identifiers and Python exemptions.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | A fixture path and its fixture_id are treated as the same contract. | High | Rename physical path segments only; compare registry IDs before and after and require semantic parity. |
| Risk | The broad fixture tree produces partial references. | High | Use a recursive path inventory and verify every Markdown/JSON path consumer, including registry-adjacent values. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the fixture inventory is concrete and the exemption set resolves the Python boundary.
<!-- /ANCHOR:questions -->
