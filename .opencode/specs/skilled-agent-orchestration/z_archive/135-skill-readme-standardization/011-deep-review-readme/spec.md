---
title: "Feature Specification: deep-review README"
description: "Rewrite the deep-review skill README in the narrative voice, leading with the severity-weighted multi-dimension review loop and its release-readiness verdict."
trigger_phrases:
  - "deep-review readme"
  - "deep-review narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/011-deep-review-readme"
    last_updated_at: "2026-06-07T12:18:52Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped deep-review README via deep-context + dual-draft"
    next_safe_action: "Begin phase 012 (mcp-chrome-devtools README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Version line and brittle counts dropped (feature catalog, gates, scenarios, tool budget all drifted); verdict and severity model verified against review_mode_contract.yaml"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-review README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 24 |
| **Predecessor** | 010-deep-research-readme |
| **Successor** | 012-mcp-chrome-devtools-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11**, the deep-review loop that closes Batch B (deep-*).

**Scope Boundary**: Only `.opencode/skills/deep-review/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `deep-review/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-review README is a tabular reference card with a buried Key Statistics block and no problem-first entry point. That block carries six stale or contradictory facts: a version line ahead of SKILL.md, a stuck threshold that contradicts its own configuration table, an undercounted state-file total, a tool budget off by one, an undercounted feature catalog and a quality-gate count of four against a real legal-stop bundle of nine. It does not lead with the distinctive value: a loop that audits one dimension per pass and ends with a release-readiness verdict.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the severity-weighted multi-dimension loop, the verdict that routes the next command and the convergence gate, with the stale version line and brittle counts dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `deep-review/README.md` to the narrative skeleton; lead with severity findings, the verdict and convergence.

### Out of Scope

- Any change to SKILL.md or the loop's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/README.md` | Modify | Narrative-voice rewrite of the review-loop README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Leads with the distinctive value | QUICK START shows `/deep:start-review-loop:auto "target"` and the five target types; HOW IT WORKS covers the lifecycle, severity/verdict model and convergence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Stale drift dropped | No version line and no brittle counts; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The severity model, the verdicts and the convergence math match SKILL.md, `review_mode_contract.yaml` and the references; all 21 cited paths resolve and no non-existent path is cited.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft cites a deep-research-only path (`guides/capability_matrix.md`, `convergence_graph.md`) that does not exist here | Broken link | Host listed the real tree first and forbade those paths in the authoring prompt; verified all 21 cited paths resolve |
| Risk | Model draft repeats a stale count | Inaccurate README | Template drops version and hard counts; host verified the verdict and severity model against the YAML contract |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The loop, severity model, verdicts and convergence math verified during the gather.
<!-- /ANCHOR:questions -->
