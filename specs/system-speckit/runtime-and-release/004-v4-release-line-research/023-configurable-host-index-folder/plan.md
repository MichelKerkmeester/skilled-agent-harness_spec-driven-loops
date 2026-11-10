---
title: "Implementation Plan: Let a host repository name its trigger index folder"
description: "Read the host index folder from .skilled-host.json at the owning root, route the three resolvers through it, and exit 2 on a setting that cannot be honored."
trigger_phrases:
  - "configurable host index folder plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Let a host repository name its trigger index folder

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM |
| **Framework** | system-spec-kit retrieval scripts: `lookup-trigger-index.mjs`, `generate-trigger-index.mjs` and `lib/host-index.mjs` |
| **Storage** | None. One optional JSON settings file, read only |
| **Testing** | vitest, `host-trigger-index.vitest.ts` in the cli project, and the 15 related cli test files |

### Overview
`hostIndexDir(root)` in `host-index.mjs` reads `indexDir` from `.skilled-host.json` at the root and returns that folder. The default is `.speckit-index`. `hostIndexPath()`, `isHostRepository()` and the generator's own-directory check all resolve through it, so the generator, the lookup and the host check agree. Both entry points turn a setting they cannot honor into exit 2 with a message. The named-folder cases in the host test file and the 15 related suites prove the change.
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
- [x] `vitest run tests/host-trigger-index.vitest.ts --config ../../vitest.config.ts --project cli`, run from `runtime/cli`, prints `Tests  48 passed (48)` and exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one setting, one resolver, read at the root whose index is being located.

### Key Components
- **`hostIndexDir(root)` in `lib/host-index.mjs`**: reads and checks the setting, then returns the folder or throws
- **`hostIndexPath(root)` and `isHostRepository(root)` in `lib/host-index.mjs`**: resolve the index file and the host verdict through `hostIndexDir`
- **`keepsOwnIndexDirectory(root)` in `generate-trigger-index.mjs`**: the own-folder exemption for linked projects, now read through `hostIndexDir`
- **`main()` in both scripts**: map a setting error to exit 2 with the message on stderr

### Data Flow
A bare lookup asks git for the caller's root and reads `hostIndexPath(root)` when that file exists. Otherwise it asks `owningHostRoot` for the owner and reads `hostIndexPath(owner)`, so the owner's setting decides the folder and the project needs none. The generator checks the same verdict before it resolves any default, and it writes to `hostIndexPath(root)` for a host.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This change touches path handling, so the surface inventory applies even though the request is a feature.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hostIndexPath()` in `lib/host-index.mjs`, called by `lookup-trigger-index.mjs` and `generate-trigger-index.mjs` | Resolves the index file for a root | update | Cases "generates into the named directory and the lookup reads it" and "lets a linked project read the directory its owning host names" |
| `isHostRepository()` in `lib/host-index.mjs`, called by the generator and by `spec/upgrade-legacy.mjs` | Host verdict for a root | update | Case "counts the named directory, not the default, as the host signal"; the upgrade-legacy files run in the 15-file set |
| `keepsOwnIndexDirectory()` in `generate-trigger-index.mjs` | Exempts a linked project that keeps its own folder | update | Case "does not refuse a project that keeps its own index directory" |
| `.skilled/commands/speckit/search.md` | Told a host to pass the default path explicitly | corrected: describes automatic selection and the named folder | `rg -n "skilled-host\.json" .skilled/commands/speckit/search.md` prints two lines |
| `runtime/data/README.md`, `lib/README.md`, `folder-structure.md` | Maintainers and hosts | update | Read against the code. `rg -n "skilled-host.json"` finds each file |

Required inventories:
- Same-class producers: `rg -n "speckit-index" .skilled/skills/system-spec-kit/runtime .skilled/commands .skilled/skills/system-spec-kit/references` leaves four kinds of literal. These are the default constant in `host-index.mjs`, the comments in the two scripts, the test expectations, and the default path named in `search.md` beside the setting.
- Consumers of changed symbols: `rg -n "hostIndexPath\(|isHostRepository\(|HOST_INDEX_RELATIVE|hostIndexDir\("` finds `hostIndexDir` used at `host-index.mjs` lines 105 and 202 and at `generate-trigger-index.mjs` line 688. `HOST_INDEX_RELATIVE` remains exported as the default location, and the test file imports it.
- Matrix axes: root kind (Skilled checkout, host with the default folder, host with a named folder, linked project with an indexed owner, linked project with its own folder, linked project with an unindexed owner). Setting state (absent, valid, unsafe value, not JSON). Entry point (lookup, generator). Rows covered by a test are named in the Verification column above. The linked project whose owner names a folder holding no index is covered, and falls back to the packaged index.
- Algorithm invariant: after `path.normalize`, the resolved folder is relative, non-empty, not `.`, not absolute, does not begin with `..`, and does not begin with `.skilled`, `specs`, `.git` or `node_modules` in any letter case. Once links are followed on the part of the path that exists, it still lies inside the root, outside the four reserved folders, and is not a regular file. Adversarial cases are the eleven rows of the rejection table in the host test file (`../outside`, `/abs/index`, `.`, `.skilled/index`, `specs/index`, `.SKILLED/index`, `Specs/index`, `.git/idx`, `node_modules/x`, the empty string and the number 42) and the three cases for a link out of the host, a link into the corpus and a regular file.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: records the HEAD case count (20) and the fixed folder at HEAD (lines 35 and 84 of `host-index.mjs`).
- **Implementation**: adds the setting contract, routes the three resolvers through it, maps setting errors to exit 2 in both scripts, and updates the three docs.
- **Verification**: runs the host test file, the 15 related suites, the syntax and whitespace checks, and the strict validator.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `hostIndexDir`, `hostIndexPath` and `isHostRepository` with the default folder, a named folder and the rejected values | vitest, `host-trigger-index.vitest.ts` |
| Integration | Both scripts run as subprocesses for generation and lookup, the exit-2 path, and a linked project | vitest, `host-trigger-index.vitest.ts` |
| Regression | The 15 related cli test files, including the trigger-index, upgrade-legacy and workflow suites | vitest, cli project |
| Manual | None. Every case is automated. Barter's re-pin is Barter's step | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest 4.1.12 at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest` | Internal (vendored) | Green | The test runs cannot start |
| `owningHostRoot()` from phase 022 | Internal | Green | A linked project would read its own default folder instead of the owner's |
| git CLI, used by `callerRepoRoot` and `owningHostRoot` | External | Green | Both return `null`, and the lookup reads the packaged index |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a case in the 15 related suites that passed at baseline fails after the change, or a host with no settings file reads or writes a folder other than `.speckit-index/`.
- **Procedure**: no commit exists yet, so the change is an uncommitted diff of twelve files. Before a commit, the operator reviews that diff and discards it on an explicit yes. After a commit, `git revert <commit>` undoes it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (HEAD count, HEAD reproduction) | None | Implementation |
| Implementation (setting contract, resolvers, exit 2, docs) | Setup | Verification |
| Verification (host file, 15 related suites, syntax and strict validation) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->

---

