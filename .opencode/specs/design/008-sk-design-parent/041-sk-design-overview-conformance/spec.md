---
title: "Feature Specification: sk-design OVERVIEW Conformance [template:level_2/spec.md]"
description: "22 sk-design reference and asset files lack the sk-doc Section-1 OVERVIEW structure, creating navigation drift across the design family. This packet brings every file into conformance with a content-preserving restructure."
trigger_phrases:
  - "sk-design overview conformance"
  - "overview structure"
  - "skill reference template"
  - "skill asset template"
  - "section 1 overview"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/041-sk-design-overview-conformance"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark sk-design OVERVIEW conformance complete; 22/22 verified, 3 gates pass"
    next_safe_action: "Regenerate generated metadata; commit the 22-file conformance batch"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
      - ".opencode/skills/sk-design/design-foundations/assets/token_starter.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-design OVERVIEW Conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Completed** | 2026-06-29 |
| **Branch** | `041-sk-design-overview-conformance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
22 sk-design reference and asset files (13 references, 9 assets) predate the sk-doc Section-1 OVERVIEW convention, so they open straight into body content instead of the standardized `## 1. OVERVIEW` block that the `skill_reference_template.md` and `skill_asset_template.md` define. This produces structural drift across the design family: references lack the Purpose / When to Use / Core Principle triad and assets lack the Purpose / Usage pair, making the corpus harder to scan and harder to validate against the sk-doc templates.

### Purpose
Every one of the 22 files conforms to its sk-doc template's Section-1 OVERVIEW structure through a content-preserving restructure, with no substantive body content deleted, frontmatter unchanged, and all three shipped campaign gates still passing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a 1-2 sentence header-free intro to each of the 22 files, directly under the H1.
- Add a `## 1. OVERVIEW` section to each file using the type-correct sub-structure:
  - **References (13)** → `skill_reference_template.md` OVERVIEW = Purpose / When to Use / Core Principle.
  - **Assets (9)** → `skill_asset_template.md` OVERVIEW = Purpose / Usage.
- Renumber all existing H2 sections contiguously so they follow the new `## 1. OVERVIEW` (existing content shifts to `## 2.`, `## 3.`, ... in original order).
- Re-verify the three gate-consumed files after restructure.

### Out of Scope
- Frontmatter edits — frontmatter is preserved verbatim on every file.
- Substantive body content changes — this is a structure-only, content-preserving restructure; no body prose, tables, matrices, or findings schemas are deleted or rewritten.
- Any sk-design file not in the 22-file list below — no opportunistic cleanup of adjacent docs.
- SKILL.md, README.md, or hub/registry files in sk-design — only the named references and assets are touched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| design-audit/references/accessibility_performance.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-audit/references/ai_fingerprint_tells.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-audit/references/anti_patterns_production.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-audit/references/audit_contract.md | Modify | **Gate-critical**: add intro + reference OVERVIEW; preserve a11y matrix + findings schema; renumber |
| design-audit/references/corpus_map.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-audit/references/critique_hardening.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-audit/references/evidence_capture.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-audit/references/hardening_edge_cases.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-audit/references/transform_remediation.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-foundations/references/worked_examples.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-interface/references/design-process/redesign_intake.md | Modify | Add intro + reference OVERVIEW; renumber |
| design-motion/references/advanced_craft.md | Modify | Add intro + reference OVERVIEW; renumber |
| shared/design_dispatch_boundary.md | Modify | Add intro + reference OVERVIEW; renumber |
| shared/assets/register_card.md | Modify | Add intro + asset OVERVIEW (Purpose/Usage); renumber |
| design-motion/assets/animate_presence_checklist.md | Modify | Add intro + asset OVERVIEW; renumber |
| design-motion/assets/motion_pattern_cards.md | Modify | Add intro + asset OVERVIEW; renumber |
| design-motion/assets/motion_performance_failure_card.md | Modify | Add intro + asset OVERVIEW; renumber |
| design-interface/assets/interface_preflight_card.md | Modify | **Gate-critical**: add intro + asset OVERVIEW; preserve all 12 sections incl. R4 matrix (## 11) + VERDICT (## 12); renumber |
| design-foundations/assets/token_starter.md | Modify | **Gate-critical**: add intro + asset OVERVIEW; preserve COLOR RAMP/TYPE SCALE/SPACING SCALE/HAND OFF heading text; renumber |
| design-audit/assets/a11y_quick_fixes.md | Modify | Add intro + asset OVERVIEW; renumber |
| design-audit/assets/anti_patterns_score_rubric.md | Modify | Add intro + asset OVERVIEW; renumber |
| design-audit/assets/audit_evidence_worksheet.md | Modify | Add intro + asset OVERVIEW; renumber |

All paths are relative to `.opencode/skills/sk-design/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the 22 files gains a `## 1. OVERVIEW` section with the type-correct sub-structure | References show Purpose / When to Use / Core Principle; assets show Purpose / Usage; `grep "## 1. OVERVIEW"` matches in all 22 files |
| REQ-002 | Each file gains a 1-2 sentence header-free intro under the H1, and existing H2 sections are renumbered contiguously starting at `## 2.` | Intro present before OVERVIEW; section numbers are sequential with no gaps or duplicates |
| REQ-003 | Restructure is content-preserving: no substantive body content deleted, frontmatter byte-unchanged | `git diff` shows only additive intro/OVERVIEW + heading-number changes; frontmatter block identical pre/post |
| REQ-004 | The three gate-consumed files still pass their gates after the edit | `naming_doc_check.py` exit 0 on token_starter.md; audit gate + `proof_check.py` observation-triad pass on audit_contract.md; Interface Pre-Flight HARD gate + R4 matrix + VERDICT intact on interface_preflight_card.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Standing campaign invariants hold after all 22 edits | `design-command-surface-check` STATUS=PASS drift=0; skill-benchmark hubRoute 34/29/5/0 unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 22/22 files conform to the Section-1 OVERVIEW structure for their sk-doc template type (reference or asset), verified by section-outline check. **VERIFIED** — orchestrator-independent acceptance: 22/22 conformant, exactly 22 sk-design files modified (zero scope creep).
- **SC-002**: All three gate re-verifications pass — `naming_doc_check.py` exit 0 on token_starter.md; audit gate + `proof_check.py` triad green on audit_contract.md; Interface Pre-Flight gate intact on interface_preflight_card.md. **VERIFIED** — naming_doc_check.py exit 0 (alias headings preserved); `proof_check._validate_observation_triad` returns `{ok: True}` with a11y matrix + findings schema preserved; preflight renumbered `## 1`–`## 13` with VERDICT last (## 13) and interaction-state matrix at ## 12 (shifted +1 from the pre-edit ## 11/## 12 by the OVERVIEW insertion), cross-references to other files unchanged.
- **SC-003**: `design-command-surface-check` reports STATUS=PASS drift=0 and skill-benchmark hubRoute stays 34/29/5/0 after the full restructure. **VERIFIED** — surface-check STATUS=PASS drift=0; hubRoute 34/29/5/0; evergreen 0 leaks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | token_starter.md feeds `naming_doc_check.py`, which matches heading TEXT via number-stripped aliases (COLOR RAMP / TYPE SCALE / SPACING SCALE / HAND OFF) | High | Renumbering is safe because the check strips numbers, but MUST re-run `naming_doc_check.py` and confirm exit 0 after the edit |
| Risk | audit_contract.md feeds the audit gate + `proof_check.py` observation-triad + the 7-layer a11y matrix; §-content is parsed by text / finding-heading, not section number | High | Preserve the a11y matrix and findings schema verbatim; renumber headings only; re-run the audit gate and `proof_check.py` |
| Risk | interface_preflight_card.md feeds the Interface Pre-Flight HARD gate (walked, not auto-parsed) plus the R4 interaction-state matrix (currently ## 11) and VERDICT (## 12); renumbering shifts these | High | Preserve all 12 sections' content; the gate is walked so numbers are safe, but re-verify the gate, R4 matrix, and VERDICT survive the shift |
| Risk | Section renumbering introduces a gap, duplicate, or off-by-one across a long file | Medium | Per-file section-outline diff during orchestrator verification; renumber in original order only |
| Dependency | cli-codex gpt-5.5 xhigh fast executor performs each batch | Batches cannot be implemented as planned if the executor is unavailable | Orchestrator implements the batch directly as fallback, preserving the same verification gates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Content Integrity
- **NFR-C01**: Body content is preserved verbatim except for heading-number changes and the additive intro + OVERVIEW block.
- **NFR-C02**: Frontmatter blocks are byte-identical before and after the edit on all 22 files.

### Structural Consistency
- **NFR-S01**: Every reference file's OVERVIEW carries exactly Purpose / When to Use / Core Principle sub-parts.
- **NFR-S02**: Every asset file's OVERVIEW carries exactly Purpose / Usage sub-parts.

### Gate Stability
- **NFR-G01**: No campaign gate regresses — naming_doc_check.py exit 0, audit gate + proof_check green, design-command-surface-check drift=0, skill-benchmark hubRoute 34/29/5/0.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Document Boundaries
- File already has a leading non-`## 1.` H2: insert OVERVIEW as new `## 1.` and shift all existing H2s by one.
- File has an existing intro paragraph: keep it, ensure it reads as the 1-2 sentence header-free intro; do not duplicate.
- File uses non-numbered H2 headings: number them contiguously starting after OVERVIEW while preserving heading text.

### Gate-Consumer Scenarios
- token_starter.md: a renumber that accidentally rewrites the alias heading TEXT (COLOR RAMP / TYPE SCALE / SPACING SCALE / HAND OFF) would break `naming_doc_check.py` — preserve the text, change only the leading number.
- audit_contract.md: a findings-schema or a11y-matrix row reorder would break text/finding-heading parsing — preserve order and content.
- interface_preflight_card.md: dropping or merging any of the 12 sections (especially R4 matrix at ## 11 and VERDICT at ## 12) would break the walked gate — preserve all 12.

### Batch Scenarios
- Partial batch completion: a half-restructured file is reverted, not left in a mixed state; the batch is re-run cleanly.
- Gate failure on a critical file: HALT the batch, report the gate output, do not proceed to the next batch until resolved.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 22 files across 4 sub-skills + shared; structure-only but broad |
| Risk | 14/25 | 3 files feed shipped gates (parser/text-matching); content-preserving lowers blast radius |
| Research | 6/20 | Template structure is fixed; per-file section inventory is mechanical |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking. The OVERVIEW sub-structure per type is fixed by the sk-doc templates; the 3 gate re-verifications are the only conditional checks and are enumerated in REQ-004.
<!-- /ANCHOR:questions -->
