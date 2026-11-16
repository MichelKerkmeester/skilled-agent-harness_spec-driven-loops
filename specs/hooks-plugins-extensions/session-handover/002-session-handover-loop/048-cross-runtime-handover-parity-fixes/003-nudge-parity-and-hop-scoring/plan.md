---
title: "Implementation Plan: Phase 3: nudge-parity-and-hop-scoring"
description: "Move the Vibe nudge claim into the shared nudge module so Claude, Codex and Vibe deliver one nudge when hooks run at once, and score the side word in the live-hop harness."
trigger_phrases:
  - "nudge parity and hop scoring plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: nudge-parity-and-hop-scoring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ES modules), Bash |
| **Framework** | Skilled session-handover core |
| **Storage** | Per-session nudge state and a claim file in the relaunch state directory |
| **Testing** | `node --test` |

### Overview
The claim, the second decision under it and the level write move from `vibe/handover-parts.mjs` into one `lib/nudge.cjs` function. Claude `context-nudge.mjs`, Codex `shared.mjs` and the Vibe adapter call it in place of their own write. The live-hop harness copied from phase 047 gains a side-word check, and live Pi and OpenCode hops prove phases 001 and 002.
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
One shared helper replacing three copies of read, decide and write

### Key Components
- **`lib/nudge.cjs`**: the shared claim and commit.
- **`claude/context-nudge.mjs`, `codex/shared.mjs`, `vibe/handover-parts.mjs`**: callers.
- **`../scratch/harness/score.cjs`**: the side-word check.

### Data Flow
A tool hook decides a nudge, then the shared function creates the claim file, decides again and writes the level. A hook that finds a live claim or a spent level returns quiet, so one hook delivers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/nudge.cjs` | Nudge ladder for every runtime | update; one new export, existing functions unchanged | the nudge tests unchanged and passing |
| Claude, Codex and Vibe nudge paths | Deliver the nudge | update; commit through the claim | the existing nudge delivery tests unchanged and passing |
| Pi and OpenCode | In-process nudge | unchanged | not in the diff |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, one Vibe brief per change, then the docs and the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Two commits racing on one state file deliver one nudge, a stale claim is taken over | `node --test`, one mutation per check |
| Manual | Live Pi and OpenCode hops with a side word, scored by `score.cjs` | `../scratch/harness/live-hop.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi and OpenCode CLIs with working providers | External | To check | No live hop |
| tmux | External | Green | No live hop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a nudge that no longer arrives on Claude, Codex or Vibe.
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
| Verification | Implementation | Merge |
<!-- /ANCHOR:phase-deps -->

---
