# Plugin Audit Review - mk-skill-advisor

> **Iteration 2 cross-check (Opus 4.8):** 12 iteration-1 findings adjudicated (6 adjusted, 6 confirmed); 5 new findings. Full detail in [`iteration-002-opus-4.8.md`](./iteration-002-opus-4.8.md).

> **Source:** GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast --variant high`) read-only audit via cli-opencode, 2026-07-10. Findings are hypotheses with file:line evidence, pending remediation-time confirmation.

## Summary

The OpenCode entrypoint has the required default-only export shape, and no P0 issue was found. The audit found stale-cache, subprocess, shim-path, and fail-open bugs plus material parity drift in rendering, thresholds, prompt limits, and timeout budgets.

| Field | Value |
|-------|-------|
| Plugin | `.opencode/plugins/mk-skill-advisor.js` (Skill Advisor prompt-time plugin) |
| Claude hook counterpart | .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts, .opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts |
| Verdict | REFINE |
| Findings | 0 P0 / 6 P1 / 6 P2 / 0 refinement (12 total) |

**Parity assessment:** Default confidence and uncertainty thresholds align at 0.8 and 0.35, and the OpenCode file correctly exposes only a default plugin factory. Overall parity is weak: OpenCode has a graph-insensitive host cache, a 64 KiB prompt cap, an approximately 11-second timeout path, a forked renderer, and hygiene-only failure injection; Claude has no prompt cap on its argv fallback, a three-second budget, silent non-ok output, and a fallback that omits configured thresholds.

## Finding Registry

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| F1 | P1 | parity | `.opencode/plugins/mk-skill-advisor.js:48` | OpenCode can serve obsolete recommendations after skill-graph changes | high |
| F2 | P1 | bug | `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263` | Claude CLI fallback passes an unbounded prompt through argv | high |
| F3 | P1 | bug | `.opencode/plugins/mk-skill-advisor.js:455` | Bridge output handling permits memory growth and stderr pipe deadlock | high |
| F4 | P1 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:11` | Legacy Claude shim resolves its target from mutable process CWD | high |
| F5 | P1 | error | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13` | Legacy Claude shim has no child timeout and hides launch failures | high |
| F6 | P1 | parity | `.opencode/plugins/mk-skill-advisor.js:672` | OpenCode injects context on skip or failure while Claude fails open silently | high |
| F7 | P2 | parity | `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263` | Claude CLI fallback discards caller-supplied thresholds | high |
| F8 | P2 | parity | `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:324` | OpenCode uses a forked renderer that omits shared governor context | high |
| F9 | P2 | bug | `.opencode/plugins/mk-skill-advisor.js:582` | Session disposal races with in-flight requests and can repopulate cleared state | high |
| F10 | P2 | error | `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:271` | Forced process exit can truncate Claude fail-open output and diagnostics | high |
| F11 | P2 | parity | `.opencode/plugins/mk-skill-advisor.js:33` | Default prompt-blocking timeout differs by more than threefold | high |
| F12 | P2 | error | `.opencode/plugins/mk-skill-advisor.js:55` | Malformed OpenCode configuration is silently treated as absent | high |

## Finding Detail

### F1 - OpenCode can serve obsolete recommendations after skill-graph changes
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:48`
- **Evidence:** ADVISOR_SOURCE_PATHS contains only the bridge, launcher, advisor-server source, and compiled server. getAdvisorContext returns a host-cache hit at lines 547-555 without invoking the bridge, so changes to skill metadata or the graph database do not invalidate the default five-minute cache. The Claude producer instead calls getAdvisorFreshness before every cache lookup and invalidates on freshness.sourceSignature at skill-advisor-brief.ts:429-461.
- **Impact:** OpenCode may inject outdated skill routing for up to cacheTTLMs after skills or graph generation change, while Claude observes the new graph immediately.
- **Proposed fix:** Include canonical graph generation or the same freshness sourceSignature used by buildSkillAdvisorBrief in the OpenCode cache key, or remove the redundant host cache and rely on the shared advisor cache.

### F2 - Claude CLI fallback passes an unbounded prompt through argv
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263`
- **Evidence:** runCliRecommend inserts args.prompt into JSON.stringify(payload) and passes that JSON as the --json argv value at lines 263-280. The Claude entrypoint accepts the complete prompt at user-prompt-submit.ts:169-190 with no byte limit. OpenCode instead byte-clamps the entire bridge payload to 64 KiB at mk-skill-advisor.js:358-371.
- **Impact:** Large Claude prompts can exceed the operating system argument-size limit, causing E2BIG and silently losing advisor context on the fallback path. The same prompt can succeed under OpenCode, creating runtime-dependent behavior.
- **Proposed fix:** Send the CLI request through stdin rather than argv and apply one shared UTF-8 prompt-byte policy across both surfaces.

### F3 - Bridge output handling permits memory growth and stderr pipe deadlock
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:455`
- **Evidence:** runBridge configures both stdout and stderr as pipes at line 458, appends every stdout chunk to an unbounded string at lines 478-481, and never consumes child.stderr. maxBriefChars is applied only after the full response is collected and parsed.
- **Impact:** A noisy or malfunctioning bridge can grow the plugin host's memory without bound. Enough stderr output can fill the pipe, block the child, and force every request to wait for the timeout.
- **Proposed fix:** Enforce a bounded raw-stdout limit, drain stderr with a small diagnostic cap, terminate the child when output exceeds the limit, and return a prompt-safe fail-open code.

### F4 - Legacy Claude shim resolves its target from mutable process CWD
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:11`
- **Evidence:** TARGET is the relative path .opencode/skills/system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js, and spawnSync runs it with cwd: process.cwd() at lines 13-17. Unlike the OpenCode plugin's import.meta.url-based bridge path, this only resolves when the hook process happens to start at the repository root.
- **Impact:** Running Claude Code from a workspace subdirectory can make the counterpart target unreachable and silently reduce the hook output to {}.
- **Proposed fix:** Resolve the target from import.meta.url or locate the repository root deterministically before spawning.

### F5 - Legacy Claude shim has no child timeout and hides launch failures
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13`
- **Evidence:** spawnSync is called without a timeout. Lines 21-30 replace all result.error, nonzero status, empty stdout, and invalid JSON cases with {}, while result.error itself is never reported.
- **Impact:** A deadlocked target can block UserPromptSubmit until an external hook manager kills it, and missing-target or spawn failures are indistinguishable from a legitimate advisor skip.
- **Proposed fix:** Give spawnSync a bounded timeout, emit a prompt-safe diagnostic to stderr for result.error/nonzero/invalid-output cases, and continue returning {} to preserve fail-open behavior.

### F6 - OpenCode injects context on skip or failure while Claude fails open silently
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:672`
- **Evidence:** appendAdvisorBrief pushes HYGIENE_DIRECTIVE whenever response.brief is absent, including skipped, degraded, timeout, and parse-failure responses. The Claude hook returns {} whenever renderBrief returns null at user-prompt-submit.ts:210-224. The bridge itself states at mk-skill-advisor-bridge.mjs:868-873 that disabled and failed advisor paths should fail open silently across runtimes.
- **Impact:** Identical prompts receive different model-visible instructions. OpenCode injects context for ordinary policy skips such as /help and for infrastructure failures, while Claude injects nothing.
- **Proposed fix:** Define the fallback policy once in the shared renderer: either return no advisor context on all non-ok statuses or deliberately return the same hygiene-only context from both surfaces.

### F7 - Claude CLI fallback discards caller-supplied thresholds
- **Severity / Category / Confidence:** P2 / parity / high
- **Location:** `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263`
- **Evidence:** SkillAdvisorCliFallbackOptions exposes thresholdConfig, but the CLI payload at lines 263-270 sends only topK, includeAttribution, and includeAbstainReasons. thresholdsFrom then prefers the CLI's effective defaults at lines 351-359. The OpenCode bridge correctly passes confidenceThreshold and uncertaintyThreshold at mk-skill-advisor-bridge.mjs:666-674.
- **Impact:** A non-default Claude threshold can be ignored on fallback, producing recommendations that the native path would accept or reject differently. Defaults currently align at 0.8 confidence and 0.35 uncertainty.
- **Proposed fix:** Include normalized confidenceThreshold and uncertaintyThreshold in the Claude CLI request and add a test using non-default values.

### F8 - OpenCode uses a forked renderer that omits shared governor context
- **Severity / Category / Confidence:** P2 / parity / high
- **Location:** `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:324`
- **Evidence:** The bridge defines its own renderAdvisorBrief at lines 324-360 and loadNativeAdvisorModules returns that local renderer at line 430. The canonical renderer at mcp_server/lib/render.ts:197-200 appends GOVERNOR_DIRECTIVE, which Claude tests require, but the bridge renderer appends only HYGIENE_DIRECTIVE.
- **Impact:** Successful OpenCode and Claude recommendations have different model-visible content, and the duplicated sanitization and ambiguity logic can continue drifting independently.
- **Proposed fix:** Import and use the canonical compiled renderAdvisorBrief in the bridge, retaining a minimal fail-open response only when that shared module cannot load.

### F9 - Session disposal races with in-flight requests and can repopulate cleared state
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:582`
- **Evidence:** resetRuntimeState clears advisorCache and metrics but not state.inFlight. Session deletion at lines 692-702 also removes only completed cache entries. An already-running promise subsequently reaches lines 569-575 and can insert its response after deletion or global disposal.
- **Impact:** Deleted-session cache entries can reappear, and disposed plugin instances can retain active subprocesses and mutate supposedly reset status until those requests settle.
- **Proposed fix:** Track an instance generation or disposed flag and refuse post-reset cache writes; also track child processes so disposal can terminate them and clear in-flight state safely.

### F10 - Forced process exit can truncate Claude fail-open output and diagnostics
- **Severity / Category / Confidence:** P2 / error / high
- **Location:** `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:271`
- **Evidence:** The top-level catch starts process.stdout.write('{}\n') without awaiting its callback, and finally immediately calls process.exit(0) at lines 271-285. emitDiagnostic also launches asynchronous persistence without awaiting it at lines 109-124.
- **Impact:** On a top-level exception, Node may exit before {} is flushed; normal executions may also terminate before the diagnostic record is persisted.
- **Proposed fix:** Await writeHookOutput in the catch path, avoid process.exit(), set process.exitCode = 0, and either await diagnostic persistence or explicitly flush it before returning.

### F11 - Default prompt-blocking timeout differs by more than threefold
- **Severity / Category / Confidence:** P2 / parity / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:33`
- **Evidence:** OpenCode defaults bridgeTimeoutMs to 10000 ms and then allows another 1000 ms before SIGKILL at lines 465-475. Claude defaults its producer budget to 3000 ms at user-prompt-submit.ts:70 and uses the remaining budget for CLI fallback at lines 186-200.
- **Impact:** The same slow advisor can stall an OpenCode prompt for roughly 11 seconds while Claude fails open near three seconds, producing materially different interactive behavior.
- **Proposed fix:** Use a shared end-to-end hook budget or explicitly document and test a justified per-runtime budget; include termination grace inside, rather than after, that budget.

### F12 - Malformed OpenCode configuration is silently treated as absent
- **Severity / Category / Confidence:** P2 / error / high
- **Location:** `.opencode/plugins/mk-skill-advisor.js:55`
- **Evidence:** loadConfig catches every read and JSON parse error and returns {} at lines 55-62. Plugin status has no field distinguishing a missing file from malformed JSON or a permission failure.
- **Impact:** Invalid configuration silently activates defaults, potentially including enabled=true, while operators receive no indication that their settings were ignored.
- **Proposed fix:** Treat ENOENT as an absent optional file, but retain a prompt-safe configuration error code for parse/read failures and expose it through the status tool.

## Files Reviewed

- `.opencode/plugins/mk-skill-advisor.js`
- `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/compat-contract.json`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts`
- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/mk-skill-advisor-plugin.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`
