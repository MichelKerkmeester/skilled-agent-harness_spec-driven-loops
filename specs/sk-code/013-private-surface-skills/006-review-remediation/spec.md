---
title: "Feature Specification: Phase 6: review-remediation"
description: "The deep review of this packet confirmed 4 P1 and 19 P2 findings: stale closure records in phases 002 and 003, a commit-guard filter gap, two skills-root readers without the local-* rule, and undocumented private-skill surfaces. This phase applies the confirmed fixes."
trigger_phrases:
  - "review remediation"
  - "phase 6 review remediation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: review-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-leak-and-routing-verification |
| **Successor** | None |
| **Handoff Criteria** | Recursive strict validation of the parent prints `RESULT: PASSED`, the pre-commit harness prints `132 passed, 0 failed`, and every changed script's tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the private surface skills packet. It applies the confirmed findings of `../review/review-report.md`.

**Scope Boundary**: the files the review names, minus the sk-code hub derived routing files and the `sk-code-quality`, `sk-code-review` and `sk-code-ci` folders, which other workers own this round.

**Dependencies**:
- Phases 001 to 005 on `origin/main`
- The review report and its finding registry

**Deliverables**:
- Closed phase 002 and 003 records, a reconciled parent and goal, and six rewritten research citations
- A type-change-aware commit guard, two more skills-root readers with the `local-*` skip, and a test that holds the reader inventory
- Docs for the private-skill gate and the private-root variable
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet shipped, but its own records said phases 002 and 003 were open and the parent was 27 percent done. The guard missed a staged type change, the derived-freshness CI gate and the doctor description audit read `local-*` skills, and no user-facing doc named the private-skill gate or `SPECKIT_PRIVATE_SKILL_ROOTS`.

### Purpose
Every record states what the commits prove, every skills-root reader states its `local-*` rule, and a test fails when a new reader omits one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The four P1 record fixes and the record-side P2 fixes in the parent, the goal and phases 002, 003 and 004
- The guard filter, the derived-freshness gate, the doctor description audit and their tests
- The scanner-inventory test, the hooks README, the advisor README, one advisor catalog leaf, one system-spec-kit playbook scenario, the TSDoc on the containment helper and one speckit asset line

### Out of Scope
- The two sk-code benchmark scenarios that still name deleted Webflow paths. They wait on an operator decision.
- The "Webflow-only standard" line in `sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md`. Another worker owns that folder this round.
- `command-catalog-mirror-check.cjs`, which the new inventory test found and records as open. No finding named it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Private-skill guard reads `--diff-filter=ACMRT` |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Case 81: a tracked `local-*` file that changes type is refused |
| `.skilled/scripts/git-hooks/README.md` | Modify | Eleven blocking sub-gates, the private-skill gate named |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` | Modify | Roots come from `listSkillRoots`, which skips `local-*` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs` | Modify | The gate never checks a stale `local-*` root |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` | Create | Fails on a skills-root reader with no `local-*` rule |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | Modify | Lists the new test |
| `.skilled/commands/doctor/scripts/audit_descriptions.py` | Modify | Skips `local-*` before any probe |
| `.skilled/commands/doctor/scripts/tests/test_audit_descriptions.py` | Modify | A private folder and a private link are not counted |
| `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts` | Modify | TSDoc on the three exports |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | Private Local Skills section |
| `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` | Modify | 44 features, auto-indexing 8 |
| `.skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/private-skill-containment.md` | Create | Catalog leaf for the containment rule |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index row for scenario 484 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/private-skill-commit-guard.md` | Create | Scenario 484, the private-skill gate on the commit path |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | `not_for` no longer names the removed Webflow and motion_dev routes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 002 and 003 closure rows, statuses and checklists match commit ancestry | AC-013, AC-014, AC-026 and AC-027 read `Met` with replayable evidence, and both `spec.md` files read `Complete` |
| REQ-002 | The parent and goal agree that every phase is done | The phase map reads Done for phases 1 to 6, and `completion_pct` is 100 in both |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A staged type change of a `local-*` path is refused | Harness case 81 passes, and the harness prints `132 passed, 0 failed` |
| REQ-004 | The derived-freshness gate and the doctor description audit skip `local-*` | Their new tests pass, and each fails against the old script |
| REQ-005 | A skills-root reader with no rule fails a test | `skill-root-reader-inventory.test.cjs` passes, and fails when a reader loses its entry |
| REQ-006 | The gate and the private-root variable are documented | The README, catalog and playbook validators pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validation of the parent prints `RESULT: PASSED`, and no `SOURCE_TAGS` warning names a file under `research/`.
- **SC-002**: Every test of every changed script passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Other workers edit the sk-code hub this round | A fix there would collide | Those fixes are reported, not applied |
| Risk | The reader inventory test detects readers by variable name | A reader with an unusual name slips past | Every inventoried file is also checked for its rule directly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the public hub benchmark keep its two frontend-site scenarios now that the frontend surface is private?
- Should `command-catalog-mirror-check.cjs` skip `local-*`, as the other doctor readers now do?
<!-- /ANCHOR:questions -->

---
