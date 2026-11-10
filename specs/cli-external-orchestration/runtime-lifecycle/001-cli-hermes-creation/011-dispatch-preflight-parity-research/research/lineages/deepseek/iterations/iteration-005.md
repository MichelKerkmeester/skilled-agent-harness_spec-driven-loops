---
title: "Iteration 5: OpenCode Parity — Plugin API Deny and the Smallest Adapter"
trigger_phrases: []
---
# Iteration 5: OpenCode Parity — Plugin API Deny and the Smallest Adapter

## Focus
Whether OpenCode's plugin API can deny a Bash tool call before execution, the API to cite, the smallest adapter, and how it compares against what the current audit plugin already collects.

## Findings

1. **Yes — OpenCode's plugin API denies pre-execution by throwing from `tool.execute.before`, and the repo states that as the contract.** The plugins README records it for the spec-gate plugin: "enforce throws `system-spec-gate:` on deny (OpenCode's deny signal)". The deep-loop guard implements exactly that — `if (result.decision === 'reject') throw new Error(result.detail);` inside `async 'tool.execute.before'(input, output)` — and rethrows only its own prefixed error so unrelated internal failures still fail open. [SOURCE: .opencode/plugins/README.md:84] [SOURCE: .opencode/plugins/system-deep-loop-guard.js:71,93-96]

2. **The advisory channel is already established for this exact job.** `sk-git-preflight-advisory.js` runs on `tool.execute.before` for `bash`, buffers "at most 20 advisory events", and "drains them on the next `experimental.chat.system.transform`; never prints." A dispatch preflight warning would use the same buffer-and-drain pair. The transport details (input `tool`/`args`, `input.sessionID`, `ctx.directory`) are the same surfaces the audit plugin and guard already consume. [SOURCE: .opencode/plugins/README.md:35,122-123] [SOURCE: .opencode/plugins/sk-git-preflight-advisory.js:92]

3. **What the current dispatch audit file already collects**: `tool.execute.after` for `bash` only; it recognizes a dispatch via the shared `dispatch-audit.mjs` core (`recordDispatch` builds the scrubbed JSONL line: runtime, session, callID, skill, truncated command, model, target, durationMs, exitCode, outputBytes), anchors the log to the repo root via `findRepoRoot`, gates on `isHookEnabled('dispatch')`, and is explicitly "purely observational: runs after the tool result already exists and never throws, never blocks." It never reads a SKILL.md, never evaluates `hard_rules`, and so cannot deny anything. [SOURCE: .opencode/plugins/cli-dispatch-audit.js:1-16,60-90]

4. **Smallest adapter: add a `tool.execute.before` hook to this same plugin (or a sibling under the same `dispatch` kill-switch).** The plugin already imports the audit core and the kill-switch resolver and already computes `projectDir`; the addition needs one more import (`readHardRules`, `evaluate` from `hooks/dispatch/lib/dispatch-rule-checks.mjs`; `DISPATCH_SHAPES` from `hooks/dispatch/lib/dispatch-audit.mjs`, both already available), and the body mirrors the Claude preflight's main() with OpenCode's transport: read `output?.args?.command`, match `DISPATCH_SHAPES`, resolve `SKILL.md` under `projectDir`, `evaluate`, then `throw new Error('cli-dispatch-preflight: …')` for a block and buffer the advisory text for the next system transform. No subprocess is spawned (unlike the Cursor shim), so the added latency is one regex match plus one small file read on dispatch-shaped commands only. [SOURCE: .opencode/plugins/cli-dispatch-audit.js:22-31,44-48] [SOURCE: .opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs:57-100]

5. **What the preflight adds over the audit, item by item**:

| Collection point | Exists | Data | Can deny | Can advise | Blind spot |
|---|---|---|---|---|---|
| `tool.execute.after` audit (today) | yes | post-hoc scrub line: skill, command, model, target, duration, exit, bytes | no | no | hung dispatches (no post event); no rule evaluation at all |
| `tool.execute.before` preflight (proposed) | no | skill match + rule violations, pre-spawn | yes (throw) | yes (buffer) | dispatches composed in other runtimes never reach this plugin |

6. **Scope limit that the parity story must keep straight**: an OpenCode-session plugin only sees commands executed *inside* an OpenCode session. A `claude -p "opencode run …"` chain, or a command typed in Cursor, still needs the per-runtime adapter for that host. OpenCode parity closes the loop for OpenCode-hosted dispatches; it does not replace the Claude/Codex/Devin/Pi adapters, and it is exactly parallel to them in coverage. [INFERENCE: based on plugin event wiring — `tool.execute.before` fires in the host that loads the plugin]

7. **Kill-switch consistency is free but must be deliberate**: the audit plugin gates on `isHookEnabled('dispatch')`; a preflight added to the same plugin inherits it, but the deep-loop guard's comment warns the switch must be checked "FIRST — before any policy evaluation or denial". The same ordering applies here so a disabled dispatch concern can never block. [SOURCE: .opencode/plugins/system-deep-loop-guard.js:73-76] [SOURCE: .opencode/plugins/cli-dispatch-audit.js:61]

## Ruled Out
- Treating OpenCode as unable to block: the spec-gate plugin denies through the same `tool.execute.before` surface, and the plugins README names throwing as the deny signal. The dispatch concern simply never registered a before hook. [SOURCE: .opencode/plugins/README.md:84]
- Printing advisories from the plugin: the repo's own advisory plugins never print; they buffer and drain on the next system transform, which is the pattern to reuse for consistency and to avoid stdout pollution of tool output. [SOURCE: .opencode/plugins/README.md:35]

## Dead Ends
- Looking for an OpenCode-specific rule engine: there is none; the plugins import the same `dispatch-rule-checks.mjs` engine where needed (the audit core and the sk-git plugin), so a dispatch preflight has no reason to add one. [SOURCE: .opencode/plugins/sk-git-preflight-advisory.js:19]

## Edge Cases
- Contradictory evidence: none. The audit plugin's comment says it "can never change, delay, or block a dispatch" — true of the `after` hook it owns, and not a statement about the plugin surface.
- Partial success: the advisory's arrival timing is not verified — `experimental.chat.system.transform` may fire later in the same turn or on the next one, so a warning can trail the dispatch it is about. Blocking checks (throw) are pre-execution by construction; warnings share the sk-git advisory's timing, which the repo documents as "drains them on the next transform". [SOURCE: .opencode/plugins/README.md:35]
- Missing dependencies: none; both imports already exist in the dependency-free hook library.

## Sources Consulted
- .opencode/plugins/cli-dispatch-audit.js
- .opencode/plugins/README.md
- .opencode/plugins/system-deep-loop-guard.js
- .opencode/plugins/sk-git-preflight-advisory.js
- .opencode/plugins/mcp-route-guard.js
- .opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs
