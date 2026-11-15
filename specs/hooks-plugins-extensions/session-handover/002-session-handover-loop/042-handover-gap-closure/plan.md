---
title: "Implementation Plan: Handover gap closure on Pi, OpenCode and Codex"
description: "A probe that types scripted steps into a live session measures each of the five gaps on the runtimes it affects. The shared nudge module gains one refusal check that Claude Code, Pi and OpenCode all call, Pi and OpenCode send the withdrawn notice Claude Code and Codex already send, and Codex gets a compaction pointer on SessionStart. The same probes run again on the fixed code."
trigger_phrases:
  - "handover gap closure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Handover gap closure on Pi, OpenCode and Codex

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM, TypeScript for the Pi extension, bash for the probe |
| **Framework** | Pi extension API, OpenCode plugin API, Claude Code and Codex hooks |
| **Storage** | Relaunch records and `relaunch.log` in the per-user state directory, handoff notes under `.skilled/skills/.state/session-relaunch/handoffs/` |
| **Testing** | `node --test`, vitest for the Pi extension, `tsc -p tsconfig.pi.json`, live tmux probes |

### Overview
`probe.sh` starts one runtime in tmux, under `skilled-loop` or straight, and types each scripted step once its trigger shows on screen or in the relaunch log. A step can wait for a pattern to leave the screen, which lets a prompt land after a turn ends and inside the killer's idle wait. `questionHoldReason` in the nudge module reads the session's record and returns the refusal text while the record can still be armed. Pi's `tool_call`, OpenCode's `tool.execute.before` and Claude Code's `PreToolUse` guard all call it. Pi steers the withdrawn notice from `agent_start`, and OpenCode keeps it in the system prompt for the rest of the withdrawing turn. `codex/compact-pointer.mjs` answers `SessionStart` with `source: compact` the way Claude's pointer does.
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
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` prints `fail 0` with at least 1,560 tests
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared relaunch core with one adapter per runtime

### Key Components
- **`nudge.questionHoldReason`**: one check and one text for every runtime that can hold a turn on a question, so the three refusals cannot drift apart.
- **Pi `tool_call` and `agent_start`**: the refusal returns `{ block: true, reason }`, and the notice goes out as a steer, which Pi reads before the run's first model call because it awaits `agent_start`.
- **OpenCode `tool.execute.before` and the system transform**: a throw refuses the tool on both OpenCode hosts, and a per-session flag keeps the notice in the system prompt until the next operator prompt or a compaction.
- **`codex/compact-pointer.mjs`**: bound to `SessionStart` through `hook-registry.json`, acting only on `source: compact`.

### Data Flow
Question: the model calls its question tool after `prepare`, the adapter asks `questionHoldReason`, the pending record makes it refuse with the note path and the `cancel` command, the model ends the turn or cancels, and the record arms or is gone. Withdraw: the operator types after the arm, the adapter withdraws the record, then sends `WITHDRAWN_NOTICE`, and the model keeps working. Codex compaction: Codex compacts, runs `SessionStart` with `source: compact`, the pointer resets the level and sends the claim text for the open note.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claude/subagent-guard.mjs` question check | Claude's refusal | moved onto the shared check, text unchanged | its 23 tests |
| Pi `agent_start` | withdraws an arm | also steers the notice | Pi suite, live withdraw probe |
| OpenCode user `message.updated` and the system transform | withdraws an arm, pushes nudge and seed | also sets and pushes the notice | plugin suite, live withdraw probe |
| Codex `SessionStart` | spec-kit start context only | gains the relaunch pointer | Codex adapter suite, live compaction probe |
| `.codex/hooks.json` | rendered from the registry | one new row | `sync-hook-registrations.cjs --check` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup builds the probe and measures each gap on the runtimes it affects. Implementation adds each fix behind a test that fails on the old code. Verification runs the full gate and the same probes on the fixed code. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The shared check, both refusals, both notices, the Codex pointer and its binding | `node --test`, vitest |
| Type | The Pi extension against the local Pi types | `tsc -p tsconfig.pi.json` |
| Live | One probe per gap and runtime, before and after | `scratch/harness/probe.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude Code 2.1.325, Pi 1.5.2, OpenCode 2.3.0, Codex 0.169.0 | External | Green | No live measurement for that runtime |
| Codex weekly quota, 17% | External | Yellow | Codex runs stop, the operator is asked |
| Codex reads `hooks.json` from the main checkout of a worktree | External | Known | A live Codex hook test runs from a plain local clone with hook trust bypassed for that run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a session is refused a question it should be allowed, or the notice reaches a session whose hand-over still stands.
- **Procedure**: revert the code commit. Each adapter change is self-contained, and the Codex row goes with its registry entry.
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
| Implementation | Live baseline | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
