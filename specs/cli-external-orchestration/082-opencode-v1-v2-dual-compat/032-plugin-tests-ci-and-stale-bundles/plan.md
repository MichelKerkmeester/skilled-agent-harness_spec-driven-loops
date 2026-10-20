---
title: "Implementation Plan: Phase 32: plugin-tests-ci-and-stale-bundles"
description: "A new blocking workflow provisions every listed tree and runs the OpenCode plugin suites on Node 22, Spec-Kit Check's triggers gain the plugins folder, and provisioning rebuilds a listed output when the fingerprint of its git-tracked sources differs from the one it recorded at the last build."
trigger_phrases:
  - "plugin tests ci and stale bundles plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 32: plugin-tests-ci-and-stale-bundles

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, bash, Node 22 test runner |
| **Framework** | `node:test`, the sk-git bash test harness |
| **Storage** | None |
| **Testing** | `worktree-naming.test.sh`, `node --test`, `actionlint`, `check-gate-inputs.sh` |

### Overview
The plugin suites get their own workflow rather than a step in the dual-version battery: they read files across `.skilled`, `.opencode` and `.pi`, so they need a wide trigger, and widening the battery's would install both OpenCode families on nearly every commit. Provisioning keeps its missing-output rule and adds a stale-output rule driven by a stamp it records after each build: a fingerprint of the git-tracked inputs, so files a build writes never re-trigger it, a deleted input does, and a build that writes nothing new cannot loop.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CI gate plus an idempotent provisioning rule.

### Key Components
- **`opencode-plugin-tests.yml`**: checkout, Node 22, `provision_worktree "$GITHUB_WORKSPACE"` with bun 1.3.9 on PATH, then `node --test '.opencode/plugins/tests/*.test.cjs'`. Node 22 takes a glob there, not a directory.
- **`_wn_input_fingerprint`**: describes every git-tracked path under the package and its extra sources as it is on disk (content blob from `git hash-object --stdin-paths`, symlink target, or missing) and hashes the sorted description.
- **`_wn_output_stale`**: reports `unrecorded` when the package has no stamp, and `changed` when the current fingerprint differs from the stamp; it compares no file times; outside a git work tree it never succeeds.
- **`_wn_record_build`**: after a successful build, writes the current fingerprint to the package's stamp under the worktree's git directory.
- **The build rule in `provision_worktree`**: builds when the output is missing, or rebuilds when it is stale, printing why.

### Data Flow
`git pull` changes the tracked inputs, so their fingerprint no longer matches the stamp; the next `provision` rebuilds that package and records the new fingerprint. A fresh checkout has no outputs, so it builds them as before and records stamps.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- The suite's import closure and file reads were traced with a module resolve hook and an fs wrapper (`scratch/trace/`), which set the trigger to the three source roots.
- The checks change content rather than times, and one sets a future modification time to prove times play no part; fixtures without their own `.git` run under `GIT_CEILING_DIRECTORIES`, because the suite itself runs inside a repository.
- A real worktree was provisioned twice after a fresh create, and once after touching a source, to show the rule neither loops nor misses (`scratch/real-reprovision-*.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the merge commit on main. The workflow and the trigger lines are self-contained, and the old build rule needs no data migration.
<!-- /ANCHOR:rollback -->

---
