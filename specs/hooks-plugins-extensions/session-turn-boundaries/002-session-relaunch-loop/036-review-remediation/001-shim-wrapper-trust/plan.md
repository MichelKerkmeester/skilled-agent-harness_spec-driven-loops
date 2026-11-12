---
title: "Implementation Plan: Phase 1: shim-wrapper-trust"
description: "Add a real-path trust check to `skilled_loop_find_wrapper` so the shell shim runs only a wrapper inside the checkout it was sourced from. Prove it with a failing-then-passing case in the existing `node --test` suite and document the rule in both README files."
trigger_phrases:
  - "shim wrapper trust plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: shim-wrapper-trust

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 and zsh shell shim, Node.js test harness |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
The change adds one guard to `skilled_loop_find_wrapper` in `.skilled/bin/skilled-loop-shell.sh`. At source time the shim stores the real path of the checkout it was sourced from, and the resolver prints a candidate only when its real path is inside that root, inside a linked worktree that `git -C <root> worktree list --porcelain` reports, or inside a checkout named in `SKILLED_LOOP_TRUSTED_CHECKOUTS`. The worktree list is asked of the sourced checkout, so a directory cannot vouch for itself. The existing `node --test` suite proves the guard with a planted outside wrapper and keeps the symlinked `.skilled` case.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-resolver path guard

### Key Components
- **`skilled_loop_find_wrapper`**: Walks up from `$PWD` and prints the nearest wrapper only when its real path is inside the sourced checkout.
- **Checked path is the launched path**: The resolver prints the wrapper's real path, so the file the trust check read is the file `bash` runs. The wrapper already resolves its own location through symlinks, so a linking repository behaves as before.
- **Git environment**: The worktree query runs with `GIT_DIR`, `GIT_COMMON_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY` and `GIT_NAMESPACE` removed, because any of them makes `git -C` answer for another repository.
- **Unknown sourced checkout**: The stored checkout is empty when the shim's real path cannot be resolved, when that path does not end in `/.skilled/bin`, or when a copy of the shell kept the functions and lost the variable. An empty checkout trusts nothing by itself and git is not asked, because `git -C ""` answers for the current directory, which is the directory being judged. Only `SKILLED_LOOP_TRUSTED_CHECKOUTS` can then trust a wrapper.

### Data Flow
At source time the shim stores the checkout's real path. A runtime function calls `skilled_loop_resolve`, which calls `skilled_loop_find_wrapper`. The resolver walks up from `$PWD`, takes the first candidate, resolves its real path and prints it only when that path is inside the stored checkout. `skilled_loop_launch` runs `bash "$wrapper"` for a printed path and `command "$binary" "$@"` otherwise.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/skilled-loop-shell.sh` | Walks up from `$PWD` and prints the first `.skilled/bin/skilled-loop` at line 160. `skilled_loop_launch` runs it at line 189. | update | `rg -n 'skilled_loop_find_wrapper\|bash "\$wrapper"' .skilled/bin/skilled-loop-shell.sh` prints the resolver and the launch line. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Observes resolution through `skilled_loop_resolve` and launch through stubs. | update | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0. |
| `.skilled/bin/README.md` | Holds the shell shim row. | update | `rg -n 'sourced checkout' .skilled/bin/README.md` prints the row. |
| `.skilled/hooks/session-relaunch/README.md` | Holds the shim paragraph and its condition list. | update | `rg -n 'sourced checkout' .skilled/hooks/session-relaunch/README.md` prints the paragraph. |
| `.skilled/bin/skilled-loop` | The wrapper the resolver returns. | unchanged | `rg -n 'skilled_loop_find_wrapper' .skilled/bin/skilled-loop` prints nothing. |

Required inventories:
- Same-class producers: `rg -n 'skilled_loop_find_wrapper|skilled_loop_resolve' .skilled/bin/skilled-loop-shell.sh`.
- Consumers of changed symbols: `rg -n 'skilled_loop_resolve|skilled-loop-shell' .skilled/hooks/session-relaunch/tests .skilled/bin/README.md .skilled/hooks/session-relaunch/README.md`.
- Matrix axes: Shell is bash or zsh. Wrapper location is inside the sourced checkout, a symlinked `.skilled` pointing to it, a planted checkout outside it, or no wrapper. Terminal is interactive or piped. Two more locations follow from the trust rules: a registered linked worktree, and a checkout named in `SKILLED_LOOP_TRUSTED_CHECKOUTS`. Required rows: 2 shells x 6 locations = 12 resolution rows, plus 2 launch rows.
- Algorithm invariant: A wrapper runs only when its real path is inside the checkout the shim was sourced from. Adversarial cases: a wrapper planted outside the checkout, a wrapper path that climbs with `..`, a symlinked `.skilled` pointing into the checkout, a missing wrapper, a wrapper path that resolves to a directory, and a directory whose `.git` file points at the sourced checkout without being registered there.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: Confirm the current resolver and the passing suite in `tasks.md` T001 to T002.
- **Implementation**: Add the failing outside-wrapper test, then the trust check and the two README paragraphs in `tasks.md` T003 to T006.
- **Verification**: Run the suite, both shell parsers, both README greps and the packet validator in `tasks.md` T007 to T011.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `skilled_loop_find_wrapper` trust decision and `skilled_loop_resolve` output | `node --test` |
| Integration | Full shim sourced under bash and zsh, with stubbed binaries | `node --test` |
| Manual | N/A: the suite covers launch through stubs and needs no operator journey | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/bin/bash` | Internal | Green | The bash cases cannot run |
| `/bin/zsh` | Internal | Green | The zsh cases cannot run |
| Node.js test runner | Internal | Green | The suite cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The trust check rejects the legitimate wrapper in the sourced checkout or in a repository whose `.skilled` links to it.
- **Procedure**: Revert the shim commit, which restores the pre-fix `skilled_loop_find_wrapper`. The test and README changes revert with it.
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
