---
title: "Implementation Plan: Vibe automatic session handover"
description: "A Vibe adapter adds one turn-start part and one turn-end part to the two Vibe composers, fed by a usage reader over the Vibe journal. Unit tests, the gate suites, playbook scenarios and scored live hops beside Claude Code prove it."
trigger_phrases:
  - "vibe automatic handover plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Vibe automatic session handover

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS and ESM), Markdown |
| **Framework** | Vibe 3.1.2 `pre_agent` and `post_agent` hooks, the session handover core |
| **Storage** | The Vibe session folder (read only) and the git-ignored relaunch records |
| **Testing** | node:test, the phase 041 hop harness and `score.cjs` |

### Overview
`readVibeUsage` reads the last measured `input_tokens` from the session's journal and the `compaction_threshold` from its current generation. `session-handover/vibe/handover-parts.mjs` gives the turn-start composer a part that expands a claim seed, withdraws an armed hand-over on an operator prompt and otherwise nudges past the threshold. It gives the turn-end composer a part that arms a pending record and starts the killer, run last and never denying. DeepSeek V4.1 Flash max through cli-opencode writes each change from a short brief, a fresh Opus medium agent reviews the result, and live hops are scored beside a Claude Code baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator chose the scope, the workspace, the live model and the builder
- [x] The live spike answered both open questions

### Definition of Done
- [ ] `node --test .skilled/hooks/session-handover/tests/vibe-*.test.mjs` passes
- [ ] `HOOKDIR=session-handover bash ../044-in-session-handover-rename/scratch/gate.sh` keeps the 044 counts plus the new tests
- [ ] `score.cjs` prints the same score for the Vibe run as for the Claude Code baseline
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Composer parts reusing the core.

### Key Components
- **`readVibeUsage` and `resolveVibeWindow`**: the fill and the window. Without them no Vibe turn can tell how full it is, since `context-breakdown.json` holds characters, not tokens.
- **The turn-start part**: seed expansion, withdraw and nudge, the Codex adapter's order. Without it no Vibe session hears it should hand over.
- **The turn-end part**: arm and killer, the Codex `armPendingRecord` shape. Without it a prepared record stays pending and the wrapper declines it.

### Data Flow
`pre_agent` gives the session folder as `transcript_path`. The part reads the fill, nudges, and the session writes the note through `/speckit:handoff`, which prepares the record. `post_agent` arms it and starts the killer on the newest journal segment. The killer ends the Vibe process once the journal goes quiet, and `skilled-loop` starts Vibe again on the claim seed, which the next `pre_agent` expands.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/context-usage.cjs` | Usage readers for Claude Code and Codex | update | new unit test |
| `session-lifecycle/vibe/turn-start.mjs`, `turn-end.mjs` | The only Vibe turn entries | update | composer tests keep their counts |
| `lib/relaunch-core.cjs`, `killer.cjs`, `bin/skilled-loop` | Already know Vibe | unchanged | gate suites |
| `.vibe/plugins/README.md`, handover README | State that Vibe hands over by command only | update | grep |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup holds the spike and the briefs. Implementation adds the reader, the parts and the wiring. Verification runs the tests, the gate, the review and the live hops.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `readVibeUsage`, the turn-start part, the turn-end part | node:test |
| Integration | The two composers, the relaunch and Vibe hook suites | node:test, the 044 gate script |
| Manual | Vibe hops through `skilled-loop vibe`, one Claude Code baseline | the 043 probe harness, `score.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `vibe` 3.1.2 and `MISTRAL_API_KEY` | External | Green | No live hop |
| LLM Gateway for DeepSeek V4.1 Flash | External | Green | The builder falls back to asking the operator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a Vibe turn is denied or delayed by a hand-over part, or a suite drops below its count.
- **Procedure**: `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=0` stops the parts at once. Revert the phase commit to remove them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 044 on main | Implementation |
| Implementation | The spike results | Verification |
| Verification | Every part wired | The push |
<!-- /ANCHOR:phase-deps -->

---
