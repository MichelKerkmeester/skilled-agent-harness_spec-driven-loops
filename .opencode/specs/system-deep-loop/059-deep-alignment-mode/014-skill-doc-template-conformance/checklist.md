---
title: "Checklist: deep-alignment skill-doc template conformance"
description: "Verification checklist for the six-group doc conformance: per-group template match, checker passes, content preservation, and packet validation, each with source-cited evidence."
trigger_phrases:
  - "deep-alignment doc conformance checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/014-skill-doc-template-conformance"
    last_updated_at: "2026-07-13T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "All checklist items evidenced from independent checker runs"
    next_safe_action: "Operator review, then commit before merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-014-skill-doc-template-conformance"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Checklist: deep-alignment skill-doc template conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Evidence types: checker result (`package_skill.py --check` / `validate_document.py`), `git diff` review, file:line. A box is `[x]` only when the cited evidence exists.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Isolated worktree off origin/v4 with clean current docs
  - **Evidence**: `wt/0035-deep-alignment-doc-conformance` at HEAD `2e8466c7f6`; deep-alignment tree clean
- [x] CHK-002 [P1] Authoritative template + passing exemplar identified per group
  - **Evidence**: deep-review + deep-research both `package_skill.py --check` → PASS
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Human voice applied (third-person/imperative, no second person, no hype)
  - **Evidence**: nine adapters have zero authored em dashes and semicolons (only verbatim citations retain marks); README, core references, and `SKILL.md` measured at 0 em dashes
- [x] CHK-011 [P1] snake_case names preserved; no accidental renames
  - **Evidence**: `git status` shows content-only modifications, zero renames across the 39 touched files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] `package_skill.py --check` on deep-alignment → PASS
  - **Evidence**: `Result: PASS` (one pre-existing `assets/.gitkeep` naming nit, out of scope)
- [x] CHK-021 [P1] `validate_document.py` clean on every touched doc
  - **Evidence**: working `sk-doc/shared/scripts/validate_document.py` returns 38/38 PASS, zero blocking failures
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] SKILL.md router conforms (SMART ROUTING §2 added, renumbered)
  - **Evidence**: `## 2. SMART ROUTING` present, sections renumbered, `RULES` + `REFERENCES` added; `package_skill.py --check` PASS
- [x] CHK-031 [P1] README conforms to `skill_readme_template.md`
  - **Evidence**: restructured to nine-section shape, 0 em dashes; `validate_document.py --type readme` clean
- [x] CHK-032 [P1] 4 core references conform
  - **Evidence**: OVERVIEW + numbered sections, 0 em dashes; `validate_document.py --type reference` clean on all four
- [x] CHK-033 [P1] 9 adapter docs conform (consistent per-kind shape)
  - **Evidence**: `validate_document.py --type reference` 9/9 PASS; HVR-clean (0 authored em dashes/semicolons)
- [x] CHK-034 [P1] feature_catalog conforms to create-feature-catalog templates
  - **Evidence**: ephemeral "Spec phase" provenance rows stripped per the create-feature-catalog snippet template; `validate_document.py` passes on `feature_catalog/`
- [x] CHK-035 [P1] behavior_benchmark conforms to create-benchmark templates
  - **Evidence**: index + baseline conformed; scenario files left frontmatter-less per `behavior_benchmark_guide.md:141`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No secrets or credentials introduced (doc-only pass)
  - **Evidence**: no `.cjs` or config change; markdown structure and frontmatter only (doc-only pass)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] No technical content dropped (contracts/schema/scenarios intact)
  - **Evidence**: backtick code-identifier set-diff (HEAD vs now, code-shaped filter) = 0 dropped across all 39 files; only 25 ephemeral `.opencode/specs/...` provenance spans removed
- [x] CHK-051 [P1] Every touched doc carries the 5-field frontmatter + 4-part version
  - **Evidence**: `package_skill.py --check` PASS validates SKILL.md; `validate_document.py` PASS validates reference/catalog/benchmark frontmatter + version
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] All edits confined to the isolated worktree
  - **Evidence**: work runs against `wt/0035-...` paths only
- [x] CHK-061 [P1] 014 packet holds the Level-2 doc set
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` + `description.json` + `graph-metadata.json` all present
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **Groups**: SKILL.md, README, references-core (4), adapters (9), feature_catalog, behavior_benchmark
- **Checkers**: `package_skill.py --check` (SKILL) + `validate_document.py` (docs)
- **Open**: agent execution + verification + packet validation
<!-- /ANCHOR:summary -->
