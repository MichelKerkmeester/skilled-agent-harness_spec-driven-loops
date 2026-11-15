---
title: "Implementation Plan: Vibe sender history lookup at claim"
description: "The handover locator mint gains a Vibe branch: it builds the sender's session folder the way the lookup CLI does and reads the working folder from the folder's meta.json. Claim tests and one live Vibe hop prove the printed lookup redeems."
trigger_phrases:
  - "vibe history locator plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Vibe sender history lookup at claim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS), Markdown |
| **Framework** | The session handover core and the compiled history lookup runtime |
| **Storage** | The Vibe session folder (read only) and the hook state the mint writes |
| **Testing** | node:test, the 044 gate script and one live hop |

### Overview
`mintHandoverLocator` in `lib/relaunch-core.cjs` gets a Vibe branch. It builds `<VIBE_HOME or ~/.vibe>/logs/session/unified/<session_id>` exactly as the lookup CLI's `storeRootFor` and `vibeSessionCandidates` do, so the handle digests the same path. The recorded folder for the same-checkout check comes from that folder's `meta.json`. DeepSeek V4.1 Flash max through cli-opencode writes the change from short briefs, a fresh Opus medium agent reviews it, and a test that runs the printed command proves the handle redeems.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator chose the spec folder, the worktree, the builder and the reviewer
- [x] The Vibe `meta.json` fields are measured from a live session

### Definition of Done
- [ ] `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` passes with the new Vibe tests
- [ ] `HOOKDIR=session-handover bash ../044-in-session-handover-rename/scratch/gate.sh` keeps the baseline counts plus the new tests
- [ ] A live Vibe hop's receiver runs the printed lookup and gets the sender's turns
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One branch in the existing mint.

### Key Components
- **`vibeSessionFolder(sessionId, env)`**: the sender's session folder. Without it the mint has no store path for a Vibe sender and returns null.
- **`vibeWorkingFolder(sessionFolder)`**: the folder `meta.json` records. Without it the same-checkout check cannot run, and the mint must refuse.

### Data Flow
`claim` reads the note's `runtime: vibe`, `session_id` and `cwd`, then calls `handoverLookupSection`. The mint builds the Vibe session folder, reads its recorded folder, checks it sits in the note's checkout, digests the folder path into the handle and writes the locator to hook state. The section prints the lookup command, which the CLI redeems by building the same path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/relaunch-core.cjs` `mintHandoverLocator` | Mints the claim-time locator for Claude Code and Codex | update | Vibe claim tests |
| `runtime/hooks/lib/history/cli.ts` | Redeems the locator, already resolves Vibe | unchanged | the redeem test |
| Handover README and docs listing locator senders | Name Claude Code and Codex only | update | `rg -n 'Only Claude Code and Codex senders'` prints nothing |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline and writes the briefs. Implementation adds the Vibe branch, its tests and the doc lines. Verification runs the gate, the review and one live hop.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The Vibe branch through `claim`: section, other checkout, missing folder | node:test |
| Integration | The printed command redeemed against a Vibe session fixture | node:test, `bin/history-lookup.mjs` |
| Manual | One Vibe hop through `skilled-loop vibe` | the 045 live harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The compiled history runtime under `runtime/dist` | Internal | Green | The mint returns null and no section prints |
| `vibe` and `MISTRAL_API_KEY` | External | Green | No live hop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a claim of a Vibe note fails or prints a lookup the CLI refuses.
- **Procedure**: revert the phase commit. The mint returns to null for Vibe and the claim prints its note as before.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The history lookup phase 007 on main | Implementation |
| Implementation | The briefs | Verification |
| Verification | The tests passing | The merge |
<!-- /ANCHOR:phase-deps -->

---
