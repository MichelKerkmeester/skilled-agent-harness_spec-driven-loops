# Iteration 26: S4-02 Minimum Iterations And Convergence-Off Contract

## Focus

Dimension D2 target-mapping for S4-02: define the config contract for `minIterations` plus `convergenceMode: "off"` alongside `maxIterations`, `convergenceThreshold`, and `stuckThreshold`, and map how `_optimizerManaged` should treat the new fields.

## Actions Taken

1. Read the live research state, strategy, current deep-research config, and iteration 25 outputs to avoid duplicating the S4-01 injection-inbox pass.
2. Inspected our deep-research config template, auto YAML setup and convergence steps, and optimizer manifest/search/promote boundary.
3. Mined loop-cli-main for the closest stop-contract analog: `maxRuns` as an explicit nullable execution cap with a separate reached latch.
4. Mined kasper for config-contract analogs: bounded integer minimums, semantic switches, enum modes, layered defaults, and safe normalization.
5. Mapped the contract onto exact deep-research and optimizer target files without implementing any changes.

## Findings

### S4-02A: Add `minIterations` as an explicit lower-bound stop guard

- Reference mechanism: kasper validates minimum-like integer config through bounded schemas (`external/kasper/src/config.ts:14-18`, `external/kasper/src/config.ts:37`, `external/kasper/src/config.ts:46`) and documents minimum observation gates as first-class config (`external/kasper/README.md:80-81`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json`; add `minIterations` beside `maxIterations`, `convergenceThreshold`, and `stuckThreshold`.
- Contract: default `minIterations` should be `3`, matching the rolling-average convergence signal's first meaningful evidence window. It must be an integer, must be `<= maxIterations`, and should fail preflight if the pair is contradictory rather than silently clamping.
- Why it helps: early STOP becomes impossible until the loop has gathered enough evidence to make convergence signals meaningful.
- Port difficulty: med.
- Tag: quick-win.

### S4-02B: Model `convergenceMode: "off"` as a semantic switch, not a threshold hack

- Reference mechanism: loop-cli-main treats an absent max cap as explicit `null` (`external/loop-cli-main/src/loop-config.ts:22-32`), carries `maxRuns: number | null` in loop options (`external/loop-cli-main/src/types.ts:20-28`), and only enforces the stop when `maxRuns !== null` (`external/loop-cli-main/src/core/loop-controller.ts:298-303`, `external/loop-cli-main/src/core/loop-controller.ts:455-458`). Kasper likewise exposes semantic config switches like `enabled` and `auto_update` separately from numeric thresholds (`external/kasper/README.md:70-72`, `external/kasper/src/config.ts:26-29`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json`; add `convergenceMode` with an enum such as `"composite" | "off"` or `"on" | "off"`.
- Contract: `convergenceMode: "off"` should disable only convergence-driven STOP. It should not disable `maxIterations`, user pause, invalid-state halts, or explicit completion gates. Graph convergence can still run and emit telemetry, but its STOP_ALLOWED result must be demoted to CONTINUE or broaden/recovery routing.
- Why it helps: operators can run anti-convergence research sessions without lying to the system via impossible threshold values.
- Port difficulty: med.
- Tag: quick-win.

### S4-02C: Wire the new fields through YAML setup and state-log parity

- Reference mechanism: kasper merges layered partial config over defaults after normalization (`external/kasper/src/config.ts:161-190`) and documents that project-local config overrides global config while missing fields fall back to defaults (`external/kasper/README.md:64`, `external/kasper/README.md:139`).
- OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`; update setup bindings, `step_create_config`, and the initial config JSONL record.
- Contract: the config file and first JSONL `type:"config"` record must both carry `minIterations` and `convergenceMode`. Legacy records missing these fields should default to `minIterations: 0` or `3` by versioned policy and `convergenceMode: "composite"` so resume/replay behavior stays deterministic.
- Why it helps: the current YAML writes `maxIterations` and `convergenceThreshold` into the JSONL config record (`.opencode/commands/deep/assets/deep_research_auto.yaml:310-315`) but has no place for a lower-bound guard or convergence-off mode.
- Port difficulty: med.
- Tag: deep-rewrite.

### S4-02D: Treat `minIterations` as a guarded numeric tunable, and lock `convergenceMode`

- Reference mechanism: kasper separates bounded numeric fields from semantic booleans/enums in its schema (`external/kasper/src/config.ts:26-49`), with defaults declaring both numeric thresholds and switches (`external/kasper/src/types.ts:31-51`).
- OUR target file: `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`; add `minIterations` only if the optimizer can enforce the cross-field invariant `minIterations <= maxIterations`.
- Contract: `minIterations` belongs in `_optimizerManaged.tunableFields` only after the canonical optimizer manifest, search step overrides, replay runner, and promotion boundary understand the paired constraint. `convergenceMode` should be listed as locked or omitted from tunables because it changes stop semantics rather than tuning a numeric threshold.
- Why it helps: optimizer search currently derives an independent numeric parameter space from manifest ranges and requires a step for every tunable (`.opencode/skills/system-spec-kit/scripts/optimizer/search.cjs:25-31`, `.opencode/skills/system-spec-kit/scripts/optimizer/search.cjs:39-68`), while promotion rejects locked or undeclared fields (`.opencode/skills/system-spec-kit/scripts/optimizer/promote.cjs:126-170`). Without a cross-field rule, random search can generate invalid `minIterations > maxIterations` candidates.
- Port difficulty: med.
- Tag: deep-rewrite.

## Questions Answered

- S4-02 answered: `minIterations` should be a first-class config lower bound, not inferred from `convergenceThreshold`.
- `convergenceMode: "off"` should be an explicit semantic switch that disables convergence STOP only, while preserving hard caps and safety halts.
- `_optimizerManaged` should treat `minIterations` as a numeric tunable only with a paired `minIterations <= maxIterations` constraint. `convergenceMode` should be locked or kept outside optimizer-managed tunables.

## Questions Remaining

- S4-03 should map the exact YAML guard location: `current_iteration < minIterations` should short-circuit STOP candidates before quality-guard override logic.
- The implementation backlog needs to decide whether legacy missing `minIterations` defaults to `0` for byte-compatible replay or `3` for the new template default.
- The optimizer manifest needs a design for cross-field constraints before `minIterations` can be safely searched.

## Next Focus

S4-03: locate the `current_iteration < minIterations` guard in `deep_research_auto.yaml` and define how it short-circuits STOP to CONTINUE.
