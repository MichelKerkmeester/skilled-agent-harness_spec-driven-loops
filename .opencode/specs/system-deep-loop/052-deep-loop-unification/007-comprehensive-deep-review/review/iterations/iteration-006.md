# Deep Review Iteration 006

## Dimension

Correctness -- `deep-research` packet.

## Files Reviewed

Sampled, not exhaustive, from the 146-file packet:

- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:1-458`
- `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md:1-260`
- `.opencode/skills/system-deep-loop/deep-research/references/state/state_format.md:1-124`
- `.opencode/skills/system-deep-loop/deep-research/references/state/state_jsonl.md:1-260`
- `.opencode/skills/system-deep-loop/deep-research/references/state/state_reducer_registry.md:76-155`
- `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json:1-82`
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1-260,2514-2568,2644-2665,2680-2758`
- `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs:1-55`
- `.opencode/skills/system-deep-loop/deep-research/README.md:76-155`
- `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/manual_testing_playbook.md:180-204`
- `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/02--initialization-and-state-setup/research-charter-validation.md:24-78`
- `.opencode/skills/system-deep-loop/deep-research/references/protocol/context_snapshot.md:1-30`
- `.opencode/skills/system-deep-loop/deep-research/feature_catalog/01--loop-lifecycle/run-now-control.md:1-20`
- `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-execution.md:1-20`
- `.opencode/skills/system-deep-loop/deep-research/behavior_benchmark/baselines/claude-baseline.md:1-20`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40`

Skipped: most feature-catalog files, most manual-testing scenario files, changelog historical records, full reducer internals outside the sampled lifecycle/path logic, generated benchmark baseline details beyond one link-resolution sample, and all `node_modules` content.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### DR-006-P2-001 [P2] Research-charter manual tests still cite stale Step 5a

- Claim: Live manual-testing docs direct operators to validate research-charter behavior at initialization `Step 5a`, but the canonical loop protocol now defines `Validate Research Charter` as `7a`, and `SKILL.md` already points readers to Step 7a.
- Evidence: `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md:91-97` defines `7a. **Validate Research Charter**`; `.opencode/skills/system-deep-loop/deep-research/SKILL.md:333-334` points to `loop_protocol.md` Step 7a; `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/manual_testing_playbook.md:191` says `Verify initialization Step 5a`; `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/02--initialization-and-state-setup/research-charter-validation.md:30,48,54,58,74` repeatedly directs testers to Step 5a.
- Finding class: matrix/evidence.
- Scope proof: `Grep` for `Step 5a|Step 7a|5a|7a` in the packet showed current Step 7a in `SKILL.md`/`loop_protocol.md`, stale Step 5a in live manual-testing docs, and one historical changelog mention not counted as live documentation.
- Recommendation: Update the manual-testing scenario summary and execution contract to cite Step 7a, while leaving historical changelog text unchanged or clearly historical.
- Counterevidence sought: Checked whether the loop protocol still contained a Step 5a charter anchor; it does not in the current sampled lines, and the top-level skill now cites Step 7a.
- Alternative explanation: The manual-testing playbook may have been copied from an older protocol where charter validation was Step 5a; that explains the drift but does not make the current test instruction accurate.
- Final severity: P2.
- Confidence: 0.94.
- Downgrade trigger: If the manual-testing playbook is explicitly historical/non-operational or a hidden compatibility alias maps Step 5a to Step 7a in the operator tooling.

#### DR-006-P2-002 [P2] Registry filename contract conflicts between top-level docs and reducer writes

- Claim: The packet's top-level user-facing docs call `deep-research-findings-registry.json` the canonical findings registry, but the config template and live reducer write `findings-registry.json`; the long name is only read as a documented fallback.
- Evidence: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:309-311` lists and labels `deep-research-findings-registry.json` as canonical; `.opencode/skills/system-deep-loop/deep-research/README.md:82,151` tells users the registry lives at `deep-research-findings-registry.json`; `.opencode/skills/system-deep-loop/deep-research/references/state/state_reducer_registry.md:83,144` says new docs should prefer `deep-research-findings-registry.json` and shows it in the protection map. Counter to that, `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json:46,71` configures `research/findings-registry.json`; `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2520-2521` sets `registryPath` to `findings-registry.json` and `documentedRegistryPath` to the long name; `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2650` writes only `registryPath`.
- Finding class: cross-consumer.
- Scope proof: `Grep` for `deep-research-findings-registry|findings-registry.json|registryFile` showed both names across docs; sampled reducer path confirmed the executable write target is the short `findings-registry.json` path.
- Recommendation: Pick one live canonical registry filename and align `SKILL.md`, README, `state_reducer_registry.md`, config template, file-protection map, and reducer output, or explicitly document the long name as future/compatibility-only until scripts switch.
- Counterevidence sought: Checked whether the reducer writes both names; the sampled write block writes only `registryPath`, while the long name is passed only as a prior-registry read fallback.
- Alternative explanation: The `v(next)` note may mean the long name is intentionally future canonical; if so, current docs should not present it as the live registry path operators can inspect today.
- Final severity: P2.
- Confidence: 0.90.
- Downgrade trigger: If command-level YAML copies or renames `findings-registry.json` to `deep-research-findings-registry.json` after reducer execution, making both documented paths valid live outputs.

## Traceability Checks

- Loop-protocol correctness: Sampled init and loop steps; found the Step 7a charter-validation canonical reference and the stale Step 5a manual-testing references above.
- State-format correctness: Compared `state_format.md`/`state_jsonl.md` with `assets/deep_research_config.json`; the main packet files and config defaults align for config/state/strategy/dashboard/deltas, with the registry-name conflict recorded as DR-006-P2-002.
- Script logic: Sampled reducer path resolution, prior-registry fallback, numeric iteration-file sorting, registry/dashboard/strategy writes, and runtime capability shim. No P0/P1 logic bug found in sampled code.
- Cross-reference correctness: Sampled links to `references/protocol/context_snapshot.md`, `feature_catalog/01--loop-lifecycle/run-now-control.md`, `manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-execution.md`, and `behavior_benchmark/baselines/claude-baseline.md`; all resolved by direct read. Full link corpus not exhausted.

## Verdict

PASS with P2 advisories. No runtime correctness blocker was confirmed in the sampled protocol/state/script paths, but two packet-local documentation correctness drifts should be fixed before relying on the manual-testing and registry-path docs as operator truth.

## Next Dimension

Iteration 7 should continue the `deep-research` packet with security. Focus on path handling in artifact-root resolution, reducer writes, pause/lock sentinels, command YAML shell boundaries, WebFetch/tool-permission claims, and whether user-controlled spec folders or inbox records can escape the intended research packet.

Review verdict: PASS
