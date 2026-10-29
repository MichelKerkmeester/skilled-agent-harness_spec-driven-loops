---
title: "Feature Specification: Phase 11: align-cli-external-orchestration"
description: "After the machine router moved from SKILL.md to ROUTER.md, the cli-external-orchestration docs could still describe the old layout. This phase ran an operator-local alignment check over the 73 files changed since base 6a9946a800, fixed the upheld findings that do not change routing, and reran the full battery."
trigger_phrases:
  - "align cli external orchestration"
  - "phase 11 align cli external orchestration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: align-cli-external-orchestration

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
| **Phase** | 11 of 22 |
| **Predecessor** | 010-align-cli-classifier |
| **Successor** | 012-align-cli-orca |
| **Handoff Criteria** | The recheck battery passes 142 checks and every recheck failure is derived, so it re-mints at commit, or was fixed after the recheck. The fix lane left no LEFT or OUTSIDE item, and the cli-external-orchestration router parses as it does at HEAD. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files of `.skilled/skills/cli-external-orchestration/` changed since base `6a9946a800`, plus any file a finding names outside the skill. Fixes leave routing as it is. Items that need routing-data changes go to the routing follow-up recorded in the parent spec.

**Dependencies**:
- The router move in phases 004 and 005, which put the skill's machine router in `ROUTER.md`.
- The router-file resolver, which checks that every skill router parses as it does at HEAD.
- The skill advisor, which scores the routing probe prompts.

**Deliverables**:
- The fix-lane edits to the cli-external-orchestration docs, listed in Files to Change.
- A recheck of the full battery against the worktree, with each failure classified.
- This phase's four documents. The run evidence stays in the run folder outside the checkout.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of cli-external-orchestration moved from SKILL.md to ROUTER.md. READMEs, playbooks, catalogs and changelogs could still point at the old place or carry stale counts. Nobody had yet checked every file the move touched.

### Purpose
Every upheld finding that does not change routing is fixed or carries a disposition, and the full battery passes apart from derived checks.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Recorded by an operator-local alignment check on 2026-10-29. The full output stays in the run folder outside the checkout.
```text
First run (pushed tree, before the fix lane)
Commits: 6a9946a800 to 4f741f6b48, 27 first-parent commits
Files: 73, of which 0 uncommitted or untracked
Findings: 19 (P0 0, P1 5, P2 14), 11 literal, 0 inferred, 10 outside the scope; 17 more overturned by the critic and not counted
Lanes: A, B, C, D
Battery: {"pass":128,"not_applicable":3}
Probes: no probes

Recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"fail":4,"pass":142,"not_applicable":3}
fail S2-skill-package: derived: the compiled policy hash in the hub manifest re-mints at commit
fail S3-catalog-package: fixed after this recheck: the sk-design-diagram catalog leaf and root now share one description, and validate_catalog_package.py reports 0 fail
fail S7-compiled-route-guard: derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate
fail S11-hermes-skills: derived: the Hermes skill copies regenerate from source before the commit
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the cli-external-orchestration files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes: code; skill docs; READMEs, changelogs and env; routing.
- Score the routing probe prompts against the advisor.
- Apply the upheld findings that do not change routing, and fix router prose in a follow-up pass.
- Rerun the full battery against the worktree and classify each failure.

### Out of Scope
- Routing data, such as `graph-metadata.json` `intent_signals` - the packet decision is that no skill routes differently, so these items go to the routing follow-up recorded in the parent spec.
- Re-minting the derived files, such as the hub manifest hash, the activation manifests and the Hermes skill copies - the pre-commit gates regenerate them at commit.

### Files to Change

Paths are relative to `.skilled/skills/cli-external-orchestration/` unless they start with `.skilled/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `{cli-claude-code,cli-opencode}/manual-testing-playbook/intra-routing-recall/*.md` (18 files) | Modify | Fix lane: A-01 |
| the `intra-routing-recall/*.md` scenarios (20 files, 30 lines) | Modify | Fix lane: A-03 |
| `cli-claude-code/references/providers-and-models.md` | Modify | Fix lane: A-04 |
| `cli-pi/README.md` | Modify | Fix lane: A-05, B-06 |
| the `cli-executor-dispatch-routing` feature catalog entry | Modify | Fix lane: A-06 |
| `README.md` | Modify | Fix lane: A-07 |
| `cli-cursor/SKILL.md` and `cli-devin/SKILL.md` | Modify | Fix lane: A-08 |
| the cli-claude-code `cost-and-background` and `agent-routing` scenarios, and the cli-codex `codex-cloud` and `cli-invocation` scenarios | Modify | Fix lane: A-09 |
| `cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md` | Modify | Fix lane: B-01 |
| the `cross-repo-cross-server` `self-invocation-guard-nested.md` scenario | Modify | Fix lane: B-02 |
| `cli-{claude-code,codex,cursor,opencode,pi}/references/providers-and-models.md` | Modify | Fix lane: B-07 |
| `orchestrate-agent-multi-step.md` and `orchestrate-agent-multi-agent.md` | Modify | Fix lane: B-09 |
| `cli-opencode/references/self-invocation-guard.md` | Modify | Fix lane: C-03 |
| `SKILL.md` | Modify | Fix lane: C-06 |
| `cli-cursor/manual-testing-playbook/execution-modes/ask-mode-read-only.md` | Modify | Fix lane: C-09 |
| `cli-pi/assets/prompt-quality-card.md`, the cli-pi playbook files and the cli-hermes playbook | Modify | Fix lane: D-02 |
| the `ordered-bundle-cli-transport-compiled-routing.md` scenario | Modify | Fix lane: D-05 |
| `cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modify | Fix lane: F-01 |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` (this folder) | Modify | Record the check and its evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every upheld finding that does not change routing is fixed. | The fix-lane results list 19 FIXED items. |
| REQ-002 | Every LEFT and OUTSIDE item carries a disposition. | The fix-lane results list no LEFT or OUTSIDE item. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The recheck fails only on derived checks or on a check fixed after the recheck. | The recheck battery reads `{"fail":4,"pass":142,"not_applicable":3}` and each failure (S2-skill-package, S3-catalog-package, S7-compiled-route-guard, S11-hermes-skills) has its classification. |
| REQ-004 | Routing does not change. | The router-file resolver parses all 54 skill routers identically to HEAD. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck battery passes 142 checks, up from 128 on the first run, and fails only on S2-skill-package, S3-catalog-package, S7-compiled-route-guard, S11-hermes-skills.
- **SC-002**: The fix-lane checks pass: `package_skill.py --check --strict` on the hub and its 7 packets: PASS, and `check-markdown-links.cjs` reports 0 broken links.
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

- None blocks. No item needs a routing-data change.
<!-- /ANCHOR:questions -->

---
