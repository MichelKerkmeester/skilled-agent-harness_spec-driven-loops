---
title: "Feature Specification: Phase 13: align-mcp-code-mode"
description: "After the machine router moved from SKILL.md to ROUTER.md, the mcp-code-mode docs could still describe the old layout. This phase ran an operator-local alignment check over the 7 files changed since base 6a9946a800, fixed the upheld findings that do not change routing, and reran the full battery."
trigger_phrases:
  - "align mcp code mode"
  - "phase 13 align mcp code mode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: align-mcp-code-mode

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/274-packet-router-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 22 |
| **Predecessor** | 012-align-cli-orca |
| **Successor** | 014-align-mcp-tooling |
| **Handoff Criteria** | The recheck battery passes 48 checks and every recheck failure is derived, so it re-mints at commit, or was fixed after the recheck. Every LEFT and OUTSIDE item carries a disposition, and the mcp-code-mode router parses as it does at HEAD. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files of `.skilled/skills/mcp-code-mode/` changed since base `6a9946a800`, plus any file a finding names outside the skill. Fixes leave routing as it is. Items that need routing-data changes go to the routing follow-up recorded in the parent spec.

**Dependencies**:
- The router move in phases 004 and 005, which put the skill's machine router in `ROUTER.md`.
- The router-file resolver, which checks that every skill router parses as it does at HEAD.
- The skill advisor, which scores the routing probe prompts.

**Deliverables**:
- The fix-lane edits to the mcp-code-mode docs, listed in Files to Change.
- A recheck of the full battery against the worktree, with each failure classified.
- This phase's four documents. The run evidence stays in the run folder outside the checkout.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of mcp-code-mode moved from SKILL.md to ROUTER.md. READMEs, playbooks, catalogs and changelogs could still point at the old place or carry stale counts. Nobody had yet checked every file the move touched.

### Purpose
Every upheld finding that does not change routing is fixed or carries a disposition, and the full battery passes apart from derived checks.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Recorded by an operator-local alignment check on 2026-10-29. The full output stays in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Commits: 6a9946a800 to 4f741f6b48, 27 first-parent commits
Files: 7, of which 0 uncommitted or untracked
Findings: 15 (P0 0, P1 1, P2 14), 10 literal, 0 inferred, 11 outside the scope; 17 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":46,"not_applicable":7}
Probes: STATUS=OK run-probes: pass=8 fail=0 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":48,"fail":3,"not_applicable":7}
fail S3-catalog-package: fixed after this recheck: the sk-design-diagram catalog leaf and root now share one description, and validate_catalog_package.py reports 0 fail
fail S7-compiled-route-guard: derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate
fail S11-hermes-skills: derived: the Hermes skill copies regenerate from source before the commit
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the mcp-code-mode files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes: code; skill docs; READMEs, changelogs and env; routing.
- Score the routing probe prompts against the advisor.
- Apply the upheld findings that do not change routing, and fix router prose in a follow-up pass.
- Rerun the full battery against the worktree and classify each failure.

### Out of Scope
- Routing data, such as `graph-metadata.json` `intent_signals` - the packet decision is that no skill routes differently, so these items go to the routing follow-up recorded in the parent spec.
- Re-minting the derived files, such as the hub manifest hash, the activation manifests and the Hermes skill copies - the pre-commit gates regenerate them at commit.

### Files to Change

Paths are relative to `.skilled/skills/mcp-code-mode/` unless they start with `.skilled/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `changelog/v1.0.15.0.md` | Modify | Fix lane: B-01, A-06 |
| `manual-testing-playbook/manual-namespace-contract/list-tools-dot-vs-underscore.md` | Modify | Fix lane: A-01 |
| `manual-testing-playbook/manual-namespace-contract/correct-manual-tool-form.md` | Modify | Fix lane: A-02 |
| `manual-testing-playbook/manual-namespace-contract/wrong-form-error.md` | Modify | Fix lane: A-03 |
| `manual-testing-playbook/recovery-and-config/timeout-escalation.md` | Modify | Fix lane: A-04 |
| `leaf-manifest.config.json` | Modify | Fix lane: A-07 |
| `SKILL.md` | Modify | Fix lane: A-08 |
| `README.md` | Modify | Fix lane: C-01, C-02 |
| `manual-testing-playbook/manual-testing-playbook.md` | Modify | Fix lane: CR-01 |
| `ROUTER.md` | Modify | LEFT C-04: the full node command for the leaf-manifest generator |
| `.skilled/skills/system-spec-kit/ROUTER.md` | Modify | OUTSIDE C-04: the same full node command |
| `.skilled/skills/sk-doc/scripts/validate_document.py` | Modify | OUTSIDE C-10: a file named ROUTER.md reads as a skill_router document, with two new tests |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` (this folder) | Modify | Record the check and its evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every upheld finding that does not change routing is fixed. | The fix-lane results list 11 FIXED items. |
| REQ-002 | Every LEFT and OUTSIDE item carries a disposition. | Each of the 5 LEFT and OUTSIDE items has a Disposition line. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The recheck fails only on derived checks or on a check fixed after the recheck. | The recheck battery reads `{"pass":48,"fail":3,"not_applicable":7}` and each failure (S3-catalog-package, S7-compiled-route-guard, S11-hermes-skills) has its classification. |
| REQ-004 | Routing does not change. | The router-file resolver parses all 54 skill routers identically to HEAD. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery passes 48 checks, up from 46 on the first run, and fails only on S3-catalog-package, S7-compiled-route-guard, S11-hermes-skills.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` on the skill: PASS, and `check-markdown-links.cjs` reports 0 broken links.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The pre-commit gates that re-mint derived files | The derived recheck failures stay until a commit runs them | Classify each one as derived in the recheck, and let the commit re-mint them |
| Risk | A fix edits routing data and changes what the skill routes to | Med | The fix lane was barred from routing data, and the router-file resolver showed every skill router parses as it does at HEAD |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocks. Routing-data items go to the routing follow-up recorded in the parent spec.
<!-- /ANCHOR:questions -->

---
