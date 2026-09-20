---
title: "Feature Specification: sk-create-diagram reference template alignment"
description: "Align 10 named reference files with sk-create-skill's literal skill-reference-template.md structure — section dividers, ALL-CAPS numbered headers, intro/Section-1 duplication."
trigger_phrases:
  - "diagram reference template alignment"
  - "reference file divider fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/011-reference-template-alignment"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored spec; audit found 4/10 files with real divider+casing defects"
    next_safe_action: "Dispatch fixes: deepseek for 4 clear defects, LUNA-fast for 6 needing deeper audit"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Ground truth for 'aligned' is the template's own literal structure (skill-reference-template.md), cross-checked against 2 already-conformant sibling files: a `---` divider before every numbered H2, and ALL-CAPS section titles."
      - "Pre-dispatch audit found the defect is uneven, not uniform: 4/10 files (primitive-icons.md, export.md, import-mermaid.md, import-drawio.md) have real missing dividers AND lowercase-style titles; the other 6 already pass both checks and need a deeper per-template audit rather than a blind divider-insert."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram reference template alignment

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete — 10/10 files structurally aligned (dividers, casing, intro de-duplication); 5/10 share a documented, out-of-scope "missing overview section" gap requiring content authorship, see `implementation-summary.md` |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 of 12 |
| **Predecessor** | `../010-benchmark-artifact-embedding/spec.md` |
| **Successor** | `../012-flowchart-capability-merge/spec.md` |
| **Handoff Criteria** | All 10 named files pass `validate_document.py --type reference`; every genuine divider/casing/duplication defect found and fixed; no unnecessary churn to already-conformant files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Only the 10 named files. No content rewrite beyond structural alignment (dividers, header casing, intro/Section-1 de-duplication) — technical content stays intact.

**Dependencies**: None beyond the packet's existing shipped state.

**Deliverables**: 10 reference files structurally aligned with `sk-create-skill/assets/skill/skill-reference-template.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator named 10 reference files that don't align with `sk-create-skill`'s literal reference template: missing `---` dividers between numbered sections, and inconsistent layout structure. An orchestrator-run audit against the template's own body plus 2 already-conformant sibling files (`type-architecture.md`, `foundations/README.md`) confirmed the defect is real but uneven — 4 files have clear missing-divider and lowercase-header defects; the other 6 pass both of those checks on inspection and need a closer per-template audit rather than an assumed fix.

### Purpose

Bring all 10 files to full structural alignment: a `---` divider immediately before every numbered `## N. NAME` section, ALL-CAPS section titles, and no duplicated content between the H1 intro and Section 1 — without rewriting the technical content those sections carry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `references/primitives/primitive-icons.md` — 14 sections, ~12 missing dividers, lowercase-style titles.
- `references/import-export/export.md` — 7 sections, 0 dividers, lowercase-style titles.
- `references/import-export/import-mermaid.md` — 11 sections, ~8 missing dividers, lowercase-style titles.
- `references/import-export/import-drawio.md` — same defect class as import-mermaid.md.
- `references/primitives/primitive-annotation.md`, `primitive-sketchy.md`, `primitive-terminal.md` — divider/casing already pass; audit for template-fidelity issues beyond those two checks.
- `references/foundations/style-guide.md`, `output-spec.md`, `onboarding.md` — same: divider/casing already pass; audit for deeper issues.

### Out of Scope

- `references/types/*.md` — not named by the operator; a spot-check found the same divider-omission pattern there too, but re-opening that directory is a separate decision, not silently bundled into this phase.
- Any content/wording change unrelated to structural alignment.
- `assets/` or `scripts/` — not part of this phase.

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `references/primitives/primitive-icons.md` | Edit | Insert dividers, fix header casing |
| `references/import-export/export.md` | Edit | Insert dividers, fix header casing |
| `references/import-export/import-mermaid.md` | Edit | Insert dividers, fix header casing |
| `references/import-export/import-drawio.md` | Edit | Insert dividers, fix header casing |
| `references/primitives/primitive-annotation.md` | Edit (if audit finds a defect) | Template-fidelity audit |
| `references/primitives/primitive-sketchy.md` | Edit (if audit finds a defect) | Template-fidelity audit |
| `references/primitives/primitive-terminal.md` | Edit (if audit finds a defect) | Template-fidelity audit |
| `references/foundations/style-guide.md` | Edit (if audit finds a defect) | Template-fidelity audit |
| `references/foundations/output-spec.md` | Edit (if audit finds a defect) | Template-fidelity audit |
| `references/foundations/onboarding.md` | Edit (if audit finds a defect) | Template-fidelity audit |
| `011-reference-template-alignment/` | Create | This phase's spec-folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every numbered `## N.` section in all 10 files is preceded by a `---` divider. | `grep -c "^---$"` per file equals section count (frontmatter close excluded). |
| REQ-002 | Every numbered section title is ALL-CAPS, matching the template and both cross-check files. | Visual + grep confirmation across all 10. |
| REQ-003 | No technical content is lost or altered beyond structural formatting. | Diff review confirms only header/divider lines changed for the 4 confirmed-broken files. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The 6 already-passing files are audited for deeper template-fidelity issues (intro/Section-1 duplication, frontmatter completeness) rather than left unexamined. | Explicit per-file audit note recorded, whether or not a fix was needed. |
| REQ-005 | `validate_document.py --type reference` passes for all 10 files. | Command output captured per file. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10/10 files structurally aligned with the template (dividers + casing).
- **SC-002**: 0 technical content regressions — confirmed by diff review.
- **SC-003**: 10/10 pass `validate_document.py --type reference`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dispatched model could over-fix an already-conformant file, introducing unnecessary churn. | Medium | Explicit instruction to fix only genuine defects; every claimed fix independently re-verified against the file's actual pre/post diff before recording. |
| Dependency | Template ground truth (`skill-reference-template.md`) and 2 cross-check files | High | Already read in full and confirmed as the audit baseline before any dispatch. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope and audit baseline are resolved above.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Packet root: `../spec.md`
- Template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md`
