---
title: "Tasks: Phase 61: Worktree build provisioning"
description: "Ordered tasks to make worktree provisioning build the outputs two runtime suites import, make those suites name the fix, and make provision target the worktree it runs in."
trigger_phrases:
  - "worktree build provisioning tasks"
  - "provision build step tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 61: Worktree build provisioning

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

- [x] T001 Trace both failures to their build outputs
  - Evidence: the purity suite reaches `cli-communication-projection/dist/index.js` through the `sk-communication-projection.js` plugin; the pi-extension suite reaches `system-skill-advisor/runtime/dist/runtime/lib/policy-plan.js` through `spec-gate-core.mjs`.
- [x] T002 Read the provisioner and its list
  - Evidence: `provision_worktree` only installed; the list had no projection line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Name each package's build output in the list (`sk-git/scripts/worktree-provision-paths.txt`)
  - Evidence: a second field per line; the advisor and projection lines carry theirs.
- [x] T004 Build a package whose listed output is missing (`sk-git/scripts/worktree-naming.sh`)
  - Evidence: a build step after the install step; a build that fails, or exits 0 without its output, counts as failed; the summary line reports built packages.
- [x] T005 Default provision to the worktree it runs in (`sk-git/scripts/worktree-naming.sh`)
  - Evidence: `git rev-parse --show-toplevel` replaces the primary-checkout default for `provision_worktree` only; allocation is unchanged.
- [x] T006 Test with npm stubbed (`sk-git/scripts/tests/worktree-naming.test.sh`)
  - Evidence: nine new assertions, including a linked-worktree case; two unrequested `--no-provision` flags on existing tests reverted.
- [x] T007 Name the fix in both suites (`runtime/tests/opencode-plugins-folder-purity.vitest.ts`, `runtime/tests/spec-gate-pi-extension.vitest.ts`)
  - Evidence: the purity suite rewraps a missing `/dist/` module; the pi-extension suite checks for the advisor build before loading its imports.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the naming suite
  - Evidence: `worktree-naming.test.sh` PASS=80 FAIL=0.
- [x] T009 Negative control against the previous script
  - Evidence: PASS=73 FAIL=7; the six build assertions and the linked-worktree output assertion fail.
- [x] T010 See both suites name the fix before provisioning
  - Evidence: the purity suite failed with the provision command in its message; with the advisor build moved aside for one run, so did the pi-extension suite.
- [x] T011 Provision this worktree and rerun both suites
  - Evidence: `worktree-naming.sh provision`, run with no argument from the worktree, printed `0 installed, 1 built, 9 already present, 0 failed`; the primary checkout's status was unchanged; both suites 10 passed.
- [x] T012 Check the test typecheck adds no errors
  - Evidence: `tsc -p runtime/tsconfig.tests.json` reports the same 91 errors with and without this phase's test edits.
- [x] T013 Update documentation
  - Evidence: this phase's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`.
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
