---
title: "Feature Specification: Phase 20: fix-admission-baseline-and-block-ci"
description: "Fix the three engine drifts and the stale gold entry the admission baseline found, then make the CI admission step blocking."
trigger_phrases:
  - "admission baseline fix"
  - "admission ci blocking"
  - "compiled engine drift fix"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 20: fix-admission-baseline-and-block-ci

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-19 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-refresh-rollback-snapshots-on-re-mint |
| **Successor** | None |
| **Handoff Criteria** | The admission check passes for every admitted hub and the CI step blocks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the skilled source-root migration specification.

**Scope Boundary**: The four baseline failures and the CI step. Coverage gaps stay a report; they bind only new hubs.

**Dependencies**:
- Phase 18 found this, and the operator chose to plan it on 2026-09-19.

**Deliverables**:
- See section 3.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The admission baseline in phase 17 found four failures among the admitted hubs. system-deep-loop's compiled engine routes a bare 'benchmark a model' prompt to the command-bridge lane `model-benchmark`, which its gold forbids, and answers a `research:` mode hint with `clarify`. sk-doc's engine defers on a natural-language quality-review holdout. And one sk-doc scenario still expects the dissolved `sk-design-diagram`. The CI step stays warn-only until these are fixed, which the operator chose on 2026-09-19.

### Purpose
Every admitted hub passes the admission check, and CI blocks any new drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- system-deep-loop's shadow-child compiler or router: keep command-bridge lanes out of bare prompts, and honor an explicit mode hint.
- sk-doc's shadow-child compiler: route the natural-language quality-review holdout.
- The stale gold entry in `sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md`.
- Re-mint the affected manifests, and switch the CI step to blocking.

### Out of Scope
- Coverage gaps in the admitted hubs - they are reported, not enforced.
- New gold for uncovered modes - authoring work for each hub's owner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/*` | Modify | Command-bridge guard and mode hints |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/lib/*` | Modify | Holdout routing |
| `.skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md` | Modify | Current gold |
| `.github/workflows/routing-registry-drift.yml` | Modify | Drop `--warn-only` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `compiled-route-admission.cjs --all` reports `pass` for every admitted hub. |
| REQ-002 | No scenario that passes today regresses. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The affected manifests are re-minted and promoted, and the route guard reports every hub fresh. |
| REQ-004 | The CI step blocks. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The admission check passes for all five hubs.
- **SC-002**: A deliberately broken gold entry fails CI.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A compiler change moves routes the gold does not cover | High | The full playbook, parity and admission suites run before and after |
| Risk | A blocking step fails an unrelated push | Med | It blocks only after the baseline is clean |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The CI step stays under a minute.

### Security
- **NFR-S01**: No private home-derived path in any tracked file.

### Reliability
- **NFR-R01**: A blocking step fails only on real drift or stale gold.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Multi-mode gold keeps its must-include rule.

### Error Scenarios
- An engine error fails the hub as broken.

### State Transitions
- Promotion runs through the existing sync tool.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two compilers, one gold file, one workflow |
| Risk | 14/25 | Live routing for two admitted hubs |
| Research | 8/20 | Each drift needs its cause in the compiler |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should mode hints be honored in every hub's compiler, or only where gold asks for them?
<!-- /ANCHOR:questions -->

---
