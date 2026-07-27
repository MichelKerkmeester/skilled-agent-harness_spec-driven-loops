---
title: "Feature Specification: design-interface references conformance"
description: "Audit all 29 files under design-interface/references/ (aesthetics, design-grounding, design-process, foundations incl. color/layout/type, mcp-tooling) against skill-reference-template.md."
trigger_phrases:
  - "design-interface references conformance"
  - "reference template audit"
  - "aesthetics foundations mcp-tooling references"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned spec with confirmed and corrected defect findings"
    next_safe_action: "Run exhaustive per-file audit across all 29 reference files"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: design-interface references conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `001-packet-root` |
| **Successor** | `003-assets` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`references/` holds 29 files (5 in `aesthetics/`, 2 in `design-grounding/`, 10 in `design-process/`, 10 in `foundations/` including `color/`, `layout/`, `type/` subfolders, 2 in `mcp-tooling/`), all governed by `skill-reference-template.md`. A sampling pass found one confirmed structural defect, one confirmed size/naming concern, and one dispatcher-cited defect that did **not** reproduce on direct read — recorded here so the exhaustive audit doesn't re-litigate it.

### Purpose
Read every one of the 29 files in full against `skill-reference-template.md` §1 (OVERVIEW requirement), §2 (document structure), §3 (200-line creation bar), and the frontmatter rule in §84 (5-field block), then fix confirmed deviations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 29 files under `references/aesthetics/`, `references/design-grounding/`, `references/design-process/`, `references/foundations/` (+ `color/`, `layout/`, `type/`), `references/mcp-tooling/`.

### Out of Scope
- `assets/`, `procedures/`, `corpus/`, `scripts/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/` — each is its own sibling child.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/mcp-tooling/refero-tools.md` | Modify | Confirmed: §1 header is `## 1. WHAT STAYS SK-DESIGN'S OWN (JUDGMENT SIDE)`, not `## 1. OVERVIEW` (skill-reference-template.md §1 requires the OVERVIEW header). File is 37 lines, well under the 200-line reference-worthiness bar. |
| `references/aesthetics/README.md` | Audit | Confirmed: 45 lines, has full 5-field frontmatter (contradicts the brief's premise it is exempt), is named `README.md` rather than a kebab-case topic name, and is under the 200-line bar — flag as a consolidation candidate into `aesthetics/` sibling files or the parent index pattern, not an automatic rename. |
| `references/design-process/resource-loading-notes.md` | Audit only | Dispatcher claimed numbered H2s are sentence-case; direct read shows all four H2s (`1. OVERVIEW`, `2. LOAD-AND-PROVE LOOP...`, `3. CITATION REQUIRED...`, `4. REFERENCE LOADING DISCIPLINE`) are already ALL-CAPS. This defect does NOT reproduce. Confirmed separate issue: 36 lines, under the 200-line bar. |
| `references/foundations/corpus-map.md` | Audit only | 51 lines, under the 200-line bar; flag as a consolidation candidate, not an automatic deletion (per dispatcher note). |
| Remaining 25 files | Audit | Sampled as conformant (`design-process/design-principles.md`, `design-process/brief-to-dials.md`, `foundations/color/oklch-workflow.md`, `aesthetics/brutalist.md`, `design-grounding/design-inventory.md`) or not yet read in full — exhaustive pass required before claiming conformant. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 29 files read in full against `skill-reference-template.md` §1-§3 | Per-file conformant/deviation table recorded, no file skipped |
| REQ-002 | `refero-tools.md` given a proper `## 1. OVERVIEW` section or a documented exception | Section present or exception approved by operator |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Resolve the three sub-200-line files (`refero-tools.md`, `aesthetics/README.md`, `resource-loading-notes.md`, `corpus-map.md`) — consolidate, or document why each earns standalone-reference status despite being under the bar | Decision recorded per file with rationale |
| REQ-004 | Full 29-file inventory rechecked against a fresh directory listing before closing this child | No file added/removed mid-audit without being reflected in the verdict table |
| REQ-005 | Cross-reference integrity confirmed via `rg` after any consolidation, rename, or merge | Zero dangling relative links from `SKILL.md` or sibling reference files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 29 files carry a valid 5-field frontmatter block and a template-conformant `## 1. OVERVIEW` (or equivalent required) section.
- **SC-002**: Every sub-200-line file has an explicit disposition (keep as exception / consolidate / rename) rather than being left silently non-conformant.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Consolidating `aesthetics/README.md` could break relative links from `SKILL.md` or sibling references | Broken cross-references | Grep for `aesthetics/README` before any move/merge |
| Risk | Treating the dispatcher's "sentence-case" claim as true without verification would cause an unnecessary edit | Wasted effort, potential introduction of a real defect where none existed | Already verified false on read; recorded in Files to Change above |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `refero-tools.md`, `aesthetics/README.md`, `resource-loading-notes.md`, and `corpus-map.md` be consolidated into larger sibling files, or kept standalone with a documented under-200-line exception (e.g., they are intentionally thin pointers)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing template**: `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`
