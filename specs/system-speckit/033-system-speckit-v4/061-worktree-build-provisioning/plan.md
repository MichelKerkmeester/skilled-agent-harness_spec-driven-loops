---
title: "Implementation Plan: Phase 61: Worktree build provisioning"
description: "Let the provision path list name each package's build output, build a package when that output is missing, and make the two suites that import those outputs name the fix."
trigger_phrases:
  - "worktree build provisioning plan"
  - "provision build step plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 61: Worktree build provisioning

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash; TypeScript tests |
| **Framework** | None. A sourced shell library |
| **Storage** | `worktree-provision-paths.txt`, one package per line |
| **Testing** | The sk-git shell harness; Vitest, `root` project |

### Overview
Each line of the path list may now name a file the package's build writes. Provision installs as before, then builds the package when that file is missing, and counts a build that exits 0 without writing it as a failure. The two suites check for the output they need, or catch the missing module, and fail with the provision command in the message.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend in place: a second field in the list, a build step in `provision_worktree`.

### Key Components
- **Path list**: `<package dir> [<build output relative to it>]`.
- **`provision_worktree`**: install when dependencies are missing, then build when the listed output is missing; report installed, built, already present and failed.
- **Suites**: the purity suite catches a missing build output per plugin; the pi-extension suite checks for the advisor build before its imports run.

### Data Flow
`worktree-naming.sh create` or `provision` reads the list in order, so a package another package's build depends on is installed first.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The shell harness copies the script and a test list into its throwaway repo and stubs npm on the path, so no test installs or builds anything real. It checks that a missing output is built once, an existing one is not, a second run builds nothing, and a build that fails or writes nothing fails provisioning. The suites are checked before and after provisioning this worktree: before, the purity suite must fail with the new message; after, both must pass.

### Delivery
A GPT-6 Luna executor wrote the script, list and test changes from a brief. The orchestrator reviewed the diff, reverted two unrequested `--no-provision` flags Luna had added to existing tests, which pass without them, and ran the negative control. The first real run of provision exited 0 having built nothing, because with no argument it had checked the primary checkout; a second Luna brief made it default to the worktree it runs in, with a linked-worktree test.

### Deviation
The planned scope did not include the no-argument default. It was added because the phase's own goal, provisioning a worktree from inside it, failed without it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

npm on the path of whoever provisions; the advisor's build uses spec-kit's installed `tsc`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. Build outputs written by provisioning are gitignored and can be deleted.
<!-- /ANCHOR:rollback -->

---
