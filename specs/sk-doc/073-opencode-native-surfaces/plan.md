---
title: "Implementation Plan: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink"
description: "Replace the whole-tree .opencode/commands link with a real directory of per-entry links that sync-runtime-mirrors.cjs generates and checks, move goal-opencode.md into it as a real file, and delete the .skilled/plugins link. Every live path reference moves to the .opencode/ paths, and the mirror, plugin, layout and catalog suites prove the result."
trigger_phrases:
  - "opencode native surfaces plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, Python 3, markdown, git symlinks |
| **Framework** | None; repository tooling under `.skilled/` |
| **Storage** | None; the file tree is the state |
| **Testing** | `node --test`, pytest, vitest (cli project), `sync-runtime-mirrors.cjs --check` |

### Overview
`.opencode/commands` stops being one link to `.skilled/commands` and becomes a real directory holding one relative link per shared entry plus the real file `goal-opencode.md`. The `.skilled/plugins` link is deleted and every live reference to it, or to the old goal command path, is moved to the `.opencode/` path. The mirror check, the plugin, layout and catalog suites and a live OpenCode command listing prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented: `spec.md` sections 2 and 3
- [x] Success criteria measurable: SC-001 is a `test` command, SC-002 a live listing
- [x] Dependencies identified: `spec.md` section 6 names OpenCode link-following

### Definition of Done
- [x] All acceptance criteria met: `acceptance-criteria.md` rows all `Met`
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS: 202 mirrors across 9 trees are in sync.`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: per-entry generated mirror links

### Key Components
- **`sync-runtime-mirrors.cjs`**: generates and checks the `opencode-commands` tree, one link per top-level entry of `.skilled/commands`, and requires `.opencode/commands` to be a real directory
- **`command-scope.cjs`**: lists `goal-opencode.md` as the OpenCode-native command in `RUNTIME_NATIVE_COMMANDS['.opencode/commands']`, so the check keeps it and flags any other stray entry

### Data Flow
Shared commands are authored in `.skilled/commands`. The sync script reads its top-level entries and writes a relative link for each into `.opencode/commands`, next to the one native file. OpenCode reads `.opencode/commands` and follows the links.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

The change touches path handling, so the surfaces that resolve or list these paths are named here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sync-runtime-mirrors.cjs`, `command-scope.cjs` | Own the runtime command mirrors | update | `--check` PASS 202 mirrors; `sync-runtime-mirrors.test.mjs` 3/3 |
| `sk-code-quality/scripts/quality-gate.cjs` | Resolves a file to its surface; followed the `.skilled/plugins` link | update | `quality-gate.test.cjs` 93/0; F21b fails with the gate line reverted |
| `audit_descriptions.py` | Counts the command description budget | update | 40 commands, 6867 chars, same as main |
| `command-catalog-mirror-check.cjs` | Checks catalogs against the command tree | unchanged | `STATUS=OK`; its test 13/13 |
| Docs, tests, workflows, plugin comments | Name the plugin and goal command paths | update | `rg` for the old paths outside `specs/` finds only a released changelog |

Inventory used: `rg -l --hidden '\.skilled/plugins|\.skilled/commands/goal-opencode\.md' -g '!specs/**' -g '!.git' .`
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records the main baseline, Implementation changes the layout and the references, and Verification reruns the mirror check and the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Mirror sync, quality-gate surface resolution, README checker | `node --test`, pytest |
| Integration | Plugin suite, layout test, command catalog check, gate battery G1-G20 and A1 against main | `node --test`, `command-catalog-mirror-check.cjs` |
| Manual | OpenCode lists every command from `.opencode/commands` | `opencode-version-battery.cjs --family=v2` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode follows symlinked entries in its commands directory | External | Green: v2 battery lists all 49 command files | Shared commands would vanish from OpenCode |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: OpenCode stops listing a shared command or `/goal-opencode`, or the mirror check fails on main
- **Procedure**: `git revert` the change commit(s); that restores the whole-tree `.opencode/commands` link and the `.skilled/plugins` link
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baseline numbers | Verification |
| Verification | Implementation | Commit and merge |
<!-- /ANCHOR:phase-deps -->

---

