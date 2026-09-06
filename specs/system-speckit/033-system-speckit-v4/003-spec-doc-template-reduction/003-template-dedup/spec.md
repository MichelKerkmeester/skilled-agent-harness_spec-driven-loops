---
title: "Feature Specification: Phase 3: template-dedup"
description: "After packet 033, decision-record.md.tmpl already shares its ADR skeleton between L3 and L3+; only about 24 frontmatter lines remain duplicated, and the L3+ description is garbled. Correct that smaller defect while addressing the 948-line domain-specific research taxonomy."
trigger_phrases:
  - "template dedup"
  - "decision-record duplication"
  - "research template neutralization"
  - "byte-identical render gate"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/003-template-dedup"
    last_updated_at: "2026-08-26T07:00:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored dedup design from 001-analysis research (R1 + R5)"
    next_safe_action: "Correct the decision-record frontmatter and review the focused snapshot diff first"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/addons/decision-record.md.tmpl"
      - ".opencode/skills/system-spec-kit/templates/addons/research.md.tmpl"
      - ".opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-036-003-template-dedup"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Can research taxonomy neutralization reuse content-router fallback anchors to avoid versioning churn?"
    answered_questions:
      - "Is the decision-record skeleton duplicated between L3 and L3+? (No. The body is shared; only about 24 frontmatter lines are duplicated, and the L3+ description is garbled.)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: template-dedup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-tasks-checklist-merge |
| **Successor** | 004-continuity-single-source |
| **Handoff Criteria** | decision-record frontmatter is corrected with a reviewed snapshot diff limited to the intended metadata change; research taxonomy neutralization is either landed with a reviewed re-baseline or explicitly deferred; both dist trees rebuilt. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** — the dedup work packet 033 left unfinished, and the cheapest proving step for the byte-identical render pipeline. Grounded in 001-analysis research recommendations R1 (dedup) and R5 (research taxonomy).

**Scope Boundary**: `decision-record.md.tmpl` (frontmatter correction with shared-body preservation) and `research.md.tmpl` (domain-neutralization, higher risk). The checklist dedup is intentionally NOT here — the phase-2 merge restructures checklist away, subsuming it.

**Dependencies**:
- The golden-snapshot harness and ADR-004 byte-identical gate.
- Content-router coupling for `research.md.tmpl` anchors (research_finding → research/research.md).

**Deliverables**:
- Corrected `decision-record.md.tmpl` frontmatter with the shared ADR body preserved and the focused snapshot diff reviewed.
- Domain-neutral `research.md.tmpl` skeleton OR a documented deferral decision.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`decision-record.md.tmpl` already shares its ADR skeleton across the L3 and L3+ blocks. The remaining defect is about 24 duplicated frontmatter lines plus a garbled L3+ description. `research.md.tmpl` is 948 lines whose taxonomy is a front-end-form-widget tutorial (Markup/CSS/Spam/SPA), which every L3+/phase render dumps regardless of the investigation's domain. These defects create maintenance cost and context tax.

### Purpose
Correct the decision-record frontmatter while preserving its shared ADR body, and replace the research widget taxonomy with a domain-neutral skeleton. Reduce source and rendered bytes while limiting output changes to the intended metadata and taxonomy updates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `decision-record.md.tmpl`: correct the duplicated frontmatter and garbled L3+ description; preserve the already-shared ADR body and review the focused render diff.
- `research.md.tmpl`: replace the fixed widget taxonomy with a domain-neutral section skeleton, preserving the anchor set that content-router depends on.

### Out of Scope
- Checklist dedup — subsumed by the phase-2 merge.
- `_memory.continuity` consolidation (phase 004) and comment relocation (phase 005).

Research taxonomy neutralization is deferred to a separately reviewed change because the widget taxonomy couples to `research_finding` routing anchors; changing it in this phase could break content routing without a dedicated route review and re-baselined snapshots.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| templates/addons/decision-record.md.tmpl | Modify | Correct duplicated frontmatter and garbled L3+ description; preserve the shared ADR body |
| templates/addons/research.md.tmpl | Modify | Domain-neutral skeleton; preserve required anchors |
| scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap | Modify | Empty diff for decision-record; reviewed re-baseline only for research renders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | decision-record frontmatter correction preserves the shared ADR body | **Given** the golden-snapshot suite, L3 and L3+ retain the same ADR body and the reviewed snapshot differences contain only the intended frontmatter correction |
| REQ-002 | research.md.tmpl preserves its content-router anchor set | **Given** the neutralized template, the research_finding anchor targets still resolve; content-router routing is unchanged |
| REQ-003 | Both dist trees rebuilt; strict validation clean | **Given** a rebuilt scripts/dist + mcp-server/dist, `validate.sh --strict` passes on fresh L3/L3+ scaffolds |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Research taxonomy neutralization decision recorded | **Given** the content-router coupling risk, this phase either lands the neutralization with a reviewed re-baseline OR records an explicit deferral with rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: decision-record.md.tmpl keeps one shared ADR body, removes the duplicated frontmatter, and has a reviewed snapshot diff limited to the intended metadata correction.
- **SC-002**: research.md.tmpl either domain-neutralized (reviewed re-baseline) or deferred with a recorded decision.
- **SC-003**: Both dist trees rebuilt; `validate.sh --strict` clean on representative scaffolds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | research.md.tmpl anchor change breaks content-router | Medium-High | Keep the research_finding anchor set; neutralize prose only, or defer behind a spike |
| Risk | Snapshot `-u` without diff review | Medium | Reviewed diff is the gate; decision-record changes must remain limited to the intended frontmatter correction |
| Dependency | Golden-snapshot + dist rebuild pipeline | Blocks completion claim | Review the focused decision-record diff first as the pipeline smoke test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Can the research taxonomy neutralization reuse content-router's fallback anchor behavior to avoid a versioned anchor change? (Needs a dedicated spike before committing R5.)
<!-- /ANCHOR:questions -->

---
