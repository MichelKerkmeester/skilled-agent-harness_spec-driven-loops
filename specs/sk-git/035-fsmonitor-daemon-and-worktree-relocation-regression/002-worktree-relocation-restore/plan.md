---
title: "Implementation Plan: Phase 2: worktree-relocation-restore"
description: "Plan for the worktree base write-back guard, the doctor in-checkout warning, and the operator move of existing worktrees out of the checkout."
trigger_phrases:
  - "worktree relocation restore plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: worktree-relocation-restore

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (wrapper and its test), Node.js CommonJS (doctor check and its test) |
| **Framework** | None |
| **Storage** | Git config key `speckit.worktreeBase` in the shared `.git/config` |
| **Testing** | `bash .skilled/bin/tests/worktree-session.test.sh` (fixture repositories) and `node --test` on `git-setup-check.test.cjs` |

### Overview
This is Layer 2 of the fix design in `001-deep-research/research/research.md` (section 6). The wrapper keeps the base it resolves in memory and writes it to config only when the operator set `SPECKIT_WORKTREE_BASE`. The doctor adds a DEGRADED result for a base inside the checkout when more than three linked worktrees exist. The existing worktrees move outside the checkout in an operator-run step, with a rollback written here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` sections 2 and 3)
- [x] Success criteria measurable (`spec.md` section 5, each one a command)
- [x] Dependencies identified (section 6 below)

### Definition of Done
- [ ] All acceptance criteria met (`acceptance-criteria.md`, every row `Met` or waived by an ADR)
- [ ] `bash .skilled/bin/tests/worktree-session.test.sh` prints a summary ending `FAIL=0`
- [ ] `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` prints `# fail 0`
- [ ] `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` exits 0 with no change to its result from the baseline
- [ ] Docs updated (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`), and no README needs a change because `.skilled/skills/sk-git/README.md:125` describes the override, not the write-back
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Explicit-only persistence. One guard decides whether a base is written to config, and only an operator-set env value passes it.

### Key Components
- **Base source record** (`.skilled/bin/worktree-session.sh:219-227`): the resolver already reads env, then config, then the default. It also records which source won, so the guard can tell an explicit value from a default.
- **Write-back guard** (`.skilled/bin/worktree-session.sh:293-295`): replaces the unconditional "write when unset" with "write when the source is the env variable and the key is unset". It logs the in-checkout default otherwise.
- **In-checkout check** (`.skilled/commands/doctor/scripts/git-setup-check.cjs:677-725`, `checkWorktrees`): resolves the base with the same rules as `resolveWorktreeBase` (`:615-625`), then tests whether it sits inside the main checkout and counts the linked worktrees.

### Data Flow
A launch reads the env variable, then the config key, then the default, at `worktree-session.sh:219-227`. Only the env source reaches the guard at `:293`. When that source is set and the key is unset, the guard writes the key. The naming helper (`_wn_base_dir`, `worktree-naming.sh:65-78`) and the reaper (`worktree-reaper.sh:62`) read the key the same way, so a default launch and a reaper started on its own resolve the same `.worktrees`. The doctor resolves the same base and reports it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This addendum applies: the change fixes a finding from `001-deep-research` (research.md section 5 Q1, section 6 Layer 2), and the in-checkout test is a path containment check.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/worktree-session.sh` write-back (`:293-295`) | Only writer of `speckit.worktreeBase` in the repository (`:294`). It writes whenever the key is unset. | update | `bash .skilled/bin/tests/worktree-session.test.sh` prints `FAIL=0` |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` `_wn_base_dir` (`:65-78`) | Reads env, then config, then `.worktrees`. Callers at `:203`, `:410` and `:447`. It never writes. | unchanged, consumer | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` exits 0, as at baseline |
| `.skilled/bin/worktree-reaper.sh` `WT_BASE` (`:62`) | Reads env, then config, then the default. Consumer only. | unchanged, consumer | `grep -n 'WT_BASE=' .skilled/bin/worktree-reaper.sh` prints line 62 |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` `resolveWorktreeBase` (`:615-625`) and `checkWorktrees` (`:677-725`) | Resolves the base for the `worktrees` row. Producer of the new DEGRADED result. | update | `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` prints `# fail 0` |
| `.skilled/bin/tests/worktree-session.test.sh` F4 case (`:146-167`) | Asserts that an env-set base persists. | unchanged, keep | `bash .skilled/bin/tests/worktree-session.test.sh` prints `FAIL=0` |
| `.skilled/skills/sk-git/README.md:115,125` and `.skilled/skills/sk-git/scripts/README.md:69` | Describe the override and the default. They do not describe the write-back. | unchanged, consumer | `grep -n 'worktreeBase' .skilled/skills/sk-git/README.md` shows no line that says the wrapper writes the key |
| `.git/config` of this checkout | Holds the key the operator sets. | operator update | `git config --get speckit.worktreeBase` prints `~/worktrees/public` after T018 |

**Required inventories**

- Same-class producers: `grep -rn 'speckit.worktreeBase' .skilled/bin .skilled/skills/sk-git/scripts .skilled/commands/doctor`. The only production writer is `worktree-session.sh:294`. The other writes are fixtures in the test files (`worktree-naming.test.sh:195`, `git-setup-check.test.cjs:1069` and later). The doctor's `WORKTREE_REPAIR` (`git-setup-check.cjs:86`) is a repair string, not a write.
- Consumers of changed symbols: `_wn_base_dir` has three callers in `worktree-naming.sh` and one test assertion (`worktree-naming.test.sh:196`). None of them changes.
- Matrix axes: env variable (unset, empty, non-empty) by config key (unset, set). The rows are:

| Row | Env | Config | Expected base | Config write | Log line | Covered by |
|-----|-----|--------|---------------|--------------|----------|------------|
| 1 | unset | unset | `.worktrees` | none | yes | new default case (REQ-001, REQ-002) |
| 2 | unset | set | config value | none | no | unchanged, no new test |
| 3 | non-empty | unset | env value | yes | no | F4 case (REQ-003) |
| 4 | non-empty | set, same value | env value | none | no | unchanged, no new test |
| 5 | empty | unset | `.worktrees` | none | yes | new empty-variable case (REQ-001) |
| 6 | non-empty | set, other value | env value | none | no | unchanged, no new test |

Rows 1, 3 and 5 change behavior, so they get coverage. Rows 2, 4 and 6 do not change.

- Algorithm invariant: the in-checkout test is a path containment check. The base is inside the checkout only when its resolved real path equals the main checkout's real path or begins with that path followed by a separator. The adversarial cases are: base equal to the checkout root (inside), a sibling folder whose name starts with the checkout name (outside), a base outside the root (outside), and a symlink in the base chain that leads into the checkout (inside). Doctor test cases cover all four (`tasks.md` T009).

**Plan-time reads**: the producer grep and the consumer list were read on 2026-10-27. CHK-FIX-002 in `tasks.md` repeats the producer grep after the change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the current guard, the baseline suite results and the live key state, with no edits. Implementation changes the guard, the doctor check and their tests. Verification runs both suites, reads the doctor row, and then hands the operator-run move to the migration tasks.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Wrapper base-source guard (matrix rows 1, 3 and 5) | `bash .skilled/bin/tests/worktree-session.test.sh` with fixture repositories |
| Unit | Doctor in-checkout check: inside, outside, prefix sibling, symlink, at and above the three-worktree threshold | `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` |
| Integration | A real launch in a fixture with no env variable, then `git config --get speckit.worktreeBase` | The wrapper suite (the default-path case) |
| Read-only check | The doctor battery against this checkout, showing the `worktrees` row | `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false node .skilled/commands/doctor/scripts/git-setup-check.cjs --json` |
| Manual (operator) | Each worktree move, repair and listing | The commands in `tasks.md` T015 to T020 |

Both suites run with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false` in the environment. That setting makes every child git call skip the fsmonitor daemon, so a wedged daemon cannot hang a run. Commands that read the index are not run against the live checkout without it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash`, `node` | System | Green | Neither suite runs. Check with `node --version` and `bash --version` in `tasks.md` T001. |
| `git worktree move` and `git worktree repair` | System | Yellow until `git --version` is checked in T001 | The migration waits. `repair` with path arguments needs git 2.30 or later. |
| Operator confirmation for each move | Human | Yellow | REQ-005 closes only as a user-approved deferral. |
| Same device for the checkout and `~/worktrees` | System | Yellow until `df -P` is read in T017 | A cross-device move copies the tree, which is slow and risky for a live worktree. The move waits. |
| The `node:test` runner in `git-setup-check.test.cjs` | System | Green | The doctor tests cannot run. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The wrapper or doctor suite fails after the change, or a moved worktree breaks a running session.
- **Procedure**:
  1. Code: revert the commit that changed `worktree-session.sh`, `git-setup-check.cjs` and their tests. The old write-back returns with it.
  2. Migration, for each moved worktree: `git worktree move "$NEW" "$OLD"`, then `git worktree repair "$OLD"`, where `OLD` is the original path and `NEW` is its folder under `$HOME/worktrees/public`. Each move is reversed one at a time, most recent first.
  3. Key: `git config --unset speckit.worktreeBase`. The key returns to its unset state from before T018.
  4. Check: `git worktree list --porcelain | grep -c '^worktree .*/\.worktrees/'` prints the count from before the move, which is 11 if no move was made.
- **Limit**: The rollback restores paths and the config key. It does not restore what a session saw while its worktree was away, and it does not restart any daemon. A daemon left watching a moved path is phase 003's concern.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification ──► Migration (operator)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Predecessor 001-deep-research (closed) | Implementation |
| Implementation | Setup (baseline results recorded) | Verification |
| Verification | Implementation (both suites green) | Migration |
| Migration (operator) | Verification and written operator confirmation for each worktree | REQ-005 closure |
<!-- /ANCHOR:phase-deps -->

---
