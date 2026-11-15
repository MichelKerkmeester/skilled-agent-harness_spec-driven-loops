---
title: "Feature Specification: Phase 2: history-core-relocation"
description: "The history lookup core is built and printed from the spec-kit runtime, which the handover concern does not own. This phase gives the concern a runnable lookup entry, points the printed command at it, and keeps the history suites at their current count."
trigger_phrases:
  - "history core relocation"
  - "phase 2 history core relocation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: history-core-relocation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-hop-recall-baseline |
| **Successor** | 003-mint-locator-at-prepare |
| **Handoff Criteria** | Every importer resolves and the history suites pass with the same count: `npx vitest run tests/history-*.vitest.ts` prints 13 files and 191 tests. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the packet that moves the session history lookup out of the compaction path and into the in-session handover, so a receiving session can look up the sender's earlier turns.

**Scope Boundary**: The runnable lookup entry and the printed command only. The locator mint at `prepare` is phase 3, the offer at `claim` is phase 4, and the compaction offer removal is phase 5.

**Dependencies**:
- The runtime build (`npm run build`) produces `dist/hooks/lib/history/cli.js`, which the concern entry imports.
- The concern has no build step, so its entry is plain ESM over that compiled file.

**Deliverables**:
- A `.mjs` lookup entry in `.skilled/hooks/session-relaunch/bin/`.
- A changed `HISTORY_LOOKUP_COMMAND` and a `lookupRunsFrom` proof that covers the entry and the compiled core.
- Updated CLI-path assertions in four test and support files, plus three README updates.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lookup core is TypeScript compiled into `.skilled/skills/system-spec-kit/runtime/dist/`, and the command a model runs names that compiled file. The handover concern is plain `.cjs` and `.mjs` with no build step, so its `claim` path cannot own a lookup entry without a build of its own or a thin runnable entry over the compiled core. Phase 4 needs that entry to print a command the receiver can run.

### Purpose
The handover concern owns the runnable lookup entry, and the printed command names it, with the history suites passing at the same count.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts
 Test Files  13 passed (13)
      Tests  191 passed (191)
```

Section 2's count of 13 files and 191 tests is quoted from this block. The same command must print the same two lines after the change.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.skilled/hooks/session-relaunch/bin/history-lookup.mjs` as the concern's runnable entry over the compiled `cli.js`.
- Change `HISTORY_LOOKUP_COMMAND` in `lookup-offer.ts` to the entry path.
- Make `lookupRunsFrom` prove the entry and the compiled core both exist.
- Update the CLI-path assertions in the four test and support files.
- Update the core README, the concern README and the bin README.

### Out of Scope
- Moving the TypeScript source or the build into the concern - `cli.ts` imports `../../claude/hook-state.js` and `../../../lib/esm-entry.js`, and `hook-state.ts` imports `lookup-offer.js`, so a move needs a cross-package build cycle.
- Minting a locator at `prepare` - phase 3.
- Printing the lookup section at `claim` - phase 4.
- Removing the compaction offer - phase 5.
- Changing the lookup operations, the reply bound or the search behaviour - the phase must not change behaviour.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/bin/history-lookup.mjs` | Create | The concern's runnable entry: imports `runHistoryLookupCli` and sets `process.exitCode`. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` | Modify | The constant names the entry; `lookupRunsFrom` checks the entry and the compiled core. |
| `.skilled/skills/system-spec-kit/runtime/tests/_support/history-fixtures.ts` | Modify | `checkoutRoot()` creates placeholders at both paths. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-projection.vitest.ts` | Modify | Three CLI-path strings change to the entry path. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Modify | Two CLI-path strings change to the entry path. |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modify | One CLI-path string changes to the entry path. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` | Modify | The CLI section names the entry and keeps the compiled-core note. |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The concern README names the lookup entry and its core. |
| `.skilled/hooks/session-relaunch/bin/README.md` | Modify | The bin README lists the second runnable entry. |
| `.skilled/hooks/session-relaunch/tests/history-lookup-entry.test.cjs` | Create | The concern's entry test: same refusal, same exit code, core load. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The concern's entry runs the same CLI as the compiled file. | `node .skilled/hooks/session-relaunch/bin/history-lookup.mjs` prints `{"ok":false,"code":"invalid_usage"}` and exits 2. |
| REQ-002 | The printed command names the concern entry. | `rg -n "HISTORY_LOOKUP_COMMAND =" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` prints `node .skilled/hooks/session-relaunch/bin/history-lookup.mjs`. |
| REQ-003 | The offer is withheld when the compiled core is missing. | The concern's entry test builds a checkout with the entry and no compiled core and asserts `lookupRunsFrom` returns `false`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The history suites pass at the same count. | `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts` prints `Test Files 13 passed (13)` and `Tests 191 passed (191)`. |
| REQ-005 | The concern's entry test passes. | `node --test .skilled/hooks/session-relaunch/tests/history-lookup-entry.test.cjs` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The entry prints the same refusal JSON and the same exit code as the compiled CLI for the same argv.
- **SC-002**: The history suites print 13 files and 191 tests before and after the change.
- **SC-003**: No file outside the Files to Change table is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runtime build (`npm run build`) | Without `dist/hooks/lib/history/cli.js` the entry cannot import the core | `lookupRunsFrom` checks the core and withholds the offer; the entry prints a refusal |
| Risk | The entry's relative import breaks if the dist layout changes | Med | The entry test imports the core and fails loudly |
| Risk | Two runnable paths drift apart | Low | The entry holds no copy of the core; it imports the one compiled file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the operator accept split ownership, with the source and build in the spec-kit runtime and the runnable entry in the concern? Decision: yes for this phase, recorded in `goal.md`; a physical move is blocked by the build cycle named in `plan.md`.
- Does the entry belong in `bin/` or `lib/`? Decision: `bin/`, because it is a runnable command and `bin/README.md` lists runnable entries.
<!-- /ANCHOR:questions -->

---
