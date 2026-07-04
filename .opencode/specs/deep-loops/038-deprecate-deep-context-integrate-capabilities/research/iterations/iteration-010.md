# Iteration 10: Final Cross-Check and Decision Consolidation

## Focus

This iteration performed the final targeted cross-check for the `safe now / defer / archive / leave historical / false positive` decisions before synthesis. I used the dispatch-provided surface list and avoided the strategy-blocked whole-repo `deep-context` sweep; the selected interpretation was "verify representative active surface classes and consolidate implementation decisions," not "produce a complete edit diff."

## Findings

1. The public command/router/assets surface is still an active standalone `/deep:context` route: `context.md` renders `deep/context`, auto/confirm YAML still names the nested `deep-context` skill and `deep-context` agent, and the generated contract still declares `/deep:context` plus source inputs. Decision: safe now to replace the public command with a redirect/stub and edit source YAML/presentation/router mappings, but regenerate compiled contracts rather than hand-editing them. [SOURCE: .opencode/commands/deep/context.md:9] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:79] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:99] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:4] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]
2. Mode registry, hub metadata, and advisor discoverability remain active cleanup surfaces: the mode registry still exposes `workflowMode: "context"` with `deep-context` aliases, and hub graph metadata still carries context-loop triggers and the nested `deep-context/SKILL.md` key file. Decision: safe now to remove/retag standalone discoverability after replacement guidance exists, then refresh skill graph/advisor indexes; projection-map-only cleanup remains insufficient. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:20] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:27] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:77] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:78] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:79] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:125] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:157]
3. The dedicated `deep-context` packet still contains the standalone capability contract: triggers include `deep context` / `context loop`, the output contract still emits `context/context-report.md + .json`, and the report requirement still calls for a REUSE catalog. Decision: archive or retire the packet after redirect and replacement docs, not before command-contract and metadata cleanup complete. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:30] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:264] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:372] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/README.md:61] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32]
4. OpenCode/Claude agents and top-level docs are live mirror/docs surfaces rather than historical-only content: prior synthesis already line-cites root README/AGENTS references and the skill declares the OpenCode agent canonical with a Claude mirror. Decision: update/deprecate the OpenCode and Claude agents together, update README/AGENTS/orchestrator docs in place, and treat `.codex` as no-op because no `.codex/**/*deep*context*` mirror matched. [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:64] [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:66] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284] [INFERENCE: based on Glob `.codex/**/*deep*context*` returning no files]
5. Runtime `context` branches are active defer gates: `upsert`, `status`, `query`, `fanout-run`, `fanout-merge`, and `convergence` still accept `context`, with a runtime unit test asserting the accepted loop-type set. Decision: defer internal runtime branch removal to a separate test-rewrite/removal stage; do not include it in the public redirect patch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/upsert.cjs:150] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/status.cjs:122] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/query.cjs:96] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1380] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:911] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25]
6. Active fixtures/tests/benchmarks split cleanly: dedicated CXB behavior benchmarks are archive/retire candidates, active deep-loop benchmark fixtures that assert standalone context need rewrite/drop after replacement routing, historical specs/archives stay untouched, and generic `context_loading_contract` / `contextManifestDigest` matches are false positives. Decision: include fixture rewrite in implementation, exclude historical cleanup, and do not use CXB as replacement-loop acceptance. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32] [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:68] [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:74] [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:75]

## Implementation Checklist Summary

1. Replace `/deep:context` command behavior with a clear redirect/stub to replacement `deep-research` / `deep-review` context-carrying flows, editing source command/router/assets first. [SOURCE: .opencode/commands/deep/context.md:9] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:79]
2. Regenerate compiled command contracts from source and review the diff; do not hand-edit generated `compiled/deep_context.contract.md`. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]
3. Publish sibling-loop replacement guidance and destination fields before hiding/deleting standalone context docs. [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:40] [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:47]
4. Retag/remove mode-registry and graph-metadata standalone context discoverability, then run advisor graph/index refresh and advisor tests. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:20] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:77]
5. Update OpenCode and Claude agent mirrors plus README/AGENTS/orchestrator docs in one mirror-sync pass; `.codex` needs no mirror edit. [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:64] [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:66] [INFERENCE: based on Glob `.codex/**/*deep*context*` returning no files]
6. Rewrite/drop active deep-loop benchmark fixtures that assert `mode: "context"` or `advisorLane: "deep-context"`; archive dedicated CXB behavior benchmarks and leave historical spec/archive references. [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:68] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32]
7. Defer internal runtime branch removal until runtime tests and coverage-graph semantics are rewritten or an explicit long-term compatibility decision is made. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1380]

## Ruled Out

- Whole-repo `deep-context` reference sweep: strategy marks this blocked, so this pass used targeted command, hub, runtime, packet, fixture, and mirror checks. [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:97]
- Hand-editing compiled generated command contracts: compiled output lists source inputs and must be regenerated after source changes. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]
- Public-patch removal of internal runtime `context` support: runtime scripts/tests still accept it. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25]

## Dead Ends

- Treating every `context` substring as a standalone deep-context cleanup target remains a dead end; generic context manifest fixtures are false positives. [SOURCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:68]
- Treating dedicated CXB behavior benchmarks as replacement-loop acceptance remains a dead end; archive them as old standalone evidence after redirect. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32]

## Edge Cases

- Ambiguous input: The prompt asked for final cross-check across many surfaces; I interpreted this narrowly as representative verification plus consolidated decisions, not a complete edit list.
- Contradictory evidence: None newly discovered. Prior contradictions about public deprecation versus active runtime support are resolved as `safe now` for public redirect and `defer` for runtime removal.
- Missing dependencies: None required. `.codex` mirror check returned no matching files and is classified as absence/no-op rather than a missing dependency.
- Partial success: Representative greps were intentionally targeted and some outputs were truncated; this is acceptable for final consolidation because earlier iterations already supplied detailed direct-line evidence, but implementation should still run post-edit greps/tests.

## Sources Consulted

- .opencode/commands/deep/context.md:9
- .opencode/commands/deep/assets/deep_context_auto.yaml:79
- .opencode/commands/deep/assets/deep_context_auto.yaml:99
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:4
- .opencode/skills/deep-loop-workflows/mode-registry.json:20
- .opencode/skills/deep-loop-workflows/graph-metadata.json:77
- .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:30
- .opencode/skills/deep-loop-workflows/deep-context/README.md:61
- .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32
- .opencode/skills/deep-loop-runtime/scripts/upsert.cjs:150
- .opencode/skills/deep-loop-runtime/scripts/status.cjs:122
- .opencode/skills/deep-loop-runtime/scripts/query.cjs:96
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1380
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:911
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660
- .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25
- .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:64
- .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/research/research.md:68
- Glob `.codex/**/*deep*context*` returned no files

## Assessment

- New information ratio: 0.52
- Questions addressed: live surfaces inventory; active versus generated/mirrored/test/historical/false-positive classification; safe/defer/archive/historical/false-positive cleanup order; implementation checklist and residual gaps.
- Questions answered: final decision matrix is consolidated; no additional key surface class beyond the prior inventory was found by representative checks; `.codex` mirror absence is confirmed by no matching files.

## Reflection

- What worked and why: Targeted searches over the dispatcher-named surface classes worked because prior iterations had already reduced the problem to source-owned commands, hub metadata, runtime branches, packet internals, docs/mirrors, and fixtures.
- What did not work and why: A complete grep-driven edit list was not attempted because the strategy blocks broad sweeps and generated/docs/history surfaces require different ownership decisions.
- What I would do differently: During implementation, run the same matrix after edits and compare pre/post hits by category so residual matches are intentionally classified rather than guessed.

## Recommended Next Focus

Synthesize the 10 iterations into the final research output and use the checklist above as the implementation order: public redirect, replacement docs, generated-contract regeneration, registry/advisor metadata/index cleanup, mirror/docs updates, fixture rewrite/archive, then separate runtime branch removal decision.

## Residual Gaps for Synthesis

- Exact post-edit match counts are implementation-time evidence, not research-time evidence; run targeted greps after changes.
- Live advisor ranking/status behavior still needs verification after graph metadata/index refresh.
- Internal runtime `context` removal remains a separate compatibility decision with its own tests and rollback.
- Generated compiled contracts must be regenerated and diffed after source edits; this iteration did not perform implementation writes.
