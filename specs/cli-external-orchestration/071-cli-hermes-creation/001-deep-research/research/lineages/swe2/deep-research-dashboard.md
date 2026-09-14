# Deep Research Dashboard — lineage `swe2`

**Topic**: Hermes Agent (v0.21.1) as the seventh cli-external-orchestration runtime
**Session**: `fanout-swe2-1789402663119-cvvtf8` · **Executor**: cli-devin / swe-2-max
**Status**: COMPLETE — 5/5 iterations · **stopReason**: `maxIterationsReached`

## Convergence telemetry (informational only — forced depth)

| Iter | Angle | newInfoRatio | Findings | Ruled out |
|---|---|---|---|---|
| 1 | Headless dispatch contract | 1.00 | 7 | 1 |
| 2 | Providers/models/reasoning | 0.90 | 5 | 0 |
| 3 | Fan-out fitness | 0.85 | 9 | 3 |
| 4 | Seven-runtime matrix | 0.75 | 4 | 2 |
| 5 | Recommendation + plan | 0.60 | 5 | 5 |

Threshold 0.05 — never approached; all deltas stayed well above it. Stop was by iteration cap, as configured.

## Headline result

Integrate `cli-hermes`. It satisfies the dispatch contract (deterministic `-Q` headless, `--yolo` write gate, `--run-budget`, exact reasoning-enum match, `HERMES_HOME`/`--profile` isolation, `HERMES_AGENT` self-invocation marker, trustworthy exit codes) and out-features every sibling on hooks (~40 events), profiles, and in-agent wall-clock. Two gates: no provider is configured today (no live smoke has ever run) and no repo-local `.hermes` config surface exists.

## Open questions carried forward

U1 live `chat -Q` end-to-end (phase-002 gate) · U2 budget-expiry stderr signature · U3 `delegate_task` internals · U4 project-`.hermes` discovery depth · U5 prompt-size/max-turns · U6 plugin MCP under safe-mode.

## Artifact index

- `deep-research-config.json` — lineage config
- `deep-research-strategy.md` — angle plan (5 angles, all executed)
- `deep-research-state.jsonl` — 13 records (config, init, 5×iteration, 5×dashboard, synthesis)
- `iterations/iteration-001..005.md`
- `deltas/iter-001..005.jsonl`
- `findings-registry.json` — 29 findings, 7 ruled-out directions, 6 unknowns
- `research.md` — synthesis
