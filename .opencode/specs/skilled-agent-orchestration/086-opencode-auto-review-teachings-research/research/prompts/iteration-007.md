# Deep Research Iteration 007 of 20 — Event-driven activation (session.idle + session.error lifecycle + abort cooldowns)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 7 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 003 documented `ABORT_COOLDOWN = 10_000` and `ABORT_RACE_DELAY = 1_500` constants
- Iter 005 documented the event handler branches (`session.error` → record abort timestamp; `session.idle` → cooldown check → 1.5s sleep → re-check → runReview)

**Why this iter exists**: this is the FIRST synthesis iter (iters 007-015 are mechanism extractions). You combine info from iter 003 + iter 005 to produce a comprehensive write-up of the event-driven activation mechanism. Then you grep our local repo to assess whether this pattern is feasible across runtimes other than OpenCode (Claude Code, Codex, Gemini, Devin).

**What this mechanism does**:
1. The plugin listens for two OpenCode runtime events: `session.idle` (completion signal) and `session.error` (abort signal)
2. On `session.error` with `errorName === "MessageAbortedError"`, it records the session id in `recentlyAbortedSessions` with the current timestamp
3. On `session.idle`, it (a) skips if this is a review child session's own idle event, (b) skips if within 10s of an abort, (c) sleeps 1.5s as a "race delay" to catch late-arriving aborts, (d) re-checks abort state after sleep, (e) calls `runReview(sessionID)`

**Why the design**: when a user hits Ctrl+C mid-task, the session abort might fire AFTER session.idle (race). The 1.5s delay gives the abort event time to land before runReview commits to spawning a child session.

## TASK

### Step 1 — Aggregate the mechanism from iters 003 + 005

Re-read your local outputs of iter-003 and iter-005:

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md
```

Extract: the verbatim event-handler block (from iter-005), the abort constants (from iter-003), the `recentlyAbortedSessions` Map definition (from iter-005).

### Step 2 — Document the full lifecycle as a sequence diagram (ASCII)

Render a step-by-step trace from "user prompt → completion → review fired" with timing annotations:

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

Then a "happy abort" trace:

```text
T=0     User submits prompt
T=N     Model starts tool calls
T=N+M   User Ctrl+C → MessageAbortedError fires
T=N+M   Plugin event handler: session.error → record sessionID → Date.now() in recentlyAbortedSessions
T=N+M+ε OpenCode emits session.idle (post-abort cleanup)
T=N+M+ε Plugin event handler: check recentlyAbortedSessions → entry found, elapsed < 10s → skip
        (no review spawned — exactly the intended behavior)
```

And a "race abort" trace (the reason ABORT_RACE_DELAY exists):

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

### Step 3 — Cross-runtime feasibility assessment

Could this pattern apply to runtimes other than OpenCode? Investigate each:

```bash
# Claude Code: does it have a session.idle-equivalent hook?
ls .opencode/skills/system-skill-advisor/hooks/claude/
cat .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts 2>/dev/null | head -30

# Gemini: same question
ls .opencode/skills/system-skill-advisor/hooks/gemini/
cat .opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts 2>/dev/null | head -30

# Codex: same
ls .opencode/skills/system-skill-advisor/hooks/codex/
cat .opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts 2>/dev/null | head -30

# Devin: same
ls .opencode/skills/system-skill-advisor/hooks/devin/
cat .opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts 2>/dev/null | head -30

# system-code-graph: session-start (SessionStart event exists)
ls .opencode/skills/system-spec-kit/mcp_server/hooks/devin/
cat .opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts 2>/dev/null | head -30
```

Document which events each runtime emits + which are addressable by hook files in this repo:

| Runtime | session.idle equivalent | session.error equivalent | Hook file pattern |
|---------|------------------------|--------------------------|-------------------|
| Claude Code | ? (see settings.json hooks) | ? | `.opencode/skills/system-skill-advisor/hooks/claude/` |
| Gemini | ? | ? | `.opencode/skills/system-skill-advisor/hooks/gemini/` |
| Codex | ? | ? | `.opencode/skills/system-skill-advisor/hooks/codex/` |
| Devin | ? | ? | `.opencode/skills/system-skill-advisor/hooks/devin/` + `.devin/hooks.v1.json` |
| OpenCode | ✅ yes (this plugin) | ✅ yes | `.opencode/plugins/*.js` |

### Step 4 — Identify the closest local analogue

Our existing plugins already have event-hook surfaces. What's the closest event to "completion of a session"?

```bash
# Look for any onIdle / onComplete / onFinish hooks in our plugins
rg -n 'session.idle|session.complete|on.*Idle|on.*Complete|Stop|stop' .opencode/plugins/ 2>&1 | head -20

# Claude Code Stop event is the closest analogue
rg -n 'Stop\|stop-hook' .claude/settings.local.json 2>&1 | head -5
```

## SCOPE

- `research/iterations/iteration-003.md` (abort constants)
- `research/iterations/iteration-005.md` (event handler)
- Local hook surfaces under `.opencode/skills/system-skill-advisor/hooks/{claude,gemini,codex,devin}/`
- `.opencode/plugins/mk-*.js`
- `.devin/hooks.v1.json`
- `.claude/settings.local.json`
- **No writes outside `research/iterations/iteration-007.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
# Pull prior iter content
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md

# Inventory hook events by runtime
for RT in claude gemini codex devin; do
  echo "=== $RT ==="
  ls .opencode/skills/system-skill-advisor/hooks/$RT/ 2>/dev/null
done

# Claude settings hooks
jq '.hooks // "no hooks key"' .claude/settings.local.json 2>/dev/null

# Devin hooks v1
cat .devin/hooks.v1.json 2>/dev/null | jq 'keys' 2>/dev/null
```

## CONSTRAINTS

- READ-ONLY.
- Cite both upstream `packages/auto-review/auto-review.ts:<line>` AND local repo `<absolute-path>:<line>` for every claim.
- Quote the upstream event handler block verbatim in your output.
- Reuse the pinned SHA via grep of iter-001.

## COMMON FAILURE MODES

1. **Hook directory missing for a runtime**: if `.opencode/skills/system-skill-advisor/hooks/claude/` doesn't exist, that's a finding (we don't have an advisor hook for that runtime). Don't gloss over.
2. **Event-name confusion**: Claude Code uses `Stop` event, OpenCode uses `session.idle`, Codex uses different. Don't claim equivalence without checking.
3. **`.claude/settings.local.json` schema is nested**: per memory entry, the hook shape is `hooks.<Event>: [{matcher, hooks: [{type, command}]}]`. Don't assume flat schema.

## OUTPUT FORMAT

Write to `research/iterations/iteration-007.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 007 — Event-driven activation (session.idle + session.error + abort cooldowns)

## Summary
<2-4 sentence verdict on the mechanism + cross-runtime feasibility>

## Files/Commands Reviewed
- Upstream: `packages/auto-review/auto-review.ts:<line-range>` (event handler) + `:<line>` (abort constants)
- Local: `research/iterations/iteration-003.md`, `research/iterations/iteration-005.md`
- Local hooks: `.opencode/skills/system-skill-advisor/hooks/{claude,gemini,codex,devin}/`
- Local plugins: `.opencode/plugins/mk-*.js`
- Runtime hook configs: `.claude/settings.local.json`, `.devin/hooks.v1.json`

## Findings

### Mechanism Overview
| Component | Verbatim / value | Purpose |
|-----------|------------------|---------|
| `ABORT_COOLDOWN` | `10_000` (ms) | window after MessageAbortedError where session.idle events are ignored |
| `ABORT_RACE_DELAY` | `1_500` (ms) | sleep between idle-arrival and runReview to catch race-arriving aborts |
| `recentlyAbortedSessions` | `Map<string, number>` | session_id → abort_timestamp |
| `reviewSessionIDs` | `Set<string>` | child review-session ids; skip their session.idle events |

### Event Handler (verbatim from auto-review.ts)
```typescript
<verbatim event handler code from auto-review.ts:NN-NN>
```

### Lifecycle Trace — Happy Path
```text
<ASCII trace showing T=0 .. T=N+1.5s+ "review fired">
```

### Lifecycle Trace — Happy Abort
```text
<ASCII trace showing user Ctrl+C, session.error before session.idle, review skipped>
```

### Lifecycle Trace — Race Abort (the reason ABORT_RACE_DELAY exists)
```text
<ASCII trace showing session.idle before session.error, ABORT_RACE_DELAY sleep, race caught>
```

### Cross-Runtime Feasibility
| Runtime | session.idle equivalent | session.error equivalent | Current hook file present? | Verdict |
|---------|------------------------|--------------------------|----------------------------|---------|
| Claude Code | `Stop` event | error logs (Bash output) | Yes for UserPromptSubmit + Stop | PORTABLE (with adapter) |
| Gemini | `BeforeAgent` only? | not exposed in current schema | Yes for UserPromptSubmit | NEEDS SDK research |
| Codex | unknown — no session.idle hook in current shape | unknown | Yes for UserPromptSubmit | NEEDS SDK research |
| Devin | `Stop` event via `.devin/hooks.v1.json` | session abort signal? | Yes for UserPromptSubmit + SessionStart | LIKELY PORTABLE |
| OpenCode | ✅ native | ✅ native | This plugin is the canonical example | DONE |

### Closest Local Analogue
<grep result for closest "completion" event in our codebase + 1-paragraph assessment>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — synthesis builds on iter-003/005 but adds the lifecycle trace + cross-runtime analysis. `dimension status: FULLY EXTRACTED`.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":7,"focus":"event-driven activation","mechanismsExtracted":4,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Event handler verbatim block included
- [ ] 3 lifecycle traces (happy / happy-abort / race-abort) drawn as ASCII
- [ ] Cross-runtime feasibility table covers all 5 runtimes (claude / gemini / codex / devin / opencode)
- [ ] Closest local analogue identified
- [ ] Output file ≥ 80 lines

Begin.
