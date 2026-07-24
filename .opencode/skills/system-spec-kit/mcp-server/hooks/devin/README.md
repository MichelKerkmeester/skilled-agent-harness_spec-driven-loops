---
title: "Devin Hooks: Lifecycle Adapters"
description: "Devin CLI hook adapters that normalize Devin lifecycle payloads and delegate to the existing Claude hook implementations -- built, typechecked, and dormant pending a devin build that fires hooks under -p dispatch."
---

# Devin Hooks: Lifecycle Adapters

---

## 1. OVERVIEW

`hooks/devin/` adapts Devin CLI's `SessionStart` and `UserPromptSubmit` lifecycle events onto the existing Claude hook implementations in `../claude/`. Each adapter reads and validates its own Devin payload, spawns the matching compiled Claude adapter with a normalized input, and translates the result back into Devin's documented `hookSpecificOutput` response envelope (the same shape Codex uses -- confirmed by phase 001's citation that Devin's event-name set closely mirrors Claude Code's own hook contract). No lifecycle logic is duplicated: state and transcript semantics stay owned by the Claude adapters.

## 2. STATUS: DORMANT -- LIVE-VERIFIED, NOT ASSUMED

Live-probed 2026-07-24 against the installed `devin 3000.2.17` binary, mirroring the same temporary-uncommitted-`.devin/hooks.v1.json`-plus-real-dispatch methodology used for `cli-cursor`'s phase 004:

| Registration path tried | Result |
|---|---|
| Standalone `.devin/hooks.v1.json` (with and without a top-level `"version": 1` field) | **Never consulted** -- a real dispatched `ls` tool call produced zero probe firings for `SessionStart`, `UserPromptSubmit`, `PreToolUse`, or `Stop`. |
| `.devin/config.json`'s `"hooks"` key | Same -- zero firings. |
| Deliberately malformed JSON in `.devin/hooks.v1.json` | `devin -p` succeeded with **zero parse errors or warnings** -- proof the file isn't even read in this mode, not just that it's silently ignored once read. |
| `--agent-config <file>` with a `hooks` field | **Explicitly rejected**: `unknown field 'hooks', expected one of system_instructions, allowed_tools, permissions, mcp_servers, extensions` -- `hooks` is not part of this schema at all. |

**Conclusion**: no headless/dispatched attachment point for Devin's hook system exists in this build. `devin -p` (print/non-interactive mode -- the only mode any dispatcher, including this repo's own `cli-devin` executor, would ever use) does not fire hooks under any registration path tested. True interactive mode was not testable from this environment (requires a real TTY) and remains the one unconfirmed gap.

These adapters are built, typechecked (`tsc --noEmit`, 0 errors), compiled, and directly-invocation-tested with realistic payloads -- but **never claimed as live-fire-verified**, because they cannot be under the confirmed constraint above. Re-run the probe methodology in this table before registering `.devin/hooks.v1.json` against a future `devin` build, or before trusting this dormant status as still accurate.

## 3. CONTENTS

| File | Purpose |
|------|---------|
| `shared.ts` | Reads and validates a bounded Devin hook payload, spawns the matching `../claude/*.js` adapter, and emits Devin's `hookSpecificOutput` response envelope. |
| `session-start.ts` | `SessionStart` adapter. Delegates to `session-prime.js` and emits the returned context. |
| `user-prompt-submit.ts` | `UserPromptSubmit` adapter. Delegates to `user-prompt-submit.js` and normalizes its JSON response into the Devin envelope. |

## 4. CONSUMERS

- A project `.devin/hooks.v1.json` would register the compiled `dist/hooks/devin/*.js` outputs of `session-start.ts` and `user-prompt-submit.ts` against `SessionStart`/`UserPromptSubmit`. **Not committed** -- registering a config path confirmed dead under `-p` dispatch would misrepresent this phase's actual coverage.

## 5. RELATED

- [`../README.md`](../README.md)
- [`../codex/README.md`](../codex/README.md) -- structural precedent; Devin's envelope shape matches Codex's, unlike Cursor's distinct `{permission, user_message, agent_message}` shape.
- [`../../runtime/hooks/devin/README.md`](../../runtime/hooks/devin/README.md)
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md`](../../../../../../.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md) -- ADR-001, revised with this finding.
