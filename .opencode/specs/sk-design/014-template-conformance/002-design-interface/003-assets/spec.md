---
title: "Feature Specification: design-interface assets conformance"
description: "Audit the 3 files under design-interface/assets/ against skill-asset-template.md; no defects were confirmed in the sampling pass."
trigger_phrases:
  - "design-interface assets conformance"
  - "asset template audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/003-assets"
    last_updated_at: "2026-07-27T16:18:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned spec; no confirmed defects yet, exhaustive audit not run"
    next_safe_action: "Audit all 3 asset files against skill-asset-template.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/assets/"
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

# Feature Specification: design-interface assets conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `002-references` |
| **Successor** | `004-procedures` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`assets/` holds 3 files (`interface-preflight-card.md`, 210 lines; `foundations/contrast-pair-inventory.md`, 55 lines; `foundations/token-starter.md`, 147 lines), governed by `skill-asset-template.md`. No defect was confirmed for this folder in the program-level sampling pass — this is unlike `references/` and `manual-testing-playbook/`, where specific issues were already caught. That absence of a finding is not the same as confirmed conformance: none of the three files was read against the template section-by-section.

### Purpose
Perform the exhaustive per-file audit that was skipped at sampling time, against `skill-asset-template.md` §2 (asset file types), §3 (document structure), §4 (standard asset structure), and §10 (asset file checklist). Fix anything found; if nothing is found, record "conformant, no changes" with evidence rather than leaving the question open.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `assets/interface-preflight-card.md`
- `assets/foundations/contrast-pair-inventory.md`
- `assets/foundations/token-starter.md`

### Out of Scope
- `references/`, `procedures/`, `corpus/`, `scripts/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/` — sibling children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `assets/interface-preflight-card.md` | Audit | Not yet checked against §3/§4/§10; 210 lines |
| `assets/foundations/contrast-pair-inventory.md` | Audit | Not yet checked; 55 lines |
| `assets/foundations/token-starter.md` | Audit | Not yet checked; 147 lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 3 files read in full against `skill-asset-template.md` §2-§4, §10 | Per-file conformant/deviation verdict recorded with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | If no deviations found, record "conformant, no changes" explicitly | Recorded in `implementation-summary.md` with per-file evidence, not just asserted |
| REQ-003 | Confirm all 3 files carry a valid 5-field frontmatter block per `skill-asset-template.md` | Verdict recorded per file |
| REQ-004 | Confirm no other file exists under `assets/` beyond the 3 accounted for in scope | Fresh `find assets -type f` matches the scope table |
| REQ-005 | Cross-references from `SKILL.md`, `procedures/`, or `feature-catalog/` into these 3 asset files still resolve | `rg` spot-check |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 asset files have an explicit, evidenced conformance verdict — never left as "assumed fine because nothing was flagged."
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Treating "no known defects cited" as "conformant" without reading the files | A real defect goes unfixed | Exhaustive read required before any conformant claim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Resolved**: None remain. The audit found 3 real structural defects (2 files missing the `---` separator before `## 1. OVERVIEW`; 1 file's intro was a 6-sentence paragraph with Section 1 lacking Purpose/Usage subsections) — all 3 fixed. No open questions surfaced.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing template**: `.opencode/skills/sk-doc/create-skill/assets/skill/skill-asset-template.md`
