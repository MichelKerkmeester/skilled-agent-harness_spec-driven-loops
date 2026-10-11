---
title: "Feature Specification: Phase 7: sk-code-script-kebab-names"
description: "The strict skill package check failed sk-code-opencode on three snake_case script names under assets/scripts. This phase renames them and their two tests to kebab-case and updates every live reference first."
trigger_phrases:
  - "sk code script kebab names"
  - "phase 7 sk code script kebab names"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: sk-code-script-kebab-names

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/096-feature-catalog-anchor-deprecation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-skill-package-doc-findings |
| **Successor** | 003-feature-catalog-findings |
| **Handoff Criteria** | sk-code-opencode passes `package_skill.py --check --strict` with its tests and drift guards green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the feature catalog template-anchor deprecation. It remediates pre-existing findings that phases 1 and 2 surfaced.

**Scope Boundary**: the three drift-guard scripts and two tests in sk-code-opencode, the docs, wrapper and leaf manifest that cite them, one changelog entry missing its version key, and the version carriers and new entries of sk-code-opencode and sk-code-obsidian.

**Dependencies**:
- None. The scripts are loaded by relative path from the wrapper and the tests.

**Deliverables**:
- Five files renamed to kebab-case
- Every live reference updated and the leaf manifest regenerated
- `scratch/rename_kebab_scripts.py`, run once
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`package_skill.py --check --strict` failed sk-code-opencode because `router_replay_lib.cjs`, `verify_doc_claims.cjs` and `verify_router_sync.cjs` break the kebab-case rule for package files. A rename without updating the callers would break the drift-guard wrapper, a `require()` and two tests.

### Purpose
The scripts carry kebab-case names and every caller still finds them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` the three scripts and their two tests
- Replace the old names in every live doc, script and manifest that cites them
- Regenerate the sk-code leaf manifest with its generator
- Add the missing version key to `changelog/v1.0.1.0.md`
- Patch-bump sk-code-opencode and sk-code-obsidian

### Out of Scope
- Historical changelog entries and spec folders - they record what was true then
- Python scripts in the same folder - Python module names use snake_case by convention and the validator does not flag them
- The sk-code hub version bump - the hub version also lives in JSON routing files kept by another owner, handed off

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Five sk-code-opencode scripts and tests | Rename | Kebab-case names |
| Ten docs, the wrapper and `leaf-manifest.json` | Modify | Updated references |
| `changelog/v1.0.1.0.md` | Modify | Version key |
| Two unit version carriers and entries | Modify and create | Patch bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No live file under `.skilled` or `.hermes` names the old scripts outside changelogs |
| REQ-002 | The tests, drift guards and parent skill check pass after the rename |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every owning skill or mode whose shipped files changed is patch-bumped once, and each hub's bump is recorded as a handoff |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` prints Result: PASS for sk-code-opencode.
- **SC-002**: Both tests and all four drift guards pass, as before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A missed caller breaks a guard | Med | Grep across `.skilled` and `.hermes` returns 0, and the wrapper and tests run green |
| Risk | The leaf manifest drifts | Low | Regenerated with its generator; the parent skill check passes |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Documentation and metadata only.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Not applicable. No permission or secret changes.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: Bulk edits run through one deterministic script kept in `scratch/`.
- **NFR-R02**: Each validator result is compared against its baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a file without the finding is left untouched.
- Maximum length: not applicable.
- Invalid format: the usage strings and the test regexes that name the scripts change together, so the tests still match.

### Error Scenarios
- External service failure: a DevPass limit switches the builder to the cline route.
- Network timeout: not applicable.
- Concurrent access: the worktree is isolated from the main checkout.

### State Transitions
- Partial completion: every change is a tracked-file edit that `git checkout` reverts.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Five renames, 15 files |
| Risk | 4/25 | Documentation and metadata edits |
| Research | 6/20 | Reader and owner inventory |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
