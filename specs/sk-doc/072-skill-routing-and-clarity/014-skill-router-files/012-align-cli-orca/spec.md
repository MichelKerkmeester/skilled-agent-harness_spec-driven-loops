---
title: "Feature Specification: Phase 12: align-cli-orca"
description: "After the machine router moved from SKILL.md to ROUTER.md, the cli-orca docs could still describe the old layout. This phase ran an operator-local alignment check over the 7 files changed since base 6a9946a800, fixed the upheld findings that do not change routing, and reran the full battery."
trigger_phrases:
  - "align cli orca"
  - "phase 12 align cli orca"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: align-cli-orca

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
| **Phase** | 12 of 22 |
| **Predecessor** | 011-align-cli-external-orchestration |
| **Successor** | 013-align-mcp-code-mode |
| **Handoff Criteria** | The recheck battery passes 57 checks and every recheck failure is derived, so it re-mints at commit. Every LEFT and OUTSIDE item carries a disposition, and the cli-orca router parses as it does at HEAD. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files of `.skilled/skills/cli-orca/` changed since base `6a9946a800`, plus any file a finding names outside the skill. Fixes leave routing as it is. Items that need routing-data changes go to the routing follow-up recorded in the parent spec.

**Dependencies**:
- The router move in phases 004 and 005, which put the skill's machine router in `ROUTER.md`.
- The router-file resolver, which checks that every skill router parses as it does at HEAD.
- The skill advisor, which scores the routing probe prompts.

**Deliverables**:
- The fix-lane edits to the cli-orca docs, listed in Files to Change.
- A recheck of the full battery against the worktree, with each failure classified.
- This phase's four documents. The run evidence stays in the run folder outside the checkout.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of cli-orca moved from SKILL.md to ROUTER.md. READMEs, playbooks, catalogs and changelogs could still point at the old place or carry stale counts. Nobody had yet checked every file the move touched.

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
Findings: 20 (P0 0, P1 2, P2 18), 14 literal, 1 inferred, 9 outside the scope; 9 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":47,"not_applicable":7}
Probes: STATUS=OK run-probes: pass=10 fail=0 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":57,"not_applicable":7,"fail":2}
fail S7-compiled-route-guard: derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate
fail S11-hermes-skills: derived: the Hermes skill copies regenerate from source before the commit
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the cli-orca files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes: code; skill docs; READMEs, changelogs and env; routing.
- Score the routing probe prompts against the advisor.
- Apply the upheld findings that do not change routing, and fix router prose in a follow-up pass.
- Rerun the full battery against the worktree and classify each failure.

### Out of Scope
- Routing data, such as `graph-metadata.json` `intent_signals` - the packet decision is that no skill routes differently, so these items go to the routing follow-up recorded in the parent spec.
- Re-minting the derived files, such as the hub manifest hash, the activation manifests and the Hermes skill copies - the pre-commit gates regenerate them at commit.

### Files to Change

Paths are relative to `.skilled/skills/cli-orca/` unless they start with `.skilled/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` and `hub-deferral-receipt.md` | Modify | Fix lane: C-02 |
| `changelog/v0.1.7.0.md` | Modify | Fix lane: C-01, A-03, C-05 |
| `manual-testing-playbook/manual-testing-playbook.md` | Modify | Fix lane: A-01, C-06, D-02, D-03 |
| `references/session-and-runtime.md` and `mutation-and-browser-boundaries.md` | Modify | Fix lane: A-02 |
| `feature-catalog/routing/orca-qualified-vocabulary.md` | Modify | Fix lane: A-04, D-07, D-08 |
| `references/orca-skills/computer-use.md` | Modify | Fix lane: A-06 |
| `manual-testing-playbook/ownership/official-skill-handoff.md` | Modify | Fix lane: B-06 |
| `README.md` | Modify | Fix lane: C-03 |
| `manual-testing-playbook/routing/orca-positive-route.md` | Modify | Fix lane: D-04 |
| `leaf-manifest.config.json` | Modify | Fix lane: E-02 |
| `ROUTER.md` | Modify | Router-prose pass: OUTSIDE E-01 and OUTSIDE C-04 |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` (this folder) | Modify | Record the check and its evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every upheld finding that does not change routing is fixed. | The fix-lane results list 17 FIXED items. |
| REQ-002 | Every LEFT and OUTSIDE item carries a disposition. | Each of the 3 LEFT and OUTSIDE items has a Disposition line. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The recheck fails only on derived checks. | The recheck battery reads `{"pass":57,"not_applicable":7,"fail":2}` and each failure (S7-compiled-route-guard, S11-hermes-skills) has its classification. |
| REQ-004 | Routing does not change. | The router-file resolver parses all 54 skill routers identically to HEAD. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery passes 57 checks, up from 47 on the first run, and fails only on S7-compiled-route-guard, S11-hermes-skills.
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
