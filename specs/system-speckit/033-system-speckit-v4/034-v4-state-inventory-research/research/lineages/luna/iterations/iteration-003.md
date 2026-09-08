# Iteration 3: Angle 3, SYSTEM-DEEP-LOOP

## Focus

Audit the live deep-loop modes, deep command files, executor kinds and allowlists, fan-out controls, convergence policy, state ledger and reducer behavior.

## Actions Taken

- Read the state log and strategy first.
- Read the system-deep-loop registry and all six deep command frontmatters.
- Read the executor configuration source, fan-out schema, convergence contract and reducer entrypoints.

## Findings

## INVENTORY

| Surface | Value | Source |
|---|---|---|
| Deep-loop modes | Six registered modes: `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`; registry also carries the stable mode metadata. `research`, `review` and `ai-council` are lexical, `agent-improvement` is alias-fold, and the two benchmark modes are command-bridge. There is no registered `alignment` mode. | [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:12`] [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:32`] [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:172`] |
| Deep commands | `/deep:research`, `/deep:review`, `/deep:ai-council`, `/deep:agent-improvement`, `/deep:model-benchmark` and `/deep:skill-benchmark` are live command front doors. Research and review are iterative, council is multi-topic, and benchmark commands are diagnostic workflows. | [SOURCE: `.opencode/commands/deep/research.md:2`] [SOURCE: `.opencode/commands/deep/ai-council.md:3`] [SOURCE: `.opencode/commands/deep/skill-benchmark.md:2`] |
| Executor kinds | `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin` and `cli-pi`. | [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11`] |
| Executor flag support | Codex supports model, reasoning, service tier, sandbox, timeout and live tools. Claude Code supports model, config dir, reasoning, sandbox, timeout and live tools. OpenCode supports model, reasoning, sandbox, timeout and live tools. Cursor supports model, sandbox, timeout and live tools. Devin supports model, sandbox, timeout and live tools. Pi supports model, reasoning, timeout and live tools, but no OS sandbox or service tier. | [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:77`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:99`] |
| Model allowlists | Pi has 10 curated literals and defaults to `deepseek-v4-flash-vision-exp`; Cursor has 21 curated model IDs and defaults to `composer-2.5`; Devin has 13 curated IDs and defaults to `swe`. | [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:182`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:214`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:292`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:318`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:362`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:383`] |
| Preventive sandbox | Codex, Claude Code and Cursor have preventive sandbox capability. OpenCode, Devin and Pi do not, so the runtime relies on fail-loud or post-hoc containment for those kinds. | [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:117`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:124`] |
| Fan-out controls | Fan-out caps models, branches and replicas at 16 each and expanded lineages at 256. Default concurrency is 2, retries max at 5, lag ceiling at 300000 ms and heartbeat default is 60 seconds. | [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:630`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:681`] |
| Research convergence | Four modes are live: `default`, `off`, `sliding-window` and `divergent`. `max-iterations` forces the run to the hard cap and treats convergence as telemetry. Research stop reasons include `converged`, `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop` and `userPaused`. | [SOURCE: `.opencode/commands/deep/research.md:102`] [SOURCE: `.opencode/commands/deep/research.md:124`] [SOURCE: `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:78`] |
| Research state | The YAML defines canonical config, append-only state log, strategy, registry, dashboard, iteration files, per-iteration delta files and final `research.md`; each iteration needs route proof and `type: iteration`. | [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:154`] [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:165`] [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:1658`] |
| Ledger and reducer | The workflow describes an append gateway that authorizes records against a ledger and refreshes the state-log projection. `reduce-state.cjs` parses JSONL and deltas, builds registries, convergence and dashboards, and reports corruption warnings. | [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:106`] [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:130`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:120`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1514`] |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | One-line correction | Source |
|---|---|---|---|---|---|---|
| Not opened in this angle; draft walk reserved for iteration 10 | Deep-loop mode names and executor behavior | MISSING | The live mode name is `agent-improvement`, not generic `improvement`; no `alignment` registry mode was found. Executor selection is allowlisted and fan-out is capped. | P1 | Use the exact registered mode names and current executor/fan-out contract. | [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:104`] |

## DISAGREEMENTS

The deep-loop registry and command set agree on six command-backed surfaces. The YAML’s prose says `@deep-research` is the native leaf path, while the Codex lineage branch explicitly says a bound lineage must execute inline instead of spawning nested Codex. This is a workflow-context distinction, not a registry contradiction. [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:1580`]

## CONFIDENCE

Confirmed: mode names, routing classes, command front doors, executor kinds, flag support, allowlist counts, sandbox capabilities, fan-out limits, convergence modes and state paths were opened directly. Inferred: the append-gateway ledger itself is the durable authority because the workflow and state references describe the state-log as a projection, but this lane did not execute the gateway by user instruction.

## Questions Answered

- What does system-deep-loop ship now, and which operational contracts govern its research mode?

## Questions Remaining

- Verify system-skill-advisor’s graph metadata, scorer thresholds, hook brief and MCP IDs.
- Compare these contracts to exact changelog lines.

## Next Focus

SYSTEM-SKILL-ADVISOR: inspect daemon, CLI front door, scorer thresholds, graph metadata, hook brief, state containment and MCP tool IDs.

## Reflection

The live deep-loop surface is broader than research and review. The executor config is the key source for exact model and flag support, and it explicitly prevents silent degradation of a requested CLI kind. Nested Codex dispatch remains ruled out for this lineage.
