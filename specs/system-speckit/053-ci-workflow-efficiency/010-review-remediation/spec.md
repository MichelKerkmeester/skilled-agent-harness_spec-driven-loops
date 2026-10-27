---
title: "Feature Specification: Phase 10: review-remediation"
description: "Apply the confirmed findings of the packet deep review: the over-broad CI routing keyword, the missing workflow-path keyword, the sk-code-ci rule gaps, the doctor ci contract gaps and the stale phase records."
trigger_phrases:
  - "review remediation"
  - "phase 10 review remediation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: review-remediation

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
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 11 |
| **Predecessor** | 009-doctor-ci-review-wiring |
| **Successor** | 011-ci-health-followups |
| **Handoff Criteria** | The surface-hint suite prints `fail 0`, the router-sync and drift guards pass, and the packet passes recursive strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the CI workflow efficiency packet. It applies the confirmed findings of `../review/review-report.md`.

**Scope Boundary**: the sk-code hub routing files, the `sk-code-ci` packet, the `/doctor:ci` router and its contract, and the phase records of this packet. The `sk-code-quality` and `sk-code-review` packets are out of scope.

**Dependencies**:
- `../review/review-report.md` (5 P1 and 16 P2 confirmed findings)

**Deliverables**:
- The routing fix and its regenerated artifacts
- The `sk-code-ci` rule and template fixes
- The `/doctor:ci` contract fixes
- The reconciled phase records

<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review found a routing regression: the bare keyword `concurrency group` sent a worker-pool prompt to the CI surface and failed the guard test written to prevent it. A review that named only a `.github/workflows/` path did not load the CI rules. The `sk-code-ci` rules contradicted themselves on what a switched-off required check does, and several phase records described a tree that no longer exists.

### Purpose
Every confirmed finding the operator did not hold back is fixed, and each check the findings name passes again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the bare `concurrency group` keyword and add `.github/workflows/` to the CI routing vocabulary, then regenerate the derived artifacts.
- Fix the `sk-code-ci` rule gaps (`persist-credentials`, skip semantics, a stale line citation) and the two templates.
- Fix the `/doctor:ci` argument hint, the doctor contract operations and a stale WHY comment in `ci-report.cjs`.
- Reconcile the parent and the 002, 003, 004, 005, 006, 007, 008 and 009 records with the tree.

### Out of Scope
- Phase 004 T072 to T074 and phase 007 T100 to T102 - they are time-gated and run later.
- `sk-code-quality/` and `sk-code-review/` - another worker owns them in this round.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/ROUTER.md`, `hub-router.json`, `graph-metadata.json`, `sk-code-ci/SKILL.md` | Modify | The CI routing vocabulary |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | The compiled fallback graph |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored copy | Regenerate | The sk-code policy hash |
| `.hermes/skills/sk-code-ci/SKILL.md` | Regenerate | The Hermes copy |
| `.skilled/skills/sk-code/sk-code-ci/references/{job-shape-rules,protected-set,trigger-and-filter-rules}.md`, `assets/{workflow-template,job-block-template}.yml` | Modify | Rule and template fixes |
| `.skilled/skills/sk-code/SKILL.md`, `hub-router.json`, `sk-code-ci/SKILL.md` | Modify | The surface contract text (operator-delegated decision, 2026-10-25) |
| `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/` (three files), `.skilled/bin/tests/compiled-route-admission.test.cjs` | Create, Modify | Three single-route replays and the corpus pin |
| `.skilled/commands/doctor/ci.md`, `scripts/ci-report.cjs`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Command contract and comment fixes |
| `.github/workflows/routing-registry-drift.yml` | Modify | The routing-suite comment states what the step does now |
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modify | The config comment gives the real reason it avoids a vitest import |
| `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml`, `doctor-ci-presentation.txt`, `ci.md`, `scripts/tests/doctor-ci-contract.test.cjs` | Modify | The master-switch refusal names its reason, and the test holds the two copies equal |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modify | Exclude the ClickUp placeholder tree, which declares no dependencies, so the provisioning completeness test passes |
| `specs/system-speckit/053-ci-workflow-efficiency/{002,003,004}-*/` records | Modify, Create | The 003 criterion text, the 002 band remainder with its evidence file, the 004 cache entry note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A non-CI prompt that says "concurrency group" stays off the CI surface | `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` prints `pass 8` and `fail 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A review that names only a `.github/workflows/` path bundles the CI surface | The compiled route for `review .github/workflows/spec-kit-check.yml` is `surfaceBundle` with `sk-code-review` then `sk-code-ci` |
| REQ-003 | The derived routing artifacts match their sources | `verify-router-sync.cjs` 5 of 5, `compiled-route-sync.cjs --check` clean, `skill-graph-freshness.cjs --strict` exit `0` |
| REQ-004 | Every phase record matches the tree | `validate.sh --strict --recursive` on the packet prints `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The surface-hint suite and the serial compiled-route suites pass with `fail 0`.
- **SC-002**: The parent phase map equals each child's Status line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A parallel worker editing `sk-code-quality/` and `sk-code-review/` | Med | Regenerate once at the end and leave their Hermes copy for the orchestrator |
| Risk | Dropping the bare keyword makes a terse CI edit request defer | Low | `actions concurrency group` and the path keyword still score the surface |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The changelog finding (R4-P2-001) closed on the operator's call to remove the dead pointer from every phase spec.
<!-- /ANCHOR:questions -->

---
