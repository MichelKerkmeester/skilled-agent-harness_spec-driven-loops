# Iteration 3: Claude Hook and Unhealthy-Transport Fallback

## Focus

Trace the Claude `UserPromptSubmit` advisor brief end to end and determine exactly when the documented daemon-backed CLI fallback helps, degrades, or cannot help under unhealthy transport.

## Actions Taken

1. Traced the Claude hook adapter, shared brief producer, prompt policy, and fallback helper from prompt parsing through rendered `additionalContext`.
2. Compared the implementation with the hook reference and the Claude/CLI manual testing playbooks.
3. Audited targeted hook and fallback tests for handoff coverage.
4. Ran the targeted Vitest files and a live warm-only CLI call against a deliberately absent socket.

## Findings

### 1. The Claude path is native-local first, warm-daemon CLI second

The hook truncates prompts at 64 KiB, derives the workspace from `cwd`, and calls `buildSkillAdvisorBrief` with the full Claude hook timeout (default 2500 ms). That producer applies `shouldFireAdvisor`, reads local advisor freshness, consults its process-local prompt cache, and invokes the Python advisor subprocess. It does not call the MCP daemon on this primary path. Only a result with no brief and status `fail_open`, or `degraded` plus `freshness: unavailable`, triggers `buildSkillAdvisorBriefFromCli`. `skipped/absent` does not trigger it. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:73] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:187] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:202] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:210] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:400] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:429] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:481]

This means “MCP transport unhealthy” needs two distinct diagnoses. A broken MCP client channel with a healthy warm daemon can be bypassed by the CLI. An absent, hung, or unhealthy daemon cannot: the fallback is intentionally `--warm-only`, performs a deep socket probe, never cold-spawns, and returns retryable exit 75. [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:224] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:262] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:499]

### 2. The fallback has a nominal 250 ms budget but can receive only the primary path's remainder

The fallback helper defaults to 250 ms and clamps that to the remaining hook budget. However, the primary producer is given the entire 2500 ms hook timeout, and the fallback receives `hookTimeout - elapsed`, floored to 1 ms. A primary timeout can therefore starve the recovery path that is supposed to handle it. The CLI helper then subdivides the remaining budget between a deep probe and the CLI process. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:204] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:215] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:152] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:236] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:537]

Implementable improvement: reserve a bounded fallback slice before invoking the primary producer, for example by passing `hookBudget - fallbackReserve` as `subprocessTimeoutMs`, then use the reserve only for eligible failures. Add timing tests for a primary timeout followed by a successful warm-daemon fallback and for a probe timeout that still exits within the total hook budget. Target files: `hooks/claude/user-prompt-submit.ts` and `mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`.

### 3. The fallback faithfully preserves scoring thresholds, but its resilience claim is broader than its real boundary

The CLI request forwards both confidence and uncertainty thresholds, requests abstain reasons, and reconstructs `passes_threshold` from the daemon's echoed effective thresholds. This prevents the fallback from silently reverting to looser defaults. [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:269] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:362] [SOURCE: .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:373]

The manual playbook calls the CLI a “faithful ... stand-in ... during transport-down windows,” but its own scenario only proves warm-only refusal when the daemon is absent. The accurate claim is narrower: it is a faithful alternate client for a warm daemon when the normal MCP client transport is unavailable. [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/cli_hooks_and_plugin/skill_advisor_cli_fallback.md:18] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/cli_hooks_and_plugin/skill_advisor_cli_fallback.md:21] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/cli_hooks_and_plugin/skill_advisor_cli_fallback.md:46]

Implementable improvement: split documentation and diagnostics into `mcp_channel_unavailable`, `warm_daemon_unavailable`, `probe_timeout`, and `cli_timeout`; state explicitly which conditions the CLI can recover. Target files: `references/hooks/skill_advisor_hook.md`, the CLI fallback playbook, and `hooks/lib/skill-advisor-cli-fallback.ts`.

### 4. The live hook-to-CLI handoff is not covered, and the targeted hook suite is currently red

The Claude tests inject `buildBrief` but do not inject `buildCliBrief`. The adapter intentionally disables its default CLI builder whenever a primary builder is injected, so the timeout and Python-missing tests do not traverse the fallback. Repository search found no `buildCliBrief` coverage in the advisor test tree. The only dedicated fallback test checks normalization of the small status/reason/exit envelope. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:210] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:40] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:9]

The targeted run produced 4 failures out of 11 tests. Empty prompt, `/help`, producer timeout, and Python-missing cases expect `{}`, while the implementation now returns `hookSpecificOutput.additionalContext` containing the governance fallback directive whenever `renderAdvisorBrief` returns null. The envelope-only fallback test passed, and a live warm-only call against an absent socket returned structured exit 75 as designed. [SOURCE: command `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/hooks/claude-user-prompt-submit-hook.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts --reporter=default`] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:228] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:240]

Implementable improvement: add explicit handoff tests with both injected builders for `fail_open -> CLI ok`, `degraded/unavailable -> CLI ok`, `skipped -> no CLI`, `daemon absent -> retryable exit 75`, and total-budget exhaustion. Separately decide the intended no-brief contract. Keeping the governance directive is defensible, but then update the four stale expectations and the reference statement that fail-open yields `{}` or no context. Target files: the Claude hook test, fallback tests, and hook reference.

### 5. Operator documentation points at stale or mixed ownership paths

The hook reference and manual scenario name `system-spec-kit/mcp_server/dist/hooks/...` for execution and even cite a `system-spec-kit/mcp_server/hooks/...` source, while the investigated TypeScript source and tests live under `system-skill-advisor/hooks/...` and `system-skill-advisor/mcp_server/tests/...`. A copied dist surface may be intentional, but the source-of-truth labels are not clear enough to diagnose stale builds—the current session also surfaced a stale `@spec-kit/mcp-server` dist warning. [SOURCE: .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:48] [SOURCE: .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:83] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/cli_hooks_and_plugin/claude_user_prompt_submit.md:26] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/cli_hooks_and_plugin/claude_user_prompt_submit.md:73]

Implementable improvement: document the authored source, build owner, and executed dist artifact as three separate paths, then add a path-existence/dist-freshness assertion to the hook parity suite.

## Questions Answered

- Q2 is answered: the hook is fail-open and policy/freshness gated; its CLI fallback is a warm-daemon alternate transport, not daemon recovery. Threshold fidelity is good, but recovery time can be starved, end-to-end handoff coverage is missing, and current no-brief behavior has drifted from tests and documentation.

## Questions Remaining

- Q3 remains: prove threshold and prompt-policy synchronization across environment and call-specific overrides. The Q2 trace shows threshold forwarding on the CLI path, but not full cross-path parity.
- Q5 remains: rank the timing-reservation, end-to-end coverage, diagnostic taxonomy, output-contract reconciliation, and documentation-path fixes against calibration improvements from later iterations.

## Ruled-Out Directions

- Treating warm-only CLI fallback as daemon failover is ruled out. It probes an existing daemon and returns retryable exit 75 when that daemon is absent or unhealthy; it deliberately never cold-spawns.
- Treating the current targeted hook tests as proof of CLI fallback behavior is ruled out. Their injected primary producer suppresses the default fallback builder, and no explicit fallback builder is supplied.

## Next Focus

Q3: prove prompt-policy gating and threshold synchronization across the hook producer, MCP handler, environment defaults, and per-call overrides, including the CLI fallback's echoed effective thresholds.
