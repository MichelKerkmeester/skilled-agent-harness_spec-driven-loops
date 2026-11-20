# Iteration 2: Frontier node F-1-004 — cross-CLI parity

## Focus

Frontier node F-1-004 (depth 1, scope `runtime/scripts/fanout-run.cjs`, `runtime/lib/deep-loop/executor-config.ts`): where do the eight CLI lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences?

## Findings

1. **The "single executor contract" already exists as data — but only half of it is printed.** `EXECUTOR_KIND_FLAG_SUPPORT` (`executor-config.ts:112-142`) declares which config fields each kind accepts, and `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` (`:159-169`) declares whether the kind's sandbox is a real OS boundary, a compensating control, or nothing. `finalizeLineageCommand` then emits `sandboxMode` and `permissionMode` in `effectiveConfig` (`fanout-run.cjs:2507-2516`) and the preview prints exactly those two, so a `cli-pi` or `cli-devin` lineage shows `sandboxMode: workspace-write` even though the matrix says `false` (no preventive boundary). One concrete change: add `sandboxEnforcement: "preventive" | "compensating" | "none"` to `effectiveConfig` from the capability matrix and print it beside `sandbox` in the preview and `invocation-metadata.json`. Value: ends the "which CLI actually confines" question with one field. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:159] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2507]

2. **`reasoningEffort` is a per-kind lottery in an otherwise shared matrix.** The Zod schema accepts it for every kind (`executor-config.ts:91`), but the supported-field table rejects it for `cli-cursor`, `cli-devin` and `cli-mistral-vibe` because those ids bake the tier into the model name (`:117-141`), so one `--executors` matrix that sets effort for all lineages fails on the three that cannot honor it. One concrete change: keep the field accepted for every kind, map it in the adapter (`--effort`, `--variant`, `--thinking`, or a `#effort` model suffix), and report `effortApplied: "flag" | "baked" | "none"` in `effectiveConfig`, with a loud warning when a requested tier cannot be honored. Value: one matrix works across all eight kinds. Effort M. Risk medium (a silent downgrade would be worse than the current hard failure; the warning is the contract). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:91] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:117] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2659]

3. **Failure classification keeps kind-specific branches in the shared worker instead of in the adapter table.** `fanout-run.cjs:4695` ignores a non-zero exit for `cli-pi` only, `:4664-4667` runs extra completion validators for `cli-deepseek-harness` and `cli-mistral-vibe`, and `:4714` maps quota exhaustion to its own reason across all kinds. The worker therefore knows four kinds by name, and a new kind must edit it. One concrete change: let each entry in `LINEAGE_COMMAND_ADAPTERS` (`:3557-3567`) carry `exitPolicy` and `completionValidator`, and have the worker classify from those fields only. Value: one failure model; new kinds add data, not branches. Effort M. Risk medium (the pi tolerance and the vibe partial verdict must move without behavior change). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3557] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4695] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4664]

4. **The six per-kind single-executor branches in each YAML are the same command with a different `--executor` argument.** `deep-research.yaml:1762-1837` has eight `if_cli_*` branches; six of them (claude-code, cursor, devin, pi, opencode, codex) run `dispatch-iteration.cjs --executor <kind>` with identical arguments, and only `cli-deepseek-harness` (extra `--spec-folder`) and `cli-mistral-vibe` (fail closed) differ. `deep-review.yaml` carries the same duplication. One concrete change: collapse the six into one `if_cli` branch whose `--executor` is `{config.executor.kind}`, keep the two special branches, in both YAMLs. Value: roughly 60 lines removed per YAML and one place to add the next kind. Effort S. Risk low (`dispatch-iteration.cjs` already accepts the kind as a value). [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1762] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1812] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1738] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1752]

5. **Log shape and resume are already at parity; the remaining asymmetry is `native`.** Every kind writes the same `logs/fanout-lineage.out` and `.err` with rotation (`fanout-run.cjs:4640-4645`), and every kind resumes through `readStoredLineageSessionId` (`:772`), so those two axes need no contract. But `native` is listed in `EXECUTOR_KINDS` and in `LINEAGE_COMMAND_ADAPTERS`, yet `buildNativeLineageCommand` throws on OpenCode v2 by construction (`:2640-2645`), so a matrix that names `native` works or fails on the host's OpenCode major version. One concrete change: remove `native` from the fan-out adapter table and reject it in `preflightFanoutCapabilities` with the same message, or gate it behind an explicit `native-command-surface` kind. Value: removes a version-dependent trap from the matrix. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4640] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2640] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11]

## Ruled Out

- Treating log shape as a parity gap: all kinds already write the same rotated `fanout-lineage.out/.err` pair, so no change is needed there.
- Proposing a new config schema: `executor-config.ts` is already the single schema; the gap is that two derived facts (enforcement class, effort application) are not carried into the output.

## Dead Ends

- Searching for per-kind resume flags: resume is config-driven for every kind through `readStoredLineageSessionId`, so there is nothing to unify.

## Edge Cases

- Ambiguous input: "log shape" could mean the file pair or the JSON event shape. Read as the file pair; the event shape is already uniform through the append gateway.
- Contradictory evidence: none.
- Missing dependencies: no live CLI binaries were invoked; the flag matrices and builders are the evidence.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11,91,112,117,159`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:772,2494,2507,2533,2640,2659,3557,4640,4664,4695,4714`
- `.skilled/commands/deep/assets/deep-research.yaml:1738,1752,1762,1812,1825`
- `.skilled/commands/deep/assets/deep-review.yaml` (same branch shape)

## Assessment

- New information ratio: 1.0
- Questions addressed: cross-CLI parity (frontier node F-1-004)
- Questions answered: none yet; the node stays open for the failure-class pass

## Reflection

- What worked and why: reading the capability matrices before the workers showed that parity is mostly encoded already, which turned the question from "invent a contract" into "publish the contract you have".
- What did not work and why: looking for per-kind resume or log differences found none; the asymmetry is concentrated in the YAML branches and the worker's kind checks.
- What I would do differently: diff the two YAML executor sections line by line next time, since that is where the duplication is measurable.

## Recommended Next Focus

Keep F-1-004 open for a short pass on the failure-class table and the `native` removal, then move to F-1-006 (cost and latency) and back to F-1-002 for the partial-run summary.
