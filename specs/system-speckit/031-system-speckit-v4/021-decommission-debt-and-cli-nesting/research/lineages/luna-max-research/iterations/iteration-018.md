# Iteration 18: Detached lineage projection path

## Focus

Compare the workflow's declared state-log path with the gateway's default
deep-research legacy projection path and the reducer's resolved research path.
This pass follows the actual detached lineage append boundary and records only
the path mismatch exposed there.

## Findings

1. **LUNA-057 — The deep-research gateway projects to a nested state log while the workflow and reducer expect the lineage root. P1. CONFIRMED path-contract mismatch, directly observed in this lineage; downstream stale-state impact is CONFIRMED for the reducer path and INFERRED for other consumers.** The workflow declares `state_paths.state_log` as `{artifact_dir}/deep-research-state.jsonl` and says a successful gateway call refreshes that state log from the ledger. The deep-research projection contract's default `relativePath` is instead `research/deep-research-state.jsonl`; the gateway constructs its shadow projection with `runDirectory` equal to the artifact directory, so the projection lands under `{artifact_dir}/research/`. In this run, gateway receipts succeeded and the nested projection advanced through iteration 18, while the root state file remained the two phase-init records. The reducer therefore could not read the gateway's appended iteration events from its declared state path without an explicit in-process adapter. Smallest fix: make the deep-research contract's lineage default `relativePath` equal to `deep-research-state.jsonl`, or change every workflow/reducer state-path consumer to the nested path, then add an assertion that one successful append advances the exact configured state log. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:130-156] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:41-64] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:288-304,495-505] [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2920-2934] [INFERENCE: the root state remained at two valid lines after the gateway receipt while the nested projection contained the iteration summaries; this is the observed detached-lineage state split]

## Ruled Out

- The gateway did not silently reject the iteration event: its receipt reported a committed ledger sequence and `projectionRefreshed:true`; the defect is where the projection is written, not authorization or event admission. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:529-560] [INFERENCE: gateway receipt observed for iteration 18]
- The reducer's path is not an independent alternate by design: it resolves the research artifact root and appends `deep-research-state.jsonl`, matching the YAML but not the projection contract. [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2918-2934]

## Dead Ends

- No second ledger or state writer was promoted. The mismatch is between one gateway projection target and the single declared reducer/workflow path.

## Edge Cases

- A future caller could intentionally pass a custom projection contract with a root-relative path. That does not repair the default CLI path used by the workflow; the default must satisfy the declared state-path contract.
- The nested projection is useful legacy compatibility output, but it needs to be named as a projection distinct from the canonical reducer input if both files are retained.

## Questions Remaining

- Q7 gains a confirmed lineage state/projection mismatch that can conceal accepted events.
- Q1 and Q6 remain open for additional live residue and successor coverage.
- Q2-Q5 remain open for registrations, dependencies, tests, and documentation drift.

## Sources Consulted

- [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:104-156]
- [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:41-64]
- [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:288-304,495-560]
- [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2918-2934]

## Assessment

- New information ratio: 0.94
- Questions addressed: Q7
- Questions answered: Q7 = expanded (gateway, configured state path, and reducer disagree)
- Confidence: high for the path mismatch and this run's observation; high for reducer stale-state impact; medium for unobserved consumers

## Reflection

- What worked and why: comparing the path literals across the YAML, projection contract, and reducer revealed the split; the gateway receipt plus both file locations supplied a safe negative control.
- What did not work and why: the normal reducer invocation could not consume the root state without a compatibility adapter, so no claim is made that an unmodified run would complete synthesis correctly.
- What I would do differently: inspect the synthesis compiler and resource-map generation next, keeping all outputs lineage-local.

## Recommended Next Focus

Angle 6/7: inspect synthesis/resource-map contracts and final stop-state recording for another distinct path or completion mismatch.
