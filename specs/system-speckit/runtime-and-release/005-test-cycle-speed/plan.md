---
title: "Implementation Plan: Test cycle speed: cut the spec-kit suite time and the gate stacking"
description: "Five cuts in order of saving per risk. The first makes a local npm test match what CI already runs and takes it from 29 minutes to about four."
trigger_phrases:
  - "test cycle speed plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Test cycle speed: cut the spec-kit suite time and the gate stacking

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest |
| **Framework** | Vitest projects |
| **Storage** | None |
| **Testing** | `npm test` in `system-spec-kit/runtime` and `system-deep-loop/runtime` |

### Overview
Most of the 29 minutes is one config line. `runtime/vitest.config.ts` collects the deep-loop suite, and CI does not use that config. Removing the line makes the local run match CI. The remaining cuts are smaller and each waits for a measurement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `validate.sh specs/system-speckit/runtime-and-release/005-test-cycle-speed --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One suite per skill, one command per suite.

### Key Components
- **`system-spec-kit/runtime/vitest.config.ts`**: what a local `npm test` collects. It includes `../system-deep-loop/runtime/tests/**` and loads that skill's setup file.
- **`system-spec-kit/vitest.config.ts`**: the `root` and `cli` projects CI runs. Neither includes a deep-loop file.
- **`system-deep-loop/runtime/vitest.config.ts`**: the deep-loop suite alone, which `deep-loop-runtime.yml` runs.

### Data Flow
A change to spec-kit runs the `root` and `cli` projects. A change to deep-loop, or to `system-spec-kit/shared`, runs the deep-loop suite. CI already works this way through its path filters.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline. Implementation is the five cuts below, one packet each. Verification reruns the timing.

| Cut | Change | File | Saving | Workflow change |
|-----|--------|------|--------|-----------------|
| 1 | Drop the deep-loop include and its setup file from the local config | `system-spec-kit/runtime/vitest.config.ts` | 1199 s of test time measured. About 29 min to about 4 min estimated | None |
| 2 | Make `npm test` run the `root` and `cli` projects CI runs | `system-spec-kit/runtime/package.json`, `scripts/run-tests.mjs` | No saving. Adds about 10 min measured and closes a coverage gap | None |
| 3 | Write the rerun rule: the touched project locally, the full matrix in CI, no full rerun after a rebase that moved only generated files | `system-spec-kit/references/` and `sk-code-skilled` verify doctrine | One full run saved per rebase, 29 min measured | None |
| 4 | Profile the ten slowest deep-loop files, then cut fixed waits and repeated setup | `system-deep-loop/runtime/tests/` | Up to 54% of test time is in ten files, measured. The share that can go is unknown until profiled | None |
| 5 | Turn on file parallelism after each file has its own temp root | Both `vitest.config.ts` files | Estimated at half or better. Not measured | None |

Cut 2 costs time and still comes second, because a local green that skips 203 files CI runs is the larger risk. Cuts 1 and 2 together give one command of about 14 minutes that matches CI for spec-kit. The `cli` project can be split the way CI splits it, with `upgrade-legacy` alone, when that is too slow.

Three process habits cost more than any file did. The full suite ran after each rebase. Gates were stacked, so one change paid for the suite, the alignment battery and the doctor checks even when it touched one of them. Nine docs restate the schema version, so a version bump fans out into nine edits and their checks. Cut 3 covers the first two. The third is noted here and belongs to a docs packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each cut measures before and after with the same command and reports both numbers. Cut 1 is proven by the file count: `npm test` in `system-spec-kit/runtime` must report 133 files, which is 299 less the 166 deep-loop files, and `npm test` in `system-deep-loop/runtime` must still report 166.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the two runtimes' installed packages.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a cut drops a test file CI still expects locally. Each cut is one commit in its own packet, so `git revert` of that commit restores the earlier run.
<!-- /ANCHOR:rollback -->

---

