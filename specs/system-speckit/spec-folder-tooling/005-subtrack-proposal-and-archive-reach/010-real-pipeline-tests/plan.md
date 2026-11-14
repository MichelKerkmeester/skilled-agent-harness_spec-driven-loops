---
title: "Implementation Plan: Phase 10: real-pipeline-tests"
description: "Add one vitest suite that builds a temp repository holding copies of the true writers, applies a relocation map twice, reruns after an induced failure and restores onto a taken number. Prove it reads the writers' output by removing one pipeline call in a scratch copy and watching the suite fail."
trigger_phrases:
  - "real pipeline tests plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: real-pipeline-tests

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript test files and Node.js ESM (`.mjs`) fixtures |
| **Framework** | vitest |
| **Storage** | A temp git repository per test, under the OS temp folder |
| **Testing** | vitest, run from `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase adds one suite, `runtime/cli/tests/relocate-real-pipeline.vitest.ts`, and changes no script under test. The suite builds a temp repository, runs `relocate.mjs` and `archive.sh` there with the six true writers and reads the stores they wrote. Proof is a mutation check: the suite fails when the migrate call is removed from a scratch `relocate.mjs` and passes on the real one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 006, 007 and 008 are committed
- [ ] T001 recorded the two existing suites staying green with the migrate call removed
- [ ] T002 listed what each true writer loads, and T003 measured one apply

### Definition of Done
- [ ] All five requirements pass their acceptance check
- [ ] From `runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate-real-pipeline.vitest.ts` exits 0, and exits 1 against the mutated scratch copy
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure absent from the baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Temp-repository integration suite

### Key Components
- **`relocate-real-pipeline.vitest.ts`** (new file): four cases, an apply run twice, two resume cases and one renumbering restore. Extending `relocate.vitest.ts` in place fails, because its shared setup at lines 55 to 66 writes the seven stubs every case in that file runs against, and a tree with the true writers needs a different builder.
- **Tree builder** (extend `tests/fixtures/subtrack-tree.mjs`, or a new `real-pipeline-tree.mjs` beside it): gives the temp repository what the true writers need. `relocate.mjs` takes the repository from the working directory at line 58 and its writers from beside its own file at lines 61 to 70, so T002 decides for each writer whether it runs in place or from a copy. A new file is created only if T002 shows the existing builder cannot be extended, and the task says which of its callers in `archive-track.vitest.ts` would break.
- **Failure wrapper** (inside the suite): a small script placed in front of one true writer that exits 1 on its first call and then runs the writer. It stands in for a real failure without replacing the writer's output.

### Data Flow
Each case builds the temp repository, commits it, runs `relocate.mjs` or `archive.sh` from inside it and reads `description.json`, `graph-metadata.json`, the track root and the `validate.sh` result. A guard reads `git status --porcelain` for the stores the writers touch, in the checkout the suite runs in, before and after the file runs.

### Shared Contracts
No script under test changes. The contract this suite must not break is the working tree of the real checkout: nothing under it is written. REQ-005 asserts that for the stores the writers touch, and not for the whole checkout, which another session may change while the suite runs.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the existing suites staying green on a mutated `relocate.mjs`, lists what each true writer loads and measures one apply. Implementation adds the tree builder and the four cases in `relocate-real-pipeline.vitest.ts`. Verification runs the mutation check, the full `npm test` against the baseline and the recursive validation of the parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The suite command is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate-real-pipeline.vitest.ts`, run from `runtime/cli`. It must exit 0 on the committed scripts and 1 on the mutated scratch copy.

The floor is one happy path and one edge case per surface. The relocate surface gets the double apply and a rerun after a late step failed. The identity surface gets a rerun after the migrate step failed. The restore surface gets one renumbering restore. Every assertion reads a value a true writer wrote, and no assertion restates what `relocate.mjs` computes, which is the gap this phase closes. The mutation check is run by hand and recorded, and is not a test case.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `bash`, `git`, the compiled runtime under `runtime/cli/dist` and the vitest binary at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest`. No new package. Phases 006, 007 and 008 must be committed first, because the resume and restore cases assert what they fix.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the suite changes the real checkout, or it fails for a reason that is not a defect in the pipeline.
- **Procedure**: revert the one commit that carries this phase. It removes the suite and its builder and leaves every script as it was.
<!-- /ANCHOR:rollback -->

---
