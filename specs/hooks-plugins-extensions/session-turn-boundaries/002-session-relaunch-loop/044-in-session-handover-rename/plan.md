---
title: "Implementation Plan: Rename session relaunch to session handover"
description: "One scripted pass moves the hook folder and the files named after the feature, then rewrites every live form of the name with a word map that protects spec-folder names. The suites, the sync checks and one live Claude Code hop prove nothing else changed."
trigger_phrases:
  - "session handover rename plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Rename session relaunch to session handover

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS and ESM), TypeScript, bash, Markdown, JSON |
| **Framework** | The hook adapters for Claude Code, Codex, Pi, OpenCode and Vibe |
| **Storage** | Git-ignored handoff notes under `.skilled/skills/.state/` |
| **Testing** | node:test, vitest, the hook and mirror sync checks |

### Overview
`git mv` moves `.skilled/hooks/session-relaunch/` and the 13 files named after the feature. A Perl word map then rewrites every live form of the name in 130 files and skips any `NNN-session-relaunch` spec-folder name. A first pass named the feature "in-session handover". The operator then chose the shorter "session handover" as the main name, so `rename2.pl` moved every in-session form to the short one. Both flag readers then learn to read `SYSTEM_IN_SESSION_HANDOVER_*` for each on or off switch while the main one is blank, and `/speckit:handoff` gains three owned signals. The same suites that passed before the rename must print the same counts, and one live Claude Code hop must hand over on the renamed code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator answered scope, the bare word, history and aliases
- [x] The baseline counts are recorded before the first rename

### Definition of Done
- [x] The inventory grep, with spec-folder names excluded, prints 0
- [x] `HOOKDIR=session-handover bash scratch/gate.sh` prints the baseline counts and two sync PASS lines
- [x] `score.cjs` on the live Claude Code run prints `5/5`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical rename with protected names.

### Key Components
- **`rename.pl` and `rename2.pl`**: the word maps. They run the longest forms first and shield `NNN-` spec-folder names. The second turns every in-session form into the short one and fixes "an session handover" to "a session handover".
- **`switchAlias()` and `__hook_flags_resolve_switch`**: one prefix map, `SYSTEM_SESSION_HANDOVER_` to `SYSTEM_IN_SESSION_HANDOVER_`, read only while the main switch is blank.
- **Mirror links**: the nine `.claude/hooks`, `.codex/hooks` and OpenCode links, re-pointed with `ln -sfn` at the new folder.

### Data Flow
The flag readers turn `SYSTEM_SESSION_HANDOVER_*` into the on or off answer. The hooks write notes to `.state/session-handover/handoffs`, and the wrapper seeds the next session with `[session-handover] claim and continue handoff`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This is a rename with no fix and no behavior change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the inventory and the baseline. Implementation moves the files, rewrites the content and re-points the links. Verification reruns the gate and one live hop.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Relaunch core, flags, Pi adapter, goal hooks, Vibe hooks, doctor, spec gate, writer, advisor commands | node:test, vitest |
| Integration | Hook registrations, mirror links, drift checks | `check-hook-sync`, `check-mirror-sync`, the drift checks |
| Manual | One Claude Code hop through `skilled-loop` | `scratch/harness/live-hop.sh`, `score.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 043 on main | Internal | Green | The rename would start before the Vibe fixes |
| Claude Code account 1 | External | Green | No live hop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a hook stops firing or a suite drops below its baseline after the merge.
- **Procedure**: revert the rename commit. A checkout that already moved its state folder moves it back to `.state/session-relaunch`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 043 on main | Implementation |
| Implementation | The baseline counts | Verification |
| Verification | Every rename and link | The push |
<!-- /ANCHOR:phase-deps -->

---
