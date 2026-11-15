---
title: "Implementation Plan: Claude Code session handover on by default and v4.0.2.1 release notes"
description: "The shared hook flag resolver and its shell mirror gain one per-runtime default, Claude on, that answers only when no relaunch enable switch holds a value. The release notes and the docs that state the default are then rewritten to match."
trigger_phrases:
  - "claude default on release notes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Claude Code session handover on by default and v4.0.2.1 release notes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and POSIX shell |
| **Framework** | None |
| **Storage** | None, flags come from the environment and `.skilled/hooks/hook-flags.env` |
| **Testing** | `node --test`, vitest for the Pi extension |

### Overview
`hookFlagDecision` in `hook-flags.cjs` gains a last rung for the default-off concern: when neither the runtime switch nor the global switch holds a value, a runtime listed for the concern in a new `DEFAULT_ON_RUNTIMES` map is on. `hook_enabled` in `hook-flags.sh` gets the same rung. The resolver tests prove the Claude default and the parity of both readers, and the docs and release notes then describe the new default.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` prints `fail 0` with at least 1,555 tests
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared flag resolver

### Key Components
- **`hook-flags.cjs`**: decides every hook concern for the Node readers. Extending `hookFlagDecision` in place is the cheapest move, because every Claude caller already passes `runtime: 'claude'`.
- **`hook-flags.sh`**: the shell reader, which must give the same answer.

### Data Flow
A Claude hook calls `isHookEnabled` or `hookFlagDecision` with `{ runtime: 'claude' }`. The master and kill switches answer first, then the runtime switch, then the global switch, and only when both enable switches are blank does the new per-runtime default answer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hook-flags.cjs` `hookFlagDecision` | owns the default | update | resolver tests |
| `hook-flags.sh` `hook_enabled` | shell mirror | update | parity test |
| `hook-flags.mjs`, `hook-flags.ts` | re-export the `.cjs` resolver | unchanged | facade test |
| Claude hooks: `context-nudge.mjs`, `stop-arm.mjs`, `compact-pointer.mjs`, `subagent-guard.mjs`, `session-relaunch.cjs prepare` | consumers passing `runtime: 'claude'` | unchanged | relaunch suite |
| Codex, Pi and OpenCode adapters | consumers passing their own runtime | unchanged | relaunch and Pi suites |
| Docs that state the default | readers | update | `rg` for "ships off" over the doc surfaces |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the suite baselines and the measured default. Implementation writes failing resolver tests, then the `.cjs` and `.sh` rung, then the docs and release notes. Verification runs the relaunch, resolver and Pi suites and validates this packet. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `hookFlagDecision` per runtime, switch precedence | `node --test .skilled/hooks/shared/hook-flags.test.cjs` |
| Integration | `.cjs` and `.sh` parity, the relaunch adapters | `node --test` relaunch and plugin suites, vitest Pi suite |
| Manual | The Measured Behavior command | `node -e` and `bash` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js and bash | Internal | Green | None, no new package |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Claude Code sessions in a project nudge or hand over where the owner did not expect it, and setting `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` is not acceptable as the fix.
- **Procedure**: Revert the resolver commit, which removes `DEFAULT_ON_RUNTIMES` and its shell rung. The docs commit can stay or be reverted on its own.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baselines | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
