---
title: "Implementation Plan: Phase 1: symlink-engine-and-command"
description: "Build one Node engine that reports, plans, applies and undoes the framework links a project repo holds, behind a digest the operator approves, then put a thin /doctor:symlink router in front of it with a read-only check, a writing link and a writing unlink."
trigger_phrases:
  - "symlink engine and command plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: symlink-engine-and-command

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS with built-in modules only: `node:fs`, `node:path`, `node:crypto` |
| **Framework** | None; the doctor thin-router contract from sk-create-command, and `node:test` |
| **Storage** | `assets/symlink-manifest.json` as the entry map, plus one JSON run record per apply |
| **Testing** | `node --test` over trees in `os.tmpdir()`, the doctor suites and `route-validate.sh` |

### Overview
One manifest names every path a project repo can link, so no mode carries its own list. One engine reads that manifest and answers four questions: what is there now, what would complete it, apply that plan, and undo one recorded run. The plan prints a digest of its own inputs and action list, and `apply` refuses any digest it does not recompose, which is the same gate `agents-md-embed.cjs` already uses.
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
- [ ] `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` exits 0 and prints `# fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-driven, digest-gated engine.

### Key Components
- **`symlink-engine.cjs`**: the four subcommands, the mode table, the merge walk, the digest and the run record
- **`symlink-manifest.json`**: core, runtimes, extras and instruction entries, each with its kind and source
- **`symlink-engine.test.cjs`**: temp source and target trees for both modes, four refusals and the round-trip
- **`symlink.md` and its three workflows**: bind `check`, `link` or `unlink` and run the engine, composing nothing
- **`doctor-symlink-presentation.txt`**: the menu, the plan and digest, the yes, the refusals and the next steps

### Data Flow
The manifest selects the entries the runtime set asks for. `check` stats each one and reports a status. `plan` turns the same entries into actions, sorts them and hashes the source, the root and the actions into a digest. `apply` recomposes that plan, compares the digest, applies each action and appends it to the run record. `unlink` reads the record and walks it backwards, matching each path against the target text the run recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `agents-md-embed.cjs` | Owns the plan, digest and run-record convention | unchanged | `rg -n "BACKUP_DIR = " .skilled/commands/doctor/scripts/agents-md-embed.cjs` still prints one line |
| `lib/agents-md-sections.cjs` | Exports `sha256`, the hash the doctor scripts share | unchanged | The engine requires it rather than copying the body |
| `_routes.yaml` | Declares every doctor route and its mutation class | unchanged until phase 003 | `bash .skilled/commands/doctor/scripts/route-validate.sh` still reports 24 routes |
| Existing doctor tests | Cover the doctor commands | unchanged | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 |
| `<root>/.git/info/exclude` | Where a target repo's ignore lines land | written by the engine at the operator's yes | `check` reports `ignored` per entry, and the unlink removes only the recorded lines |

Required inventories:
- Same-class producers: `rg -n "createHash\('sha256'\)|planDigest" .skilled/commands/doctor/scripts` names the digest producers as `agents-md-embed.cjs`, `release-update.cjs` and this engine; only the exported `sha256` is reused.
- Consumers of `symlink-manifest.json`: the engine's selection step and the test suite. No other file reads it.
- Matrix axes: 7 runtimes by 3 modes, plus the 8 entry statuses, listed before implementation starts.
- Algorithm invariant: a path is replaced or removed only when its link text starts with the source checkout path. Every other real path and every other link is kept and reported.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the frozen contract and settles the digest and run-record convention it copies. Implementation writes the manifest, the four subcommands, the test file and the router with its three workflows and presentation. Verification runs the engine suite, the doctor suites, the two live dry runs and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Whole and merge modes, the local-conflict refusal, broken and foreign links, the digest gate, unlink and the root refusals | `node:test` over trees in `os.tmpdir()` |
| Integration | `check`, `plan`, `apply` and `unlink` against one scratch target tree, driven through the CLI | The engine's own CLI and `git` |
| Manual | Read-only dry runs against the two user repos, and `plan` twice against a scratch copy | `symlink-engine.cjs check`, `plan` |

The one command that decides the phase is `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs`; it must print `# fail 0` and exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js built-in modules | Internal | Green | The engine has no runtime, so the phase stops |
| `lib/agents-md-sections.cjs` (`sha256`) | Internal | Green | Copy the hash body into the engine, and the two digests drift |
| `_routes.yaml` | Internal | Yellow | The router stays reachable by path only until phase 003 registers the routes |
| Both user repos, read-only | External | Yellow | The unit suite still covers every mode, and the dry runs move to phase 003 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an apply wrote where a real path was expected, or the operator wants the target repo back as the run found it.
- **Procedure**: run `node .skilled/commands/doctor/scripts/symlink-engine.cjs unlink --run <dir> --dry-run`, read the plan, then run the same command with `--yes`; then revert the phase commit. `unlink` keeps the run directory, so the same undo can be retried.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification ──► Phase 002
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---
