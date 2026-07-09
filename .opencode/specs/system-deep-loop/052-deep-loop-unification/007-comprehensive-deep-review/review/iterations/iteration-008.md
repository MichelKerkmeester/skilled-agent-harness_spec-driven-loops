# Iteration 008 - Traceability: deep-research Packet

## Dimension

- Dimension: traceability
- Target: `.opencode/skills/system-deep-loop/deep-research/`
- Prior registry count before this iteration: 8 active findings (`P0=0`, `P1=2`, `P2=6`)
- Verdict: CONDITIONAL, because this iteration adds one P1 command-contract traceability finding.

## Files Reviewed

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:86`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:14`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:263`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:303`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:309`
- `.opencode/skills/system-deep-loop/deep-research/README.md:39`
- `.opencode/skills/system-deep-loop/deep-research/README.md:82`
- `.opencode/skills/system-deep-loop/deep-research/README.md:193`
- `.opencode/skills/system-deep-loop/deep-research/changelog/v1.14.0.0.md:1`
- `.opencode/skills/system-deep-loop/deep-research/changelog/v1.14.0.0.md:11`
- `.opencode/commands/deep/research.md:9`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:109`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:110`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:128`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:146`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:200`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:245`
- `.opencode/agents/deep-research.md:34`
- `.opencode/agents/deep-research.md:69`
- `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:473`
- `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:475`
- `.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md:67`
- `.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md:90`
- `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_strategy.md:28`
- `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_dashboard.md:30`

## Findings by Severity

### P0

None.

### P1

#### DR-008-P1-001 - Generated command contract assigns loop ownership to the LEAF agent

- Severity: P1
- Category: traceability-command-contract
- File: `.opencode/commands/deep/assets/compiled/deep_research.contract.md:110`
- Claim: the active compiled `/deep:research` command contract tells the executor to dispatch `deep-research` "to run the loop" and says the `deep-research` leaf owns "the loop and every artifact write," but the live packet contract says the YAML workflow owns setup, dispatch, reducer sync, convergence, synthesis, and loop-level writes while `@deep-research` executes exactly one iteration.
- Evidence refs: `.opencode/commands/deep/research.md:9`, `.opencode/commands/deep/assets/compiled/deep_research.contract.md:109`, `.opencode/commands/deep/assets/compiled/deep_research.contract.md:110`, `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:473`, `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:475`, `.opencode/skills/system-deep-loop/deep-research/SKILL.md:263`, `.opencode/skills/system-deep-loop/deep-research/SKILL.md:303`, `.opencode/commands/deep/assets/deep_research_auto.yaml:128`, `.opencode/commands/deep/assets/deep_research_auto.yaml:146`, `.opencode/agents/deep-research.md:34`, `.opencode/agents/deep-research.md:69`
- Counterevidence sought: rendered `/deep:research` contract output still includes YAML-owned assets and prompt-pack route proof, and the YAML itself contains the correct state paths and workflow phases. That reduces the risk from P0, but it does not remove the contradiction because the directive block is marked "READ FIRST" and imperative.
- Alternative explanation: the generator may be trying to prevent the command executor from manually performing research inline. If so, the directive should say the executor must run the YAML workflow and let the workflow dispatch one LEAF iteration at a time, not that the leaf owns the loop and every artifact write.
- Final severity: P1
- Confidence: 0.87
- Downgrade trigger: downgrade to P2 if the compiled contract is proven never to be consumed by executors or if command runtime ignores the `autonomousExecutionDirective` block and follows only the YAML workflow phases.
- Recommendation: update the compiled-contract generator wording for leaf-dispatch modes so it preserves YAML ownership and per-iteration LEAF ownership, then regenerate the compiled command contract.

### P2

No new P2 findings. The pre-existing registry-name drift in `references/guides/quick_reference.md:90` aligns with the already-registered DR-006-P2-002 class and was not re-counted.

## Traceability Checks

- sk-doc template alignment: PASS. Fresh command output:

```text
🔍 Validating skill: deep-research
==================================================

✅ Skill is valid!

==================================================
Result: PASS
```

- README accuracy: PASS with carry-forward advisory. `README.md` matches the current packet shape and link layout for `SKILL.md`, grouped `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, and `behavior_benchmark/`; `README.md:82` still participates in the already-registered registry-name drift and was not counted as new.
- Changelog currency: PASS. Latest `changelog/v1.14.0.0.md:1` and `:11` describe the grouped reference-library rename and inbound-link updates; the sampled current tree has grouped `references/guides`, `references/protocol`, `references/convergence`, and `references/state` paths.
- Command/agent cross-reference: FAIL with new P1. The command markdown renders the compiled contract at `.opencode/commands/deep/research.md:9`, and that generated contract has stale loop-ownership wording.
- Internal cross-reference integrity: PASS for this sample. `README.md` links to `feature_catalog/01--loop-lifecycle/run-now-control.md`, `feature_catalog/01--loop-lifecycle/per-iteration-memory-upsert.md`, `references/guides/quick_reference.md`, `references/protocol/loop_protocol.md`, `references/convergence/convergence.md`, `references/state/state_format.md`, `assets/deep_research_config.json`, `assets/deep_research_strategy.md`, `assets/deep_research_dashboard.md`, `assets/prompt_pack_iteration.md.tmpl`, and `assets/runtime_capabilities.json`; scoped `Glob` checks confirmed those targets exist. No `[text](./path)` links were found inside `references/` or markdown assets themselves in the sampled grep.

## Verdict

CONDITIONAL. The deep-research packet remains structurally valid and most traceability surfaces are current, but the active generated command contract contains a P1 ownership contradiction that can misroute autonomous command execution.

## Next Dimension

Iteration 9 should continue the planned rotation with `deep-research` maintainability. Focus on whether the packet makes the YAML-owned loop, per-iteration LEAF boundary, reducer-owned files, registry-name transition, and command-contract generation responsibilities easy to maintain without reintroducing ownership drift.

Review verdict: CONDITIONAL
