---
title: "Implementation Plan: Phase 37: ci-pi-and-provisioning-follow-ups"
description: "A discovery job feeds the Pi workflow's matrix and each leg adds typecheck and pack steps. Provisioning takes its source fingerprint before the build and writes it after success. A battery test runs main() through a symlinked nested root, the sk-doc runner pins the TAP reporter, and the workflows README lists every workflow."
trigger_phrases:
  - "ci pi and provisioning follow ups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 37: ci-pi-and-provisioning-follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, bash, Node.js |
| **Framework** | None |
| **Storage** | Provision stamps under the worktree's git directory |
| **Testing** | `worktree-naming.test.sh`, `node --test`, `actionlint` |

### Overview
Five independent changes, one commit each. The Pi workflow gains a `discover` job whose JSON list drives the matrix, and each leg runs `typecheck` and `check:pack` when the extension defines them. `provision_worktree` keeps the fingerprint it takes before the build and `_wn_record_build` writes that value. The battery test file gains an end-to-end test through a symlinked alias. The sk-doc runner pins `--test-reporter=tap`. The workflows README gains rows for every workflow.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other - CI and developer tooling.

### Key Components
- **`discover` job**: finds `.pi/extensions/*/package.json`, writes the sorted folder names as a JSON array output, and fails when there are none.
- **`provision_worktree`**: computes `_wn_input_fingerprint` before the build command and passes it to `_wn_record_build` after a successful build that left its artifact.
- **`_wn_record_build <dir> <pkg> <fingerprint>`**: writes the given fingerprint as the stamp instead of computing one.
- **Battery test**: `main()` through `fs.symlinkSync(real, alias)` of a root nested under an outer `.opencode/plugins`.
- **`run-script-tests.sh`**: `node --test-reporter=tap` for the listed node tests.

### Data Flow
The discovery output reaches the matrix through `needs.discover.outputs.extensions`. The fingerprint flows from before the build to the stamp after it; the next provision compares the stamp with a fresh fingerprint.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each change has a check that fails on the old code. The new provisioning test fails 2 expectations on the old order. The new battery test fails when ancestor detection stops resolving symlinks. A failing node:test fixture gives no `not ok` line on Node 26 without the reporter pin. The discovery step is dry-run on the repository, on a fixture with a third extension and a folder without `package.json`, and on an empty folder. The real worktree is provisioned with its stamps moved aside and then again, to show the five listed builds go idle. The cite-drift test was run 170 times locally and its CI history read.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

GitHub Actions' `fromJSON` on a job output for the matrix. `jq` on the hosted runner. Node's `--test-reporter` flag, present in Node 22 and 26.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commits. Each touches its own files, so any one can be reverted alone: the Pi workflow returns to its hand-written matrix, provisioning to its after-the-build stamp, the runner to the default reporter, and the README and the test lose their additions.
<!-- /ANCHOR:rollback -->

---
