---
title: "Feature Specification: Phase 18: align-sk-git"
description: "After the machine router moved from SKILL.md to ROUTER.md, nothing yet showed that the sk-git docs, playbooks, READMEs and changelogs still matched where routing lives. This phase records one operator-local alignment check over sk-git, the fixes it upheld and a full recheck."
trigger_phrases:
  - "align sk git"
  - "phase 18 align sk git"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: align-sk-git

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
| **Phase** | 18 of 22 |
| **Predecessor** | 017-align-sk-doc |
| **Successor** | 019-align-sk-prompt |
| **Handoff Criteria** | The sk-git recheck reads pass 44, fail 3 and not applicable 7 with each failure classified, the 10 fixes are in place, all 54 routers parse identically to HEAD, and D-1 is carried to the routing follow-up |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The sk-git files changed since base `6a9946a800`. The phase changes no routing data. No `INTENT_SIGNALS`, `RESOURCE_MAP`, advisor vocabulary or hub class moves. Run output stays in the run folder outside the checkout.

**Dependencies**:
- The router move in phases 004 to 006, which put the sk-git machine router in `ROUTER.md`.
- The router-file resolver, which proves each router still parses the same.
- DeepSeek V4.1 Flash workers for the four review lanes and the fix lane.

**Deliverables**:
- The upheld findings that do not change routing, fixed in the sk-git files listed below.
- A recheck of the full battery against the worktree, with each failure classified.
- Each routing item named with its disposition and carried to the routing follow-up in the parent spec.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The router move changed where the sk-git machine router lives, but the docs around it were written for the old place. A playbook, README, changelog or reference that still points at a router inside SKILL.md sends a reader to the wrong file. No check had yet read sk-git as a whole after the move.

### Purpose
Every upheld finding in sk-git that does not change routing is fixed, every routing item is carried forward, and the recheck shows only failures with a known cause.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Copied from the evidence file in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Kind: skill, file set first-parent
Commits: 6a9946a80064c9971385d4c9cfba6bf9809fd1a5 to 4f741f6b48ac5825a3ce18dbe19575d76043885f, 27 first-parent commits
Files: 5, of which 0 uncommitted or untracked
Findings: 14 (P0 0, P1 1, P2 13), 7 literal, 0 inferred, 9 outside the scope; 5 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":44,"not_applicable":7}
Probes: STATUS=OK run-probes: pass=10 fail=0 cannot_run=0

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":44,"fail":3,"not_applicable":7}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the sk-git files changed since base `6a9946a800` and run the existing check battery over them.
- Send four read-only review lanes over those files: code, skill docs, READMEs with changelogs and env, and routing.
- Score routing probe prompts against the advisor, and let a critic overturn weak findings.
- Apply the upheld findings that do not change routing, through a DeepSeek fix lane and a follow-up router prose pass.
- Rerun the full battery against the worktree and classify each failure.

### Out of Scope
- Routing data changes - the packet decision is that no skill routes differently, so each one is carried to the routing follow-up.
- Regenerating derived files by hand - the activation manifests and Hermes copies regenerate at commit.
- Git commits - this phase writes no git state.

### Files to Change

Paths are relative to the repository root.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/SKILL.md` | Modify | The discovery sentence names only `references/` and `assets/`, matching `RESOURCE_BASES` (SKGIT-A-02) |
| `.skilled/skills/sk-git/ROUTER.md` | Modify | The negative is qualified to conditional resources, and the GITKRAKEN bullet says it loads on top of the always-loaded quick reference (X-01) |
| `.skilled/skills/sk-git/README.md` | Modify | The commit-msg row reports PASS=45 FAIL=0 and the prepare-commit-msg row PASS=80 FAIL=0, both measured (B-04, B-05) |
| `.skilled/skills/sk-git/changelog/v1.11.6.0.md` | Modify | The false repointing claim is replaced, and a spec-folder blockquote for 005-packet-and-standalone-migration is added (SKGIT-A-01, C-2) |
| `.skilled/skills/sk-git/references/finish-workflows.md` | Modify | The pointer goes to the sibling `github-mcp-integration.md` sections 3 and 4 (SKGIT-A-03) |
| `.skilled/skills/sk-git/assets/pr-template.md` | Modify | The tool pointer goes to `../references/github-mcp-integration.md` sections 3 and 4 (B-07) |
| `.skilled/skills/sk-git/leaf-manifest.config.json` | Modify | The `_note` separates the two ROUTER.md discovery roots from the manifest-reached catalog and playbook leaves (B-03) |
| `.skilled/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` | Modify | GIT-042 step 1 also copies `hard-rules.json` beside SKILL.md, and the scenario fires (B-01) |
| This phase's `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Record the run, the fixes and the recheck |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Routing does not change. | All 54 skill routers parse identically to HEAD with the router-file resolver. |
| REQ-002 | Each upheld finding that does not change routing is fixed. | The evidence file lists 10 FIXED lines, and each LEFT or OUTSIDE line carries a disposition. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each recheck failure has a known cause. | The recheck lists 3 failures, and each one is classified as derived or fixed after the recheck. |
| REQ-004 | Each routing item is carried forward. | Each OUTSIDE line held by the no-routing-change decision names the routing follow-up. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery reads `{"pass":44,"fail":3,"not_applicable":7}`, and every failure in it is classified.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` prints `Result: PASS`, `validate_document.py` reports 0 issues on six changed files, and `check-markdown-links.cjs` reports 0 broken links.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash workers | No lane findings and no fix lane | Rerun the lane; the battery and probes still run without them |
| Risk | A fix edits routing data under the cover of a prose fix | High | The fix lane is barred from routing data, and the router-file resolver shows all 54 routers parse identically to HEAD |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `gitlens start review` be pinned to sk-code in `router-reach-allowlist.json` (D-1)? Decision: not in this phase. It is routing data, held by the no-routing-change decision and carried to the routing follow-up.
- None else blocks.
<!-- /ANCHOR:questions -->

---

