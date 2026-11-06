# Iteration 1 — Headless dispatch contract

- Focus: Angle 1, headless dispatch contract
- Timestamp: 2026-11-05T22:15:22Z
- Findings count: 6
- Novelty: 1.0

## Focus

Establish the installed DeepSeek Harness headless invocation, input, output, session, and exit contract, then compare it with cli-pi and the existing orchestration modes.

## Actions Taken

- Read the provided source map and the headless package and CLI reference in the read-only source clone.
- Checked installed launcher behavior: dsh --version printed 0.2.2-rc.1 (exit 0); dsh --help printed launcher help (exit 0).
- dsh headless --help and dsh --profile headless --dump-config both exited 1 with EPERM while opening a default-home profile file. dsh --dump-config-schema exited 1 with “error: --profile <name> is required”. No headless task was dispatched.
- Followed the dispatcher’s explicit inline-execution override: the standard executor-dispatch step was treated as satisfied, and this iteration was researched in this process without a nested CLI or agent.

## Findings

1. Headless mode accepts the task as positional text, or reads stdin when the task is omitted or the sole argument is -; when positional text is supplied, stdin is not consumed. Empty tasks are rejected. [SOURCE: dsh-src/packages/bundle/headless/src/startup.ts:117-155] [SOURCE: https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/headless/README.md (fetched 2026-11-05)]
2. The visible headless controls include --json, --session-id, --permission-mode, --approval-policy, and repeatable --add-dir. The headless parser exposes no model, provider, reasoning-effort, or timeout option; provider/model selection therefore belongs to profile configuration, while a caller that needs a hard time bound must supervise the process externally. [SOURCE: dsh-src/packages/bundle/headless/src/startup.ts:53-75,84-92,117-155] [SOURCE: dsh-src/apps/cli/reference/README.md:41-46]
3. Default output is the final assistant text on stdout, with reasoning/diagnostics on stderr. JSON mode emits a session event and structured turn, step, thinking, text, tool-call, tool-result, and final events; a supplied session ID adopts the persisted session, while a default ID is generated. [SOURCE: dsh-src/packages/bundle/headless/src/json-stream.ts:230-237,244-327] [SOURCE: https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/headless/README.md (fetched 2026-11-05)]
4. Process success follows the terminal turn reason: completed exits 0; aborted or error exits 1. JSON tool-result events expose completed/error status, but the checked contract defines no separate process exit specifically for a denied tool; that case remains UNKNOWN without an observed run. Provider or driver failures are surfaced through stderr and an error event. [SOURCE: dsh-src/packages/bundle/headless/src/index.ts:400-443] [SOURCE: dsh-src/packages/bundle/headless/src/json-stream.ts:301-327] [SOURCE: dsh-src/packages/bundle/headless/tests/headless.spec.ts:698-707]
5. Pi overlaps on one-shot text and JSON output but also defines persistent JSONL RPC and direct provider/model/session controls. Codex, OpenCode, Claude Code, Cursor, Devin, and Hermes each expose distinct invocation and permission/model/output flags, so a DeepSeek mode needs its own adapter contract rather than reusing cli-pi’s flag assumptions. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:38-44,90-110] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/cli-reference.md:92-106,153-162] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:95-123] [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md:102-110,126-146,152-154] [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:95-112] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:146-186] [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md:36-66,74-83]
6. The CLI’s profile bootstrap prepares missing profile files during first use, and the CLI reference warns that configuration dumping can initialize those files. This makes even seemingly informational profile-scoped commands capable of writes unless a profile is already provisioned. [SOURCE: dsh-src/apps/cli/reference/README.md:17,55,60] [SOURCE: dsh-src/apps/cli/src/profile-boot.ts:224-235,271-295]

## Questions Answered

- What dispatch contract does DeepSeek Harness expose for headless execution, and how does it compare with the existing cli-pi contract?

## Questions Remaining

- How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode?
- Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped?
- What fan-out executor support and cross-repository touch points are required to integrate the mode safely?
- What constraints, unknowns, and dependency-ordered phases should guide implementation?

## Next Focus

Angle 2: provider and model routing.

## Scope Violations

- The two profile-scoped inspection commands attempted default-home profile initialization outside the lineage write boundary and were blocked by EPERM during open. No successful write receipt was observed; the commands were not retried. This is recorded as an attempted boundary crossing.
- The normal per-iteration dispatch step calls for an executor dispatch. The dispatcher explicitly resolved that conflict by binding execution to this process and treating the dispatch step as satisfied; that override was followed.

## Sources

- dsh-src/packages/bundle/headless/src/startup.ts
- dsh-src/packages/bundle/headless/src/json-stream.ts
- dsh-src/packages/bundle/headless/src/index.ts
- dsh-src/packages/bundle/headless/tests/headless.spec.ts
- dsh-src/apps/cli/reference/README.md
- dsh-src/apps/cli/src/profile-boot.ts
- cli-pi, cli-codex, cli-opencode, cli-claude-code, cli-cursor, cli-devin, and cli-hermes reference files listed above
- https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/headless/README.md
