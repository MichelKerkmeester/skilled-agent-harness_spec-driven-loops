# Iteration 6 - Hook Payload Formatting Beyond Codex SessionStart

## METADATA
- Iteration: 6 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 5 - Hook payload formatting beyond codex-session-start

## INVESTIGATION
Read the research charter, all prior on-disk iterations (`iteration-001.md` through `iteration-003.md`; iterations 004-005 were not present), the native-rerun synthesis, and the native trial log. Prior evidence established that Codex `session-start --smoke` and Copilot offline preflight were verified in the native rerun, while live plugin/runtime integration remained deferred.

Traced the hook entry scripts and payload docs under `mcp_server/hooks/{claude,copilot,codex,gemini}` plus the root hooks README and OpenCode plugin entrypoint:

- Claude: `session-prime.ts`, `user-prompt-submit.ts`, `shared.ts`, and `claude/README.md`.
- Copilot: `session-prime.ts`, `user-prompt-submit.ts`, `custom-instructions.ts`, and `copilot/README.md`.
- Codex: `session-start.ts`, `user-prompt-submit.ts`, `pre-tool-use.ts`, and `codex/README.md`.
- Gemini: `session-prime.ts`, `user-prompt-submit.ts`, `shared.ts`, and `gemini/README.md`.
- OpenCode: no `mcp_server/hooks/opencode/` folder exists; root hooks docs point to the OpenCode plugin and bridge, so `plugins/spec-kit-skill-advisor.js` and `plugins/README.md` were checked as the runtime-specific path.

Startup network check: no hook startup entrypoint imports `fetch` or HTTP clients. Claude, Gemini, Copilot, and Codex startup paths call `buildStartupBrief()`, which reads local code-graph DB/readiness, hook state, and CocoIndex availability. Prompt-time advisor hooks do spawn a local Python advisor subprocess; OpenCode prompt-time plugin spawns its bridge and may call the local OpenCode client to recover the prompt when the transform input lacks one.

## FINDINGS
- P1 `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md:63` - Copilot offline preflight docs say the session-prime writer "prints a status JSON", but `session-prime.ts` writes the raw startup/compact text payload to stdout; recommended remediation: either change the script to emit a stable JSON status envelope for smoke mode or update the preflight text to verify the actual stdout contract.
- P1 `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:24` - Gemini docs list startup, compaction, stop, and prompt hook files, but the only registration section is for the `BeforeAgent` advisor path; recommended remediation: add SessionStart/PreCompress-or-compact/SessionEnd registration and smoke examples that assert `hookSpecificOutput.additionalContext`.
- P2 `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md:30` - Claude docs register only `UserPromptSubmit` even though the script table lists `PreCompact`, `SessionStart`, and `Stop`; recommended remediation: document the non-advisor hook payload contracts and add smoke commands for startup/compact/stop.
- P2 `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts:206` - `--smoke` exists only for Codex `SessionStart`; there is no equivalent flag across prompt-time and non-Codex runtime entrypoints, so smoke coverage is asymmetric; recommended remediation: standardize `--smoke` or documented offline preflight modes for every runtime entry script.
- P2 `.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:40` - OpenCode has no `mcp_server/hooks/opencode/` folder and the root hooks docs only say OpenCode uses a plugin/bridge path; recommended remediation: add an OpenCode hook/runtime README section that points to the exact plugin, bridge, payload insertion point, and status/smoke command.

## EVIDENCE
Prior/native context:

```text
research/deep-research-strategy.md:23 lists focus dimension 5 as "Hook payload formatting beyond codex-session-start".
../002-native-deferred-trial-rerun/synthesis-report-native-rerun.md:37-40 records Codex session-start --smoke as fixed and verified.
../002-native-deferred-trial-rerun/synthesis-report-native-rerun.md:39-40 records Copilot offline preflight as fixed and verified.
../002-native-deferred-trial-rerun/trials/trial-log.jsonl:12 records N-HK-005 codex_session_start_smoke_flag as verified.
../002-native-deferred-trial-rerun/trials/trial-log.jsonl:13 records N-HK-006 copilot_offline_unauthenticated_preflight as verified.
```

Smoke flag / smoke docs:

```text
.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts:199-215 implements --smoke and explicitly avoids session-prime/API/files.
rg -n -e "--smoke" mcp_server/hooks matched only codex/session-start.ts.
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md:53-77 documents an offline unauthenticated preflight, but not a --smoke flag.
.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md:40-57 documents SessionStart and prompt-hook smoke checks.
```

Payload format docs and code:

```text
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:37-41 defines JSON hookSpecificOutput.additionalContext for UserPromptSubmit.
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:391-396 writes formatted plain text to stdout for Claude session priming.
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md:7-12 lists PreCompact, SessionStart, UserPromptSubmit, and Stop scripts.
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md:30-48 documents only UserPromptSubmit registration.

.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/shared.ts:41-55 documents Gemini JSON output and additionalContext.
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/shared.ts:73-100 formats Gemini output with hookSpecificOutput.additionalContext.
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:307-312 uses formatGeminiOutput for startup output.
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:15-20 lists session-prime, compact-inject, user-prompt-submit, session-stop, compact-cache, and shared.ts.
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:24-50 documents only BeforeAgent advisor registration.

.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md:27-36 documents next-prompt freshness and custom-instructions delivery rather than model-visible additionalContext.
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md:63 says session-prime "prints a status JSON".
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:224-240 builds the startup/compact output and writes `${output}\n`, not JSON.
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:233-238 refreshes instructions and returns `{}`.
```

Startup and prompt-time execution:

```text
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:5 says startup brief is built from local code graph and hook state with no MCP round-trip.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:187-224 reads stats/readiness and startup highlights from local code graph storage.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:306-365 builds startup output from graph, hook state, and CocoIndex availability.
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/subprocess.ts:225-263 runs the local Python `skill_advisor.py` subprocess over stdin.
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/subprocess.ts:268-274 timeboxes each advisor subprocess attempt.
```

OpenCode path:

```text
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:40 says OpenCode prompt-time advice is delivered by the OpenCode plugin and bridge, not a hooks subfolder.
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:126 says prompt advice can use the OpenCode plugin bridge.
.opencode/plugins/README.md:43 identifies `spec-kit-skill-advisor.js` as the prompt-time OpenCode advisor plugin.
.opencode/plugins/README.md:50-56 locates bridge modules under `mcp_server/plugin_bridges/`.
.opencode/plugins/spec-kit-skill-advisor.js:37 defines the skill-advisor bridge path.
.opencode/plugins/spec-kit-skill-advisor.js:420-424 spawns the bridge subprocess.
.opencode/plugins/spec-kit-skill-advisor.js:575-639 appends the advisor brief to OpenCode chat system output.
.opencode/plugins/spec-kit-skill-advisor.js:676-705 exposes a status tool but no hooks/README smoke command points to it.
```

## NEW INSIGHTS
- The Codex `--smoke` fix is isolated to `SessionStart`; the rest of the hook surface relies on README smoke snippets or tests rather than a uniform CLI smoke flag.
- Copilot's docs and implementation disagree on the preflight stdout shape. The implementation is file-based and text-output based; the docs claim a status JSON for the session-prime writer.
- Gemini has the clearest low-level payload helper docs, including the HTML-escaping caveat for `additionalContext`, but its README does not document registration/smoke for the startup and compaction scripts it lists.
- OpenCode is intentionally outside `mcp_server/hooks/`, but the root hooks docs do not give an operator a concrete OpenCode smoke/status path.
- Startup hooks are local-state paths, not network/API paths. Prompt-time advisor paths are subprocess/bridge paths and should be evaluated separately from startup network risk.

## OPEN QUESTIONS
- Should every hook entrypoint support a common `--smoke` contract, or should smoke remain runtime-specific where the runtime payload contracts differ?
- Should Copilot `session-prime.ts` grow an explicit `--smoke` status JSON mode while preserving current stdout text for real hook execution?
- Should OpenCode runtime documentation live under `mcp_server/hooks/opencode/README.md` for parity, or stay in `.opencode/plugins/README.md` with stronger links from hooks docs?
- Should prompt-time advisor subprocess execution be documented as "offline/local subprocess" separately from startup hooks to avoid conflating it with network/auth-dependent runtime execution?
