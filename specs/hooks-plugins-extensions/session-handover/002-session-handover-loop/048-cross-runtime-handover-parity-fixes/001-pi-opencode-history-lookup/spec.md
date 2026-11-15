---
title: "Feature Specification: Phase 1: pi-opencode-history-lookup"
description: "A Pi or OpenCode receiver cannot recover a detail the handoff note left out, because the claim mints a History Lookup only for Claude Code, Codex and Vibe senders. This phase mints one for Pi and OpenCode senders through the shared session readers."
trigger_phrases:
  - "pi opencode history lookup"
  - "pi history locator"
  - "opencode history locator"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: pi-opencode-history-lookup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/420-cross-runtime-handover-parity-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-failed-arm-deferred-mark |
| **Handoff Criteria** | A Pi claim and an OpenCode claim each print a History Lookup whose command redeems |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the cross-runtime hand-over parity fixes. Phase 046 gave Vibe senders a History Lookup, and this phase does the same for Pi and OpenCode.

**Scope Boundary**: the locator mint in `relaunch-core.cjs` and its tests and docs. The lookup CLI and the shared readers already handle Pi and OpenCode locators and stay unchanged.

**Dependencies**:
- The shared readers `.skilled/hooks/shared/session-readers/pi.mjs` and `opencode.mjs`, both `ready` in its capability table.
- The history engine build in `.skilled/hooks/session-handover/history/dist`.

**Deliverables**:
- Pi and OpenCode arms in `mintHandoverLocator`.
- Claim tests that redeem the printed command for each runtime.
- Docs that list Pi and OpenCode senders.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mintHandoverLocator` finds a transcript path only for Claude, Codex and Vibe and returns null for every other runtime, so a claim of a Pi or OpenCode note prints no History Lookup. Without it, 0 of 6 Claude receivers recovered an off-note detail. With it, 3 of 3 Claude receivers and 2 of 2 Vibe receivers did.

### Purpose
A Pi or OpenCode receiver can look up the sender's earlier turns, as a Claude Code, Codex or Vibe receiver can.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 921,928p .skilled/hooks/session-handover/lib/relaunch-core.cjs
    const transcriptPath = runtime === 'claude'
      ? claudeSessionLogPath(sessionId, process.env)
      : runtime === 'codex'
        ? codexRolloutPath(sessionId, process.env)
        : runtime === 'vibe'
          ? vibeSessionFolder(sessionId, process.env)
          : null;
    if (transcriptPath === null) return null;
$ sed -n 431,447p .skilled/hooks/session-handover/history/lib/cli.ts
async function locateReaderSession(
  ...
  const result = await readers.readSession({
    runtime: locator.runtime,
    sessionId: locator.sessionId,
    projectDir: sessionFolder(locator),
```
The lookup CLI already redeems a Pi or OpenCode locator through `locateReaderSession`, with the handle digested from the session identity and no path.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mint a Pi locator after `loadPiSession` finds the session in the folder the note names.
- Mint an OpenCode locator after `loadOpenCodeSession` finds the session with that recorded folder.
- Tests that a claim prints the section and that its command redeems, and that a missing session prints none.

### Out of Scope
- The lookup CLI and the shared readers.
- Devin and DSH senders, which have no relaunch hop.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | Pi and OpenCode arms in `mintHandoverLocator` |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` or a new test file | Modify | Claim and redeem tests for Pi and OpenCode |
| `.skilled/hooks/session-handover/README.md`, `.skilled/hooks/injection-contract.md` | Modify | List Pi and OpenCode senders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A claim of a Pi note whose session file is in the note's folder prints a History Lookup whose command returns the sender's turns |
| REQ-002 | A claim of an OpenCode note whose session row records the note's folder prints a History Lookup whose command returns the sender's turns |
| REQ-003 | The existing handover suite passes with no edited expectation for another runtime |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A Pi or OpenCode note whose session the reader cannot find prints no History Lookup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-handover/tests/*.test.cjs` passes with more tests than the baseline and 0 failing.
- **SC-002**: A live Pi hop and a live OpenCode hop each report a side word absent from the note, recovered through the lookup (run in phase 003).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `require` of an ES module from the CommonJS core | Med: no locator | Node 26 loads it, and the mint already returns null on any error |
| Risk | The mint reads with options that differ from the lookup CLI's | High: a printed command that cannot redeem | The tests run the printed command against the same store |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The mint reads the session once per claim.

### Reliability
- **NFR-R01**: Any failure in the new arms prints no section and never fails the claim.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a note with no `session_id` or `cwd` prints no section, as today.
- Maximum input: a long session reads through the reader's own bounds.
- Failure path: a missing Pi folder, a missing OpenCode database or a row with another folder prints no section.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | About 30 lines in one file plus tests |
| Risk | 8/25 | Shared core, but only new branches |
| Research | 4/20 | Readers and CLI already exist |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
