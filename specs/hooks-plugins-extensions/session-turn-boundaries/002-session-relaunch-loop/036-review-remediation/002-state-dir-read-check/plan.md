---
title: "Implementation Plan: Phase 2: state-dir-read-check"
description: "Add the existing `ensureStateDir` real-directory and owner check to `readRelaunchFile` so a read never trusts a symlinked or foreign-owned state directory. Add one containment call in `consume` so a record cannot name a note outside the handoffs directory. Prove both with cases that fail before the fix in the two existing `node --test` suites."
trigger_phrases:
  - "state dir read check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: state-dir-read-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, Node.js CommonJS in `.cjs` files |
| **Framework** | None |
| **Storage** | JSON relaunch records in a per-user state directory |
| **Testing** | `node --test` |

### Overview
The change adds one read-side guard inside `readRelaunchFile` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` and one containment call in `consume` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`. The guard is one helper that holds the `lstatSync` real-directory and owner test. `ensureStateDir` and `readRelaunchFile` both call it. The read path creates no directory, returns null and writes one stderr line when an existing directory fails. The two existing suites prove the cases fail before the fix and pass after it.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-library read guard

### Key Components
- **`ensureStateDir`**: Owns the real-directory and current-owner rule at line 137, and keeps creating the directory for write paths.
- **`readRelaunchFile`**: Applies the same rule before its read at line 1059 and creates nothing. An existing directory that fails reads as null and one line goes to stderr: `[session-relaunch] relaunch state directory is not a real directory owned by the current user: <dir>`. The hook log lives in the directory that failed, so the refusal cannot be appended there. A directory that does not exist yet reads as null without that line.
- **`readStateFile`** in `.skilled/hooks/session-relaunch/lib/nudge.cjs`: Reads the nudge level and the rearm grant from the same state directory, so it applies the same check and returns its empty state when the directory fails. The review of this phase found it.
- **Missing handoffs directory**: `consume` drops any `handoff` the containment helper rejects, which includes a note whose handoffs directory no longer exists. The wrapper takes the note path from `should-relaunch` and the note state from `consume`, so that hop is declined as a missing note, as before.
- **`handoffPathWithinRepo`**: Resolves a note path and rejects one outside the repository handoffs directory at line 151.
- **`consume`**: Takes no lock and removes nothing when the state directory fails the check, and reports the record as absent. With a trusted directory it passes `record.handoff` through `handoffPathWithinRepo` before it reads any note. A rejected value is dropped: the record is still removed, `handoff` prints as an empty string and `handoff-outside-dropped` is logged with the loop id.

### Data Flow
A caller asks `readRelaunchFile` for a loop record. The reader resolves the state directory, inspects the real entry and its owner, and reads the record only when the entry is a real directory owned by the current account. A failed check returns null and writes one stderr line. `consume` reads the record under the append lock, removes the record file, then passes `record.handoff` through `handoffPathWithinRepo` before it reads the note frontmatter.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ensureStateDir` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` at line 137 | Owns the real-directory and current-owner rule and creates the directory | unchanged | `rg -n 'function ensureStateDir' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints line 137. |
| `readRelaunchFile` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` at line 1059 | Reads the record with no directory check | update | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with the symlinked-directory and foreign-owner cases. |
| `handoffPathWithinRepo` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` at line 151 | Resolves and contains note paths for `claim`, `complete` and `prepare` | unchanged | `rg -n 'function handoffPathWithinRepo' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints line 151. |
| `consume` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` at line 707 | Reads `record.handoff` at line 729 with no containment check | update | `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with the outside-handoff case. |
| `shouldRelaunch` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` at line 599 | Reads a record through `stateForLoop` at line 462 and `readRelaunchFile` at line 464, so it inherits the read check | unchanged | `rg -n 'function shouldRelaunch|readRelaunchFile' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints lines 599 and 464. |
| The 20 `readRelaunchFile` call sites in 8 production files | Consume the record read and pass `loopId` plus an optional `env` | unchanged | `rg -n 'readRelaunchFile\(' .skilled/hooks/session-relaunch --glob '!**/tests/**' --glob '!**/*.test.*'` prints the definition, the interface and every production call site. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Holds the current `readRelaunchFile` and `ensureStateDir` cases | update | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Holds the current `consume` cases | update | `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. |

Required inventories:
- Same-class producers: `rg -n 'ensureStateDir\(' .skilled/hooks/session-relaunch --glob '!tests/**'` prints the definition, the write-path callers and the existing test cases.
- Consumers of changed symbols: `rg -n 'readRelaunchFile' .skilled/hooks/session-relaunch --glob '!**/tests/**' --glob '!**/*.test.*'` prints the definition, its internal callers and the adapter call sites.
- Matrix axes: Directory state is a real directory owned by the current account, a symlink, a regular file, or a directory owned by another account. Handoff location is inside the handoffs directory, outside it, or reached through a symlinked handoffs directory. Required rows: 4 directory states = 4 read rows, plus 3 handoff locations = 7 rows.
- Algorithm invariant: A read returns a record only when the state directory is a real directory owned by the current user, and `consume` reads a note only when its path is inside the repository handoffs directory. Adversarial cases: a symlinked state directory, a foreign-owned state directory, a regular file at the state path, a missing state directory, a `..` escape in `record.handoff`, an absolute path outside the repository, a handoffs directory that is itself a symlink, and a `handoff` that names a directory.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: Confirm the current guard, the two suites and the containment helper in `tasks.md` T001 to T004.
- **Implementation**: Add the failing read-side and outside-handoff cases, then the read check and the `consume` containment in `tasks.md` T005 to T008.
- **Verification**: Run both suites and the packet validator in `tasks.md` T009 to T011.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `readRelaunchFile` directory check and `shouldRelaunch` decision | `node --test` |
| Integration | `consume` handoff containment through the CLI | `node --test` |
| Manual | N/A: the suites drive the read and consume paths and need no operator journey | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js runtime and `node --test` | Internal | Green | Neither suite can run |
| Node.js built-in `fs` and `path` | Internal | Green | The read and containment checks cannot resolve or inspect a path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A legitimate real state directory owned by the current user reads as no record, or a `handoff` inside the handoffs directory is refused.
- **Procedure**: Revert the `relaunch-core.cjs` and `session-relaunch.cjs` commits together with their tests, which restores the pre-fix read and `consume` behavior.
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
