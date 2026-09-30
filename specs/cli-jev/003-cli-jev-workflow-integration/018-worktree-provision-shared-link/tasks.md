---
title: "Tasks: Phase 18: worktree-provision-shared-link"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "worktree provision spec-kit link tasks"
  - "wn deps satisfied fix tasks"
  - "sk-doc link repair tasks"
  - "worktree naming harness fixture tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: worktree-provision-shared-link

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read `sk-git` SKILL.md rule 8 and `scripts/tests/README.md`, and `sk-code`'s OpenCode shell style guide and checklist (`.skilled/skills/sk-git/SKILL.md`). Evidence: read rule 8 (install by default, no shared path resolving to the source checkout), the harness README (`set -uo pipefail`, `FAIL=0` summary), `sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md` and `assets/checklists/shell-checklist.md`
- [x] T002 Rerun `git log -5` and `git status --short` on the three `sk-git` script paths and record any change newer than `b946bc9e95` (`.skilled/skills/sk-git/scripts/`). Evidence: `git log -3 -- worktree-naming.sh tests/worktree-naming.test.sh worktree-provision-paths.txt` lists `b946bc9e954` (2026-09-24) as the newest. The only newer commit under `scripts/`, `17c4729ab4`, touches `remote-branch-allowlist.txt` alone. `git status --short -- .skilled/skills/sk-git` printed nothing, exit 0
- [x] T003 Run the harness and record the baseline summary line (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`). Evidence: `worktree-naming tests: PASS=80 FAIL=0`, exit 0, no `FAIL:` line
- [x] T004 [P] Run the read-only per-package survey from AC-002 and record that every package reads satisfied (`.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`). Evidence: a sourced `_wn_deps_satisfied` loop over the list printed `satisfied` for all nine packages with a `package.json`, `.skilled/skills/sk-doc` included, and `no-manifest .` for the root line. `ls .skilled/skills/sk-doc/node_modules` reported no such directory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Change the name choice in `_wn_deps_satisfied` to fall back to the first declared dependency when none is outside `@spec-kit/` (`.skilled/skills/sk-git/scripts/worktree-naming.sh`). Evidence: `worktree-naming.sh:488-490` now keeps every declared name in `all`, filters `@spec-kit/` into `names`, and prints `names[0] || all[0] || ""`
- [x] T006 Add one sentence to the comment block above `_wn_deps_satisfied` stating the rule for `@spec-kit/*` entries, with no spec path or id (`.skilled/skills/sk-git/scripts/worktree-naming.sh`). Evidence: `worktree-naming.sh:478-480`. `rg -n -e 'specs/' -e 'REQ-[0-9]' -e 'AC-[0-9]' -e 'cli-jev'` on the script exits 1 with no match, and the same pattern counts 10 matching lines in this phase's `spec.md`, so the search reads the file
- [x] T007 Add fixtures `spec-kit-only` and `spec-kit-and-real` to the fixture tree and path list, and make the stub `npm` also create `node_modules/@spec-kit/shared` (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`). Evidence: `spec-kit-only` declares `"@spec-kit/shared": "file:../shared"`. `spec-kit-and-real` declares `@spec-kit/shared` then `left-pad` and starts with only `node_modules/@spec-kit/shared`. The stub's `ci|install` branch makes both `node_modules/left-pad` and `node_modules/@spec-kit/shared`
- [x] T008 Add three assertions: `spec-kit-only` logs one install line after both runs, `spec-kit-and-real` logs one install line although its link was present, and `needs-build` logs no install line (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`). Evidence: three `expect_eq` calls after the second fixture run, counting `install` or `ci` lines per package in the stub's log
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `bash -n` and `shellcheck` on both changed files. Evidence: `bash -n` exits 0 on both. `shellcheck` exits 1 on both, the same as on the `HEAD` copies: `worktree-naming.sh` has 2 findings before and after (SC2088, SC2254), the harness 11 before and after (SC2164, SC2030, SC2031, SC1091). A line-number-free diff of the two finding sets is empty for each file, so the edit adds no finding
- [x] T010 Run the harness and confirm `FAIL=0` with three more passes than T003. Evidence: `worktree-naming tests: PASS=83 FAIL=0`, exit 0, against the baseline `PASS=80 FAIL=0`
- [x] T011 Revert only T005 and confirm the `spec-kit-only` case fails, then restore it. Evidence: with `names[0] || ""` restored, the harness printed `FAIL: spec-kit-only installs once across both runs (exp='1' got='0')` and `PASS=82 FAIL=1`, exit 1. Removing only the filter printed `FAIL: spec-kit-and-real installs although its link was present (exp='1' got='0')`, exit 1. Returning 1 for a package that declares nothing printed `FAIL: needs-build declares nothing and is never installed (exp='0' got='2')`, exit 1. `cmp` against the saved fixed copy exited 0 after each restore
- [x] T012 Rerun the survey and confirm only `.skilled/skills/sk-doc` reads unsatisfied. Evidence: the loop printed `UNSATISFIED .skilled/skills/sk-doc` and `satisfied` for the other eight. The exact AC-001 call for `sk-doc` exits 1 and the exact AC-002 call exits 0 for each of the other eight
- [x] T013 Confirm `git status --porcelain -- .skilled` lists only the two changed files. Evidence: it printed ` M .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` and ` M .skilled/skills/sk-git/scripts/worktree-naming.sh`. `git diff --quiet` on `worktree-provision-paths.txt` exits 0, and `git status --porcelain -- .skilled/skills/sk-doc` prints nothing
- [x] T014 Ask the operator for the repair install, naming the rollback `rm -rf .skilled/skills/sk-doc/node_modules`. Evidence: the operator said yes on 2026-09-27, relayed by the orchestrator
- [x] T015 After the yes, check `shared/dist/frontmatter/parse-frontmatter.js` exists, run `provision` (or `npm ci` in `sk-doc` if the survey names more than `sk-doc`), then check the link's real path and run `parent-skill-check.cjs .skilled/skills/sk-doc`. Evidence: the precheck found the `dist` file and both listed build outputs present. the orchestrator ran `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision` after the operator's yes on 2026-09-27. It printed `provisioning .skilled/skills/sk-doc (ci)` and `provisioned: 1 installed, 0 built, 8 already present, 0 failed`, exit 0. A second run printed `provisioned: 0 installed, 0 built, 9 already present, 0 failed`. Rechecked by this build: `readlink .skilled/skills/sk-doc/node_modules/@spec-kit/shared` prints `../../../system-spec-kit/shared`, its `pwd -P` is this worktree's `.skilled/skills/system-spec-kit/shared`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0
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

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 and 4
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6, all three dependencies met, including the operator's yes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `bash -n` exits 0 on both files, and `shellcheck` findings are identical to `HEAD` (none on edited lines)
- [x] CHK-011 [P0] No console errors or warnings. Evidence: harness output holds no `FAIL:` line and no stray error output, `PASS=83 FAIL=0`
- [x] CHK-012 [P1] Error handling implemented. Evidence: an unparsable `package.json` still exits the `node -e` call with 1 and the package is installed, unchanged by this build
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the change stays inside the existing `node -e` call and follows the harness's `expect_eq` pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, 6/6 Met, `AC_CLOSURE` closeable
- [x] CHK-021 [P0] Manual testing complete. Evidence: `parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK`, exit 0, after the repair
- [x] CHK-022 [P1] Edge cases tested. Evidence: the three new assertions cover a `@spec-kit`-only package, a mixed package with only the link present, and an empty manifest
- [x] CHK-023 [P1] Error scenarios validated. Evidence: reverting each behavior makes its own assertion fail with exit 1 (T011)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.. Class: `class-of-bug`, any listed package declaring only `@spec-kit/*` entries
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.. Evidence: the survey over every listed package shows only `sk-doc` in that class, and `rg` finds the one `@spec-kit/` filter
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.. Evidence: `rg -n '_wn_deps_satisfied'` lists the definition (`:481`) and the one caller (`:524`)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.. N/A: no security, path, parser or redaction surface changed. The manifest read is unchanged
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.. Evidence: `plan.md` affected-surfaces lists the axes, declared kinds (none, `@spec-kit` only, real only, both) against link state (absent, present, dangling), with the dangling row untested and why
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.. N/A: the check reads no process-wide state beyond `PATH`, which the harness sets per run
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.. Evidence: pinned to the uncommitted diff of the two `sk-git` files against `HEAD` `2d832edb0b`. The orchestrator commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff adds no credential or token
- [x] CHK-031 [P0] Input validation implemented. Evidence: the manifest parse fails closed, unchanged
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, plan, tasks, acceptance criteria, goal and summary agree on Complete
- [x] CHK-041 [P1] Code comments adequate. Evidence: `worktree-naming.sh:478-480` states the rule, with no ids
- [x] CHK-042 [P2] README updated (if applicable). N/A: the harness README states no pass count to update, and `sk-git` SKILL.md names no `@spec-kit/` filter
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: temporary survey and output files lived in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---



