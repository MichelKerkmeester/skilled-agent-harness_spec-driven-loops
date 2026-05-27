---
title: "Feature Specification: Regression-Harness Alias-Awareness & Stale Test Path"
description: "Two out-of-scope P1 follow-ups surfaced during phase 002: the regression harnesses match gold labels strictly (deep-* alias drift), and lane-weight-sweep.vitest.ts anchors on a renamed 026 packet path."
trigger_phrases:
  - "harness alias awareness"
  - "regression harness alias drift"
  - "lane weight sweep stale path"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/007-harness-alias-and-stale-path"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "Implemented and verified harness alias-awareness plus stale-path fix"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-weight-sweep.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Regression-Harness Alias-Awareness & Stale Test Path

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-27 |
| **Completed** | 2026-05-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-playbook-vitest-path-fix |
| **Successor** | None |
| **Handoff Criteria** | Both regression harnesses match gold labels alias-aware; lane-weight-sweep test anchors on a stable marker; full suites green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the finding-remediation packet — two P1 defects surfaced while implementing phase 002 (scorer P0 routing), deliberately deferred so they did not expand the P0 scope.

**Scope Boundary**: The regression/parity harnesses' gold-matching layer and one stale test path. No scorer behavior change.

**Dependencies**:
- Phase 001 (F1a) established the alias-resolution helper (`aliases.ts skillMatchesAlias`) reused here.

**Deliverables**:
- Alias-aware gold matching in both regression harnesses.
- Corrected (or marker-anchored) workspace-root resolution in the lane-weight-sweep test.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The regression harnesses (`skill_advisor_regression.py` and the TS `evaluateRegressionCases` in `advisor-validate.ts`) match gold labels by strict string equality, so fixtures/corpus rows labelled `sk-deep-research` / `sk-deep-review` / `sk-deep-agent-improvement` fail against the live graph IDs `deep-research` / `deep-review` / `deep-agent-improvement`. The phase 001 (F1a) alias fix made `advisor_validate` alias-aware but did not reach these harnesses. Separately, `tests/scorer/lane-weight-sweep.vitest.ts` resolves the workspace root by walking for a renamed 026 packet path that no longer exists after the 026 reorg, so the suite throws before any scoring.

### Purpose
Make the regression/parity harnesses count alias-equivalent skill IDs as correct, and re-anchor the lane-weight-sweep test on a stable marker, so the P1 alias rows pass and the full TS suite runs clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Alias-aware gold matching in `skill_advisor_regression.py` (Python harness).
- Alias-aware gold matching in `evaluateRegressionCases` / corpus parity counting (TS harness).
- Fix the stale workspace-root anchor in `lane-weight-sweep.vitest.ts`.

### Out of Scope
- Any scorer routing/abstention behavior change - that shipped in phase 002.
- Re-labelling the fixtures/corpus to the live IDs - alias resolution is preferred over editing ground-truth labels.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../mcp_server/scripts/skill_advisor_regression.py` | Modify | Resolve gold + top through the alias map before comparison |
| `.../mcp_server/handlers/advisor-validate.ts` | Modify | Apply `skillMatchesAlias` in `evaluateRegressionCases`/corpus counting |
| `.../mcp_server/tests/scorer/lane-weight-sweep.vitest.ts` | Modify | Anchor workspace root on a stable repo marker, not a renamed packet path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Harness gold matching is alias-aware | `deep-research` top satisfies an `sk-deep-research` gold label in both harnesses |
| REQ-002 | lane-weight-sweep suite runs | `lane-weight-sweep.vitest.ts` resolves the workspace root and executes its assertions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No new regressions | P0 stays 12/12 in both scorers; full TS suite green; Python unit suite green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-* alias rows pass once the scorer produces a top. Python: all 7 named rows pass (P1-RESEARCH-001/002, P1-REVIEW-003/005, P1-PHRASE-002/003/005). TS: 5 pass; P1-PHRASE-002/005 still fail because the TS scorer ABSTAINS (confidence < 0.8), not from alias drift — a scorer-confidence parity gap this phase excludes (no scorer changes). Done as scoped.
- **SC-002**: `npm test` reports zero failed suites (no remaining `lane-weight-sweep` path failure). Met: 66/66 files pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Alias map masks a real mis-route | Med | Resolve only through the published alias groups; do not collapse unrelated IDs |
| Risk | New workspace-root anchor is itself fragile | Low | Anchor on a top-level stable marker (repo root file), not a packet path |
| Dependency | `aliases.ts` alias groups | Internal | Already shipped in phase 001 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolve aliases in the harness layer, or normalize the fixture labels to the live IDs? (lean: harness-layer alias resolution, matching the F1a approach)
- Which stable marker should anchor `findWorkspaceRoot` (a repo-root sentinel file vs the skill directory)?
<!-- /ANCHOR:questions -->
