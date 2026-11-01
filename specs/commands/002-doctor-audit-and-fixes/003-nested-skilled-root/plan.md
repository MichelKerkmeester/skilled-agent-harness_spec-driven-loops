---
title: "Implementation Plan: Phase 3: nested-skilled-root"
description: "Routes the three doctor root walks through the shared sentinel resolver, keeps every existing override, and proves nested, decoy, checkout and symlinked layouts with one temporary-git-repository fixture."
trigger_phrases:
  - "nested skilled root plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: nested-skilled-root

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript: CommonJS scripts under `.skilled/commands/doctor/scripts/`, one ES module resolver imported synchronously |
| **Framework** | Node.js `node:test` and vitest; no application framework |
| **Storage** | None; every script in scope is read-only |
| **Testing** | `node --test` for the CommonJS suites, `vitest` for the freshness panel, `tests/run-all.sh` as the aggregate runner |

### Overview
Replace the three local root walks with a call to `findRepoRoot` from `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs`, keeping every argument each caller passes today. Prove it from a temporary git repository that holds a copy of the framework one folder below its git root, and prove the two unchanged layouts from the Skilled checkout and from a project whose `.skilled` is a symlink to it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The two failures are reproduced and recorded in `scratch/baseline-before-change.md`
- [ ] Each script's root consumers are listed with `file:line`
- [ ] The pre-change pass count of every suite that can see the change is recorded

### Definition of Done
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `fail 0`
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `0` failed suites
- [ ] The Skilled and linked-`.skilled` baselines print the same verdicts as `scratch/baseline-before-change.md`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-resolver delegation.

### Key Components
- **`shared/workspace/repo-root.mjs`**: owns the walk, the sentinel spellings and the hoist fallback. No change to it.
- **`lib/sk-skill-surface.cjs`**: keeps `findRepoRoot(start)` as its exported name, so `sk-skill-check.cjs`, `sk-skill-convert.cjs` and two test modules keep their call sites.
- **`skill-graph-freshness.cjs`**: keeps `SKILL_GRAPH_FRESHNESS_ROOT` above the resolver, so a fixture can still point the panel at a tree.
- **`parent-skill-check.cjs`**: keeps `REPO_ROOT` as the one module-level value every helper path is joined onto.

### Data Flow
A script starts at its own `__dirname`, hands that path to `findRepoRoot`, and receives the nearest directory holding `<name>/skills/system-spec-kit/SKILL.md` for `name` in `.skilled` or `.opencode`. Every repository-relative read is then joined onto that directory: `pathsFor()` for the surface probes, `rel()` for the freshness panel, and the `REPO_ROOT` constants for the parent-hub check.

### Per-Script Resolution

| Script | Start passed to the resolver | Value it assigns |
|--------|------------------------------|------------------|
| `lib/sk-skill-surface.cjs` | `options.startDir \|\| __dirname` | `repoRoot` in `createContext`, which every `pathsFor()` read and every `context.repoRoot` join uses |
| `skill-graph-freshness.cjs` | `__dirname` when `SKILL_GRAPH_FRESHNESS_ROOT` is unset | `REPO`, which `rel()` joins every graph, database and skills path onto |
| `parent-skill-check.cjs` | `__dirname` | `REPO_ROOT`, which the shared contract libraries, the canary fixture root, the commands directory, the skills root and the default target are joined onto |

### Fixture Shape
`tests/run-all.sh:81` runs every `tests/*.test.cjs`, so the new suite is one file the existing runner already executes.

```text
<F>/                                  # git init
  .opencode/                          # decoy: no skills/system-spec-kit/SKILL.md
  nested/.skilled/
    skills/system-spec-kit/SKILL.md   # sentinel the resolver looks for
    skills/system-spec-kit/shared/workspace/repo-root.mjs
    skills/sk-code/{SKILL.md,mode-registry.json,hub-router.json}
    skills/sk-code-terraform/SKILL.md  # the checked subject
    skills/system-deep-loop/{SKILL.md,graph-metadata.json}
    skills/<id>/graph-metadata.json   # two skills for the freshness scan
    skills/system-skill-advisor/runtime/scripts/skill-graph.json   # unique stamp
    skills/sk-doc/sk-create-skill/scripts/lib/*                     # parent-check load path
    commands/doctor/scripts/{sk-skill-check.cjs,skill-graph-freshness.cjs,parent-skill-check.cjs,lib/sk-skill-surface.cjs}
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/sk-skill-surface.cjs:84-98` | Producer: `.git` walk plus `git rev-parse` fallback, consumed by `createContext` at `:105` | Update | `rg -n "'\.git'" .skilled/commands/doctor/scripts` returns no root-selection line |
| `lib/sk-skill-surface.cjs:750-762` | Consumer: `resolveHubTarget` tests `context.skillsDir`, `context.cwd` and `context.repoRoot` in that order | Unchanged | `sk-skill-check` hub case prints `"hubPath": ".skilled/skills/sk-code"` |
| `sk-skill-check.cjs:402-405` | Consumer: runtime mirrors are read from `context.repoRoot` (`.claude`, `.opencode`, `.pi`, `.devin`) | Unchanged | New nested case reaches the report, so the mirrors are joined onto the fixture root |
| `sk-skill-check.cjs:463,483` | Consumer: shared description contract and `audit_descriptions.py --repo-root` | Unchanged | `sk-skill-check` suite keeps its 58 passes |
| `sk-skill-convert.cjs:108` | Consumer: calls `surface.findRepoRoot(SCRIPT_DIR)` directly | Unchanged | `sk-skill-convert` suite keeps its 69 passes |
| `skill-graph-freshness.cjs:46-57` | Producer: `.git` walk, overridden by `SKILL_GRAPH_FRESHNESS_ROOT` at `:55` | Update | Nested case prints the fixture's compiled stamp and no `panel error` |
| `skill-graph-freshness.cjs:311,316` | Consumer: a caught panel error is printed and exits 0 by default, 1 under `--strict` | Unchanged | Same contract asserted in the nested and linked cases |
| `parent-skill-check.cjs:74-82` | Producer: `.opencode` walk plus `path.resolve(start, '../../../..')` | Update | Decoy-`.opencode` case prints a `Resolved:` line under the framework copy |
| `parent-skill-check.cjs:133,149,153,163` | Consumer: advisor script, shared contract libraries, canary fixture and commands directory, all joined onto `REPO_ROOT` | Unchanged | The shared libraries load from the copy, so no `Cannot find module` appears |
| `parent-skill-check.cjs:1923,2480` | Consumer: skills root for the routing-shape ledger and the default target | Unchanged | `Resolved:` line names `<copy>/.skilled/skills/system-deep-loop` |
| `.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml:51` | Consumer: states the `.git` default to the operator | Update | `rg -n 'nearest ancestor.*\.git' .skilled/commands` returns no line |

Required inventories:
- Same-class producers: `rg -n "function findRepoRoot" .skilled/commands/doctor/scripts` returns three definitions (`lib/sk-skill-surface.cjs:84`, `skill-graph-freshness.cjs:46`, `parent-skill-check.cjs:74`). `rg -n "'\.git'" .skilled/commands/doctor/scripts` returns two root-selection lines (`lib/sk-skill-surface.cjs:87`, `skill-graph-freshness.cjs:49`) plus test-only hits that are not root selection.
- Consumers of the changed symbol: `rg -n "findRepoRoot\(" .skilled/commands .skilled/skills --glob '!node_modules'` returns `sk-skill-convert.cjs:108`, `tests/sk-skill-convert.test.cjs:15`, `tests/sk-skill-integrate.test.cjs:37` and the three definitions. `REPO_ROOT` consumers in `parent-skill-check.cjs` are the five rows above.
- Matrix axes: layout (`Skilled`, vendored below a git root, linked `.skilled`), decoy (`ancestor .opencode`, none), script (three), start (`script directory`, `test directory`). The fixture must cover the first three axes for all three scripts.
- Algorithm invariant: for any start inside `<X>/.skilled/…` or `<X>/.opencode/…`, `findRepoRoot(start)` returns the nearest `<D>` where `<D>/<name>/skills/system-spec-kit/SKILL.md` exists; when no candidate holds it, it returns the parent of the outermost `<name>` segment, never the enclosing git root. Adversarial cases: two nested copies (nearer wins), decoy `.opencode` without a sentinel (skipped), symlinked `.skilled` (Node realpath keeps the shared checkout), no sentinel anywhere (hoist), a path segment named `.skilled` above the repository (`nearestSentinelHolder`).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the two failures and every suite's pre-change counts. Implementation writes the fixture suite first, records its red run, then delegates the three root walks. Verification reruns the baselines, the new suite and the aggregate runner.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `surface.findRepoRoot` against a nested and a no-sentinel path | `node --test` |
| Integration | The three copied scripts run from a temporary git repository holding the framework copy one folder below its root | `node --test`, `spawnSync` |
| Integration | The same three scripts run through a project whose `.skilled` is a symlink to the Skilled checkout | `node --test`, `spawnSync` |
| Regression | `sk-skill-check`, `sk-skill-convert`, the five `parent-skill-check` suites and the freshness vitest suite | `node --test`, `vitest`, `tests/run-all.sh` |
| Manual | The three baseline commands from the Skilled checkout | `node` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `shared/workspace/repo-root.mjs` | Internal | Green | Falls back to the current walk, which leaves the defect in place |
| Node 20.19 or later, for `require()` of an ES module | External | Green | Each script fails at load with `ERR_REQUIRE_ESM`; the runtime already declares `node >=22.12.0` |
| `git` on `PATH`, to create the fixture repository | External | Green | The fixture can create a bare `.git` directory instead, which the pre-change walk reads the same way |
| `node:test` and the advisor runtime's vitest | Internal | Green | `run-all.sh` exits 2 when vitest is missing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite drops below its recorded pass count, or the Skilled or linked-`.skilled` baseline changes verdict.
- **Procedure**: Revert the packet's commit. No stored state, migration or cache is involved, so the previous walk returns with the revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The packet's scaffold and the Barter checkout at `barter/ai-speckit/coder` | Implementation, because the negative control and counts are the comparison |
| Implementation | Setup | Verification |
| Verification | Implementation | The packet's closure |
<!-- /ANCHOR:phase-deps -->

---
