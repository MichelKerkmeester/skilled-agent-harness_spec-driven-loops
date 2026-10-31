---
title: "Feature Specification: Phase 10: align-cli-classifier"
description: "After the machine router moved from SKILL.md to ROUTER.md, the cli-classifier docs could still describe the old layout. This phase ran an operator-local alignment check over the 9 files changed since base 6a9946a800, fixed the upheld findings that do not change routing, and reran the full battery."
trigger_phrases:
  - "align cli classifier"
  - "phase 10 align cli classifier"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: align-cli-classifier

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
| **Phase** | 10 of 22 |
| **Predecessor** | 009-ai-systems-verification |
| **Successor** | 011-align-cli-external-orchestration |
| **Handoff Criteria** | The recheck battery passes 56 checks and every recheck failure is derived, so it re-mints at commit. Every LEFT and OUTSIDE item carries a disposition, and the cli-classifier router parses as it does at HEAD. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files of `.skilled/skills/cli-classifier/` changed since base `6a9946a800`, plus any file a finding names outside the skill. Fixes leave routing as it is. Items that need routing-data changes go to the routing follow-up recorded in the parent spec.

**Dependencies**:
- The router move in phases 004 and 005, which put the skill's machine router in `ROUTER.md`.
- The router-file resolver, which checks that every skill router parses as it does at HEAD.
- The skill advisor, which scores the routing probe prompts.

**Deliverables**:
- The fix-lane edits to the cli-classifier docs, listed in Files to Change.
- A recheck of the full battery against the worktree, with each failure classified.
- This phase's four documents. The run evidence stays in the run folder outside the checkout.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of cli-classifier moved from SKILL.md to ROUTER.md. READMEs, playbooks, catalogs and changelogs could still point at the old place or carry stale counts. Nobody had yet checked every file the move touched.

### Purpose
Every upheld finding that does not change routing is fixed or carries a disposition, and the full battery passes apart from derived checks.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Recorded by an operator-local alignment check on 2026-10-29. The full output stays in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Commits: 6a9946a800 to 4f741f6b48, 27 first-parent commits
Files: 9, of which 0 uncommitted or untracked
Findings: 15 (P0 0, P1 2, P2 13), 6 literal, 1 inferred, 7 outside the scope; 11 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":52,"not_applicable":3}
Probes: STATUS=FINDINGS run-probes: pass=13 fail=1 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"fail":3,"pass":56,"not_applicable":3}
fail S2-skill-package: derived: the compiled policy hash in the hub manifest re-mints at commit
fail S7-compiled-route-guard: derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate
fail S11-hermes-skills: derived: the Hermes skill copies regenerate from source before the commit
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the cli-classifier files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes: code; skill docs; READMEs, changelogs and env; routing.
- Score the routing probe prompts against the advisor.
- Apply the upheld findings that do not change routing, and fix router prose in a follow-up pass.
- Rerun the full battery against the worktree and classify each failure.

### Out of Scope
- Routing data, such as `graph-metadata.json` `intent_signals` - the packet decision is that no skill routes differently, so these items go to the routing follow-up recorded in the parent spec.
- Re-minting the derived files, such as the hub manifest hash, the activation manifests and the Hermes skill copies - the pre-commit gates regenerate them at commit.

### Files to Change

Paths are relative to `.skilled/skills/cli-classifier/` unless they start with `.skilled/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-jev/changelog/v0.1.9.0.md` | Modify | Fix lane: A-01 |
| `cli-jev/README.md` | Modify | Fix lane: A-02, C-06 |
| `README.md` | Modify | Fix lane: A-04, B-03 |
| `SKILL.md` | Modify | Fix lane: B-02 |
| `cli-jev/feature-catalog/transport-classification/transport-classification.md` | Modify | Fix lane: B-05 |
| `cli-jev/ROUTER.md` | Modify | Fix lane: D-01 |
| `ROUTER.md` | Modify | Fix lane: D-03 |
| `cli-jev/feature-catalog/feature-catalog.md` | Modify | Fix lane: F-01 |
| `manual-testing-playbook/manual-testing-playbook.md` | Modify | Fix lane: F-02 |
| `ROUTER.md` | Modify | Router-prose pass: LEFT A-03, the same sentence in five hubs and the sk-design hub |
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
| REQ-002 | Every LEFT and OUTSIDE item carries a disposition. | Each of the 2 LEFT and OUTSIDE items has a Disposition line. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The recheck fails only on derived checks. | The recheck battery reads `{"fail":3,"pass":56,"not_applicable":3}` and each failure (S2-skill-package, S7-compiled-route-guard, S11-hermes-skills) has its classification. |
| REQ-004 | Routing does not change. | The router-file resolver parses all 54 skill routers identically to HEAD. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery passes 56 checks, up from 52 on the first run, and fails only on S2-skill-package, S7-compiled-route-guard, S11-hermes-skills.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` on the hub: PASS, and `check-markdown-links.cjs` reports 0 broken links.
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
