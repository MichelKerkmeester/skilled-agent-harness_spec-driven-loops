---
title: "Implementation Plan: Cross-runtime session handover parity for Pi, OpenCode and Codex"
description: "One live-hop harness scores the same task on all four runtimes. The two runtimes that do not hop get a fix at the producer of each failure: the host-process walk for OpenCode 2, and the nudge delivery and seed read in the Pi extension. The same harness then measures all four again."
trigger_phrases:
  - "cross runtime handover parity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Cross-runtime session handover parity for Pi, OpenCode and Codex

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, TypeScript for the Pi extension, bash for the harness |
| **Framework** | Pi extension API, OpenCode plugin API, Claude Code and Codex hooks |
| **Storage** | Relaunch records and `relaunch.log` in the per-user state directory, handoff notes under `.skilled/skills/.state/session-relaunch/handoffs/` |
| **Testing** | `node --test`, vitest for the Pi extension, `tsc -p tsconfig.pi.json`, live tmux hops |

### Overview
`live-hop.sh` starts one runtime under `skilled-loop` in tmux with a fixed task, a code word, a low threshold and a hop cap of one, answers only first-launch trust dialogs and records every runtime process the wrapper starts. `score.cjs` reads the relaunch log, the note and the screen and scores five steps: note prepared, signalled, relaunched, note closed and receiver answered. The baseline names three producers. `hostRuntimePid` gains one more transparent process kind, OpenCode's own helpers. The Pi extension steers its held nudge in at `turn_end` and reads its seed from the prompt's first block.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` prints `fail 0` with at least 1,556 tests
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared relaunch core with one adapter per runtime

### Key Components
- **`relaunch-core.cjs` `hostRuntimePid`**: finds the runtime that owns a process by skipping the shells above it. `dropNestedLoop` measures nesting from that host, so a wrong host is the producer of the OpenCode failure.
- **Pi `session-relaunch.ts`**: decides the nudge at `message_end`, delivers it, answers the claim seed in `before_agent_start` and arms at `agent_settled`.
- **`scratch/harness/`**: the measurement, kept in the packet because it drives live sessions and is not a repository tool.

### Data Flow
OpenCode 2: the model runs `prepare` in a tool shell, the CLI walks up from its own pid past the shell, the pty daemon and the serve process to `opencode`, finds the loop pid directly above it and keeps the loop variables. Pi: `message_end` holds the nudge, the next `turn_end` with tool results steers it into the loop, the model prepares, `agent_settled` arms and the killer ends Pi. The receiver's `before_agent_start` reads the seed from the first block and adds the claim instructions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hostRuntimePid` | host walk for `dropNestedLoop` | update | relaunch-core tests, live OpenCode hop |
| `dropNestedLoop` callers: the CLI, Claude, Pi and OpenCode adapters | consumers of the host walk | unchanged | relaunch and plugin suites |
| Pi `agent_end` delivery | nudge delivery | split into a shared helper with a `turn_end` steer | Pi suite, live Pi hop |
| Pi `before_agent_start` | seed answer | reads the prompt's first block | Pi suite, live Pi hop |
| `parseClaimSeed` | shared seed parser | unchanged | its single-line test still passes |
| Docs naming Pi's delivery or the host walk | readers | update | `rg` for `agent_end` with nudge |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup builds the harness and captures the live baseline and the suite baselines. Implementation fixes each producer behind a failing test, then reruns that runtime live. Verification runs the full gate and two final live rounds on all four runtimes. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `hostRuntimePid` and `dropNestedLoop` on an OpenCode 2 table, Pi `turn_end` and seed block | `node --test`, vitest |
| Type | The Pi extension against the local Pi types | `tsc -p tsconfig.pi.json` |
| Live | One hop per runtime with the same task | `scratch/harness/live-hop.sh`, `score.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude Code 2.1.325, Pi 1.5.2, OpenCode 2.3.0, Codex 0.169.0 | External | Green | No live measurement for that runtime |
| Codex weekly quota, 18% at the start | External | Yellow | Codex runs stop, the operator is asked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a nested run arms the outer loop, or Pi nudges a session mid-run where it should not.
- **Procedure**: revert the code commit. `isOpenCodeHelper` and the `turn_end` handler are each self-contained, so either can be reverted alone.
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
