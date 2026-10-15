---
title: "Implementation Plan: Phase 2: doctor-git-setup"
description: "Build git-setup-check.cjs as a read-only battery shaped like the sk-code setup check, wire it as /doctor:git setup and prove with fixtures that it writes nothing."
trigger_phrases:
  - "doctor git setup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: doctor-git-setup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script, Bash helpers, YAML workflow |
| **Framework** | The `/doctor` command router and its `_routes.yaml` manifest |
| **Storage** | None. The battery reads git config and files only |
| **Testing** | `node:test` under `.skilled/commands/doctor/scripts/tests/`, run by `run-all.sh` and the CI `doctor-scripts` job |

### Overview

`git-setup-check.cjs` copies the shape of `sk-code-setup-check.cjs`: a list of checks, each spawned with an argv array and no shell, judged PASS, FAIL, SKIP or UNKNOWN, with repair lines and a final `STATUS=` line. It adds a `--json` mode the sk-code battery lacks. Each check reuses an existing read-only entry point and never one that writes. The route, a one-step workflow and presentation entries make it `/doctor:git setup`. [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:83-149] [SOURCE: .skilled/commands/doctor/_routes.yaml:220-234]
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
- [ ] `run-all.sh` passes with the new test file, and `route-validate.sh` passes
- [ ] Docs updated (spec, plan, tasks and every target list in scope)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A doctor battery: a thin router hands a bound target to a one-step workflow YAML, which runs one check-only script and maps its exit code to a status.

### Key Components
- **`git-setup-check.cjs`**: the eleven checks, human and JSON output, exit 0 for all passed, 1 for a failing check and 2 when the battery cannot run.
- **`doctor-git-setup.yaml`**: one read-only step with a `mutation_boundaries` block that forbids every write target.
- **`_routes.yaml` row**: `target: setup`, `mutating: read-only`, `gate3_location: "n/a (read-only setup battery; writes nothing)"`.
- **Presentation entries**: the menu option, help text, valid targets line and the per-check result table.

### Data Flow
The router binds `setup`, the workflow runs the script from the repository root, and each check reads one source and returns a result row. The script prints the rows, then `STATUS=OK checks=11` or `STATUS=FAIL failed=N skipped=M`, and the presentation renders them.

### Check Sources

| Check | Read-only source | Never call |
|-------|------------------|------------|
| Install | `SKILL.md`, `hard-rules.json` and `scripts/` under the battery's own root | Any installer |
| Hooks | `install-git-hooks.sh --status` | The installer without `--status` |
| Trust | `git config --local --get skilled.trustRepoHooks` and the common-dir match | `git config` with a value |
| Gates | `git-hook-gates.cjs list --json` and `lib/gates.tsv` | `git-hook-gates.cjs set --apply` |
| Standards | `resolveContractDir` and `loadContract` in `message-contract.mjs` | `git-standards.cjs init`, `set` or `disable --apply` |
| Allowlist | The allowlist file, matched through `worktree-naming.sh validate-*` | Any push |
| Worktrees | `worktree-naming.sh next`, the base settings and the provision list | `allocate`, `create`, `provision` |
| Commit-Id | `cip_repo_wants_ids` in `commit-id-policy.sh` and the allocator's presence | The Commit-Id allocator |
| Advisory rules | `hard-rules.json` checked against `GIT_CHECKS` in `lib/git-rule-checks.mjs` | |
| Suppression | `SKGIT_ADVISORY*`, `SYSTEM_*_DISABLED` and saved gate keys | |
| AI tool hooks | The active tool's hook config file, per the table in `scripts/hooks/README.md` | |

[SOURCE: .skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs:236] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:23-41] [SOURCE: .skilled/scripts/install-git-hooks.sh:112-150]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The battery inspects repositories that may be untrusted, so the same trust rule as the hooks applies to it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Helper resolution in `git-setup-check.cjs` | Loads Node and shell helpers | Resolve every helper from the battery's own root, never the inspected repository | A test plants a helper in the fixture repository and asserts it never runs |
| Entry points that write (`allocate`, `--apply`, `git config` with a value) | Owned by the hooks and standards targets | Unchanged, not a consumer | `rg -n 'allocate|--apply|config --(local|global) [a-z.]+ ' git-setup-check.cjs` returns no write call, and the no-write test |
| Target lists naming `hooks` and `standards` | Router, manifest, presentation, catalog, contract and playbook | Add `setup` | `route-validate.sh` parity and `rg -n 'hooks\|standards' .skilled/commands/doctor/git.md` |

**Invariant:** the battery produces no change to the inspected repository's files, git config or git directory, and runs no code from that repository. Adversarial cases: a planted `.skilled/` tree in an untrusted clone, a `skgit.contractDir` that points at a missing folder and a malformed `hard-rules.json`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each check against a temporary `git init` fixture, isolated with `GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1` as in `git-hook-gates.test.cjs` | `node:test` |
| Integration | The whole battery on a fixture, asserting exit codes, the `STATUS=` line and `--json` shape, plus a before-and-after tree snapshot and `git config --list` comparison | `node:test`, `snapshotTree` pattern from `doctor-update-compat.test.cjs` |
| Manual | `/doctor:git setup` on this checkout and on a fresh untrusted clone | The new playbook scenario |

[SOURCE: .skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs:24-39] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:175-196]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `install-git-hooks.sh --status`, `git-hook-gates.cjs list`, `message-contract.mjs` | Internal | Green | The matching check reports UNKNOWN |
| `GIT_CHECKS` export in `git-rule-checks.mjs` | Internal | Green | The advisory-rules check reports UNKNOWN |
| `route-validate.sh` target parity | Internal | Green | The new route cannot land until router and manifest agree |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the battery writes state, runs inspected-repository code or breaks `route-validate.sh`.
- **Procedure**: revert the phase commit. The change adds a target and touches no existing behavior, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (fixtures, test skeleton) ──► Core (battery script) ──► Wiring (route, workflow, presentation) ──► Docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Wiring |
| Wiring | Core | Docs, Verify |
| Docs | Wiring | Verify |
| Verify | Core, Wiring, Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Medium | 3 to 4 hours |
| Wiring and docs | Low | 2 hours |
| Verification | Medium | 1 to 2 hours |
| **Total** | | **7 to 9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data changes, so no backup is needed
- [ ] No feature flag. The target is new and opt-in by invocation
- [ ] CI `doctor-scripts` and route validation green

### Rollback Procedure
1. Revert the phase commit.
2. Rerun `route-validate.sh` and `run-all.sh` to confirm the two existing targets are intact.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
