---
title: "Implementation Plan: Phase 12: fix the Skilled findings of the second overlay layout review"
description: "Fix the relayout error contract, the overlay-folder and layout-link containment and the git option guard in the overlay engine, each with a test that fails first, then correct the doctor docs, the workflows and the packet records, on a fresh worktree branch merged into local Skilled main."
trigger_phrases:
  - "review round 2 fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: fix the Skilled findings of the second overlay layout review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, YAML workflow assets, Markdown references |
| **Framework** | None |
| **Storage** | Git object stores, overlay manifests and JSON state files |
| **Testing** | `node --test` for the doctor scripts, vitest for system-deep-loop |

### Overview
The engine fixes land on `worktrees/495-overlay-review-round-2-fixes` one worker at a time, because they share `overlay-engine.cjs`, and the doc and workflow fixes land beside them. Each engine fix gets a test that fails on the unfixed engine. The packet records are corrected on main, and the branch merges into local Skilled main.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding confirmed or rejected against main tip `95aa07427ec` (spec.md Measured Behavior)
- [x] Baseline gates captured on the worktree at main tip
- [x] The new engine lines fixed before the doc work started, so docs and code name the same text

### Definition of Done
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with more than 263 tests
- [ ] `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0 with 20 tests
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` exits 0 with 9 tests, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] `node --test` on `release-update.test.cjs` and `doctor-update-contract.test.cjs` exits 0 with 95 tests
- [ ] The system-deep-loop vitest files phase 009 touched exit 0 with 209 tests
- [ ] `generate-trigger-index.mjs --check` exits 0
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this phase, 003, 007, 008 and the parent with `--recursive`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer, and keep every failure inside a printed contract.

### Key Components
- **`relayoutUnderLock`**: guards the backup copy and the prune, and counts the files `copyForBackup` skips so the restore-failed line can say which moved copies the backup lacks.
- **`resolveOverlayDir`**: resolves an existing in-tree folder and refuses one that lands outside the tree, and names the reason when a sibling resolves into or around the tree.
- **Layout-link containment**: one check of `layoutLinks[].path` and `replaces.path` against the tree root, run where planning runs and before a relayout writes, so the rollback can never write through an escaping path.
- **Git revision arguments**: `--end-of-options` before every manifest-derived revision passed to `git cat-file` or `git rev-parse`.

### Data Flow
The setting and the manifest are read once per command. Each containment check runs before the first write that uses the value it checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup proves the phase 009 fix and takes the baseline, Implementation lands the engine fixes one after another beside the doc fixes, and Verification reruns the gates on the branch and on merged main.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new engine test runs first against the unfixed engine and must fail there for the reason its finding names. The gate script then runs the whole set on the branch and again on merged main, and each count is compared with its baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`git` 2.50, which accepts `--end-of-options` after `cat-file blob`, and Node. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a gate on merged main falls below its baseline. Revert the merge commit on main with `git revert -m 1 <merge>`; the fix commits stay reachable on their own.
<!-- /ANCHOR:rollback -->

---
