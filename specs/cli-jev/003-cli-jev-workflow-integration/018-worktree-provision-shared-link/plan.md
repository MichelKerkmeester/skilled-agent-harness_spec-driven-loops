---
title: "Implementation Plan: Phase 18: worktree-provision-shared-link"
description: "Change the dependency check in sk-git's worktree provisioning so a package whose only dependencies are @spec-kit/* links is checked by its first link, prove it with three assertions in the owner's hermetic harness, then repair this worktree's sk-doc link with one approved install."
trigger_phrases:
  - "worktree provision spec-kit fallback plan"
  - "wn deps satisfied fix plan"
  - "sk-doc link repair rollback"
  - "worktree naming test fixture plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: worktree-provision-shared-link

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash with one inline `node -e` snippet, in `.skilled/skills/sk-git/scripts/worktree-naming.sh` |
| **Framework** | `sk-git` worktree provisioning (`provision_worktree` and `_wn_deps_satisfied`). Code and tests follow `sk-code`'s OpenCode shell standards, as `sk-git` SKILL.md line 101 routes them |
| **Storage** | None. The repair writes one gitignored `node_modules` tree |
| **Testing** | The owner's hermetic harness `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`, which runs `provision_worktree` in a `mktemp` repository with a stub `npm`. Plus `bash -n` and `shellcheck` on the two files |

### Overview
The node snippet in `_wn_deps_satisfied` keeps its choice of the first dependency outside `@spec-kit/`, and falls back to the first declared dependency of any name when there is none. The existing walk then checks that name, so a package whose only dependency is a `@spec-kit/*` link is installed until the link exists. The build adds two fixture packages and three assertions, then runs one approved install that makes this worktree's `sk-doc` link.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A data-driven shell provisioner. `provision_worktree` (`worktree-naming.sh:511-553`) reads `worktree-provision-paths.txt` and calls `_wn_deps_satisfied` per listed package. Only the dependency choice inside that function changes.

### Key Components
- **`_wn_deps_satisfied`** (`worktree-naming.sh:479-499`): picks one dependency name with `node -e`, then walks `node_modules` directories up to the worktree root the way Node resolves. The fix touches the name choice at `:486-488`
- **Comment block** (`worktree-naming.sh:471-478`): states the rule. It gains one sentence on `@spec-kit/*` entries
- **Harness provisioning section** (`tests/worktree-naming.test.sh:218-289`): a fixture tree, a path list and a stub `npm` whose `ci` and `install` make `node_modules/left-pad` (`:236-239`)

### Data Flow
`package.json` goes to the node snippet, which prints one name. The shell walks `<dir>/node_modules/<name>` from the package directory to the worktree root. Found means skipped. Not found means `npm ci` when a lockfile exists, else `npm install`.

The new name choice, as a sketch the build refines under `sk-code`:

```js
const all = Object.keys({ ...(manifest.dependencies || {}), ...(manifest.devDependencies || {}) });
const real = all.filter((n) => !n.startsWith("@spec-kit/"));
process.stdout.write(real[0] || all[0] || "");
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_wn_deps_satisfied` in `worktree-naming.sh` | Decides whether a listed package is already installed | Update the name choice and its comment | The three new harness assertions and the read-only per-package check |
| `provision_worktree` in `worktree-naming.sh` | The only caller (`:522`) | Unchanged | `rg -n '_wn_deps_satisfied' .skilled` lists the definition and this one call |
| `worktree-provision-paths.txt` | Lists the ten packages, `sk-doc` at line 40 | Unchanged | `git diff --quiet -- .skilled/skills/sk-git/scripts/worktree-provision-paths.txt` exits 0 |
| `tests/worktree-naming.test.sh` | Hermetic coverage of provisioning | Update: two fixtures, one stub line, three assertions | Harness prints `FAIL=0` with three more passes |
| `sk-git` SKILL.md rule 8 and `scripts/tests/README.md` | Describe provisioning and the harness | Unchanged. Neither names the `@spec-kit/` filter | `rg -n 'spec-kit/' .skilled/skills/sk-git/SKILL.md .skilled/skills/sk-git/scripts/tests/README.md` returns nothing |

Required inventories:
- Same-class producers: `rg -n 'startsWith\("@spec-kit/"\)' .skilled/skills/sk-git` finds the one filter. The read-only survey on 2026-09-27 found that `.skilled/skills/sk-doc` is the only listed package whose declared dependencies are all `@spec-kit/*`. `.skilled`, `system-spec-kit`, `system-spec-kit/shared` and `sk-communication/cli-communication-projection` declare no `@spec-kit/*` entry. No listed package declares nothing at all. `system-spec-kit/runtime`, `runtime/cli`, `system-skill-advisor/runtime` and `system-deep-loop/runtime` declare both kinds
- Consumers of changed symbols: `rg -n '_wn_deps_satisfied' . --glob '*.sh' --glob '*.md'`
- Matrix axes: dependency kinds declared (none, `@spec-kit` only, real only, both) against link state (absent, present, dangling). The new assertions cover `@spec-kit` only with the link absent and then present, both kinds with only the link present, and none. The existing cases cover real only. The dangling link is left untested, because `[ -d ]` already follows links and the fix does not touch the walk
- Algorithm invariant: a package reads as installed only when the name it is checked by exists on the walk. A `@spec-kit/*` name is used only when the package declares nothing else
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Each step and its observable check:

1. Collision check and baseline. `git log -5 --format='%h %ad %s' --date=short -- .skilled/skills/sk-git/scripts/` still shows `b946bc9e95` as the newest, `git status --short .skilled/skills/sk-git` is empty and the harness prints its baseline (`PASS=80 FAIL=0` on 2026-09-27)
2. Read-only survey. Source the script and call `_wn_deps_satisfied` per listed package, as in AC-002. Before the fix every package reads satisfied
3. Code change in `_wn_deps_satisfied` and its comment. `bash -n` and `shellcheck` on the script exit 0, and the survey now reports only `.skilled/skills/sk-doc` unsatisfied
4. Test change. The harness prints `FAIL=0` with three more passes. Reverting only the code change makes the `spec-kit-only` assertion fail, removing only the filter makes the `spec-kit-and-real` assertion fail, and a fallback that installs every package makes the `needs-build` assertion fail
5. Scope check. `git status --porcelain -- .skilled` lists only the two changed files
6. Repair, after the operator's yes. `test -e .skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` exits 0, the survey still reports only `sk-doc`, then `provision` prints `provisioned: 1 installed, 0 built, 8 already present, 0 failed` (the count as of 2026-09-27). `parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check` and exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `_wn_deps_satisfied` through `provision_worktree` on fixtures: a package with only a `file:` `@spec-kit/shared` dependency (installed, then skipped), and a package declaring `@spec-kit/shared` then `left-pad` with only the link present (installed), and the existing `needs-build` fixture, which declares nothing (never installed) | `worktree-naming.test.sh` with its stub `npm` |
| Integration | The real path list against this worktree, read-only | Sourced `_wn_deps_satisfied` loop |
| Manual | `parent-skill-check.cjs` on `sk-doc` after the approved repair | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator yes for the repair install | Internal | Yellow | Without it the code fix still lands. This worktree keeps failing `parent-skill-check.cjs`, and phases 008 and 009 cannot close here |
| `system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` | Internal | Green | Present in this worktree on 2026-09-27. Without it the link resolves and the require still fails |
| `sk-code` OpenCode shell standards | Internal | Green | The build reads them before editing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the harness fails after the change, the survey reports a package other than `sk-doc` changing, or the repair leaves `parent-skill-check.cjs` failing
- **Procedure**: before a commit, restore both files with `git checkout -- .skilled/skills/sk-git/scripts/worktree-naming.sh .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`. After a commit, `git revert` it. Undo the repair with `rm -rf .skilled/skills/sk-doc/node_modules`
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

Config has no work in this phase. The repair runs inside Verify and waits for the operator's yes.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 30 minutes, plus the wait for the operator's yes |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

No data changes and no flag apply. The repair's only state is the untracked `.skilled/skills/sk-doc/node_modules`.

### Rollback Procedure
1. Remove the repair: `rm -rf .skilled/skills/sk-doc/node_modules`
2. Revert the code: `git checkout --` on the two files before a commit, or `git revert` after
3. Verify: the harness prints its baseline count with `FAIL=0`, and `ls .skilled/skills/sk-doc/node_modules` reports no such directory
4. Notify: tell the orchestrator that phases 008 and 009 cannot pass `parent-skill-check.cjs` in this worktree

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
