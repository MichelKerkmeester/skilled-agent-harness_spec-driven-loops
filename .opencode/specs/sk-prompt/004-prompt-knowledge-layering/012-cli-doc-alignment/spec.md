---
title: "Feature Specification: cli-doc-alignment"
description: "Align the five cli-* prompt_quality_card.md, cli-devin's confidence-scoring-rubric.md, and three cli-opencode references to the sk-doc asset/reference templates, scrubbing ephemeral spec-phase pointers."
trigger_phrases:
  - "cli doc alignment"
  - "prompt quality card template"
  - "cli-opencode reference alignment"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/012-cli-doc-alignment"
    last_updated_at: "2026-06-03T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Aligned 9 cli-* docs to sk-doc templates"
    next_safe_action: "Validate then commit phase 012"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-opencode/references/permissions-matrix.md"
      - ".opencode/skills/cli-devin/assets/confidence-scoring-rubric.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli-doc-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 011-model-profiles-and-benchmark-merge |
| **Successor** | 013-card-relocation-and-guard |
| **Handoff Criteria** | 9 cli-* docs conform to the sk-doc asset/reference templates; ephemeral spec refs scrubbed; cards still delegate the framework/CLEAR tables; guard green; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 12 of spec 130 aligns the executor-side docs the user listed to the sk-doc templates and
scrubs the ephemeral spec-phase pointers they carried. The card pointers to the canonical card are
left untouched here; phase 013 repoints them when the card moves.

**Scope boundary**: the 5 cli-* `assets/prompt_quality_card.md`, `cli-devin/assets/confidence-scoring-rubric.md`,
and `cli-opencode/references/{permissions-matrix,destructive_scope_violations,context-budget}.md`.
No hub docs (phases 010-011), no card move (phase 013).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-* cards opened with `## 1. Shared Layer` (Title-Case, no `## 1. OVERVIEW`); the rubric and
the three cli-opencode references used unnumbered or non-OVERVIEW-first headers and carried
ephemeral spec-phase pointers (`Phase 003/004`, ADR ids, spec-folder paths).

### Purpose
Make the executor doc surface conform to the sk-doc asset/reference templates (OVERVIEW-first,
ALL-CAPS numbered sections, RELATED RESOURCES last) and durable (no ephemeral spec pointers), while
the cards keep delegating the framework/CLEAR tables to the canonical card.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 5 `cli-*/assets/prompt_quality_card.md` → asset template (OVERVIEW + ALL-CAPS + RELATED RESOURCES last).
- `cli-devin/assets/confidence-scoring-rubric.md` → asset template + `Phase 004` scrub.
- `cli-opencode/references/{permissions-matrix,destructive_scope_violations,context-budget}.md` → reference template + ephemeral-ref scrub.
- Version bumps + changelogs for the 5 touched cli skills.

### Out of Scope
- Hub SKILL.md/README/profiles (phases 010-011).
- The card relocation + guard rewrite (phase 013); the canonical-card pointer stays as-is here.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
None.

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Asset/reference template conformance | All 9 docs open with `## 1. OVERVIEW`; ALL-CAPS numbered sections |
| REQ-002 | Cards still delegate | Guard green; no framework/CLEAR table inlined |
| REQ-003 | Ephemeral refs scrubbed | No `Phase NNN`/ADR/spec-folder pointers in the 9 docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: all 9 docs have `## 1. OVERVIEW`; cards have RELATED RESOURCES last.
- **SC-002**: card-sync guard green.
- **SC-003**: no ephemeral spec refs in the 9 docs; `validate.sh --recursive --strict` exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Agent inlines a framework/CLEAR table while restructuring | Med | Guard CHECK 1 verifies; confirmed green |
| Risk | Ephemeral-scrub alters technical content | Low | Agents preserved tables/examples verbatim; verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Canonical-card pointer repoint deferred to phase 013.
<!-- /ANCHOR:questions -->
