---
title: "Implementation Plan: Phase 1: pi-opencode-history-lookup"
description: "Add Pi and OpenCode arms to the hand-over locator mint, proven by claim tests that run the printed lookup command, built by Vibe CLI from short briefs."
trigger_phrases:
  - "pi opencode history lookup plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: pi-opencode-history-lookup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS core requiring ES module readers) |
| **Framework** | Skilled session-handover core |
| **Storage** | Pi session JSONL files and the OpenCode SQLite store, read only |
| **Testing** | `node --test` |

### Overview
`mintHandoverLocator` gains a branch for `pi` and `opencode`. It requires the shared reader index, calls the runtime's reader with the same `projectDir` the lookup CLI passes at redeem, and mints a locator whose handle digests the identity alone when the reader finds the session. Every other path returns null as before.
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
- [ ] The handover suite prints `fail 0` with more tests than the baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime branch in a shared core, reusing the reader the verifier uses

### Key Components
- **`lib/relaunch-core.cjs` `mintHandoverLocator`**: chooses the runtime's evidence and mints the locator.
- **`shared/session-readers/index.mjs`**: `loadPiSession` and `loadOpenCodeSession`, the readers the lookup CLI calls.
- **`history/lib/cli.ts` `locateReaderSession`**: the unchanged verifier that recomputes `historyHandle(locator, null)`.

### Data Flow
`claim` calls `handoverLookupSection`, which calls the mint with the note's `cwd`. The mint places the lookup, reads the session with `projectDir` set to `sessionDirectory ?? workspace`, and stores the locator. The printed command runs the CLI, which reads the same session and checks the handle.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mintHandoverLocator` | Mint for Claude, Codex and Vibe | update; new branch for Pi and OpenCode only | Claude, Codex and Vibe claim tests unchanged and passing |
| Lookup CLI and shared readers | Redeem every runtime | unchanged | not in the diff |
| Handover README and injection contract | Docs | update | drift guards pass |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, one Vibe brief for the mint, one for the tests, then the docs and the suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Claim prints the section, the printed command redeems, a missing session prints none | `node --test`, one mutation check per branch |
| Manual | A live Pi hop and a live OpenCode hop with a side word | phase 003 harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| History engine build | Internal | Green | No locator at all |
| `node:sqlite` in Node 26 | External | Green | No OpenCode locator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a claim that fails or prints a lookup that cannot redeem.
- **Procedure**: `git revert` the phase's feature commit. No state format changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The operator's go-ahead | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---
