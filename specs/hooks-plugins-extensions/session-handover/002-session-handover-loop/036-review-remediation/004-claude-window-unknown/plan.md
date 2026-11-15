---
title: "Implementation Plan: Phase 4: claude-window-unknown"
description: "Plan for phase 4: return an unknown Claude window from the resolver, skip and log the nudge, add the doctor hint and correct one README row. The work changes one resolver, one hook caller, one docs table row and the two named test files."
trigger_phrases:
  - "claude window unknown plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: claude-window-unknown

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS library and ESM hook adapter |
| **Framework** | Node built-in test runner |
| **Storage** | Claude settings JSON, read only |
| **Testing** | `node --test` |

### Overview
Change `resolveWindow` in `.skilled/hooks/session-relaunch/lib/context-usage.cjs` so it returns `null` instead of 200,000 when no environment value, settings value or `[1m]` model marker supplies a window. Guard the Claude nudge in `.skilled/hooks/session-relaunch/claude/context-nudge.mjs`, log the skip, add the `/doctor:setup` hint and correct the README switch row. Prove the behavior with `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` and `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: resolver with caller guard

### Key Components
- **`resolveWindow`** in `.skilled/hooks/session-relaunch/lib/context-usage.cjs`: reads the environment and the Claude settings, then returns a positive number or `null`.
- **Claude nudge** in `.skilled/hooks/session-relaunch/claude/context-nudge.mjs`: calls `resolveWindow`, then skips when the result is `null` and logs the skip once per session, through a mark in the session's nudge state file.
- **`window` command** in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`: prints `Claude context window: <n> tokens` when the environment or a Claude settings file supplies one. Otherwise it prints `Claude context window: none configured. Set autoCompactWindow in the Claude settings or SESSION_RELAUNCH_WINDOW_TOKENS in the environment. A [1m] model uses one million tokens without either.` It exits 0 either way, because a doctor line is informational. An argument exits 2 with usage, like the other commands.
- **`/doctor:setup` step** in `.skilled/commands/doctor/assets/doctor-setup.yaml`: one informational step after the last-session-hop step runs the `window` command and shows its line. The presentation file and `setup.md` each gain the matching line.
- **README switch row** in `.skilled/hooks/session-relaunch/README.md`: states the environment-only precedence and the unknown-window outcome.

### Data Flow
The Claude `PostToolUse` hook reads the transcript fill, then resolves the window from the environment, the Claude settings files and the `[1m]` marker. A `null` result stops before `fillRatio`, writes `context-nudge-skipped` with `reason=window-unknown` to `relaunch.log` on the first such run of a session and exits 0. The hook runs on every tool call and the log has no size bound, so later runs of that session write nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `resolveWindow` in `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Owns the 200,000-token fallback at line 356 | update | `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0 with the no-setting/no-marker case |
| `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` | Only production caller at line 125 | update | `node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with the skipped-nudge case |
| `.skilled/commands/doctor/assets/doctor-setup.yaml`, `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` and `.skilled/commands/doctor/setup.md` | Run and describe the informational lines of `/doctor:setup` | update | `rg -c 'session-relaunch.cjs window' .skilled/commands/doctor/assets/doctor-setup.yaml` prints 1 |
| `main` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Dispatches the CLI commands | update | `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs window` exits 0 and prints one line |
| `.skilled/hooks/session-relaunch/README.md` | Documents the switch at line 267 | update | `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/README.md` prints one environment-only row |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Reads the environment then the Pi runtime window at line 288 | not a consumer | No edit. `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/pi/session-relaunch.ts` still prints line 288 |
| `.opencode/plugins/session-relaunch.js` | Reads the environment then the OpenCode runtime window at line 76 | not a consumer | No edit. `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .opencode/plugins/session-relaunch.js` still prints line 76 |
| `resolveCodexWindow` in `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Reads the environment then the runtime `model_context_window` | not a consumer | No edit. `rg -n 'resolveCodexWindow' .skilled/hooks/session-relaunch/lib/context-usage.cjs` prints its definition and caller |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` and `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Observe the resolver and the nudge | update | `node --test` both files exits 0 |

Required inventories:
- Same-class producers: `rg -n 'LARGE_WINDOW_MARKER|DEFAULT_WINDOW_TOKENS|SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/lib/context-usage.cjs` prints the marker and the environment reads. Finding 4 is `instance-only`, because `resolveWindow` is the only producer of the default.
- Consumers of changed symbols: `rg -n 'resolveWindow\(' .skilled/hooks/session-relaunch` prints the definition in `.skilled/hooks/session-relaunch/lib/context-usage.cjs`, the call in `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` and the test callers. No Pi, OpenCode or Codex caller exists.
- Matrix axes: window source is the environment, `settings.local.json`, project `settings.json`, home `settings.json`, the `[1m]` marker or none. Settings state is readable, missing or unreadable. Nudge outcome is fire at the threshold for a number or stay silent and log for `null`. The required rows are the six source rows across the three settings states, with the unreadable case falling through to the next source.
- Algorithm invariant: `resolveWindow` returns a positive number only when the environment, a Claude settings file or a `[1m]` model id supplies it. Every other input returns `null`. Adversarial inputs are an empty or invalid environment value, missing settings, unreadable settings, an empty model string and a model id with no marker.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: read `.skilled/hooks/session-relaunch/lib/context-usage.cjs`, `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` and `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs`, then record the current fallback.
- **Implementation**: add the failing-first cases, change `resolveWindow`, guard the nudge, add the `/doctor:setup` hint and correct the README row.
- **Verification**: run the two named suites, the full session-relaunch suite and the strict packet validator.

The ordered tasks live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveWindow` and `fillRatio` in `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | `node --test` |
| Integration | Claude `context-nudge.mjs` with a transcript and no window setting | `node --test` |
| Manual | `/doctor:setup` in a checkout with no Claude window setting | `/doctor:setup` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node` with the built-in test runner | Internal | Green | The proof commands cannot run |
| No new package | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An unconfigured checkout that should nudge now stays silent and the operator cannot set a window.
- **Procedure**: Revert the phase commit that changes `resolveWindow` and the nudge guard.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Implementation -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
