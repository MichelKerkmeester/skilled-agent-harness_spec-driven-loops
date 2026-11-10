---
title: "Implementation Plan: Phase 12: hook-guards-and-audit-log"
description: "Fix the menu rule in the shared ask-surface core, move two Stop hooks onto the shared deadline reader, key OpenCode and dsh send-back on the operator message, and root the dispatch-audit log at the repository top level."
trigger_phrases:
  - "hook guards and audit log plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: hook-guards-and-audit-log

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS and ES modules, one TypeScript Pi extension |
| **Framework** | Skilled hook adapters and OpenCode plugins |
| **Storage** | None |
| **Testing** | `node --test` plugin and hook suites (also under `AI_SESSION_CHILD=1`), hooks vitest config |

### Overview
Each of the four findings is fixed where the behaviour is decided: the core's option rule, each Stop hook's stdin read, each adapter's send-back key, and one shared log-path helper. Every change carries a test that fails on the old code, and the whole hook battery is rerun against its baseline.
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
- [x] Plugin, hook node and hook vitest suites keep every baseline pass; child-mode failures unchanged
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`ask-surface-guard/lib/ask-surface-core.cjs`**: menu detection and the send-back contract every adapter imports
- **Stop adapters (claude, codex, devin)**: read the turn payload from stdin
- **`.opencode/plugins/ask-surface-guard.js`, `dsh/ask-surface-guard.mjs`**: choose the send-back key
- **`dispatch/lib/dispatch-audit.mjs`**: owns the audit log path

### Data Flow
A runtime ends a turn, the adapter reads the payload, the core judges the last assistant message, the adapter keys the send-back and records it. A Bash tool call reaches a dispatch-audit adapter, which resolves the log path and appends one line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ask-surface-core.cjs` OPTION_LINE | Producer of the menu verdict | update | fixture suite |
| `claude/ask-surface-stop.cjs`, `lib/advisory-stop.cjs` | stdin readers | update | open-stdin spawn tests |
| `codex/`, `devin/ask-surface-stop.cjs` | callers of advisory-stop | update (catch) | advisory-stop tests |
| OpenCode plugin, dsh adapter | send-back key | update | repeat-menu tests |
| Pi adapter, Claude stop_hook_active | already per operator message | unchanged | read |
| `dispatch-audit.mjs` and claude, codex, devin, pi adapters | log path | update | nested-cwd test |
| dsh and OpenCode audit adapters | already repo-rooted | unchanged | README row |

Required inventories:
- Same-class producers: `rg -n 'readFileSync\(0' .skilled/hooks/ask-surface-guard` is empty after the change.
- Log-path producers: `rg -n 'DEFAULT_LOG_RELATIVE_PATH' .skilled/hooks/dispatch` shows only the helper and the dsh adapter.
- Matrix axes: runtime (claude, codex, devin, opencode, dsh, pi) by event (first menu, repeat menu, new operator message).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup records baselines, implementation sends one worker brief per change group, verification reruns the probes and the baseline suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | core menu rule, deadline read, send-back key, log path | `node --test`, vitest |
| Integration | whole plugin battery with and without `AI_SESSION_CHILD=1` | `node --test .opencode/plugins/tests` |
| Manual | reviewer probes of summary-plus-question prompts | node against the core module |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex Luna | External | Green | DeepSeek fallback |
| `hook-adapter-shared.cjs` reader | Internal | Green | Stop hooks keep blocking |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a baseline-passing test fails after the change.
- **Procedure**: `git revert <phase commit>` in the worktree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, negative controls) | None | Implementation |
| Implementation (worker briefs) | Setup | Verification |
| Verification (probes, suites, cross-family review) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->

---
