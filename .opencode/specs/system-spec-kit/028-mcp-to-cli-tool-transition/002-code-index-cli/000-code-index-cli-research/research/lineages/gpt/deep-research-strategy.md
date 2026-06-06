# Deep Research Strategy - Code-Index CLI Feasibility

## Research Topic

Can `mk_code_index` gain a dual-stack CLI fallback with zero feature loss, using the settled spec-memory CLI research as prior art while checking code-index-specific deltas?

## Known Context

- The packet explicitly scopes a single gpt-5.5 lane, forced 10 iterations, and a verdict-shaped report with an 8-tool parity matrix, daemon-dependency loss table, prior-art transfer, migration map, risks, and effort. [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/spec.md:63]
- `resource-map.md` was not present in the target spec folder at init; skipping coverage gate.
- The requested executor was `cli-codex model=gpt-5.5`; nested Codex self-invocation was not used because the `cli-codex` skill forbids invoking Codex from inside Codex.
- Code Graph was unavailable at session startup, which matches the packet's motivating incident class. [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/spec.md:52]

## Key Questions

- KQ1: Classify all 8 code-index tools and map each to a CLI command.
- KQ2: Audit daemon dependencies: lease heartbeat, idle monitor, IPC bridge, readiness marker, scan state.
- KQ3: Identify which spec-memory CLI answers transfer and which need code-index-specific changes.
- KQ4: Confirm current prior art: launcher, doctor/update usage, and absence of a tool-parity CLI.
- KQ5: Decide long-running semantics for scan/apply/verify.
- KQ6: Measure active integration surfaces.
- KQ7: Decide hook-latency fit.
- KQ8: Test dual-stack coexistence and spawn-race risks by code trace.
- KQ9: Produce the design deltas and risk register.
- KQ10: Render the go/no-go and effort estimate.

## Answered Questions

- KQ1: Answered. All 8 tools are CLI-portable if the CLI uses daemon IPC; 0 MCP-only.
- KQ2: Answered. The daemon/launcher must stay for owner lease, socket bridge, readiness, idle, and respawn behavior.
- KQ3: Answered. Architecture and exit taxonomy transfer; Zod manifest generation does not transfer verbatim because code-index has hand-coded JSON schemas.
- KQ4: Answered. `mk-code-index-launcher.cjs` and shared bridge are strong prior art; no full `code-index` user CLI exists today.
- KQ5: Answered. Read/status/classify are synchronous; scan/verify/apply need timeout and maintenance semantics.
- KQ6: Answered. Active surface is about 51 files / 163 matching lines; broad docs are out of dual-stack scope.
- KQ7: Answered. Warm CLI is hook-fit; cold spawn is startup/prewarm/cron or explicit recovery only.
- KQ8: Answered. Reuse launcher and session proxy; add dual-spawn and dual-client tests.
- KQ9: Answered. Ten deltas are listed in the synthesis.
- KQ10: Answered. GO for daemon-backed dual-stack CLI with auto-spawn; estimated 6-9 engineering days.

## What Worked

- Reading runtime schemas before docs prevented stale conclusions about `detect_changes`.
- Treating spec-memory research as prior art saved time while keeping code-index-specific validation honest.
- Splitting active executable references from broad prose/history references avoided migration-scope inflation.

## What Failed

- Code Graph itself was unavailable as a live MCP tool in this session, so structural exploration used `rg` and direct reads.
- The requested `cli-codex` executor could not be spawned from inside Codex because of the self-invocation guard.

## Exhausted Approaches

- Pure daemon-free CLI.
- Full reference migration inside the dual-stack packet.
- Blind schema codegen copied from spec-memory's Zod path.
- Cold-spawn prompt-time hook calls.

## Ruled-Out Directions

| Approach | Reason | Evidence |
|---|---|---|
| Pure daemon-free CLI | Fails zero-feature-loss because it bypasses resident lease, readiness, bridge, scan, and recovery behavior. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/index.ts:139] |
| Treat `detect_changes` as unregistered | Current schema and dispatcher include it. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:21] |
| Zod codegen verbatim from spec-memory | Code-index uses hand-coded JSON schema validation. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200] |
| Full MCP-reference migration now | Parent packet keeps full migration out of scope until dual-stack proves itself. | [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/spec.md:111] |

## Next Focus

Complete: synthesize root/orchestrator outputs from this lineage and open implementation phases only if the operator accepts the GO verdict.

## Non-Goals

- No implementation in this packet.
- No MCP registration removal.
- No broad reference migration.
- No direct database writer CLI for the public tool surface.

## Stop Conditions

- Stop at 10 iterations by packet requirement.
- Stop if all 10 KQs have evidence-backed answers.
- Stop if research hits an implementation-only question and record it as an implementation delta.
