---
title: "Contract: what warms the advisor daemon once no MCP client starts it"
description: "Per-runtime session warm mechanism for the advisor daemon after the MCP transport is removed, with the measured cost it avoids."
trigger_phrases:
  - "advisor warm mechanism"
  - "advisor session warm"
  - "advisor warm only"
  - "daemon start trigger"
importance_tier: "important"
contextType: "reference"
---
# Contract: what warms the advisor daemon once no MCP client starts it

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Frozen in phase 2. Phase 3 implements it and phase 4 wires it per runtime.

---

## 1. THE PROBLEM

Today the MCP client connection starts the daemon when a session opens. Remove the transport and
nothing does, so the first prompt of every session pays daemon start.

That cost is measured, not assumed: 3008 ms cold against 926 ms warm on the same daemon, a penalty
of 2082 ms on the first call. Paying it on the first prompt of every session is a visible
regression, and D2 makes any operator-visible change a failure.

---

## 2. THE MECHANISM

The CLI already has the mode. `--warm-only` starts or attaches to the daemon and returns without
running a tool, and it already reports a stale build as retryable rather than fatal. Nothing new is
built; each runtime gains one fire-and-forget invocation at session start.

The invocation is the same everywhere:

```
node .opencode/bin/skill-advisor.cjs --warm-only
```

Three properties it must keep:

- **Non-blocking.** Session start never waits on it. It is spawned detached and its output is
  discarded.
- **Silent on failure.** A warm that cannot reach the daemon exits non-zero and changes nothing.
  The next real call starts the daemon as it does today.
- **Idempotent.** A second warm against a live daemon attaches and returns.

---

## 3. PER RUNTIME

| Runtime | Hook point | Status |
|---------|-----------|--------|
| Claude Code | `SessionStart` in `.claude/settings.json`, which already exists and already carries one hook group | Confirmed available |
| OpenCode | The plugin's default export runs at plugin load, which is session start. Warm fires there | Confirmed available |
| Codex | `hooks = true` with the runtime's session-start mirror, installed by the codex hook installer | Available; phase 4 confirms the event name against the installer |
| Pi | The pi prompt hook has no session-start sibling found in `.pi/` | **No warm point found.** Pi accepts the cold first prompt unless phase 4 finds one |

Pi is recorded as a known gap rather than assumed solved. Its first prompt pays the cold cost, which
is what it pays today whenever no MCP client has started the daemon.

---

## 4. WHAT PHASE 8 CHECKS

- A session start in each runtime leaves a daemon listening before the first prompt.
- The first prompt of a session lands inside the warm budget, p50 at or under 1100 ms for the CLI
  call, for every runtime with a confirmed warm point.
- A runtime whose warm point failed still produces a brief, because the first real call starts the
  daemon.
