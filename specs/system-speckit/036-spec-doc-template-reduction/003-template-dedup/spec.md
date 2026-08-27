---
title: "Feature Specification: Phase 3: template-dedup [template:level-1/spec.md]"
description: "After packet 033, decision-record.md.tmpl still duplicates its entire ADR skeleton L3≡L3+ (138 identical lines) and research.md.tmpl carries a 948-line domain-specific widget taxonomy. Dedup them via shared-core+gated-addenda, proving the byte-identical render gate cheaply before riskier changes."
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
    packet_pointer: "036-spec-doc-template-reduction/003-template-dedup"
    last_updated_at: "2026-08-26T07:00:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored dedup design from 001-analysis research (R1 + R5)"
    next_safe_action: "Run the decision-record empty-diff dedup first to prove the golden-snapshot pipeline"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl"
      - ".opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl"
      - ".opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-036-003-template-dedup"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Can research taxonomy neutralization reuse content-router fallback anchors to avoid versioning churn?"
    answered_questions:
      - "Is decision-record L3 byte-identical to L3+? (Yes — 138 identical lines)"
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
| **Handoff Criteria** | decision-record dedup lands with an EMPTY golden-snapshot diff; research taxonomy neutralization is either landed with a reviewed re-baseline or explicitly deferred; both dist trees rebuilt. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** — the dedup work packet 033 left unfinished, and the cheapest proving step for the byte-identical render pipeline. Grounded in 001-analysis research recommendations R1 (dedup) and R5 (research taxonomy).

**Scope Boundary**: `decision-record.md.tmpl` (empty-diff dedup) and `research.md.tmpl` (domain-neutralization, higher risk). The checklist dedup is intentionally NOT here — the phase-2 merge restructures checklist away, subsuming it.

**Dependencies**:
- The golden-snapshot harness and ADR-004 byte-identical gate.
- Content-router coupling for `research.md.tmpl` anchors (research_finding → research/research.md).

**Deliverables**:
- Deduplicated `decision-record.md.tmpl` (shared-core + gated-addenda), proven empty-diff.
- Domain-neutral `research.md.tmpl` skeleton OR a documented deferral decision.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`decision-record.md.tmpl` duplicates its whole ADR skeleton across the L3 and L3+ blocks — 138 byte-identical lines differing only in frontmatter. `research.md.tmpl` is 948 lines whose taxonomy is a front-end-form-widget tutorial (Markup/CSS/Spam/SPA), which every L3+/phase render dumps regardless of the investigation's domain. Both are pure maintenance cost and context tax.

### Purpose
Collapse the decision-record duplication with a proven empty-diff refactor, and replace the research widget taxonomy with a domain-neutral skeleton — reducing source and rendered bytes without changing any render for unchanged levels.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `decision-record.md.tmpl`: fold L3 and L3+ ADR bodies into one shared-core block with gated addenda; must render byte-identically (empty diff).
- `research.md.tmpl`: replace the fixed widget taxonomy with a domain-neutral section skeleton, preserving the anchor set that content-router depends on.

### Out of Scope
- Checklist dedup — subsumed by the phase-2 merge.
- `_memory.continuity` consolidation (phase 004) and comment relocation (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| templates/manifest/decision-record.md.tmpl | Modify | Shared-core + gated-addenda; empty-diff render |
| templates/manifest/research.md.tmpl | Modify | Domain-neutral skeleton; preserve required anchors |
| scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap | Modify | Empty diff for decision-record; reviewed re-baseline only for research renders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | decision-record dedup renders byte-identically | **Given** the golden-snapshot suite, every decision-record level render produces an EMPTY diff after the refactor |
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

- **SC-001**: decision-record.md.tmpl deduplicated with an empty golden-snapshot diff (the pipeline-proving win).
- **SC-002**: research.md.tmpl either domain-neutralized (reviewed re-baseline) or deferred with a recorded decision.
- **SC-003**: Both dist trees rebuilt; `validate.sh --strict` clean on representative scaffolds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | research.md.tmpl anchor change breaks content-router | Medium-High | Keep the research_finding anchor set; neutralize prose only, or defer behind a spike |
| Risk | Snapshot `-u` without diff review | Medium | Reviewed diff is the gate; decision-record must be empty-diff |
| Dependency | Golden-snapshot + dist rebuild pipeline | Blocks completion claim | Prove empty-diff on decision-record first as the pipeline smoke test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Can the research taxonomy neutralization reuse content-router's fallback anchor behavior to avoid a versioned anchor change? (Needs a dedicated spike before committing R5.)
<!-- /ANCHOR:questions -->

---
