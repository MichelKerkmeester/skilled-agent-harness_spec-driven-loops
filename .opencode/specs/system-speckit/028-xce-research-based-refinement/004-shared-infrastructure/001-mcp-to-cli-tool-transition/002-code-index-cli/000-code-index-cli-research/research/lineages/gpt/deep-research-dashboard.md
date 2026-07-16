# Deep Research Dashboard - GPT Lineage

## Iteration Table

| run | focus | newInfoRatio | findings count | status |
|---:|---|---:|---:|---|
| 1 | 8-tool surface and parity classification | 1.00 | 5 | complete |
| 2 | Read-path readiness and false-safe behavior | 0.92 | 5 | complete |
| 3 | Daemon dependency and lease/IPC audit | 0.85 | 6 | complete |
| 4 | MCP affordance replacement design | 0.78 | 5 | complete |
| 5 | Long-running scan and apply semantics | 0.70 | 5 | complete |
| 6 | Integration-surface migration map | 0.62 | 6 | complete |
| 7 | Hook latency and warm-only policy | 0.55 | 4 | complete |
| 8 | Dual-stack coexistence and spawn races | 0.47 | 6 | complete |
| 9 | Risk register and design deltas | 0.36 | 7 | complete |
| 10 | Verdict, effort, and implementation inheritance | 0.22 | 6 | complete |

## Question Status

10/10 answered: KQ1, KQ2, KQ3, KQ4, KQ5, KQ6, KQ7, KQ8, KQ9, KQ10.

## Trend

Last 3 newInfoRatio values: 0.47 -> 0.36 -> 0.22, descending. Stop reason: `maxIterationsReached`, as requested by the forced-10 packet.

## Dead Ends

- Pure daemon-free CLI.
- Treating `detect_changes` as missing based on stale prior reviews.
- Copying spec-memory Zod CLI generation verbatim.
- Prompt-time cold spawn for hooks.
- Full reference migration during dual-stack delivery.

## Next Focus

Promote/merge this lineage into the packet-level `research/research.md` and implementation phase scaffolding if accepted.

## Active Risks

- Live Code Graph MCP was unavailable during this session; findings use direct file reads and `rg`.
- Nested `cli-codex` dispatch was not used because this runtime is already Codex.
- Broad documentation migration remains intentionally out of scope.
