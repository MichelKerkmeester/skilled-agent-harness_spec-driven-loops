---
title: "Feature Specification: Phase 6: closeout-deep-review"
description: "Run a five-iteration DeepSeek deep review over the 015 closeout commits 77f14f88d0..d04df31790 and confirm each finding with a command."
trigger_phrases:
  - "closeout deep review"
  - "phase 6 closeout deep review"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: closeout-deep-review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 10 |
| **Predecessor** | 005-hooks-vitest-scope |
| **Successor** | 007-dispatch-wrapper-scan |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the residual closeout phase parent. It closes item 6 of the residual list: the 015 closeout commits never had a deep review.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Run a five-iteration DeepSeek deep review over the 015 closeout commits 77f14f88d0..d04df31790 and confirm each finding with a command.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 015 closeout landed nine commits, 77f14f88d0 to d04df31790, that changed hooks, the compiled-route sync check, the deep-loop reducer, the OpenCode advisor plugin, a scaffold script and several releases. No independent review read them.

### Purpose
An independent DeepSeek review reads the range, and every finding it reports is rerun before it is kept. Each confirmed P0, P1 and P2 gets its own fix phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

The review target is the product change in commits `77f14f88d0..d04df31790` on `main`, the nine commits of the 015 closeout. Read each with `git show <commit>` or `git diff 77f14f88d0^..d04df31790 -- <path>`. Some of these files changed again in 016 phases 001 to 005; judge the range diff, not today's file.

| 015 phase | Commit | Product change to review |
|-----------|--------|--------------------------|
| 001 | 77f14f88d0 | sk-code hub SKILL.md rewritten in plain voice; sk-code 2.2.10.0 |
| 002 | de959a74ba | Goal criteria refreshed across the 011 and 066 trees |
| 003 | 722b80b957 | sk-git v1.8.4.0 changelog line for the playbook change |
| 004 | 8642195b24 | `dispatch-audit.mjs` reads escaped quotes in a `-c` payload; hooks `vitest.config.ts` skips node:test files |
| 005 | 1a37f602d4 | `hook-stdin-deadline.test.mjs` late-write rows for every short-deadline entry; hooks README paragraph; system-spec-kit 2.7.8.0 |
| 006 | 2805dc75f7 | `compiled-route-sync.cjs --check` compares served copies with their authored files |
| 007 | d3ccf503e1 | `reduce-state.cjs` reduces a review folder without a config file |
| 008 | e3a67a5c58 | The OpenCode advisor plugin sends the workspace surface as `surfaceHint` |
| 009 | d04df31790 | Scaffold keywords in `init_skill.py`, recompiled deep command contracts, system-deep-loop 1.5.6.0, the open-items ledger |

Review lenses, in this order:
1. **Correctness**: does each change do what its phase claims, read against the code it touches.
2. **Regressions**: `node .skilled/bin/compiled-route-sync.cjs --check`, `node .skilled/bin/compiled-route-guard.cjs`, all hub canaries (`node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs`) and `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`.
3. **Test quality**: does each new or changed test fail without its fix.
4. **Version and changelog hygiene** for each release in the range.
5. **Comment hygiene**: no spec paths, phase numbers or finding ids in code comments.
6. **Prevent-overengineering**: each change against `.skilled/repo-rules/prevent-overengineering.md`.
7. **Claim fidelity**: each 015 phase's `spec.md`, `goal.md` and `implementation-summary.md` against its commit, and the 009 ledger's states against today's tree.

The files under review are listed in `goal-file-manifest.txt`. Derived artifacts are checked with their generator's `--check` mode rather than read.

### Out of Scope
- Changing any product file in this phase. Findings name the fix, and a later phase builds it.
- The 016 phases 001 to 005, which are not in the range

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-closeout-deep-review/review/` | Create | Lineage state and the synthesized `review-report.md` |
| `006-closeout-deep-review/*.md`, `goal-file-manifest.txt` | Create | Phase docs and the review scope |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five iterations run on DeepSeek V4.1 Flash | The lineage records five iterations with route proof and a max-iterations stop |
| REQ-002 | Every kept finding is confirmed | Each finding in review-report.md names the command or read that confirmed it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
