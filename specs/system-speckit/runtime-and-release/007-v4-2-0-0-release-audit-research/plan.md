---
title: "Implementation Plan: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "Two research runs audited v4.2.0.0, first its release notes and then its logic and features. This plan covers fixing every defect the second run and its independent verification confirmed, in worktree 545."
trigger_phrases:
  - "v4 2 0 0 release audit research plan"
  - "v4.2.0.0 audit fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.4 -->
# Implementation Plan: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS and TypeScript runtime code, Python, POSIX shell, workflow YAML |
| **Framework** | node:test and vitest suites, the Python scorer tests, shell test harnesses |
| **Storage** | Markdown and JSONL state in spec packets, the skill-graph SQLite database |
| **Testing** | One regression test per behavior change, plus every touched suite in full before and after |

### Overview
The first research run audited the release notes, and its two bugs were fixed before the v4.2.0.0 tag. The second run audited the shipped logic and features, and a fresh verifier confirmed its findings. This plan fixes all of them in worktree `545-v4-2-audit-fixes`, split into five groups that touch disjoint files so they can run in parallel.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Every in-scope finding has a `Met` row in `acceptance-criteria.md`
- [ ] Every touched suite passes in full, with before and after counts in `implementation-summary.md`
- [ ] `validate.sh <packet> --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Five parallel fix groups, one owner each, with disjoint files.

### Key Components
- **Group A, deep-loop runtime:** `fanout-run.cjs` win32 stop and `--stop`, the `fanout-merge.cjs` frontier trust gate, the `--extend` warning in `workflow-steps.cjs` and the fan-out branch of `gate_pre_synthesis` in `deep-research.yaml` and `deep-review.yaml`.
- **Group B, Claude Stop hook:** escaped transcript paths, the canonical save lock, row preservation, honest outcome reporting and a visible outcome line, in `session-stop.ts` and `decision-record-writer.ts`.
- **Group C, overlay engine:** shape-and-case destinations, the layout-link same-file check, pasteable remedies, a relayout restore line, whole-word flags, JSON errors and a rollback staleness check, in `overlay-engine.cjs`.
- **Group D, skill advisor:** a refused loop command lifting the deep-loop hub, fixed in the scorer's explicit lane `lanes/explicit.ts` with the routing baseline regenerated. The Python fallback's typed mark turned out to be dropped by the CLI's degraded path, so a test pins that instead of a code change.
- **Group E, operator UX:** the `create.sh` sub-track remedy, the `skilled-loop` goal-hop warning and the `worktree-naming.sh` skill-graph checks.

### Data Flow
Each group reads its finding ids from `research/research.md` sections 2, 4 and 12, confirms them in the code, fixes them with a regression test and reports. The orchestrator reviews each diff, reruns the suites and records the evidence here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Phase 1 recorded the audit and its verification, and amended the scope. Phase 2 runs the five groups in parallel. Phase 3 reviews every diff, reruns each group's suites from the final state, fills `acceptance-criteria.md` and validates the packet. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each group captures a baseline of every suite that covers its files, adds one regression test per behavior change that fails without the fix, and reruns those suites in full afterwards. The orchestrator reruns the same suites from the final worktree state before any completion claim.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `python3`, `bash` and `git`, plus the installed dependencies of the system-spec-kit, system-skill-advisor and system-deep-loop runtimes that worktree provisioning set up.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All fixes live on branch `worktrees/545-v4-2-audit-fixes`. Before a merge, the rollback is removing the worktree and its branch. After a merge, it is reverting the merge commit on main.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Record and scope | The research run and its verification | 2 |
| 2. Fix groups A to E, in parallel | 1 | 3 |
| 3. Review and verify | 2 | None |
<!-- /ANCHOR:phase-deps -->

---
