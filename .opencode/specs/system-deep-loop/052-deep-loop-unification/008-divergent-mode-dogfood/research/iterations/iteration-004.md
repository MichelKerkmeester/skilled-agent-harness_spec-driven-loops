# Iteration 004

## Focus

Determine whether a supported OpenCode CLI flag selects `ai-council` while preserving the current isolated seat process, or whether route proof should identify a generic council-seat executor instead.

## Actions Taken

1. Read the externalized research state and reducer-owned strategy to preserve the active focus and avoid the exhausted council-delta direction. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-state.jsonl:1-15] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:77-129]
2. Compared live `opencode run --help` output with the checked-in CLI routing contract and `ai-council` agent mode. The CLI exposes generic `--agent` and `--command` selectors, while the project declares `ai-council` as `mode: subagent` and documents direct `--agent ai-council` as unsupported. [SOURCE: live command `opencode run --help`, 2026-07-11] [SOURCE: .opencode/agents/ai-council.md:1-23] [SOURCE: .opencode/skills/cli-external/cli-opencode/references/agent_delegation.md:78-92,187-200]
3. Traced the deep-council command and seat runner. The host command is selectable as `--command deep/ai-council`, but each seat is a separate concurrent `opencode run --model ... --dangerously-skip-permissions <seat-prompt>` process with no agent or command selector. [SOURCE: .opencode/commands/deep/ai-council.md:1-10] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-241,256-296] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169]
4. Checked the prompt, config, and tests for route/provenance expectations. They explicitly claim `target_agent=@ai-council` and `agent_definition_loaded=true` even though the tested subprocess argument list intentionally omits `--agent`; the config also says `one_cli_per_round: true` although runtime starts one CLI process per seat. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md:14-20] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:305-320] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:154-211] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json:15-23]

## Findings

### F-ITER004-001 (P1): Seat route proof claims an agent profile that the process never selects

`runSeatSubprocess` starts a fresh default-agent OpenCode process without `--agent` or `--command`, yet the injected route header and persisted round record claim `target_agent=ai-council` and `agent_definition_loaded=true`. Because the project-local `ai-council` definition is a subagent and cannot be selected directly at top level, the current fields prove prompt labeling, not effective agent loading. This confirms and narrows iteration 3's false-provenance finding to the exact process boundary. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-208,256-276] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:305-320] [SOURCE: .opencode/agents/ai-council.md:1-5] [SOURCE: .opencode/skills/cli-external/cli-opencode/references/agent_delegation.md:187-200]

### F-ITER004-002 (P1): Host command route and seat executor route need separate proof identities

The supported selector for the full workflow is the generic CLI `--command` flag with command id `deep/ai-council`. Reusing that command for each seat would recursively start a council session rather than preserve one isolated seat per process. Therefore command-level proof may identify mode `ai-council`, while seat-level proof should identify a generic council-seat executor (default OpenCode agent plus model/lens/seat id) and must not claim the `@ai-council` definition loaded. [SOURCE: live command `opencode run --help`, 2026-07-11] [SOURCE: .opencode/commands/deep/ai-council.md:1-10] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-208] [SOURCE: .opencode/skills/cli-external/cli-opencode/SKILL.md:297-315]

### F-ITER004-003 (P2): `one_cli_per_round` describes executor-family consistency, not actual process topology

The config advertises `one_cli_per_round: true`, but `Promise.all` invokes `dispatchSeat` for every seat and each invocation spawns its own `opencode` process. The durable invariant appears to be one CLI executor family per round, not one CLI process per round. The current name is operator-facing drift that can mislead cost, isolation, and concurrency expectations. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json:15-23] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:200-241]

### F-ITER004-004 (P2): Existing subprocess test cements the provenance mismatch instead of detecting it

The CLI runner test verifies both that the process arguments contain no agent selector and that the prompt says mode `ai-council`; it does not assert an honest effective executor identity or reject `agent_definition_loaded=true`. Consequently a regression test currently preserves the contradiction rather than guarding route-proof truthfulness. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:154-211] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:305-320]

## Questions Answered

- **Does a supported OpenCode CLI flag select `ai-council` while preserving the isolated seat process?** No. `--agent` is generic, but `ai-council` is a subagent and is not a supported top-level value. `--command deep/ai-council` selects the host workflow, not an individual seat.
- **What should route proof identify?** Preserve `ai-council` as host workflow mode, but identify each spawned process as a generic council-seat executor with explicit seat/model/lens provenance. Do not claim the `@ai-council` agent definition loaded unless the runtime gains a real supported selector and uses it.
- **Is process isolation preserved today?** Yes. Seats are concurrently dispatched as separate `opencode run` child processes. The defect is provenance labeling, not absence of process isolation.

## Questions Remaining

- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?
- Which cost and operator-friction defects dominate after route proof and unrestricted council seat startup are corrected?
- Should the seat executor schema distinguish executor family, effective primary agent, requested council mode, seat id, lens, and model as separate fields?
- How do deep-improvement candidate prompts and reducer boundaries compare with the review and council failure patterns?
- Are review prompt/validator schema mismatches covered outside skill-local tests?

## Next Focus

Which cost and operator-friction defects dominate the live deep-loop paths after validator-triggered redispatch and council seat route/provenance correction, especially subprocess startup cost, timeout behavior, and redundant context injection?

## Ruled-Out Directions

- Direct `opencode run --agent ai-council` is not a supported remedy because the checked-in agent is `mode: subagent`; project routing documentation explicitly rejects that top-level path. [SOURCE: .opencode/agents/ai-council.md:1-5] [SOURCE: .opencode/skills/cli-external/cli-opencode/references/agent_delegation.md:187-200]
- Running `--command deep/ai-council` per seat is not equivalent to selecting a seat profile; it would re-enter the host workflow and undermine the current one-process-per-seat boundary. [SOURCE: .opencode/commands/deep/ai-council.md:1-10] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-208]

## SCOPE VIOLATIONS

None. No researched runtime, skill, command, agent, config, or test file was modified.
