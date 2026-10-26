---
title: "Feature Specification: Phase 3: review-remediation"
description: "The deep review of the modes research packet returned CONDITIONAL with 2 P1 and 14 P2 findings. This phase applies the confirmed fixes to the research closure documents and to the sk-code-quality and sk-code-review folders."
trigger_phrases:
  - "review remediation"
  - "phase 3 review remediation"
  - "sk-code modes research review fixes"
  - "extension floors sk-code-review"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-review-mode-research |
| **Successor** | None |
| **Handoff Criteria** | Recursive strict validation of the parent prints `RESULT: PASSED`, and the sk-code-review canary and every sk-code-quality and sk-code-review test suite exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-code quality and review modes research packet. It applies the deep review recorded in `../review/review-report.md`.

**Scope Boundary**: the closure documents of phases 1 and 2, the parent `spec.md` and `goal.md`, and the content of `.skilled/skills/sk-code/sk-code-quality/` and `.skilled/skills/sk-code/sk-code-review/`. `sk-code-ci/` is out of scope. A second pass on 2026-10-25, assigned by the orchestrator, adds the sk-code hub routing vocabulary, one compiled-routing scenario field, the exact-header exemption in the alignment verifier and this folder's level.

**Dependencies**:
- Phases 1 and 2 are closed.
- `../review/review-report.md` exists.

**Deliverables**:
- ADR-003 in both research phases, and the acceptance, task and goal rows re-closed against it and against ADR-002.
- The quality playbook root rebuilt from the sk-doc template, the review playbook census fixed, COMPONENT headers on four Python scripts, and an Extension Floors section pinned by the review canary.

**Changelog**:
- The parent packet keeps no `changelog/` folder, so this phase records its changes in `implementation-summary.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep review found that the goal files and acceptance rows of the research phases close against counts and a boundary they no longer state. AC-009 closed as Met against a scope that no ADR recorded. It also found skill-side defects: the quality playbook root fails the playbook validator, the review playbook states two scenario counts, four Python scripts lack the COMPONENT header, and the review mode has no single list of the floors an extension may not lower.

### Purpose

Every closure document in the packet agrees with ADR-002 and ADR-003, and the two modes pass the sk-doc and sk-code-skilled checks the review named.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Review findings S-P1-01, S-P1-02 and S-P2-01 to S-P2-12.
- The Extension Floors section and its pinned-copy assertion that section 7a of the report marks Ready now.
- Removing the phrase "Webflow-only standard" from the quality playbook scenario.
- The quality P0 floor split the operator chose on 2026-10-25, recorded as ADR-001 in `decision-record.md`, which closes research rank 1.
- Second pass: `bash`, `.ts` and `bug` join the `code-skilled-runtime` vocabulary in `hub-router.json`, so a bug fix in a `.ts` file and a bash script question route to `sk-code-skilled` instead of deferring. The bare word `fix` stays out, because routing matches by substring and `fix` also matches `prefix` and `fixture`.
- Second pass: CB-CR-001 names both packets of its bundle in `expected_workflow_mode`.
- Second pass: the exact-header check exempts test files by name as well as by a `tests/` path segment.
- Second pass: this folder moves from Level 1 to Level 2, which clears the LEVEL_MATCH warning a `decision-record.md` raises in a Level 1 folder.

### Out of Scope

- S-P2-13, the CI path keywords in the hub router, which another worker owns.
- S-P2-14, which waits on an operator ruling about surface-only routing.
- The review profile, which the operator ruled out on 2026-10-25, recorded as ADR-002 in `decision-record.md`.
- `sk-code-ci/`, and in the first pass any hub routing file. The second pass edits `hub-router.json` only. `ROUTER.md`, `graph-metadata.json` and `leaf-manifest.json` need no change, because nothing projects the three single-word keywords into them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../goal.md`, `../spec.md` | Modify | D7 marks D3 and D4 superseded, criteria amended, phase 3 bound, open question answered, handoff row fixed |
| `../00{1,2}-*/goal.md` | Modify | D4 marks the parent D3 and D4 superseded, criteria amended and ticked |
| `../00{1,2}-*/decision-record.md` | Modify | ADR-003 added |
| `../00{1,2}-*/acceptance-criteria.md` | Modify | Status Complete, AC-003 to AC-005 at fifteen, AC-009 Superseded by ADR-003 |
| `../00{1,2}-*/tasks.md` | Modify | CHK-031, CHK-032 and the 001 CHK-050 evidence |
| `../00{1,2}-*/implementation-summary.md` | Modify | Limitations and verification rows |
| `../00{1,2}-*/research/research.md` | Modify | ROUTER.md tags re-anchored, envelope premise corrected, anchor note added |
| `../002-review-mode-research/spec.md` | Modify | Envelope premise corrected |
| `../scratch/commit-message*.txt` | Delete | Four used commit drafts |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modify | Rebuilt from the sk-doc playbook template |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Modify | Retired names, the unit-test claim and the Webflow phrase removed |
| `.skilled/skills/sk-code/sk-code-quality/scripts/{check-comment-hygiene,check-dist-staleness,ceiling-report}.sh`, `scripts/hooks/claude-posttooluse.sh` | Modify | COMPONENT header after the shebang |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `README.md`, `changelog/v1.3.0.0.md` | Modify, Create | The P0 floor split into the universal baseline and a `.js` or `.css` overlay |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` | Modify | Hand-typed scenario counts replaced by the derived census |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | `### Extension Floors` in section 4 |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`, `check-rule-copies.test.sh`, `README.md` | Modify | Pinned-copy assertion for the floors, one drift test, README rows |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Second pass: `bash`, `.ts` and `bug` in `code-skilled-runtime` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/` | Modify | Second pass: the refreshed policy hash |
| `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-alone-bug-fix-compiled-routing.md` | Create | Second pass: CB-CR-005, the bug-fix replay |
| `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md` | Modify | Second pass: CB-CR-001 `expected_workflow_mode` names both packets |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modify | Second pass: `LIVE_CORPUS_SIZE` from 88 to 89 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py`, `test_verify_alignment_drift.py` | Modify | Second pass: name-based test exemption and its test |
| `acceptance-criteria.md`, and the Level 2 sections of `spec.md`, `plan.md` and `tasks.md` | Create, Modify | Second pass: the Level 2 upgrade |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The goal criteria and acceptance rows of the packet name the counts and the boundary ADR-002 and ADR-003 set | Every criterion in the three research goals is ticked with evidence, and AC-009 in both phases reads Superseded with ADR-003 |
| REQ-002 | Recursive strict validation passes | `validate.sh specs/sk-code/014-code-modes-research --recursive --strict` prints `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The quality playbook root passes the playbook validator | `validate_document.py --type playbook` prints `VALID` |
| REQ-004 | The review playbook carries no hand-typed census | `validate-playbook-package.cjs` reports 0 warnings for `sk-code-review` |
| REQ-005 | The four Python entrypoints carry the COMPONENT header | `verify_alignment_drift.py --check-exact-headers` reports no finding for them |
| REQ-006 | The extension floors are listed once and pinned | `check-rule-copies.js` exits 0 and its test suite fails a reworded floor |
| REQ-007 | A bug fix in a `.ts` file and a bash script question route to `sk-code-skilled` | `compiled-route.cjs --hub sk-code` prints `single` with `sk-code-skilled` for both prompts, and the review, CI and quality controls keep their routes |
| REQ-008 | CB-CR-001 names its whole bundle | `validate-compiled-routing-scenarios.cjs --strict` passes all five scenarios and `compiled-route-admission.cjs --hub sk-code` passes |
| REQ-009 | Test files next to their scripts are exempt from the exact-header check | The checker reports 0 findings on `sk-code-quality/scripts` with `--check-exact-headers`, and its test file passes |
| REQ-010 | The folder level matches its documents | Strict validation of this folder prints `RESULT: PASSED` with `Warnings: 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validation of the parent prints `RESULT: PASSED`.
- **SC-002**: The review canary, its test suite and the four sk-code-quality test suites exit 0.
- **SC-003**: The two prompts that deferred now route to `sk-code-skilled`, and every sk-code routing gate the second pass names exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Another worker edits the hub routing files at the same time | Med | The first pass touched no hub routing file. The second pass edits only `hub-router.json` and the compiled activation manifest, which the orchestrator assigned to it, and leaves the advisor and the private surface packet to their owner |
| Risk | A new keyword captures traffic the surface cannot serve | Low | Each keyword was replayed against out-of-domain phrases, and `fix` was left out because it matches `prefix` and `fixture` |
| Risk | Header lines shift source-tag anchors in the research synthesis | Low | Each research References section states that those anchors read against `ee8c7e6f24` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Three more keywords add no measurable routing time. Each prompt replay through `compiled-route.cjs` returns in well under a second, as before.

### Security
- **NFR-S01**: No change reads or writes a credential, and no change widens what a route may load. The new keywords select an existing surface.

### Reliability
- **NFR-R01**: The served activation manifest and its authored twin carry the same policy hash, so `compiled-route-sync.cjs --check` keeps passing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a prompt with none of the keywords still defers, as `fix the prefix in this fixture` showed after the change.
- Maximum length: not applicable, because the matcher scans the whole prompt for each keyword.
- Invalid format: substring matching means `.ts` also matches `.tsv` and `bug` also matches `debug`. `parse the results.tsv file` and `debug my animation` now route to `sk-code-skilled`. Both are code work on the hub's only implementation surface, so the wider catch is accepted.

### Error Scenarios
- External service failure: none applies, because routing runs locally from the compiled manifest.
- Network timeout: none applies, because nothing is fetched.
- Concurrent access: another worker edits the advisor and the private surface packet at the same time. This pass touches none of their files.

### State Transitions
- Partial completion: a refreshed served manifest with a stale authored twin fails `compiled-route-sync.cjs --check`, so the twin is copied in the same step.
- Session expiry: this folder records every check, so a fresh session can rerun them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Files: about 30 packet and skill files over two passes, LOC: under 400, Systems: two sk-code modes and the hub router |
| Risk | 8/25 | Auth: N, API: N, Breaking: N. The routing vocabulary is a shared contract, replayed against five controls |
| Research | 4/20 | The deep review and the orchestrator brief named every fix |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this phase. S-P2-14 stays with the operator.
<!-- /ANCHOR:questions -->

---
