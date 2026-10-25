---
title: "Tasks: Phase 10: review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold this phase and add it to the parent phase map (`../spec.md`)
- [x] T002 Record the baseline: the surface-hint suite printed `pass 7`, `fail 1`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove `concurrency group` and add `.github/workflows/` in the CI vocabulary (`.skilled/skills/sk-code/{ROUTER.md,hub-router.json,graph-metadata.json,sk-code-ci/SKILL.md}`)
- [x] T004 [P] Fix the `sk-code-ci` rules and templates (`references/`, `assets/`)
- [x] T005 [P] Fix the `/doctor:ci` hint, the doctor contract operations and the `ci-report.cjs` comment
- [x] T006 [P] Reconcile the parent and the child phase records
- [x] T011 Fix the surface contract text in the hub `SKILL.md`, `hub-router.json` and `sk-code-ci/SKILL.md`, and add the three single-route replays (operator-delegated decision, 2026-10-25)
- [x] T007 Regenerate the skill graph, the activation manifest and its authored copy, and the Hermes copy
- [x] T012 Rewrite the stale routing-suite comment in `.github/workflows/routing-registry-drift.yml`, which still said the gate installs only vitest although the setup step now provisions the advisor runtime tree. The `33 of 33` counts in `sk-code-ci` were already `32 of 32`, fixed in `0781e81da2`, against 32 files in `.github/workflows/`. The stale comment in `system-skill-advisor/runtime/vitest.config.ts:18-24` now says the config avoids a vitest import because CI runs the suites under an npx-pinned vitest that can differ from the runtime's own range
- [x] T013 Make the `/doctor:ci toggle` refusal of `SKILLED_CI=off` state its reason. The refusal is intended: the workflows README says the master switch must stay unset because it skips `message-contract.yml`, the only required check. The message, the presentation contract and `ci.md` now name that reason, and the contract test asserts the two copies match (`doctor-ci-toggle.yaml`, `doctor-ci-presentation.txt`, `ci.md`, `doctor-ci-contract.test.cjs`)
- [x] T014 Align the 003 AC-005 and AC-006 criterion text with the verified proof, with a dated amendment marker and a decision-record amendment
- [x] T015 Trace the part of the 002 baseline band left unexplained: 891 min of pull_request runs the push-only pre-change window never held, 564 from the 003 probe branches and 327 from Dependabot (`002/scratch/baseline-24h/pr-runs-by-branch.json`)
- [x] T016 Report the old 1.12 GB provision cache entry without deleting it. It is gone from `gh cache list`, and the current key could not hit it (`004/scratch/cache-adoption-runs.md`)
- [x] T017 Exclude the ClickUp placeholder tree from worktree provisioning so the green final `main` commit the closure needs holds. Commit `1722864b46` tracked `mcp-click-up/mcp-servers/clickup-mcp/package.json`, which declares no dependencies, and the completeness test in `worktree-naming.test.sh` failed on it as unlisted. The second failing test copies the real list, so the same entry fixes it. The `excluded:` entry follows the obsidian-mcp one (`.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`). Evidence: the suite printed `PASS=160 FAIL=2` before and `PASS=162 FAIL=0` after
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the surface-hint suite, the serial compiled-route suites, router-sync, the drift guards and the parent-skill check
- [x] T009 Probe the path keyword and the guard prompt through the front door
- [x] T010 Run recursive strict validation on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



