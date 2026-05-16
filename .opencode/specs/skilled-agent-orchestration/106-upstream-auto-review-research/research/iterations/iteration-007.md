Iteration 007 complete. I've successfully synthesized the event-driven activation mechanism from iters 003 and 005, documenting:

**Key findings:**
- **Event handler verbatim**: Lines 139-151 from upstream auto-review.ts showing the dual-event system (session.error for abort tracking, session.idle for review triggering)
- **Abort constants**: ABORT_COOLDOWN = 10_000 ms, ABORT_RACE_DELAY = 1_500 ms
- **Lifecycle traces**: 3 ASCII sequences showing happy path, happy abort, and race abort scenarios
- **Cross-runtime feasibility**: 
  - Claude Code: PORTABLE (has Stop event as closest analogue)
  - Gemini: NEEDS SDK research (only has BeforeAgent prompt-time hook)
  - Codex: NEEDS SDK research (no completion hook in current shape)
  - Devin: LIKELY PORTABLE (if Stop event added to hooks.v1.json)
  - OpenCode: DONE (native session.idle + session.error)
- **Closest local analogue**: Claude Code's Stop event (.claude/settings.local.json lines 44-52, implemented in session-stop.ts)

**Output:**
- `research/iterations/iteration-007.md` (99 lines)
- `research/deep-research-state.jsonl` (appended iteration record)

All acceptance criteria met. Ready for iteration 008.
json` (no Stop event)

## Findings

### Mechanism Overview
| Component | Verbatim / value | Purpose |
|-----------|------------------|---------|
| `ABORT_COOLDOWN` | `10_000` (ms) | window after MessageAbortedError where session.idle events are ignored |
| `ABORT_RACE_DELAY` | `1_500` (ms) | sleep between idle-arrival and runReview to catch race-arriving aborts |
| `recentlyAbortedSessions` | `Map<string, number>` | session_id → abort_timestamp |
| `reviewSessionIDs` | `Set<string>` | child review-session ids; skip their session.idle events |

### Event Handler (verbatim from auto-review.ts:139-151)
```typescript
return { event: async ({ event }: { event: any }) => { if (event.type === "session.error") {
const sessionID = event.properties?.sessionID const errorName = event.properties?.error?.name if
(sessionID && errorName === "MessageAbortedError") { recentlyAbortedSessions.set(sessionID,
Date.now()) debug("Abort cooldown started", sessionID) } return } if (event.type !== "session.idle")
return const sessionID = event.properties?.sessionID if (!sessionID) return if
(reviewSessionIDs.has(sessionID)) { debug("Skipping review child idle", sessionID) return } const
abortAt = recentlyAbortedSessions.get(sessionID) if (abortAt) { const elapsed = Date.now() - abortAt
if (elapsed < ABORT_COOLDOWN) { debug("Skipping during abort cooldown", sessionID, elapsed) return }
recentlyAbortedSessions.delete(sessionID) } await new Promise((resolve) => setTimeout(resolve,
ABORT_RACE_DELAY)) const raceAbortAt = recentlyAbortedSessions.get(sessionID) if (raceAbortAt) {
const elapsed = Date.now() - raceAbortAt if (elapsed < ABORT_COOLDOWN) { debug("Skipping due to
abort race", sessionID, elapsed) return } recentlyAbortedSessions.delete(sessionID) } try { await
runReview(sessionID) } catch (error) { debug("runReview failed", sessionID, error) } }, }
```

### Lifecycle Trace — Happy Path
```text
T=0       User submits prompt
T=N       Model executes, calls tools, finishes
T=N+0     OpenCode emits session.idle event
T=N+0     Plugin event handler: check reviewSessionIDs (this is a parent session) → continue
T=N+0     Plugin: check recentlyAbortedSessions[sessionID] → no entry, continue
T=N+1.5s  Plugin awakes from ABORT_RACE_DELAY sleep
T=N+1.5s  Plugin: re-check recentlyAbortedSessions → still none, continue
T=N+1.5s  Plugin calls runReview(sessionID)
T=N+1.5s+ runReview gates pass → spawn child session, dispatch reviewer
```

### Lifecycle Trace — Happy Abort
```text
T=0     User submits prompt
T=N     Model starts tool calls
T=N+M   User Ctrl+C → MessageAbortedError fires
T=N+M   Plugin event handler: session.error → record sessionID → Date.now() in recentlyAbortedSessions
T=N+M+ε OpenCode emits session.idle (post-abort cleanup)
T=N+M+ε Plugin event handler: check recentlyAbortedSessions → entry found, elapsed < 10s → skip
        (no review spawned — exactly the intended behavior)
```

### Lifecycle Trace — Race Abort (the reason ABORT_RACE_DELAY exists)
```text
T=0       User submits prompt
T=N       Model finishes legitimate tool turn
T=N+0     session.idle fires
T=N+ε     User Ctrl+C → session.error fires AFTER idle
          (this is the race)
T=N+0     Plugin event handler: session.idle → no abort entry yet → continue
T=N+ε     Plugin event handler: session.error → record sessionID → Date.now()
T=N+1.5s  Plugin awakes from race delay sleep
T=N+1.5s  Plugin: re-check recentlyAbortedSessions → entry now exists, elapsed < 10s → skip
          (race caught — no review spawned)
```

### Cross-Runtime Feasibility
| Runtime | session.idle equivalent | session.error equivalent | Current hook file present? | Verdict |
|---------|------------------------|--------------------------|----------------------------|---------|
| Claude Code | `Stop` event (async) | error logs (Bash output) | Yes for UserPromptSubmit + Stop | PORTABLE (with adapter) |
| Gemini | `BeforeAgent` only (prompt-time) | not exposed in current schema | Yes for UserPromptSubmit | NEEDS SDK research |
| Codex | unknown — no session.idle hook in current shape | unknown | Yes for UserPromptSubmit | NEEDS SDK research |
| Devin | No Stop event in current `.devin/hooks.v1.json` | session abort signal? | Yes for UserPromptSubmit + SessionStart | LIKELY PORTABLE (if Stop added) |
| OpenCode | ✅ native (session.idle) | ✅ native (session.error) | This plugin is the canonical example | DONE |

**Notes:**
- Claude Code's `Stop` event (`.claude/settings.local.json` lines 44-52) is the closest analogue to `session.idle` — it fires when the session stops/completes and is already used for token tracking and context autosave (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` lines 1-5)
- Gemini's `BeforeAgent` event (`.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts` line 46) is prompt-time, not completion-time
- Devin's current hooks (`.devin/hooks.v1.json`) only include `UserPromptSubmit` and `SessionStart` — no completion/stop event configured
- The abort-cooldown + race-delay pattern is portable to any runtime that has both completion and abort events

### Closest Local Analogue
The closest local analogue to OpenCode's `session.idle` event is Claude Code's `Stop` event, registered in `.claude/settings.local.json` at lines 44-52 and implemented in `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`. This hook fires when a Claude Code session stops (completion or abort), parses the transcript for token usage, stores a session snapshot, and triggers context autosave. Unlike OpenCode's `session.idle`, Claude's `Stop` event does not provide a native abort signal equivalent to `session.error` with `MessageAbortedError` — abort detection would need to rely on transcript parsing or heuristics.

## Convergence Signal
`newInfoRatio: 0.85` — synthesis builds on iter-003/005 but adds the lifecycle trace + cross-runtime analysis. `dimension status: FULLY EXTRACTED`.
