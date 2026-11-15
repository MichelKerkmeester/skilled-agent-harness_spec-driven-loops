---
title: "Implementation Plan: Phase 47: vibe-handover-hardening"
description: "Fix eight findings in the Mistral Vibe hand-over path, each as one short Vibe CLI build brief on deepseek-flash, verified by its own test and a mutation check, then reviewed by a fresh Opus session and proven by a live Vibe hop."
trigger_phrases:
  - "vibe handover hardening plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 47: vibe-handover-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ES modules), Bash |
| **Framework** | Skilled hook adapters for Mistral Vibe 3.1.2 |
| **Storage** | Relaunch state files under the relaunch state directory |
| **Testing** | `node --test` |

### Overview
The Vibe adapter, the shared killer, the turn-start and compaction parts, the CLI and the wrapper each get the smallest change that closes one finding from `scratch/analysis.md`. Every change is gated on the Vibe adapter or `runtime === 'vibe'`, so the other runtimes keep their behavior. Each change carries a test that fails when its core line is reverted.
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
- [x] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` prints `fail 0` with more tests than the 1009 baseline, and `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs` prints `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime adapter over a shared core

### Key Components
- **`vibe/handover-parts.mjs`**: the Vibe adapter; nudge, withdraw, session-id record and turn-end arm.
- **`lib/killer.cjs`**: the shared killer; a folder path now means "watch every numbered segment".
- **`session-lifecycle/vibe/turn-start.mjs` and `compaction-context.mjs`**: part order and compaction parity.
- **`bin/session-handover.cjs` and `.skilled/bin/skilled-loop`**: the prepare message, the `session-id` command and the key warning.

### Data Flow
`pre_agent` runs the early withdraw and records the session id, then the nudge. `prepare` writes the pending record and tells the session to stop. `post_agent` arms the record and spawns the killer on the journal folder. The killer signals after three quiet seconds and the wrapper relaunches with the claim seed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/killer.cjs` `transcriptMtime` | Idle watch for every runtime | update; a file path is unchanged | Claude, Codex and Pi still pass files; full suite `fail 0` |
| `lib/relaunch-core.cjs` exports | Shared core | update; three new exports, no changed function | full suite `fail 0` |
| `bin/session-handover.cjs` `sessionIdFor` and prepare message | CLI for every runtime | update behind `runtime === 'vibe'` | Cursor and Devin manual-route test unchanged and passing |
| `lib/nudge.cjs` | Nudge ladder for every runtime | unchanged | not in the diff |
| `.skilled/commands/speckit/handoff.md`, handover README | Docs | update | drift guards 4/4, mirror check in sync |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline and the briefs, Implementation runs one Vibe brief per change, Verification runs the suites, the review, the gates and the live hop.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Adapter parts, killer idle watch, compaction part, CLI, wrapper | `node --test`, one mutation check per change |
| Integration | Wrapper launch and leftover cleanup through the shell harness | `node --test` wrapper suites |
| Manual | One live Vibe hop through `skilled-loop vibe` on the operator's plan | `scratch/harness/live-hop.sh` and `score.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vibe CLI 3.1.2 with the plan key in the keychain | External | Green | No build dispatch and no live hop |
| tmux | External | Green | No live hop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a Vibe hop that no longer relaunches, or any non-Vibe handover test that fails after merge.
- **Procedure**: revert the phase's feature commit with `git revert <commit>`; no state migration is involved.
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
| Setup | The operator's choice of fixes | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Merge |
<!-- /ANCHOR:phase-deps -->

---
