---
title: "Implementation Plan: Phase 9: close the four Skilled-side open items of the overlay layout"
description: "Fix the record-base pin resolution, the empty fan-out review scope, the pre-commit top-level probe and one playbook line, each at its source with a test, on the overlay layout worktree branch, then merge into Skilled main."
trigger_phrases:
  - "skilled open items plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: close the four Skilled-side open items of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, YAML workflow assets, Markdown references |
| **Framework** | None |
| **Storage** | Git object stores and JSON state files |
| **Testing** | `node --test` for the doctor scripts, vitest for system-deep-loop |

### Overview
Four independent fixes land on `worktrees/481-overlay-framework-root-layout`, one commit each, and merge into Skilled main. Each confirmed item gets a test that fails on the unfixed code. The gates below run before, on the branch, and on merged main.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each item confirmed or rejected with evidence (spec.md Measured Behavior)
- [x] Baseline gates captured on the worktree at main tip `b4799f7d547`
- [x] Dependencies identified (the running deep review, the shared engine helpers)

### Definition of Done
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with at least 262 tests
- [ ] `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0 with 20 tests
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` exits 0 with 9 tests, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] `node --test` on `release-update.test.cjs` and `doctor-update-contract.test.cjs` exits 0
- [ ] The system-deep-loop vitest files for terminal gates, fan-out config and review depth exit 0
- [ ] `generate-trigger-index.mjs --check` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer.

### Key Components
- **`release-update.cjs` pin resolution**: `tagCommit` fetches a full sha and then reads `FETCH_HEAD`. The fix resolves the requested sha itself after any fetch, reads a local upstream checkout directly when the remote is a folder, and refuses with every place it looked.
- **Fan-out root scope**: `step_fanout_root_config` hard-codes `reviewScopeFiles: []` and `step_scope_discovery` runs only in `phase_init`, which a fan-out skips. The fix runs scope discovery once at the fan-out root, writes the list to a file, and passes it to `fanout-run.cjs` through an optional input that lands in every lineage config.
- **Pre-commit top-level probe**: `stagedUnownedChanges` asks git for the top level from the vendored subfolder with the hook's environment. The fix uses `gitTopLevelOrNull`, which drops the hook's `GIT_DIR`, and leaves the index reads on the hook's environment.
- **Playbook line**: `large-reorg-playbook.md` §4b.

### Data Flow
Not applicable: the four fixes share no data path.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the four items and takes the baseline, Implementation lands one fix and test per item, and Verification reruns the gates on the branch and on merged main.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test is run against the unfixed code first and must fail there for the reason the item names. Then the gate script runs the full set on the branch and again on merged main, and each count is compared with its baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`git` 2.50 and Node. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a gate on merged main falls below its baseline. Revert the merge commit on main with `git revert -m 1 <merge>`; the four fix commits stay reachable on their own.
<!-- /ANCHOR:rollback -->

---
